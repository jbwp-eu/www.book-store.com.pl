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

Create a `.env` file in the project directory:

```env
VITE_API_URL="http://localhost:1337/api"
```

For production Strapi:

```env
VITE_API_URL="https://strapi.book-store.com.pl/api"
```

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

## Routes

| Path | Description |
| --- | --- |
| `/` | home page (featured projects + latest posts) |
| `/about` | about me / about the project |
| `/contact` | contact |
| `/projects` | project list |
| `/projects/:id` | project details |
| `/blog` | post list |
| `/blog/:slug` | post details |

Data is fetched from Strapi endpoints: `/projects`, `/posts`.

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
