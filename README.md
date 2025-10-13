# FOTOL JAY - Plateforme de Vente de Produits d'Occasion

Application web et mobile pour la vente de produits d'occasion avec photo obligatoire via l'appareil photo.

## 🎯 Caractéristiques Principales

- **Publication sans compte**: Les vendeurs publient leurs produits sans créer de compte
- **Photo obligatoire**: Prise de photo directement via l'appareil (pas d'import galerie)
- **Stockage CDN**: Images hébergées sur Cloudinary pour performance optimale
- **Modération**: Admin et modérateurs valident les publications
- **Consultation publique**: Acheteurs consultent sans connexion
- **Expiration automatique**: Produits expirés après 7 jours
- **Système VIP**: Priorité d'affichage pour certains produits
- **Notifications email**: Vendeurs notifiés par email

## 🏗️ Architecture

### Backend (Node.js + Express + Prisma)
- API REST
- Base de données MySQL
- Cloudinary pour les images
- Authentification JWT (Admin/Modérateur uniquement)
- Cron jobs pour expiration automatique

### Frontend (Angular)
- Interface responsive
- Accès caméra pour photos
- Consultation publique
- Interface admin/modération

## 📋 Prérequis

- Node.js >= 18
- MySQL >= 8
- Compte Cloudinary (gratuit)
- Angular CLI

## 🚀 Installation

### 1. Backend

```bash
cd back
npm install

# Configurer .env
cp .env.example .env
# Remplir les variables Cloudinary

# Générer Prisma Client
npm run prisma:generate

# Créer la base de données et migrer
npm run prisma:migrate

# Seed (créer admin/modérateur)
npm run prisma:seed

# Démarrer en mode dev
npm run dev
```

### 2. Frontend

```bash
cd front
npm install
ng serve
```

## 🔑 Comptes par Défaut

Après le seed:
- **Admin**: admin@fotoljay.com / admin123
- **Modérateur**: moderator@fotoljay.com / moderator123

## 📡 API Endpoints

### Publics (sans authentification)
- `GET /api/products` - Liste des produits approuvés
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Publier un produit (avec photos)

### Admin/Modérateur (authentification requise)
- `POST /api/auth/login` - Connexion
- `GET /api/products/moderation/pending` - Produits en attente
- `POST /api/products/:id/approve` - Approuver
- `POST /api/products/:id/reject` - Rejeter
- `DELETE /api/products/:id` - Supprimer

### Admin uniquement
- `PUT /api/products/:id/vip` - Marquer comme VIP
- `GET /api/users` - Liste des utilisateurs admin

## 🖼️ Configuration Cloudinary

1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Récupérer: Cloud Name, API Key, API Secret
3. Remplir dans `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📱 Fonctionnalités

### Pour les Vendeurs
1. Accéder au site (pas de connexion)
2. Cliquer sur "Vendre un produit"
3. Prendre des photos (1-5 max)
4. Remplir: titre, description, nom, email, téléphone
5. Soumettre → En attente de modération
6. Recevoir email de confirmation/rejet

### Pour les Acheteurs
1. Consulter les produits (pas de connexion)
2. Voir détails + photos
3. Contacter le vendeur (email/téléphone affiché)

### Pour les Modérateurs/Admin
1. Se connecter
2. Voir produits en attente
3. Approuver ou rejeter
4. Gérer produits VIP (admin)
5. Supprimer produits inappropriés

## ⏰ Tâches Automatiques

- **Minuit**: Expiration des produits > 7 jours
- **10h**: Notification produits expirant dans 24h

## 🛠️ Technologies

- **Backend**: Node.js, Express, TypeScript, Prisma, MySQL
- **Frontend**: Angular, TailwindCSS
- **CDN**: Cloudinary
- **Auth**: JWT
- **Cron**: node-cron

## 📝 Variables d'Environnement

```env
DATABASE_URL=mysql://user:password@localhost:3306/fotoljay
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## 📄 Licence

MIT

## 👥 Auteur

FOTOL JAY Team
