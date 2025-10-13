# FOTOL JAY - Frontend Angular

## ✅ Projet Angular Créé

Le projet Angular a été créé avec succès avec les composants suivants:

### 📁 Structure

```
front/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/          # Interface Acheteur ✅
│   │   │   ├── sell/          # Interface Vendeur ✅
│   │   │   ├── login/         # Connexion Admin (à compléter)
│   │   │   └── admin/         # Dashboard Admin (à compléter)
│   │   ├── services/
│   │   │   ├── api.service.ts      # Service API ✅
│   │   │   └── auth.service.ts     # Service Auth ✅
│   │   ├── models/
│   │   │   └── product.model.ts    # Modèles TypeScript ✅
│   │   ├── app.routes.ts      # Routes (à configurer)
│   │   └── app.config.ts      # Configuration
│   ├── styles.css             # Styles globaux (à ajouter)
│   └── index.html
└── package.json
```

## 🎯 Composants Créés

### 1. ✅ Home Component (Acheteur)
- **Fichiers**: `home.ts`, `home.html`, `home.css`
- **Fonctionnalités**:
  - Liste des produits approuvés
  - Recherche en temps réel
  - Affichage en grille
  - Navigation vers détails

### 2. ✅ Sell Component (Vendeur)
- **Fichiers**: `sell.ts`, `sell.html`, `sell.css`
- **Fonctionnalités**:
  - Upload de 1-5 photos
  - Prévisualisation des photos
  - Formulaire complet
  - Envoi vers API

### 3. ⏳ Login Component (Admin)
- **Fichiers**: `login.ts`, `login.html`, `login.css`
- **À implémenter**: Formulaire de connexion

### 4. ⏳ Admin Component (Dashboard)
- **Fichiers**: `admin.ts`, `admin.html`, `admin.css`
- **À implémenter**: Dashboard de modération

## 🔧 Services Créés

### ✅ ApiService
- Gestion des appels HTTP vers le backend
- Endpoints: products, auth, moderation
- Headers avec JWT

### ✅ AuthService  
- Gestion de l'authentification
- Stockage du token JWT
- Vérification des rôles (Admin/Moderator)

## 📝 Prochaines Étapes

1. **Compléter Login Component**
   - Formulaire email/password
   - Appel à AuthService
   - Redirection vers /admin

2. **Compléter Admin Component**
   - Liste des produits PENDING
   - Actions: Approuver/Rejeter/Supprimer
   - Affichage des infos vendeur

3. **Configurer les Routes**
   - `/` → HomeComponent
   - `/sell` → SellComponent
   - `/login` → LoginComponent
   - `/admin` → AdminComponent (protégée)

4. **Ajouter les Styles Globaux**
   - Copier les styles CSS
   - Variables CSS
   - Classes utilitaires

5. **Configurer HttpClient**
   - Ajouter `provideHttpClient()` dans `app.config.ts`

6. **Tester l'Application**
   - `npm start`
   - Vérifier chaque interface

## 🚀 Commandes

```bash
# Démarrer le serveur de développement
npm start
# ou
ng serve

# Build pour production
npm run build
# ou
ng build

# Générer un nouveau composant
ng generate component components/nom-composant
```

## 📚 Documentation Angular

- [Angular Docs](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Router](https://angular.dev/guide/routing)
- [Angular Forms](https://angular.dev/guide/forms)

## ⚠️ Notes

- Le projet utilise **Angular 20** (dernière version)
- **Zoneless** activé (pas de zone.js)
- **SSR** activé (Server-Side Rendering)
- **Standalone Components** (pas de modules)
- **Signals** pour la réactivité

## 🔗 Backend

Le frontend communique avec le backend sur:
- **URL**: `http://localhost:3000/api`
- **Endpoints**: Voir `back/API_DOCUMENTATION.md`

## ✅ TODO

- [ ] Compléter LoginComponent
- [ ] Compléter AdminComponent  
- [ ] Configurer les routes
- [ ] Ajouter les styles globaux
- [ ] Configurer HttpClient
- [ ] Tester l'application complète
- [ ] Créer un guard pour protéger /admin
- [ ] Ajouter gestion d'erreurs
- [ ] Améliorer l'UX (loading, toasts, etc.)
