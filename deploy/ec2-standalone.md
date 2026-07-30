# Deploy EC2 standalone — www + Caddy (Docker), osobna maszyna od nest

**Bez nest, bez sieci `book-store`.** Na EC2 działa Compose z `caddy` + `www`.
CI buduje obraz, push na Docker Hub; EC2 robi `docker pull` i `compose up`.

Workflow: `.github/workflows/deploy-ec2-standalone.yml` → **Deploy to EC2 standalone (Docker + Caddy)**  
(`workflow_dispatch`, dowolny branch).

Produkcja z nestem: `deploy/ec2.md` + `deploy-ec2.yml` (bez zmian).

## Architektura

```text
GitHub Actions
  docker build → docker push  USER/www-book-store:<sha>
EC2 (standalone)
└── Compose (/var/www/www-standalone/docker/)
    ├── caddy :80/:443  → reverse_proxy www:3000
    └── www             ← docker pull USER/www-book-store:<sha>
```

## Layout na serwerze

```
/var/www/www-standalone/
└── docker/
    ├── docker-compose.yml
    ├── Caddyfile
    ├── activate-release-docker.sh
    └── .env          # WWW_IMAGE=...  SITE_ADDRESS=...
```

## Bootstrap (jednorazowo)

### 1. EC2

Standardowy **Ubuntu Server 22.04/24.04** z AWS Quick Start **nie ma** Dockera — trzeba go doinstalować po SSH (user `ubuntu`).

**AWS (konsola):**

- Security group: **22** (SSH), **80**, **443**
- Elastic IP zalecany (DNS / smoke test)

**Docker + Compose (prosta instalacja z repozytorium Ubuntu):**

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2

sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker ubuntu
```

Wyloguj się i zaloguj ponownie (nowa sesja SSH), potem sprawdź:

```bash
docker --version
docker compose version
docker ps    # bez sudo
```

**Opcjonalnie:** nowszy Docker CE z [docker.com](https://docs.docker.com/engine/install/ubuntu/) zamiast `docker.io` — dla tego workflow wystarczy wersja z `apt` powyżej.

### 2. Katalog deploy

```bash
sudo mkdir -p /var/www/www-standalone/docker
sudo chown -R ubuntu:ubuntu /var/www/www-standalone
```

### 3. Docker Hub

Te same credentials co produkcja (`DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN`),
ten sam obraz (np. `USER/www-book-store`) — albo osobne repo przez `DOCKERHUB_IMAGE`.

### 4. DNS (opcjonalnie, dla HTTPS)

A record domeny testowej → Elastic IP.  
Bez DNS ustaw `EC2_STANDALONE_SITE_ADDRESS` na `:80` (tylko HTTP) i smoke URL jako `http://<IP>`.

### 5. Pierwszy deploy

GitHub → **Deploy to EC2 standalone (Docker + Caddy)** → Run workflow.

## GitHub — sekrety i zmienne

**Secrets (osobne od produkcji nest):**

| Secret                   | Opis                                  |
| ------------------------ | ------------------------------------- |
| `EC2_STANDALONE_HOST`    | IP / hostname testowej EC2            |
| `EC2_STANDALONE_SSH_KEY` | private klucz deploy (bez passphrase) |
| `DOCKERHUB_USERNAME`     | login Docker Hub (może być wspólny)   |
| `DOCKERHUB_TOKEN`        | access token Docker Hub               |

**Variables:**

| Variable                      | Wartość                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `EC2_STANDALONE_BASE_URL`     | np. `https://www.book-store.pl` albo `http://x.x.x.x`       |
| `EC2_STANDALONE_SITE_ADDRESS` | domena Caddy **albo** `:80` (HTTP only)                     |
| `VITE_API_URL`                | opcjonalnie (jak w prod)                                    |
| `DOCKERHUB_IMAGE`             | opcjonalnie, default: `<DOCKERHUB_USERNAME>/www-book-store` |

SSH: port **22**, user `ubuntu`.

## SITE_ADDRESS

| Wartość             | Zachowanie Caddy                       |
| ------------------- | -------------------------------------- |
| `www.book-store.pl` | HTTPS (Let's Encrypt), potrzebny DNS A |
| `:80`               | tylko HTTP na porcie 80                |

Puste `EC2_STANDALONE_SITE_ADDRESS` w Actions → activate dostaje pusty string;
ustaw jawnie `:80` albo domenę.

## vs produkcja (nest)

|                  | Prod `deploy-ec2.yml`      | Standalone (ten wariant)         |
| ---------------- | -------------------------- | -------------------------------- |
| Maszyna          | ta sama co nest            | osobna EC2                       |
| Proxy            | Caddy nest → `www:3000`    | Caddy w tym samym Compose        |
| Sieć Docker      | external `book-store`      | własna `www-standalone`          |
| Secrets host/key | `EC2_HOST` / `EC2_SSH_KEY` | `EC2_STANDALONE_*`               |
| Path na serwerze | `/var/www/www/docker`      | `/var/www/www-standalone/docker` |
