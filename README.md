# HAITECH GROUP - Site Officiel

## Prérequis

- Node.js 20+ (inclut npm)

## Installation

```bash
npm install
npm run migrate
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

## Structure livree

- `app/` : pages principales du site (Accueil, Technology, Business Center, Academy, etc.)
- `components/` : composants partages (Header, Footer, PageHero)
- `tailwind.config.ts` : theme HAITECH (couleurs et typographies)

## API Leads + MySQL

1. Copier `.env.example` vers `.env.local` puis renseigner vos identifiants MySQL (optionnel en local si root sans mot de passe).
2. Executer `sql/init.sql` sur votre serveur MySQL.
3. Le formulaire `Contact/Devis` envoie les donnees vers `POST /api/leads` (table `leads`).
4. Le script SQL cree egalement le socle complet: auth, clients, devis, e-learning, blog, logs.
5. Un back-office leads minimal est disponible sur ` /admin/leads ` (liste + changement de statut).
6. Le module devis est disponible sur ` /admin/devis ` (creation + export PDF).

## Auth admin

- Page login: ` /login `
- Comptes seed de demonstration (a changer immediatement hors local):
  - `admin@haitech-group.ci` (role admin)
  - `client@haitech-group.ci` (role client)
  - `etudiant@haitech-group.ci` (role etudiant)
- RBAC actif:
  - ` /admin/* ` : admin uniquement
  - ` /espace-client ` : client + admin
  - ` /elearning ` : etudiant + admin
  - APIs protegees selon role (`leads`, `devis`, `services`, `client`, `elearning`)

## Branding

- Logo principal integre depuis `public/logo-haitech.jpg`
- Affichage du logo sur header, hero et footer
- Devis PDF brandes HAITECH (logo, en-tete, recap TVA/remise, pied de page)

Exemple de lancement SQL:

```bash
mysql -u root -p < sql/init.sql
```

## Migrations versionnees

Les evolutions DB incrementales sont dans `sql/migrations`.

```bash
npm run migrate
```

## Tests et qualite

```bash
npm run typecheck
npm run lint
npm run test
npm run quality
npm run test:e2e
```

## Portail entreprise et operations

- Espace client enrichi: KPI, timeline unifiee, calendrier interventions, contrats/SLA, incidents, documents, NPS.
- Admin:
  - ` /admin/commandes `: workflow detaille + checklist de cloture.
  - ` /admin/interventions `: planification maintenance et services entreprise.
  - ` /admin/incidents `: support, priorites et escalades.
  - ` /admin/documents `: gestion des livrables et visibilite client.
- Observabilite:
  - endpoint ` /api/admin/metrics ` (compteurs API de base).
- Audit:
  - journalisation des actions sensibles en `audit_logs`.
- Notifications:
  - email + WhatsApp + in-app via le service `lib/notifications.ts`.
  - provider WhatsApp supporte: `meta` ou `twilio`.
  - endpoint de test admin: `POST /api/admin/notifications/whatsapp-test`.

### Configuration WhatsApp (payload exact)

- **Meta Cloud API**
  - `WHATSAPP_PROVIDER=meta`
  - `WHATSAPP_META_TOKEN=<meta_permanent_token>`
  - `WHATSAPP_META_PHONE_NUMBER_ID=<phone_number_id>`
  - payload envoye:
    - `messaging_product: "whatsapp"`
    - `recipient_type: "individual"`
    - `to: "<numero_e164>"`
    - `type: "text"`
    - `text.preview_url: false`
    - `text.body: "<message>"`

- **Twilio WhatsApp**
  - `WHATSAPP_PROVIDER=twilio`
  - `TWILIO_ACCOUNT_SID=<sid>`
  - `TWILIO_AUTH_TOKEN=<token>`
  - `TWILIO_WHATSAPP_FROM=+14155238886` (ou votre sender WA)
  - payload envoye (form-urlencoded):
    - `To=whatsapp:+<numero>`
    - `From=whatsapp:+<sender>`
    - `Body=<message>`

## Sauvegardes / reprise (base)

- Sauvegarde quotidienne MySQL recommandee via `mysqldump` + rotation 7/30 jours.
- Verifier regulierement un restore sur environnement de test.

## Prochaines evolutions recommandees

- Ajouter tests automatises (API + parcours critiques)
- Ajouter migration SQL versionnee
- Ajouter monitoring/alerting production
