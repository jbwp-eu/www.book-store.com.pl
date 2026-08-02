# www.book-store.com.pl

**Język:** Polski | [English](README.en.md)

Frontend osobistego portfolio zbudowany w **React 19** i **React Router v7** w trybie framework, z **SSR** przez **Vite** — szybki pierwszy render i lepsze SEO. Napisany w **TypeScript**, stylowany **Tailwind CSS v4**. Treść (projekty i wpisy blogowe) pochodzi z headless CMS **Strapi** (`strapi.book-store.com.pl`); strona obejmuje też sekcje about i contact.

## Wymagania

- Node.js 20+
- działające API Strapi (lokalnie lub produkcyjne)

## Start lokalny

```bash
npm install
```

Utwórz plik `.env` w katalogu projektu (wzór: `.env.example`):

```env
VITE_API_URL="http://localhost:1337/api"
FORMSPREE_URL="https://formspree.io/f/mojvppgn"
SITE_URL="http://localhost:5173"
```

Dla produkcji Strapi:

```env
VITE_API_URL="https://strapi.book-store.com.pl/api"
FORMSPREE_URL="https://formspree.io/f/mojvppgn"
SITE_URL="https://www.book-store.com.pl"
```

`VITE_API_URL` jest wbudowywane przy `npm run build`. `FORMSPREE_URL` i `SITE_URL` są odczytywane tylko na serwerze (kontakt / sitemap / robots) — bez prefiksu `VITE_`. `SITE_URL` ma default produkcyjny w `app/lib/site.server.ts`.

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
| `npm test` | testy jednostkowe (Vitest) |

## Trasy

| Ścieżka | Opis |
| --- | --- |
| `/` | strona główna (wyróżnione projekty + ostatnie posty) |
| `/about` | o mnie / o projekcie |
| `/contact` | kontakt |
| `/projects` | lista projektów |
| `/projects/:id` | szczegóły projektu |
| `/blog` | lista postów (wyszukiwanie: `?q=`) |
| `/blog/:slug` | szczegóły posta |
| `/robots.txt` | reguły crawlerów |
| `/sitemap.xml` | mapa strony (statyczne + Strapi) |

Dane pobierane są z endpointów Strapi: `/projects`, `/posts`.

## CI

Workflow `.github/workflows/ci.yml` (PR / push na `main`): `typecheck`, `test`, `build`.

Aby wymagać zielonego CI przed merge do `main`: GitHub → **Settings** → **Branches** → **Add branch protection rule** → Branch name pattern `main` → włącz **Require status checks to pass before merging** i wybierz check **CI** (job z `ci.yml`).

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
