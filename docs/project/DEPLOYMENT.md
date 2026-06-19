# RentDeck — Dağıtım Kılavuzu

## Demo Hesap

| Alan | Değer |
|------|-------|
| E-posta | demo@uludagkayak.com |
| Şifre | demo123456 |

## Canlı Demo URL'leri

| Servis | URL | Durum |
|--------|-----|-------|
| Frontend (Vercel) | https://rentdeck.vercel.app | ✅ Aktif |
| Backend API (Railway) | https://rentdeck-backend-production.up.railway.app/api | ✅ Aktif |
| Sağlık Kontrolü | https://rentdeck-backend-production.up.railway.app/api/health | ✅ HTTP 200 |

## Dağıtım Durumu (2026-06-19)

| Bileşen | Durum | Not |
|---------|-------|-----|
| CI Backend + Integration | ✅ 16/16 geçti | Run #27851158984 |
| CI Frontend Build | ✅ | |
| CI Provision | ✅ | Railway + Vercel |
| Vercel Frontend | ✅ | https://rentdeck.vercel.app |
| Railway Backend + PG | ✅ | https://rentdeck-backend-production.up.railway.app |

## Bulut Canlı Önizleme Linki (Google IDX)

https://idx.google.com/import?url=https://github.com/gorkemkyolai0666/rentdeck

## Ortam Değişkenleri

### Backend (Railway)

| Değişken | Değer |
|----------|-------|
| DATABASE_URL | postgresql://rentdeck:***@postgres.railway.internal:5432/rentdeck |
| JWT_SECRET | (org secret) |
| PORT | 8080 |
| FRONTEND_URL | https://rentdeck.vercel.app |

### Frontend (Vercel)

| Değişken | Değer |
|----------|-------|
| NEXT_PUBLIC_API_URL | https://rentdeck-backend-production.up.railway.app/api |

## Yerel Geliştirme

```bash
docker compose up -d postgres
cd backend && npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
npm run start:dev

cd frontend && npm install && npm run dev
```

Backend: http://localhost:4541/api  
Frontend: http://localhost:3541
