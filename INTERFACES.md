# 📱 Interfaces FOTOL JAY - Guide Complet

## Vue d'Ensemble

FOTOL JAY propose **3 interfaces distinctes** pour 3 types d'utilisateurs:

1. **👥 Acheteur** - Consultation publique (sans compte)
2. **📸 Vendeur** - Publication simple (sans compte)
3. **🔐 Admin/Modérateur** - Modération (avec connexion)

---

## 1. 👥 Interface ACHETEUR

### Accès
- **URL**: `http://localhost:5173/`
- **Connexion**: ❌ Non requise
- **Fichier**: `front/src/pages/home.page.js`

### Fonctionnalités

#### 📋 Liste des Produits
- Affichage en grille responsive
- Produits **APPROVED** uniquement
- Tri automatique: VIP en premier
- Compteur de vues

#### 🔍 Recherche
- Barre de recherche en temps réel
- Recherche dans titre et description
- Résultats instantanés

#### 👁️ Détails Produit
- Photos en grand format
- Description complète
- Informations vendeur:
  - Nom
  - Email (cliquable)
  - Téléphone (cliquable)
- Compteur de vues

### Captures d'Écran (Wireframe)

```
┌─────────────────────────────────────────┐
│  📸 FOTOL JAY    [Vendre] [Connexion]  │
├─────────────────────────────────────────┤
│                                         │
│   Trouvez des produits d'occasion      │
│        de qualité                       │
│                                         │
│   ┌──────────────────────┬────────┐    │
│   │ Rechercher...        │  🔍   │    │
│   └──────────────────────┴────────┘    │
│                                         │
│   ┌────────┐  ┌────────┐  ┌────────┐  │
│   │ [IMG]  │  │ [IMG]  │  │ [IMG]  │  │
│   │ iPhone │  │ PS5    │  │ Vélo   │  │
│   │ 500€   │  │ 400€   │  │ 150€   │  │
│   └────────┘  └────────┘  └────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 2. 📸 Interface VENDEUR

### Accès
- **URL**: `http://localhost:5173/#/sell`
- **Connexion**: ❌ Non requise
- **Fichier**: `front/src/pages/sell.page.js`

### Formulaire de Publication

#### 📷 Photos (Obligatoire)
```html
<input 
  type="file" 
  accept="image/*"
  capture="environment"  ← Active la caméra
  multiple               ← Plusieurs photos
/>
```
- **Minimum**: 1 photo
- **Maximum**: 5 photos
- **Source**: Caméra uniquement (pas de galerie)
- **Formats**: JPG, PNG, GIF, WEBP
- **Taille max**: 5MB par photo

#### 📝 Informations Produit
- **Titre** (max 100 caractères)
- **Description** (max 1000 caractères)

#### 👤 Informations Vendeur
- **Nom complet**
- **Email** (pour notifications)
- **Téléphone** (pour contact acheteurs)

### Processus

```
1. Vendeur accède à /sell
2. Prend 1-5 photos avec caméra
3. Remplit titre + description
4. Entre nom, email, téléphone
5. Clique "Publier"
   ↓
6. Upload vers Cloudinary
7. Création produit (statut: PENDING)
8. Confirmation affichée
   ↓
9. Modérateur examine
10. Email envoyé au vendeur:
    - ✅ Approuvé → Produit en ligne
    - ❌ Rejeté → Raison du rejet
```

### Wireframe

```
┌─────────────────────────────────────────┐
│  📸 Vendre un produit                   │
├─────────────────────────────────────────┤
│                                         │
│  📷 Photos (1/5)                        │
│  ┌─────────────────────────────────┐   │
│  │ [Prendre une photo]             │   │
│  └─────────────────────────────────┘   │
│  [IMG] [IMG] [IMG]                     │
│                                         │
│  Titre *                                │
│  ┌─────────────────────────────────┐   │
│  │ iPhone 12 Pro 128GB             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Description *                          │
│  ┌─────────────────────────────────┐   │
│  │ Très bon état, batterie 95%     │   │
│  │ Acheté il y a 1 an...           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─── Vos informations ───              │
│                                         │
│  Nom *                                  │
│  ┌─────────────────────────────────┐   │
│  │ Jean Dupont                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Email *                                │
│  ┌─────────────────────────────────┐   │
│  │ jean@example.com                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Téléphone *                            │
│  ┌─────────────────────────────────┐   │
│  │ +33 6 12 34 56 78               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────┐  ┌──────────┐        │
│  │ ✅ Publier  │  │ Annuler  │        │
│  └─────────────┘  └──────────┘        │
└─────────────────────────────────────────┘
```

---

## 3. 🔐 Interface ADMIN/MODÉRATEUR

### Accès
- **URL**: `http://localhost:5173/#/login`
- **Connexion**: ✅ Requise (JWT)
- **Fichiers**: 
  - `front/src/pages/login.page.js`
  - `front/src/pages/admin.page.js`

### Connexion

#### Comptes de Test
```
Admin:
  Email: admin@fotoljay.com
  Password: admin123

Modérateur:
  Email: moderator@fotoljay.com
  Password: moderator123
```

#### Processus
```
1. Accès à /login
2. Saisie email + password
3. POST /api/auth/login
4. Réception JWT token
5. Stockage dans localStorage
6. Redirection vers /admin
```

### Dashboard Modération

#### 📋 Liste des Produits en Attente
- Affichage détaillé de chaque produit
- Photos en grand format
- Description complète
- **Informations vendeur visibles**:
  - Nom
  - Email (cliquable)
  - Téléphone (cliquable)

#### ⚡ Actions Disponibles

##### ✅ Approuver
```javascript
POST /api/products/:id/approve
→ Statut: PENDING → APPROVED
→ Email envoyé au vendeur
→ Produit visible publiquement
```

##### ❌ Rejeter
```javascript
POST /api/products/:id/reject
Body: { reason: "Photos floues" }
→ Statut: PENDING → REJECTED
→ Email envoyé avec raison
→ Produit non visible
```

##### 🗑️ Supprimer
```javascript
DELETE /api/products/:id
→ Suppression définitive
→ Images supprimées de Cloudinary
→ Produit retiré de la base
```

### Wireframe Dashboard

```
┌──────────────────────────────────────────────────┐
│  📸 FOTOL JAY - Admin    👤 John Doe [ADMIN]    │
│                          [Voir site] [Déconnexion]│
├──────────────────────────────────────────────────┤
│                                                  │
│  📋 Produits en attente de modération           │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  ┌────────┐  iPhone 12 Pro 128GB          │ │
│  │  │ [IMG]  │  ⏱️ PENDING                    │ │
│  │  │        │                                │ │
│  │  │ [IMG]  │  Description: Très bon état... │ │
│  │  └────────┘                                │ │
│  │                                            │ │
│  │  👤 Vendeur:                               │ │
│  │  Nom: Jean Dupont                          │ │
│  │  Email: jean@example.com                   │ │
│  │  Tél: +33 6 12 34 56 78                    │ │
│  │                                            │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│  │  │ ✅ Approuver│ │ ❌ Rejeter│ │ 🗑️ Suppr │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  [Produit suivant...]                      │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## 🔄 Flux Complet

### Scénario: Vente d'un iPhone

```
1. VENDEUR (Jean)
   └─> Accède à /sell
   └─> Prend 3 photos de son iPhone
   └─> Remplit: "iPhone 12 Pro 128GB"
   └─> Description: "Très bon état..."
   └─> Nom: Jean Dupont
   └─> Email: jean@example.com
   └─> Tél: +33 6 12 34 56 78
   └─> Clique "Publier"
       ↓
   [Backend]
   └─> Upload photos → Cloudinary
   └─> Création produit (PENDING)
   └─> Notification créée
       ↓
2. MODÉRATEUR (Marie)
   └─> Se connecte à /login
   └─> Accède au dashboard /admin
   └─> Voit le produit de Jean
   └─> Examine les photos
   └─> Clique "✅ Approuver"
       ↓
   [Backend]
   └─> Statut: PENDING → APPROVED
   └─> Email envoyé à jean@example.com
   └─> "Votre produit a été approuvé!"
       ↓
3. ACHETEUR (Paul)
   └─> Accède à /
   └─> Voit l'iPhone de Jean
   └─> Clique sur la carte
   └─> Voit détails + photos
   └─> Contacte Jean:
       - Email: jean@example.com
       - Tél: +33 6 12 34 56 78
```

---

## 📊 Comparaison des Interfaces

| Fonctionnalité | Acheteur | Vendeur | Admin/Mod |
|----------------|----------|---------|-----------|
| **Connexion** | ❌ Non | ❌ Non | ✅ Oui |
| **Voir produits** | ✅ Oui | ✅ Oui | ✅ Oui |
| **Publier produit** | ❌ Non | ✅ Oui | ❌ Non |
| **Modérer** | ❌ Non | ❌ Non | ✅ Oui |
| **Contact vendeur** | ✅ Oui | ❌ Non | ✅ Oui |
| **Voir infos vendeur** | ✅ Oui | ❌ Non | ✅ Oui |

---

## 🎨 Design System

### Couleurs
```css
--primary-color: #3b82f6;      /* Bleu principal */
--secondary-color: #10b981;    /* Vert succès */
--danger-color: #ef4444;       /* Rouge danger */
--warning-color: #f59e0b;      /* Orange warning */
```

### Badges Statut
- 🟢 **APPROVED** - Vert
- 🟠 **PENDING** - Orange
- 🔴 **REJECTED** - Rouge
- ⚫ **EXPIRED** - Gris

### Badges Spéciaux
- ⭐ **VIP** - Jaune/Or

---

## 🚀 Démarrage Rapide

### Backend
```bash
cd back
npm install
npm run prisma:generate
npx prisma migrate dev
npx ts-node --transpileOnly prisma/seed.ts
npm run dev
```

### Frontend
```bash
cd front
npm install
npm run dev
```

### Accès
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API**: http://localhost:3000/api

---

## 📝 Notes Importantes

1. **Pas de compte vendeur**: Simplifie l'expérience
2. **Photos obligatoires**: Garantit l'authenticité
3. **Modération systématique**: Contrôle qualité
4. **Contact direct**: Email/téléphone visibles
5. **Cloudinary requis**: Pour le stockage images

---

## 🆘 Support

Pour toute question:
1. Consulter `README.md`
2. Consulter `QUICKSTART.md`
3. Consulter `API_DOCUMENTATION.md`
4. Consulter `CHANGES.md`
