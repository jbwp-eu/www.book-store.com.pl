# www.book-store.com.pl

**Language:** [Polski](README.md) | English

A personal portfolio frontend built with **React 19** and **React Router v7** in framework mode, with **SSR** via **Vite** for fast first loads and better SEO. Typed with **TypeScript** and styled with **Tailwind CSS v4**. Content (projects and blog posts) comes from a **Strapi** headless CMS (`strapi.book-store.com.pl`); the site also includes about and contact pages.

## Requirements

- Node.js 20+
- a running Strapi API (local or production)

## Local start

```bash
npm install
```

Create a `.env` file in the project directory (see `.env.example`):

```env
VITE_API_URL="http://localhost:1337/api"
FORMSPREE_URL="https://formspree.io/f/mojvppgn"
SITE_URL="http://localhost:5173"
```

For production Strapi:

```env
VITE_API_URL="https://strapi.book-store.com.pl/api"
FORMSPREE_URL="https://formspree.io/f/mojvppgn"
SITE_URL="https://www.book-store.com.pl"
```

`VITE_API_URL` is baked in at `npm run build`. `FORMSPREE_URL` and `SITE_URL` are read only on the server (contact / sitemap / robots) — do not use the `VITE_` prefix. `SITE_URL` defaults to production in `app/lib/site.server.ts`.

Development server (HMR):

```bash
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run start` | serve the build (`react-router-serve`) |
| `npm run typecheck` | React Router typegen + `tsc` |
| `npm test` | unit tests (Vitest) |

## Routes

| Path | Description |
| --- | --- |
| `/` | home page (featured projects + latest posts) |
| `/about` | about me / about the project |
| `/contact` | contact |
| `/projects` | project list |
| `/projects/:id` | project details |
| `/blog` | post list (search: `?q=`) |
| `/blog/:slug` | post details |
| `/robots.txt` | crawler rules |
| `/sitemap.xml` | sitemap (static pages + Strapi) |

Data is fetched from Strapi endpoints: `/projects`, `/posts`.

## CI

Workflow `.github/workflows/ci.yml` (PR / push to `main`): `typecheck`, `test`, `build`.

To require a green CI before merging to `main`: GitHub → **Settings** → **Branches** → **Add branch protection rule** → Branch name pattern `main` → enable **Require status checks to pass before merging** and select the **CI** check (job from `ci.yml`).

## Production build

```bash
npm run build
npm run start
```

Build output:

```
build/
├── client/   # static assets
└── server/   # SSR server code
```

## Docker

```bash
docker build -t book-store-www .
docker run -p 3000:3000 book-store-www
```

Note: `VITE_API_URL` is baked in at Vite build time. For a Docker image, set the variable before `docker build` (e.g. `ARG`/`ENV` in the Dockerfile) or build locally with the correct `.env`.

## Related repos

CMS backend: `strapi.book-store.com.pl` (Strapi + Postgres + Cloudinary).
