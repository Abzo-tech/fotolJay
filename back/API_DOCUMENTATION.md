# API Documentation - FOTOL JAY

## Base URL
```
http://localhost:3000/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentification (`/api/auth`)

#### Inscription utilisateur
- **POST** `/auth/register`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33612345678"
}
```

#### Inscription admin (premier admin seulement)
- **POST** `/auth/register-admin`
- **Body**:
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User"
}
```

#### Connexion
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Récupérer l'utilisateur connecté
- **GET** `/auth/me`
- **Auth**: Required

#### Changer le mot de passe
- **PUT** `/auth/change-password`
- **Auth**: Required
- **Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

### 2. Produits (`/api/products`)

#### Récupérer tous les produits (public)
- **GET** `/products`
- **Query params**:
  - `status`: PENDING | APPROVED | REJECTED | EXPIRED
  - `search`: texte de recherche
  - `page`: numéro de page (défaut: 1)
  - `limit`: nombre par page (défaut: 20)

#### Récupérer un produit par ID (public)
- **GET** `/products/:id`

#### Créer un produit
- **POST** `/products`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title`: string
  - `description`: string
  - `photos`: file[] (1-5 images)

#### Récupérer mes produits
- **GET** `/products/user/my-products`
- **Auth**: Required
- **Query params**: `status`, `search`, `page`, `limit`

#### Mettre à jour un produit
- **PUT** `/products/:id`
- **Auth**: Required
- **Body**:
```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description"
}
```

#### Supprimer un produit
- **DELETE** `/products/:id`
- **Auth**: Required

#### Republier un produit
- **POST** `/products/:id/republish`
- **Auth**: Required

---

### 3. Modération (`/api/products/moderation`)

**Rôles requis**: MODERATOR ou ADMIN

#### Récupérer les produits en attente
- **GET** `/products/moderation/pending`
- **Auth**: Required (MODERATOR/ADMIN)
- **Query params**: `page`, `limit`

#### Approuver un produit
- **POST** `/products/:id/approve`
- **Auth**: Required (MODERATOR/ADMIN)

#### Rejeter un produit
- **POST** `/products/:id/reject`
- **Auth**: Required (MODERATOR/ADMIN)
- **Body**:
```json
{
  "reason": "Raison du rejet (optionnel)"
}
```

---

### 4. Notifications (`/api/notifications`)

#### Récupérer mes notifications
- **GET** `/notifications`
- **Auth**: Required
- **Query params**: `page`, `limit`

#### Récupérer le nombre de notifications non lues
- **GET** `/notifications/unread-count`
- **Auth**: Required

#### Marquer une notification comme lue
- **PUT** `/notifications/:id/read`
- **Auth**: Required

#### Marquer toutes les notifications comme lues
- **PUT** `/notifications/read-all`
- **Auth**: Required

#### Supprimer une notification
- **DELETE** `/notifications/:id`
- **Auth**: Required

---

### 5. Gestion des utilisateurs (`/api/users`)

**Rôle requis**: ADMIN

#### Récupérer tous les utilisateurs
- **GET** `/users`
- **Auth**: Required (ADMIN)
- **Query params**: `page`, `limit`

#### Récupérer un utilisateur par ID
- **GET** `/users/:id`
- **Auth**: Required (ADMIN)

#### Mettre à jour le statut VIP
- **PUT** `/users/:id/vip`
- **Auth**: Required (ADMIN)
- **Body**:
```json
{
  "isVip": true
}
```

#### Mettre à jour le rôle
- **PUT** `/users/:id/role`
- **Auth**: Required (ADMIN)
- **Body**:
```json
{
  "role": "MODERATOR"
}
```
Rôles disponibles: `USER`, `MODERATOR`, `ADMIN`

#### Activer/Désactiver un utilisateur
- **PUT** `/users/:id/status`
- **Auth**: Required (ADMIN)
- **Body**:
```json
{
  "isActive": false
}
```

---

## Statuts des produits

- **PENDING**: En attente de modération
- **APPROVED**: Approuvé et visible publiquement
- **REJECTED**: Rejeté par la modération
- **EXPIRED**: Expiré après 7 jours

---

## Types de notifications

- **PRODUCT_APPROVED**: Produit approuvé
- **PRODUCT_REJECTED**: Produit rejeté
- **PRODUCT_EXPIRING**: Produit va expirer dans 1 jour
- **PRODUCT_EXPIRED**: Produit expiré
- **GENERAL**: Notification générale

---

## Tâches automatiques (Cron)

### Expiration des produits
- **Fréquence**: Tous les jours à minuit
- **Action**: Marque les produits approuvés depuis plus de 7 jours comme EXPIRED

### Notifications d'expiration
- **Fréquence**: Tous les jours à 10h
- **Action**: Envoie une notification aux utilisateurs dont les produits vont expirer dans 1 jour

---

## Codes d'erreur

- **200**: Succès
- **201**: Créé avec succès
- **400**: Requête invalide
- **401**: Non authentifié
- **403**: Non autorisé (permissions insuffisantes)
- **404**: Ressource non trouvée
- **500**: Erreur serveur

---

## Notes importantes

1. **Photos obligatoires**: Les produits doivent avoir au minimum 1 photo et maximum 5 photos
2. **Formats acceptés**: JPEG, JPG, PNG, GIF, WEBP
3. **Taille maximale**: 5MB par photo
4. **Produits VIP**: Les utilisateurs VIP voient leurs produits affichés en priorité
5. **Modération**: Tous les produits doivent être approuvés avant d'être visibles publiquement
6. **Consultation publique**: Les produits approuvés sont visibles sans authentification
