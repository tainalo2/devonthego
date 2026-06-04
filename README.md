# Dev on the go

Plateforme d'environnements de développement contenairisés avec [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server), accessible depuis n'importe quel navigateur.

## Architecture

- **Traefik** — reverse proxy HTTPS + basic auth par environnement
- **Registry local** — images Docker custom
- **AdonisJS 7 + React Inertia** — interface d'administration
- **SQLite / libSQL** — base de données légère
- **Docker socket** — orchestration des environnements de dev

## Démarrage rapide (VPS)

```bash
curl -fsSL https://raw.githubusercontent.com/tainalo2/dev-on-the-go/main/install.sh | sudo bash
```

Ou manuellement :

```bash
git clone https://github.com/tainalo2/dev-on-the-go.git /opt/devonthego
cd /opt/devonthego
cp .env.example .env
# Éditer .env (DOMAIN, ACME_EMAIL, ADMIN_*)
./install.sh
```

## Développement local

### Prérequis

- Node.js 24+
- Docker + Docker Compose

### Plateforme AdonisJS

```bash
cd platform
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
node ace db:seed
npm run dev
```

Ouvrir http://localhost:3333

### Stack complète (Docker)

```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

## Scripts

| Script | Description |
|--------|-------------|
| `install.sh` | Bootstrap complet sur un VPS Linux |
| `images/build-image.sh` | Construire une image d'environnement custom |
| `images/base/Dockerfile` | Image de base OpenVSCode Server |

### Exemples build image

```bash
chmod +x images/build-image.sh

# Image de base
./images/build-image.sh --build-base --name base --dockerfile images/base/Dockerfile

# Template Node.js
./images/build-image.sh --template node --name node --push

# Dockerfile custom
./images/build-image.sh --name mon-projet --dockerfile ./mon/Dockerfile --push
```

## Rôles utilisateurs

| Rôle | Permissions |
|------|-------------|
| **admin** | Gestion utilisateurs, images, tous les environnements |
| **user** | Ses environnements et ceux partagés avec lui |

## Persistance

Les volumes de workspace sont montés manuellement dans `/data/workspaces/{slug}`. Pensez à sauvegarder ce répertoire régulièrement.

### Maintenance

Synchroniser les statuts Docker (cron recommandé toutes les minutes) :

```bash
docker compose exec platform node ace dotg:sync-environments
```

## Licence

MIT
