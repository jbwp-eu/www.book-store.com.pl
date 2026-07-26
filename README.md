# www.book-store.com.pl

**Język:** Polski | [English](README.en.md)

Frontend portfolio / book-store oparty o **React Router 7** (SSR), **Vite**, **Tailwind CSS** i API **Strapi** (`strapi.book-store.com.pl`).

## Wymagania

- Node.js 20+
- działające API Strapi (lokalnie lub produkcyjne)

## Start lokalny

```bash
npm install
```

Utwórz plik `.env` w katalogu projektu:

```env
VITE_API_URL="http://localhost:1337/api"
```

Dla produkcji Strapi:

```env
VITE_API_URL="https://strapi.book-store.com.pl/api"
```

Uruchomienie deweloperskie (HMR):

```bash
npm run dev
```

Aplikacja: [http://localhost:5173](http://localhost:5173)

## Skrypty

| Komenda | Opis |
| --- | --- |
| `npm run dev` | serwer deweloperski |
| `npm run build` | build produkcyjny |
| `npm run start` | serwowanie builda (`react-router-serve`) |
| `npm run typecheck` | typegen React Router + `tsc` |

## Trasy

| Ścieżka | Opis |
| --- | --- |
| `/` | strona główna (wyróżnione projekty + ostatnie posty) |
| `/about` | o mnie / o projekcie |
| `/contact` | kontakt |
| `/projects` | lista projektów |
| `/projects/:id` | szczegóły projektu |
| `/blog` | lista postów |
| `/blog/:slug` | szczegóły posta |

Dane pobierane są z endpointów Strapi: `/projects`, `/posts`.

## Build produkcyjny

```bash
npm run build
npm run start
```

Wyjście builda:

```
build/
├── client/   # assety statyczne
└── server/   # kod serwera SSR
```

## Docker

```bash
docker build --build-arg VITE_API_URL=https://strapi.book-store.com.pl/api -t www-book-store .
docker run --rm -p 3000:3000 www-book-store
```

`VITE_API_URL` jest wbudowywane na etapie `docker build` (`ARG` w Dockerfile).

## Deploy

- **OVH VPS:** `.github/workflows/deploy-ovh.yml` — systemd + Node — [deploy/ovh.md](deploy/ovh.md)
- **EC2** (ta sama maszyna co `nest.book-store.pl`): `.github/workflows/deploy-ec2.yml` — build → **Docker Hub** → pull na EC2, sieć `book-store` — [deploy/ec2.md](deploy/ec2.md)

## Powiązane repo

Backend CMS: `strapi.book-store.com.pl` (Strapi + Postgres + Cloudinary).
