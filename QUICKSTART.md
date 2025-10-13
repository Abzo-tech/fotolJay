# 🚀 Guide de Démarrage Rapide - FOTOL JAY

## Étape 1: Configuration Cloudinary (5 min)

### Créer un compte Cloudinary
1. Aller sur https://cloudinary.com
2. Cliquer sur "Sign Up" (gratuit)
3. Remplir le formulaire d'inscription
4. Confirmer votre email

### Récupérer les credentials
1. Se connecter à Cloudinary
2. Aller dans **Dashboard**
3. Copier:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Configurer le backend
```bash
cd back
nano .env  # ou vim, code, etc.
```

Remplir:
```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

## Étape 2: Installation Backend (3 min)

```bash
cd back

# Installer les dépendances
npm install

# Générer Prisma Client
npm run prisma:generate

# Créer la base de données
npx prisma migrate dev

# Créer admin et modérateur
npx ts-node --transpileOnly prisma/seed.ts

# Démarrer le serveur
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

## Étape 3: Tester l'API (2 min)

### Test 1: Vérifier que le serveur fonctionne
```bash
curl http://localhost:3000/health
```

Résultat attendu:
```json
{"status":"OK","timestamp":"..."}
```

### Test 2: Se connecter en tant qu'admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fotoljay.com",
    "password": "admin123"
  }'
```

Résultat: Vous recevez un **token JWT**

### Test 3: Récupérer les produits
```bash
curl http://localhost:3000/api/products
```

Résultat: Liste vide (normal, pas encore de produits)

## Étape 4: Publier un Produit (Test avec Postman/Insomnia)

### Avec Postman:
1. **Méthode**: POST
2. **URL**: `http://localhost:3000/api/products`
3. **Body**: Form-data
   - `title`: "iPhone 12 Pro"
   - `description`: "Très bon état, 128GB"
   - `sellerName`: "Jean Dupont"
   - `sellerEmail`: "jean@example.com"
   - `sellerPhone`: "+33612345678"
   - `photos`: [Sélectionner 1-5 images]

4. Cliquer sur **Send**

### Résultat attendu:
```json
{
  "message": "Product submitted successfully. It will be reviewed by our team.",
  "product": {
    "id": "...",
    "title": "iPhone 12 Pro",
    "status": "PENDING",
    ...
  }
}
```

## Étape 5: Modérer le Produit

### Récupérer le token admin
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fotoljay.com","password":"admin123"}' \
  | jq -r '.token')
```

### Voir les produits en attente
```bash
curl http://localhost:3000/api/products/moderation/pending \
  -H "Authorization: Bearer $TOKEN"
```

### Approuver le produit
```bash
curl -X POST http://localhost:3000/api/products/PRODUCT_ID/approve \
  -H "Authorization: Bearer $TOKEN"
```

Remplacer `PRODUCT_ID` par l'ID du produit

## Étape 6: Vérifier le Produit Approuvé

```bash
curl http://localhost:3000/api/products
```

Le produit apparaît maintenant dans la liste publique!

## 🎉 Félicitations!

Votre backend FOTOL JAY fonctionne!

## 📝 Prochaines Étapes

1. **Frontend Angular**: Créer l'interface utilisateur
2. **Service Email**: Configurer l'envoi d'emails
3. **Tests**: Ajouter des tests automatisés
4. **Déploiement**: Mettre en production

## 🆘 Problèmes Courants

### Erreur: "Cannot find module 'cloudinary'"
```bash
npm install cloudinary
```

### Erreur: "CLOUDINARY_CLOUD_NAME is not defined"
Vérifier que `.env` est bien configuré avec vos credentials Cloudinary

### Erreur: "Database connection failed"
Vérifier que MySQL est démarré:
```bash
sudo systemctl status mysql
```

### Erreur: "Port 3000 already in use"
Changer le port dans `.env`:
```env
PORT=3001
```

## 📚 Documentation Complète

- **README.md**: Vue d'ensemble du projet
- **API_DOCUMENTATION.md**: Documentation complète de l'API
- **CHANGES.md**: Changements et migrations
- **back/documentation.md**: Documentation technique backend

## 💡 Conseils

1. **Cloudinary gratuit**: 25 GB de stockage, largement suffisant pour débuter
2. **Photos de test**: Utiliser des images < 5MB
3. **Modération**: Toujours modérer avant d'approuver
4. **Backup**: Sauvegarder régulièrement la base de données

## 🔗 Liens Utiles

- Cloudinary: https://cloudinary.com
- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com
- Angular Docs: https://angular.io

Bon développement! 🚀
