#!/bin/bash

# Yedekleme Scripti
# Bu dosya setup.sh tarafından oluşturulmuştur

BACKUP_DIR="$(pwd)/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_$TIMESTAMP.sql"
CONTAINER_NAME="ecommerce-postgres-1" # Docker compose service name usually gets numbered

mkdir -p "$BACKUP_DIR"

# Docker konteyner ismini bulmaya çalış (projeye göre değişebilir)
# "postgres" servisini arıyoruz
CONTAINER_ID=$(docker compose ps -q postgres)

if [ -z "$CONTAINER_ID" ]; then
    echo "Hata: Postgres konteyneri bulunamadı."
    exit 1
fi

echo "Veritabanı yedeği alınıyor..."
docker exec -t "$CONTAINER_ID" pg_dumpall -c -U mark > "$BACKUP_DIR/$FILENAME"

# 7 günden eski yedekleri sil
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete

echo "Yedekleme tamamlandı: $BACKUP_DIR/$FILENAME"
