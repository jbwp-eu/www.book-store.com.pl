# Deploy OVH VPS — www.book-store.com.pl

Produkcja na tym samym VPS co nest: rsync + `activate-release.sh` + systemd.

Workflow: `.github/workflows/deploy-ovh.yml` (ręcznie `workflow_dispatch` na `main`).

## Layout na serwerze

```
/var/www/www/
├── current -> releases/<sha>/
├── releases/
│   └── <sha>/
│       ├── package.json
│       ├── package-lock.json
│       ├── build/
│       └── deploy/activate-release.sh
```

## Bootstrap (jednorazowo)

```bash
sudo mkdir -p /var/www/www/releases
sudo chown -R ubuntu:ubuntu /var/www/www
```

Uruchom na GitHubie workflow **Deploy to OVH VPS** (`Actions` → `Run workflow`, branch **main**).
Rsync wrzuci release do `/var/www/www/releases/<sha>/` (katalog `releases` musi istnieć wcześniej — powyżej).
Activate zrobi `npm ci` i symlink `current`.
Bez jednostki systemd restart jest pomijany (smoke test może paść) — dokończ bootstrap poniżej
i uruchom workflow **ponownie**.

```bash
# systemd (plik z repo — skopiuj lokalnie albo z releases/<sha>/deploy/)
sudo cp deploy/www-book-store.service.example /etc/systemd/system/www-book-store.service
sudo systemctl daemon-reload
sudo systemctl enable www-book-store

# sudoers: ubuntu może restartować usługę
# ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl restart www-book-store
```

Reverse proxy (NGINX/Caddy): `www.book-store.com.pl` → `127.0.0.1:3000`.

Po systemd + proxy + sudoers: drugi raz **Run workflow** — activate ustawi `current`, zrestartuje usługę i przejdzie smoke test.

## GitHub — sekrety i zmienne

**Secrets** (te same co nest, ten sam VPS):

| Secret        | Opis                                  |
| ------------- | ------------------------------------- |
| `OVH_HOST`    | IP lub hostname VPS                   |
| `OVH_SSH_KEY` | private klucz deploy (bez passphrase) |

**Variables:**

| Variable              | Wartość                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| `OVH_DEPLOY_BASE_URL` | `https://www.book-store.com.pl`                                               |
| `VITE_API_URL`        | `https://strapi.book-store.com.pl/api` (opcjonalnie; jest default w workflow) |

SSH: port **49152**, user `ubuntu` — jak w nest.
