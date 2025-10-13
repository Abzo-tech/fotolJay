# Changements Majeurs - FOTOL JAY

## 🎯 Modifications Principales

### 1. **Système sans compte pour les vendeurs**
- ❌ **Supprimé**: Inscription/connexion pour vendeurs
- ✅ **Nouveau**: Publication directe avec nom, email, téléphone
- Les vendeurs remplissent un formulaire simple sans créer de compte
- Informations stockées directement dans le produit

### 2. **Stockage des images sur Cloudinary (CDN)**
- ❌ **Supprimé**: Stockage local des images
- ✅ **Nouveau**: Upload vers Cloudinary
- Optimisation automatique des images
- URLs permanentes et sécurisées
- Suppression automatique lors de la suppression du produit

### 3. **Authentification limitée (Admin/Modérateur uniquement)**
- Seuls les **administrateurs** et **modérateurs** ont besoin de se connecter
- Les acheteurs consultent sans connexion
- Les vendeurs publient sans connexion

### 4. **Notifications par email**
- ❌ **Supprimé**: Notifications dans l'application
- ✅ **Nouveau**: Notifications par email aux vendeurs
- Stockage des notifications en base pour historique
- Flag `sent` pour tracking des emails envoyés

## 📊 Schéma de Base de Données

### Modèle `User` (Admin/Modérateur uniquement)
```prisma
model User {
  id                  String   @id @default(uuid())
  email               String   @unique
  password            String
  firstName           String
  lastName            String
  role                UserRole @default(MODERATOR)
  isActive            Boolean  @default(true)
  forcePasswordChange Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

enum UserRole {
  MODERATOR
  ADMIN
}
```

### Modèle `Product` (avec infos vendeur)
```prisma
model Product {
  id          String        @id @default(uuid())
  title       String
  description String
  status      ProductStatus @default(PENDING)
  views       Int           @default(0)
  isVip       Boolean       @default(false)
  
  // Informations du vendeur (sans compte)
  sellerName  String
  sellerEmail String
  sellerPhone String
  
  photos      Photo[]
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Modèle `Photo` (avec Cloudinary)
```prisma
model Photo {
  id        String   @id @default(uuid())
  url       String
  publicId  String?  // Cloudinary public ID
  isPrimary Boolean  @default(false)
  productId String
  product   Product  @relation(...)
  createdAt DateTime @default(now())
}
```

### Modèle `Notification` (email)
```prisma
model Notification {
  id             String           @id @default(uuid())
  type           NotificationType
  message        String
  recipientEmail String           // Email du vendeur
  productId      String?
  sent           Boolean  @default(false)
  sentAt         DateTime?
  createdAt      DateTime @default(now())
}
```

## 🔄 Flux de Publication

### Ancien flux (avec compte)
1. Vendeur s'inscrit
2. Vendeur se connecte
3. Vendeur publie produit
4. Modération
5. Notification dans l'app

### Nouveau flux (sans compte)
1. ✅ Vendeur accède au site (pas de connexion)
2. ✅ Vendeur remplit formulaire: titre, description, nom, email, téléphone
3. ✅ Vendeur prend photos (1-5 max)
4. ✅ Photos uploadées vers Cloudinary
5. ✅ Produit créé avec statut PENDING
6. ✅ Modérateur approuve/rejette
7. ✅ Email envoyé au vendeur

## 📡 Endpoints API Modifiés

### Publics (sans auth)
```
POST /api/products
Body: {
  title, description, sellerName, sellerEmail, sellerPhone
}
Files: photos[] (multipart/form-data)
```

### Admin/Modérateur (avec auth)
```
GET  /api/products/moderation/pending
POST /api/products/:id/approve
POST /api/products/:id/reject
DELETE /api/products/:id
```

## ⚙️ Configuration Requise

### Variables d'environnement (.env)
```env
# Cloudinary (OBLIGATOIRE)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optionnel pour notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Compte Cloudinary
1. Créer un compte gratuit sur https://cloudinary.com
2. Récupérer les credentials dans Dashboard > Settings
3. Remplir les variables dans `.env`

## 🚀 Migration

### Pour migrer depuis l'ancienne version:
```bash
# 1. Installer Cloudinary
npm install cloudinary

# 2. Réinitialiser la base de données
npx prisma migrate reset --force

# 3. Créer admin/modérateur
npx ts-node --transpileOnly prisma/seed.ts

# 4. Configurer Cloudinary dans .env

# 5. Démarrer le serveur
npm run dev
```

## 📝 Notes Importantes

1. **Cloudinary est obligatoire** - L'app ne fonctionnera pas sans
2. **Pas de galerie** - Photos prises uniquement via caméra
3. **Multer en mémoire** - Upload temporaire avant Cloudinary
4. **Suppression cascade** - Images supprimées de Cloudinary avec le produit
5. **Emails asynchrones** - Notifications envoyées en arrière-plan

## 🔐 Comptes par Défaut

Après le seed:
- **Admin**: admin@fotoljay.com / admin123
- **Modérateur**: moderator@fotoljay.com / moderator123

## 📱 Prochaines Étapes

1. ✅ Backend adapté
2. ⏳ Frontend Angular à créer
3. ⏳ Service d'envoi d'emails
4. ⏳ Tests end-to-end
5. ⏳ Déploiement
