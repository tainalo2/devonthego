# Dev on the go

Containerized development environments powered by [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server), accessible from any browser.

## Architecture

```
VPS
 ├── Traefik          HTTPS reverse proxy + per-environment basic auth
 ├── Local registry   Custom Docker images
 ├── AdonisJS 7       Admin UI (React Inertia)
 └── dotg-env-*       On-demand dev containers (OpenVSCode Server)
```

| Component | Role |
|-----------|------|
| **Traefik** | TLS termination, routing (`admin.domain`, `slug.domain`) |
| **Registry** | Local image storage (`registry:5000`) |
| **Platform** | AdonisJS 7 + React Inertia admin interface |
| **SQLite / libSQL** | Lightweight database |
| **Docker socket** | Environment orchestration |

## Quick start (VPS)

One-liner install — zero configuration required:

```bash
curl -fsSL https://raw.githubusercontent.com/tainalo2/devonthego/main/install.sh | sudo bash
```

The script will:

1. Install Docker and configure the firewall
2. Clone the repository to `/opt/devonthego`
3. Start the stack in **bootstrap mode** (self-signed HTTPS on port **8443**)
4. Display temporary credentials and the setup URL

### First-time setup

**Option A — Web wizard (recommended)**

1. Open `https://<server-ip>:8443` (accept the self-signed certificate warning)
2. Sign in with the bootstrap credentials shown by `install.sh`
3. Complete the `/setup` wizard (domain, Let's Encrypt, admin account, resource limits)
4. Access production admin at `https://admin.<your-domain>`

**Option B — CLI (no browser)**

During install, answer `y` when prompted, or run later:

```bash
sudo /opt/devonthego/install.sh --configure-cli
```

**Option C — Full CLI before web start**

```bash
sudo ./install.sh --interactive
```

Skips bootstrap mode and deploys directly in production configuration.

## Install script options

| Flag | Description |
|------|-------------|
| *(default)* | Zero-config bootstrap + web wizard |
| `--configure-cli` | Complete setup via SSH (stack already running) |
| `--interactive` | Full CLI configuration before deployment |
| `--non-interactive` | Keep existing `.env` without prompts |
| `-h`, `--help` | Show help |

### Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DOTG_REPO_URL` | Git repository URL | `https://github.com/tainalo2/devonthego.git` |
| `DOTG_INSTALL_DIR` | Installation directory | `/opt/devonthego` |
| `DOTG_LANG` | Script language (`en`, `fr`, `es`, `de`, `pt`, `it`) | `en` |

Example — install in French:

```bash
DOTG_LANG=fr curl -fsSL .../install.sh | sudo bash
```

## Internationalization (i18n)

### Web interface

The admin platform supports **6 languages** with **English as the default**:

| Code | Language |
|------|----------|
| `en` | English |
| `fr` | French |
| `es` | Spanish |
| `de` | German |
| `pt` | Portuguese |
| `it` | Italian |

- Default locale: **English**
- Auto-detection via browser `Accept-Language` header
- Manual switch via the language selector in the header (persisted in session)
- Translation files: `platform/resources/lang/{locale}/`

### Shell scripts

All user-facing script messages are translated via `scripts/lib/i18n.sh`:

| Script | Purpose |
|--------|---------|
| `install.sh` | VPS bootstrap and configuration |
| `scripts/finish-setup.sh` | Switch from bootstrap to production HTTPS |
| `scripts/generate-bootstrap-certs.sh` | Self-signed TLS certificate for bootstrap |
| `images/build-image.sh` | Build custom environment images |

Set `DOTG_LANG=fr` (or `es`, `de`, `pt`, `it`) before running any script.

## Local development

### Prerequisites

- Node.js 24+
- Docker + Docker Compose

### AdonisJS platform only

```bash
cd platform
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
node ace db:seed
npm run dev
```

Open http://localhost:3333

### Full stack (Docker)

```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

## Scripts reference

| Script | Description |
|--------|-------------|
| `install.sh` | Full VPS bootstrap: Docker, clone, images, stack, setup |
| `scripts/finish-setup.sh` | Recreate Traefik + platform in production mode |
| `scripts/generate-bootstrap-certs.sh` | Generate bootstrap TLS cert (IP SAN) |
| `images/build-image.sh` | Build and optionally push custom env images |
| `images/base/Dockerfile` | Base OpenVSCode Server image |

### Build custom images

```bash
chmod +x images/build-image.sh

# Base image
./images/build-image.sh --build-base --name base --dockerfile images/base/Dockerfile

# Built-in template (node, python, php)
./images/build-image.sh --template node --name node --push

# Custom Dockerfile
./images/build-image.sh --name my-project --dockerfile ./my/Dockerfile --push
```

## User roles

| Role | Permissions |
|------|-------------|
| **admin** | Users, images, webhooks, settings, all environments |
| **user** | Own environments and those shared with them |

## Features

- **Async image builds** — background builds with log streaming and UI polling
- **Environment editing** — name, CPU, RAM (container recreated when resources change)
- **Git import** — automatic clone on start if workspace is empty
- **Webhooks** — HMAC SHA-256 signed HTTP notifications on status changes
- **Zero-config install** — bootstrap HTTPS + web setup wizard

## Persistence

Workspace volumes are stored under `/data/workspaces/{slug}`. Back up this directory regularly.

### Maintenance

Sync Docker container statuses (recommended cron every minute):

```bash
docker compose exec platform node ace dotg:sync-environments
```

## Project structure

```
/
├── install.sh                      VPS bootstrap
├── docker-compose.yml              Production stack
├── docker-compose.bootstrap.yml    Bootstrap overlay (HTTPS :8443)
├── docker-compose.dev.yml          Local development overrides
├── scripts/
│   ├── lib/i18n.sh                 Shell script i18n library
│   ├── lang/                       Script translations (en, fr, es, de, pt, it)
│   ├── finish-setup.sh
│   └── generate-bootstrap-certs.sh
├── images/                         Environment Docker images
└── platform/                       AdonisJS 7 admin application
    └── resources/lang/             Web UI translations
```

## License

MIT
