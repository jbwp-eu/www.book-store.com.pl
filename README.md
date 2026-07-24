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
docker build -t book-store-www .
docker run -p 3000:3000 book-store-www
```

Uwaga: `VITE_API_URL` jest wbudowywane na etapie builda Vite. Przy obrazie Dockera ustaw zmienną przed `docker build` (np. `ARG`/`ENV` w Dockerfile) albo zbuduj lokalnie z właściwym `.env`.

## Powiązane repo

Backend CMS: `strapi.book-store.com.pl` (Strapi + Postgres + Cloudinary).
