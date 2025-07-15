# NutriMate Frontend

Interface utilisateur moderne et responsive pour NutriMate, votre assistant alimentaire intelligent.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd nutrimate/frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos paramètres

# Lancer en mode développement
npm run dev
```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants de base (Button, Input, Modal...)
│   ├── layout/         # Composants de mise en page
│   ├── recipes/        # Composants liés aux recettes
│   ├── menus/          # Composants pour les menus
│   └── shopping/       # Composants liste de courses
├── pages/              # Pages principales
├── services/           # Services API
├── stores/             # State management (Zustand)
├── utils/              # Utilitaires et helpers
└── styles/             # Styles globaux
```

## 🎨 Design System

### Couleurs
- **Primary**: Violet (#8B5CF6, #7C3AED)
- **Secondary**: Gris foncé (#1F2937, #111827)
- **Surface**: Gris moyen (#374151)
- **Text**: Blanc/Gris clair

### Composants
- **Button**: 3 variants (primary, secondary, ghost)
- **Input**: Avec support erreurs et labels
- **Card**: Conteneur avec hover effects
- **Modal**: Overlay avec backdrop blur
- **Badge**: Labels colorés

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **Grid adaptatif**: 1-2-3-4 colonnes selon la taille d'écran
- **Navigation**: Menu hamburger sur mobile, sidebar sur desktop

## 🔧 Technologies utilisées

- **React 18**: Framework frontend
- **Vite**: Build tool moderne
- **TailwindCSS**: Framework CSS utility-first
- **Zustand**: State management léger
- **React Router**: Navigation SPA
- **React Hook Form**: Gestion des formulaires
- **Axios**: Client HTTP
- **Lucide React**: Icônes modernes
- **React Hot Toast**: Notifications

## 🎯 Fonctionnalités

### Authentification
- Inscription/Connexion
- Gestion de profil
- Persistance de session (JWT)

### Recettes
- Génération via IA (DeepSeek)
- Bibliothèque personnelle
- Filtres et recherche
- Système de favoris
- Vue détaillée avec ingrédients/étapes

### Menus
- Planification hebdomadaire
- Génération automatique
- Grille visuelle 7 jours
- Intégration avec recettes

### Shopping
- Génération automatique depuis menu
- Organisation par catégories
- Système de coches
- Export PDF

### UX/UI
- Interface dark moderne
- Animations fluides
- Feedback utilisateur (toasts)
- États de chargement
- Gestion d'erreurs

## 🚀 Commandes disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Vérification du code

# Tests (si configurés)
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end
```

## 🔧 Configuration

### Variables d'environnement
```bash
VITE_API_URL=http://localhost:8000    # URL de l'API backend
VITE_APP_NAME=NutriMate               # Nom de l'application
```

### Proxy de développement
Le serveur de développement Vite est configuré pour proxy les appels `/api/*` vers le backend local (port 8000).

## 📦 Build et déploiement

```bash
# Build de production
npm run build

# Les fichiers sont générés dans dist/
# Déployable sur Vercel, Netlify, ou serveur statique
```

### Déploiement recommandé
- **Vercel**: Déploiement automatique depuis Git
- **Netlify**: Support des SPA avec redirects
- **GitHub Pages**: Pour les projets open source

## 🔗 Intégration API

L'application communique avec le backend FastAPI via:
- **Base URL**: Configurable via `VITE_API_URL`
- **Authentification**: JWT Bearer tokens
- **Intercepteurs**: Gestion automatique des tokens et erreurs
- **Services**: Couche d'abstraction pour chaque endpoint

## 🎨 Personnalisation

### Thème
Modifiez `tailwind.config.js` pour adapter les couleurs et le design à vos besoins.

### Composants
Tous les composants sont modulaires et facilement personnalisables via les props Tailwind.

---

**Développé avec ❤️ pour une meilleure alimentation au quotidien**