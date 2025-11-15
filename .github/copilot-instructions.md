# Copilot Instructions for Edu-tech-

## Vue d'ensemble

Ce projet est une application SaaS pour la gestion d'écoles, composée d'un backend Node.js/Express/MongoDB (dossier `server/`) et d'un frontend React/Tailwind (dossier `client/`). Les deux parties communiquent via une API REST exposée par le backend.

## Architecture principale
- **Backend (`server/`)** :
  - Serveur Express, point d'entrée `server/index.js`.
  - Modèle principal : `models/school.js` (MongoDB, email unique).
  - Routes API : `routes/schoolRoutes.js` (inscription d'école avec upload de logo via `multer`).
  - Dossier `uploads/` pour stocker les fichiers envoyés (créé automatiquement).
  - Variables d'environnement requises : `MONGODB_URI` (optionnelle pour dev sans DB).
- **Frontend (`client/`)** :
  - Démarré avec Create React App.
  - Formulaire principal : `src/components/SchoolRegisterForm.jsx` (envoi multipart, gestion des erreurs serveur).
  - Utilise Tailwind CSS (`tailwind.config.js`, `postcss.config.js`).
  - Commandes :
    - `npm start` (dev)
    - `npm test` (tests)
    - `npm run build` (prod)

## Points d'intégration et conventions
- **API REST** :
  - Endpoint principal : `POST /api/register` (backend)
  - Les fichiers sont accessibles via `/uploads/<filename>`
- **Gestion des fichiers** :
  - Les logos sont uploadés via le champ `logo` du formulaire, stockés dans `uploads/`.
  - Le backend gère la création du dossier `uploads` si absent.
- **Validation côté serveur** :
  - Email unique, erreurs gérées (code 11000 pour duplication).
  - Réponses JSON structurées : `{ message, school }` ou `{ message: erreur }`
- **Frontend** :
  - Utilise Axios pour les requêtes API (multipart pour fichiers).
  - Les erreurs serveur sont affichées dans le formulaire.
  - Les champs obligatoires sont validés côté client avant envoi.

## Bonnes pratiques spécifiques
- **Ne pas définir manuellement les headers multipart dans Axios** : Axios gère automatiquement.
- **Respecter la structure des modèles et des routes** : Voir `server/models/school.js` et `server/routes/schoolRoutes.js` pour les champs attendus.
- **Débogage** :
  - Backend : logs dans la console, attention aux variables d'environnement.
  - Frontend : erreurs affichées dans le formulaire, logs dans la console navigateur.

## Exemples de flux
- Inscription d'une école :
  1. L'utilisateur remplit le formulaire React.
  2. Le frontend envoie les données (et le logo) à `/api/register`.
  3. Le backend crée l'entrée MongoDB et sauvegarde le logo.
  4. Le frontend affiche le message de succès ou d'erreur.

## Fichiers clés
- `server/index.js` : démarrage serveur/API
- `server/routes/schoolRoutes.js` : logique d'inscription
- `server/models/school.js` : schéma MongoDB
- `client/src/components/SchoolRegisterForm.jsx` : formulaire principal
- `client/README.md` : commandes frontend

---

Pour toute nouvelle fonctionnalité, suivez les conventions existantes et réutilisez les patterns des fichiers clés. Pour toute ambiguïté, demandez des précisions ou vérifiez les exemples existants.
