#!/usr/bin/env bash
# Français — messages des scripts shell

DOTG_MSG[error.must_root]='Ce script doit être exécuté en root (sudo).'
DOTG_MSG[error.unknown_option]='Option inconnue : {arg}'
DOTG_MSG[error.unsupported_os]='OS non supporté.'
DOTG_MSG[error.unsupported_os_detail]='OS non supporté : {os}. Utilisez Ubuntu 22.04+ ou Debian 12+.'
DOTG_MSG[error.missing_var]='Variable {var} manquante en mode non-interactif.'
DOTG_MSG[error.no_installation]='Aucune installation dans {dir}'
DOTG_MSG[error.already_configured]='Configuration déjà terminée (BOOTSTRAP_MODE=false).'
DOTG_MSG[error.i18n_not_found]='Fichiers de traduction introuvables. Exécutez install depuis le clone du dépôt.'

DOTG_MSG[log.os_detected]='OS détecté : {os} {version}'
DOTG_MSG[log.docker_installed]='Docker déjà installé : {version}'
DOTG_MSG[log.installing_docker]='Installation de Docker...'
DOTG_MSG[log.ufw_unavailable]='UFW non disponible, configuration firewall ignorée.'
DOTG_MSG[log.configuring_firewall]='Configuration du firewall (ports 22, 80, 443, {port})...'
DOTG_MSG[log.non_interactive_env]='Mode non-interactif : .env conservé tel quel.'
DOTG_MSG[log.production_env_kept]='Configuration production déjà présente — .env conservé.'
DOTG_MSG[log.bootstrap_env_generated]='Configuration bootstrap générée ({path}/.env)'
DOTG_MSG[log.config_saved]='Configuration sauvegardée dans {path}/.env'
DOTG_MSG[log.updating_repo]='Mise à jour du dépôt...'
DOTG_MSG[log.cloning_repo]='Clonage du dépôt dans {dir}...'
DOTG_MSG[log.building_base]="Construction de l'image de base..."
DOTG_MSG[log.building_templates]='Construction des templates...'
DOTG_MSG[log.starting_stack]='Démarrage de la stack...'
DOTG_MSG[log.waiting_platform]='Attente du démarrage de la plateforme...'
DOTG_MSG[log.saving_config_db]='Enregistrement de la configuration dans la base...'
DOTG_MSG[log.switching_production]='Basculage vers le mode production HTTPS...'
DOTG_MSG[log.waiting_restart]='Attente du redémarrage...'

DOTG_MSG[help.usage]='Usage : install.sh [options]'
DOTG_MSG[help.default]='(défaut) Zero-config : HTTPS autosigné sur :{port} + wizard web'
DOTG_MSG[help.configure_cli]='Configuration CLI (après bootstrap, sans navigateur)'
DOTG_MSG[help.interactive]='Configuration CLI complète avant déploiement (sans wizard web)'
DOTG_MSG[help.non_interactive]='Conserve le .env existant sans questions'
DOTG_MSG[help.help_opt]='Affiche cette aide'
DOTG_MSG[help.env_repo]='URL du dépôt Git'
DOTG_MSG[help.env_install_dir]="Répertoire d'installation (défaut : /opt/devonthego)"
DOTG_MSG[help.env_lang]='Langue des scripts : en, fr, es, de, pt, it (défaut : en)'

DOTG_MSG[prompt.cli_header]='Configuration Dev on the go (mode CLI)'
DOTG_MSG[prompt.keep_value]='Conserver cette valeur ? [O/n]'
DOTG_MSG[prompt.new_value]='Nouvelle valeur :'
DOTG_MSG[prompt.new_value_secret]='Nouvelle valeur :'
DOTG_MSG[prompt.cannot_empty]='La valeur ne peut pas être vide. Nouvelle valeur :'
DOTG_MSG[prompt.enable_bool]='Activer ? [o/N] (true/false) :'
DOTG_MSG[prompt.answer_true_false]='Répondez par true ou false.'
DOTG_MSG[prompt.current_value]='Valeur actuelle : {value}'
DOTG_MSG[prompt.current_value_secret]='Valeur actuelle : ******** (masquée)'
DOTG_MSG[prompt.cli_configure_now]='Configurer maintenant en CLI (sans navigateur) ? [o/N]'
DOTG_MSG[prompt.cli_options_header]='Le portail web est démarré. Configuration possible :'
DOTG_MSG[prompt.cli_option_browser]='Navigateur : https://<IP>:{port} (certificat autosigné)'
DOTG_MSG[prompt.cli_option_ssh]='SSH plus tard : {dir}/install.sh --configure-cli'

DOTG_MSG[label.domain]='Domaine principal'
DOTG_MSG[label.acme_email]="Email Let's Encrypt"
DOTG_MSG[label.admin_email]='Email administrateur'
DOTG_MSG[label.admin_name]='Nom administrateur'
DOTG_MSG[label.admin_password]='Mot de passe admin'
DOTG_MSG[label.app_url]='URL interface admin'
DOTG_MSG[label.public_signup]='Inscription publique'
DOTG_MSG[label.env_cpu]='CPU par environnement'
DOTG_MSG[label.env_memory]='RAM par environnement'

DOTG_MSG[summary.bootstrap.title]='Dev on the go — Installation bootstrap terminée'
DOTG_MSG[summary.bootstrap.step1]='1. Ouvrez :  https://{ip}:{port}'
DOTG_MSG[summary.bootstrap.step1_hint]="   (certificat autosigné — acceptez l'avertissement navigateur)"
DOTG_MSG[summary.bootstrap.step2]='2. Connectez-vous :'
DOTG_MSG[summary.bootstrap.email]='      Email           admin@bootstrap.local'
DOTG_MSG[summary.bootstrap.password]='      Mot de passe    {password}'
DOTG_MSG[summary.bootstrap.step3]="3. Suivez l'assistant /setup"
DOTG_MSG[summary.bootstrap.cli]='Sans navigateur : {dir}/install.sh --configure-cli'
DOTG_MSG[summary.bootstrap.after]='Après configuration : https://admin.<votre-domaine>'

DOTG_MSG[summary.production.title]='Dev on the go — Installation terminée'
DOTG_MSG[summary.production.admin]='Admin:     {url}'
DOTG_MSG[summary.production.email]='Email:     {email}'
DOTG_MSG[summary.production.password]='Mot de passe:  {password}'

DOTG_MSG[finish.error.no_env]='.env introuvable dans {dir}'
DOTG_MSG[finish.recreating]='Recréation Traefik et plateforme (mode production)...'
DOTG_MSG[finish.done]='Terminé. La plateforme redémarre avec HTTPS sur admin.${DOMAIN}.'

DOTG_MSG[certs.error.cert_dir]='Répertoire certificats requis'
DOTG_MSG[certs.error.server_ip]='IP du serveur requise'
DOTG_MSG[certs.created]='Certificat créé pour IP {ip} dans {dir}'

DOTG_MSG[build.error.unknown_option]='Option inconnue : {opt}'
DOTG_MSG[build.error.template_not_found]='Template introuvable : {name}'
DOTG_MSG[build.error.name_required]='Erreur : --name est requis'
DOTG_MSG[build.error.dockerfile_required]='Erreur : --dockerfile ou --template est requis'
DOTG_MSG[build.error.dockerfile_not_found]='Dockerfile introuvable : {path}'
DOTG_MSG[build.building_base]="==> Construction de l'image de base..."
DOTG_MSG[build.building_from]='==> Construction de {tag} depuis {dockerfile}'
DOTG_MSG[build.tagged]='==> Tagué comme {tag}'
DOTG_MSG[build.pushing]='==> Push vers {registry}...'
DOTG_MSG[build.done]='Terminé. Image prête : {tag}'

DOTG_MSG[build.help.usage]='Usage : {name} [options]'
DOTG_MSG[build.help.description]="Construire une image d'environnement Dev on the go custom."
DOTG_MSG[build.help.name]="Nom de l'image (requis), ex. my-project"
DOTG_MSG[build.help.base]='Image de base (défaut : devonthego/base:latest)'
DOTG_MSG[build.help.dockerfile]='Chemin Dockerfile custom'
DOTG_MSG[build.help.template]='Template intégré : node, python, php'
DOTG_MSG[build.help.tag]='Tag image (défaut : latest)'
DOTG_MSG[build.help.registry]='Registry local (défaut : registry:5000)'
DOTG_MSG[build.help.push]='Push vers le registry local après build'
DOTG_MSG[build.help.build_base]="Construire l'image de base avant l'image custom"
DOTG_MSG[build.help.help]='Affiche cette aide'
