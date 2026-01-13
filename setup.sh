#!/bin/bash

# Log dosyasını temizle veya oluştur
LOG_FILE="setup_log.txt"
> "$LOG_FILE"

# Global Değişkenler
RESET_MODE=false
RESTORE_FILE=""
SHOW_HELP=false
AUTO_YES=false

# Renkler
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Helper Fonksiyonlar
log() { echo -e "$1" | tee -a "$LOG_FILE"; }
log_info() { log "${BLUE}[BILGI]${NC} $1"; }
log_success() { log "${GREEN}[BASARILI]${NC} $1"; }
log_warning() { log "${YELLOW}[UYARI]${NC} $1"; }
log_error() { log "${RED}[HATA]${NC} $1"; }

handle_error() {
    log_error "Bir hata oluştu. Detaylar için $LOG_FILE dosyasına bakabilirsiniz."
    # Hata kritikse durma opsiyonu eklenebilir ama menü loop'u kırılmasın
}
trap 'handle_error' ERR

# -------------------------------------------------------------------
# Kaynak ve Güvenlik Kontrolleri
# -------------------------------------------------------------------

check_resources() {
    log_info "Sistem kaynakları kontrol ediliyor..."
    
    # Bellek (MB)
    if command -v free &> /dev/null; then
        TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
        if [ "$TOTAL_MEM" -lt 1024 ]; then
            log_warning "Toplam RAM 1GB'dan az ($TOTAL_MEM MB). Performans sorunları yaşanabilir."
            sleep 2
        else
            log_success "RAM Yeterli: $TOTAL_MEM MB"
        fi
    fi

    # Disk
    DISK_AVAIL=$(df -h . | awk 'NR==2 {print $4}')
    log_success "Disk Alanı: $DISK_AVAIL (Kurulum için yeterli görünüyor)"
}

run_audit() {
    log_info "Güvenlik taraması yapılıyor (npm audit)..."
    # Sadece high/critical açıkları göster
    npm audit --audit-level=high --json > audit_report.json || true
    
    VULN_COUNT=$(grep -c "high" audit_report.json || true)
    
    if [ "$VULN_COUNT" -gt 0 ]; then
        log_warning "$VULN_COUNT adet yüksek riskli güvenlik açığı bulundu! Rapor: audit_report.json"
        log_warning "Düzeltmek için kurulumdan sonra: npm audit fix"
    else
        log_success "Kritik güvenlik açığı bulunamadı."
        rm audit_report.json
    fi
}

# -------------------------------------------------------------------
# Kurulum Fonksiyonu
# -------------------------------------------------------------------

install_app() {
    local INTERACTIVE=$1
    
    # Tercihler
    ENABLE_UPDATE=false
    ENABLE_PM2=false
    ENABLE_CRON=false

    if [ "$INTERACTIVE" = true ]; then
        log_info "İnteraktif Kurulum Başlatılıyor..."
        
        read -p "📦 Sistem paketleri güncellensin mi? [E/h] " -n 1 -r; echo
        if [[ ! $REPLY =~ ^[Hh]$ ]]; then ENABLE_UPDATE=true; fi

        read -p "🚀 Uygulama PM2 ile (arkaplanda) başlatılsın mı? [E/h] " -n 1 -r; echo
        if [[ ! $REPLY =~ ^[Hh]$ ]]; then ENABLE_PM2=true; fi

        read -p "💾 Otomatik yedekleme (Cron) açılsın mı? [E/h] " -n 1 -r; echo
        if [[ ! $REPLY =~ ^[Hh]$ ]]; then ENABLE_CRON=true; fi
    else
        # Hızlı kurulum varsayılanları
        check_resources
    fi

    echo "---------------------------------------------------------"

    # 1. Update
    if [ "$ENABLE_UPDATE" = true ]; then
        log_info "Sistem güncelleniyor..."
        sudo apt-get update >> "$LOG_FILE" 2>&1 || log_warning "Güncelleme yapılamadı (Sudo?)"
    fi

    # 2. Gereksinimler
    if ! command -v docker &> /dev/null; then
        log_warning "Docker kuruluyor..."
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker $USER || true
    fi
    if ! command -v node &> /dev/null; then
        log_warning "Node.js kuruluyor..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        # Sürüm kontrolü
        NODE_VER=$(node -v | cut -d. -f1 | sed 's/^v//')
        if [ "$NODE_VER" -lt 20 ]; then
            log_warning "Node.js sürümü eski ($NODE_VER). v20'ye güncelleniyor..."
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
    fi
    if [ "$ENABLE_PM2" = true ] && ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi

    # 3. Env Config
    if [ -z "$ADMIN_PASSWORD" ]; then
        read -s -p "Admin Şifresi Belirleyin (Default: admin12345): " ADMIN_PASS_INPUT; echo
        [ -z "$ADMIN_PASS_INPUT" ] && ADMIN_PASS_INPUT="admin12345"
        export ADMIN_PASSWORD="$ADMIN_PASS_INPUT"
    fi

    if [ ! -f .env ]; then
        NEXTAUTH_SECRET=$(openssl rand -base64 32)
        NODE_ENV_VAL=$([ "$ENABLE_PM2" = true ] && echo "production" || echo "development")
        
        cat > .env << EOL
DATABASE_URL="postgresql://mark:my.passwd@localhost:5432/KervanDB?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
SMTP_EMAIL=""
SMTP_PASSWORD=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="${NODE_ENV_VAL}" 
ADMIN_PASSWORD="${ADMIN_PASSWORD}"
EOL
        log_success ".env oluşturuldu."
    fi

    # 4. Install & Build
    log_info "Bağımlılıklar yükleniyor..."
    npm install >> "$LOG_FILE" 2>&1
    
    # Audit
    run_audit
    
    log_info "Veritabanı başlatılıyor..."
    docker compose up -d postgres
    sleep 8
    
    ADMIN_PASSWORD="${ADMIN_PASSWORD}" npx prisma db push --schema prisma/schema.prisma
    ADMIN_PASSWORD="${ADMIN_PASSWORD}" npx prisma db seed

    log_info "Build alınıyor..."
    npm run build >> "$LOG_FILE" 2>&1

    # 5. Start
    if [ "$ENABLE_PM2" = true ]; then
        pm2 delete kervan-pazar 2>/dev/null || true
        pm2 start npm --name "kervan-pazar" -- start
        pm2 save >> "$LOG_FILE" 2>&1
        log_success "Uygulama PM2 ile çalışıyor."
    else
        log_success "Kurulum bitti. Başlatmak için: npm run start"
    fi

    # 6. Cron
    if [ "$ENABLE_CRON" = true ]; then
        BACKUP_SCRIPT="$(pwd)/scripts/backup.sh"
        if [ -f "$BACKUP_SCRIPT" ]; then
            chmod +x "$BACKUP_SCRIPT"
            (crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT"; echo "0 3 * * * $BACKUP_SCRIPT >> $(pwd)/backups/cron.log 2>&1") | crontab -
            log_success "Yedekleme planlandı."
        fi
    fi
}

# -------------------------------------------------------------------
# Menü Sistemi
# -------------------------------------------------------------------

show_menu() {
    clear
    log "${GREEN}"
    log "========================================="
    log "   KERVAN PAZAR YÖNETİM PANELİ v5.0"
    log "========================================="
    log "${NC}"
    echo -e "1) ${CYAN}Normal Kurulum${NC} (Standart)"
    echo -e "2) ${CYAN}Gelişmiş Kurulum${NC} (İnteraktif)"
    echo -e "3) ${MAGENTA}Sistemi Güncelle${NC} (Apt Update)"
    echo -e "4) ${YELLOW}Projeyi Sıfırla${NC} (Reset)"
    echo -e "5) ${BLUE}Restore Et${NC} (Yedekten Dön)"
    echo -e "6) ${RED}Çıkış${NC}"
    echo
    read -p "Seçiminiz (1-6): " CHOICE

    case $CHOICE in
        1)
            check_resources
            install_app false
            ;;
        2)
            check_resources
            install_app true
            ;;
        3)
            log_info "Sistem güncelleniyor..."
            sudo apt-get update && sudo apt-get upgrade -y
            log_success "Tamamlandı."
            read -p "Devam etmek için bir tuşa basın..."
            show_menu
            ;;
        4)
            log_warning "TÜM VERİLER SİLİNECEK."
            read -p "Onaylıyor musunuz? (evet/hayir): " CONFIRM
            if [ "$CONFIRM" = "evet" ]; then
                docker compose down -v || true
                rm -rf node_modules .next .env
                log_success "Sıfırlandı."
            fi
            read -p "Devam etmek için bir tuşa basın..."
            show_menu
            ;;
        5)
            read -p "SQL Dosya Yolu: " SQL_FILE
            if [ -f "$SQL_FILE" ]; then
                log_info "Yükleniyor..."
                CONT_ID=$(docker compose ps -q postgres)
                docker exec "$CONT_ID" psql -U mark -d KervanDB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
                cat "$SQL_FILE" | docker exec -i "$CONT_ID" psql -U mark -d KervanDB
                npx prisma generate
                log_success "Yüklendi."
            else
                log_error "Dosya bulunamadı."
            fi
            read -p "Devam etmek için bir tuşa basın..."
            show_menu
            ;;
        6)
            exit 0
            ;;
        *)
            echo "Geçersiz seçim."
            sleep 1
            show_menu
            ;;
    esac
}

# -------------------------------------------------------------------
# Ana Akış
# -------------------------------------------------------------------

# Argüman varsa onları işle, yoksa menüyü aç
if [ "$#" -gt 0 ]; then
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --reset)
                docker compose down -v
                rm -rf node_modules .next .env
                exit 0
                ;;
            --help)
                echo "Kullanım: ./setup.sh [--reset | --help]"
                echo "Argümansız çalıştırırsanız menü açılır."
                exit 0
                ;;
            *)
                echo "Bilinmeyen argüman: $1"
                exit 1
                ;;
        esac
        shift
    done
else
    # Root değilse uyarı ver ama durma
    if [ "$EUID" -ne 0 ]; then
        log_warning "Script root olarak çalıştırılmadı. Sistem kurulumları (docker, node) hata verebilir."
        log_warning "Öneri: sudo ./setup.sh"
        sleep 2
    fi
    show_menu
fi
