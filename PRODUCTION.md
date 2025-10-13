# 🚀 Guide de déploiement en production - FOTOL JAY

## ✅ Modifications apportées

### 1. Système d'email automatique
Les emails sont maintenant envoyés automatiquement à l'**email du vendeur** (pas à votre email personnel).

**Emails envoyés :**
- ✉️ **Confirmation de soumission** → Envoyé au vendeur quand il publie un produit
- ✉️ **Approbation** → Envoyé au vendeur quand l'admin approuve le produit
- ✉️ **Rejet** → Envoyé au vendeur quand l'admin rejette le produit (avec raison)
- ✉️ **Alerte d'expiration** → Envoyé 24h avant l'expiration (7 jours)

**Fichiers modifiés :**
- `/back/src/utils/email.util.ts` - Service d'envoi d'emails
- `/back/src/services/product.service.ts` - Intégration des emails

### 2. Validation Zod (remplacement des alert())
Tous les `alert()` ont été remplacés par un système de notifications modernes avec validation Zod.

**Avantages :**
- ✅ Validation stricte des données (email, téléphone, longueur des champs)
- ✅ Messages d'erreur clairs et précis
- ✅ Interface professionnelle avec toasts/notifications
- ✅ Pas de popups alert() intrusives

**Fichiers modifiés :**
- `/front/src/app/services/toast.service.ts` - Service de notifications
- `/front/src/app/components/toast/toast.ts` - Composant Toast
- `/front/src/app/components/sell/sell.ts` - Validation Zod intégrée

### 3. Capture photo directe (getUserMedia API)
La caméra s'ouvre maintenant directement dans le navigateur (desktop ET mobile).

**Fonctionnalités :**
- 📸 Flux vidéo en temps réel
- 📸 Capture instantanée
- 📸 Pas d'accès à la galerie possible
- 📸 Fonctionne sur tous les appareils

---

## 🔧 Configuration pour la production

### Backend (.env)

```bash
# Base de données (à adapter selon votre hébergeur)
DATABASE_URL="mysql://user:password@host:3306/database"

# JWT Secret (CHANGEZ CETTE VALEUR EN PRODUCTION!)
JWT_SECRET="votre-secret-jwt-super-securise-aleatoire"

# Port
PORT=3000
NODE_ENV=production

# Cloudinary (vos identifiants actuels)
CLOUDINARY_CLOUD_NAME=dscvpji8z
CLOUDINARY_API_KEY=546978158161641
CLOUDINARY_API_SECRET=OGkXMJ2IeZ8L2tQBKlb0X5KqvAs

# Email Gmail (vos identifiants actuels)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=diengabzo@gmail.com
EMAIL_PASSWORD=ijluyklflynu jcjp
```

### ⚠️ IMPORTANT - Sécurité

1. **JWT_SECRET** : Générez un secret aléatoire fort :
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Ne JAMAIS committer le fichier .env** (déjà dans .gitignore)

3. **Variables d'environnement** : Sur votre serveur de production, utilisez les variables d'environnement au lieu du fichier .env

---

## 📦 Déploiement

### Option 1 : Hébergement traditionnel (VPS, Dedicated Server)

#### Backend
```bash
cd back
npm install --production
npm run build  # Si vous avez un build script
npm start      # ou pm2 start src/index.ts
```

#### Frontend
```bash
cd front
npm install
npm run build
# Servir le dossier dist/front avec nginx ou apache
```

### Option 2 : Hébergement cloud

#### Backend (Railway, Render, Heroku)
- Connectez votre repo GitHub
- Définissez les variables d'environnement dans le dashboard
- Le déploiement se fait automatiquement

#### Frontend (Vercel, Netlify)
- Connectez votre repo GitHub
- Build command: `npm run build`
- Output directory: `dist/front/browser`

---

## 🔐 Checklist de sécurité

- [ ] Changer le `JWT_SECRET` en production
- [ ] Utiliser HTTPS (certificat SSL)
- [ ] Configurer CORS correctement
- [ ] Activer les logs d'erreur
- [ ] Mettre en place des backups de la base de données
- [ ] Limiter le rate-limiting sur les API
- [ ] Vérifier que `.env` est dans `.gitignore`

---

## 📧 Configuration email pour d'autres domaines

Si vous voulez utiliser un autre email que Gmail :

### Pour Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre-email@outlook.com
EMAIL_PASSWORD=votre-mot-de-passe-application
```

### Pour un serveur SMTP personnalisé
```env
EMAIL_HOST=smtp.votredomaine.com
EMAIL_PORT=587
EMAIL_USER=noreply@votredomaine.com
EMAIL_PASSWORD=votre-mot-de-passe
```

---

## 🧪 Tests avant production

1. **Tester la création de produit** avec validation
2. **Tester la capture photo** sur desktop et mobile
3. **Vérifier la réception des emails** (soumission, approbation, rejet)
4. **Tester le panneau admin** (approbation/rejet)
5. **Vérifier les notifications toast** (pas d'alert())

---

## 📝 Notes importantes

### Emails
- Les emails sont envoyés à l'adresse du **vendeur** (champ `sellerEmail`)
- Votre email (`diengabzo@gmail.com`) est utilisé comme **expéditeur**
- Si le service email n'est pas configuré, l'app fonctionne quand même (les emails ne sont juste pas envoyés)

### Validation
- Tous les champs sont validés avec Zod
- Les messages d'erreur sont en français et explicites
- Les toasts disparaissent automatiquement après 5-7 secondes

### Caméra
- Fonctionne sur desktop et mobile
- Nécessite HTTPS en production (obligatoire pour getUserMedia)
- L'utilisateur doit autoriser l'accès à la caméra

---

## 🆘 Support

En cas de problème :
1. Vérifiez les logs du serveur
2. Vérifiez la console du navigateur
3. Vérifiez que toutes les variables d'environnement sont définies
4. Vérifiez que la base de données est accessible

---

**Développé avec ❤️ pour FOTOL JAY**
