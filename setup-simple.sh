#!/bin/bash

# Hata durumunda dur
set -e

echo "=== Kervan Pazar - Hızlı Kurulum ==="

# 1. Gerekli Araçların Kontrolü ve Kurulumu
echo "[1/5] Sistem kontrolleri yapılıyor..."

if ! command -v docker &> /dev/null; then
    echo "Docker bulunamadı, kuruluyor..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER || true
fi

if ! command -v node &> /dev/null; then
    echo "Node.js bulunamadı, kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 2. Çevresel Değişkenlerin (.env) Ayarlanması
echo "[2/5] Yapılandırma dosyası (.env) kontrol ediliyor..."
if [ ! -f .env ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    cat > .env << EOL
DATABASE_URL="postgresql://mark:my.passwd@localhost:5432/KervanDB?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
SMTP_EMAIL=""
SMTP_PASSWORD=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="production"
ADMIN_PASSWORD="admin12345"
EOL
    echo ".env dosyası varsayılan ayarlarla oluşturuldu."
fi

# 3. Bağımlılıkların Yüklenmesi
echo "[3/5] Paketler yükleniyor (npm install)..."
npm install

# 4. Veritabanı Kurulumu
echo "[4/5] Veritabanı başlatılıyor..."
# Postgres container'ını başlat
docker compose up -d postgres

echo "Veritabanının hazır olması bekleniyor (8 sn)..."
sleep 8

# Prisma işlemleri
export ADMIN_PASSWORD="admin12345"
# .env dosyasından okumak yerine export ettiğimiz değeri kullanır
if grep -q "ADMIN_PASSWORD" .env; then
    export $(grep -v '^#' .env | xargs)
fi

echo "Veritabanı şeması gönderiliyor..."
npx prisma db push

echo "Örnek veriler yükleniyor..."
npm run prisma:seed

# 5. Derleme (Build)
echo "[5/5] Uygulama derleniyor (npm run build)..."
npm run build

echo ""
echo "✅ Kurulum Başarıyla Tamamlandı!"
echo "------------------------------------------------"
echo "Uygulamayı başlatmak için şu komutu çalıştırın:"
echo "npm start"
echo "------------------------------------------------"
