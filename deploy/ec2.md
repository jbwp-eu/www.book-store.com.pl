# Deploy EC2 (Docker Hub) — www.book-store.pl (ta sama maszyna co nest.book-store.pl)

**Bez Node na hoście.** CI buduje obraz, **push na Docker Hub**; EC2 robi `docker pull`
i Compose w sieci `book-store`. Caddy nest: `reverse_proxy www:3000`.

Workflow: `.github/workflows/deploy-ec2.yml` → **Deploy to EC2 (Docker)**  
(`workflow_dispatch` na `main`).

OVH nadal: systemd + `deploy-ovh.yml` (osobna ścieżka).

## Architektura

```text
GitHub Actions
  docker build → docker push  USER/www-book-store:<sha>
EC2
├── nest Compose (/var/www/nest-book-store/docker/)
│   ├── caddy :80/:443
│   ├── nest-api
│   ├── postgres
│   └── network: book-store
└── www Compose (/var/www/www/docker/)
    └── www  ← docker pull USER/www-book-store:<sha>
```

Caddy (nest):

```caddy
www.book-store.pl {
	reverse_proxy www:3000
}
```

## Layout na serwerze

```
/var/www/www/
└── docker/
    ├── docker-compose.yml
    ├── activate-release-docker.sh
    └── .env          # WWW_IMAGE=user/www-book-store:<sha>
```

## Bootstrap (jednorazowo)

### 1. Nest musi być już na Dockerze

Sieć `book-store` tworzy nest `docker-compose.yml`.

### 2. Katalog www

```bash
sudo mkdir -p /var/www/www/docker
sudo chown -R ubuntu:ubuntu /var/www/www
```

### 3. Docker Hub

1. Utwórz repozytorium na Docker Hub, np. `TWOJ_USER/www-book-store` (publiczne albo prywatne).
2. Access Token: Docker Hub → Account Settings → Personal access tokens.

### 4. DNS

A record **`www.book-store.pl`** → publiczny IP / Elastic IP tej EC2.

### 5. Pierwszy deploy

GitHub → **Deploy to EC2 (Docker)** → branch **main** → Run workflow.

## GitHub — sekrety i zmienne

**Secrets:**

| Secret               | Opis                                              |
| -------------------- | ------------------------------------------------- |
| `EC2_HOST`           | IP lub hostname EC2 (jak nest)                    |
| `EC2_SSH_KEY`        | private klucz deploy (bez passphrase)             |
| `DOCKERHUB_USERNAME` | login Docker Hub                                  |
| `DOCKERHUB_TOKEN`    | access token Docker Hub (nie hasło konta)         |

**Variables:**

| Variable              | Wartość                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `EC2_DEPLOY_BASE_URL` | `https://www.book-store.pl`                                             |
| `VITE_API_URL`        | `https://strapi.book-store.com.pl/api` (opcjonalnie)                    |
| `DOCKERHUB_IMAGE`     | opcjonalnie, default: `<DOCKERHUB_USERNAME>/www-book-store`             |

Tagi pushowane: `:<git-sha>` oraz `:latest`.

SSH: port **22**, user `ubuntu`.

## OVH vs EC2

|          | OVH                       | EC2                                         |
| -------- | ------------------------- | ------------------------------------------- |
| Workflow | `deploy-ovh.yml`          | `deploy-ec2.yml` (Docker Hub)               |
| Runtime  | systemd + Node na hoście  | kontener z obrazu Docker Hub                |
| Proxy    | NGINX/Caddy na VPS        | Caddy nest → `www:3000`                     |
| Layout   | `/var/www/www` releases   | `/var/www/www/docker`                       |

Na raz aktywna jedna produkcja (DNS → OVH **albo** EC2).
