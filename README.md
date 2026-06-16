# 🎯 K-AI Stand — Mailing List AI Karangue

Application web de collecte des visiteurs au stand **AI Karangue** lors d'événements, avec tableau de bord d'administration et export Excel.

---

## 🏗️ Architecture

```
k-ai-stand/
├── frontend/        # Angular 19 (charte AI Karangue)
├── backend/         # Node.js + Express + PostgreSQL
├── database/        # Script SQL d'initialisation
└── docker/          # Docker Compose pour PostgreSQL
```

---

## 🚀 Démarrage rapide

### 1. Base de données (via Docker)
```bash
cd docker
docker compose up -d
```
> Lance PostgreSQL sur le port **5433** et crée la table `visitors` automatiquement.

### 2. Backend
```bash
cd backend
cp .env.example .env   # Puis ajustez vos identifiants si besoin
npm install
node index.js
```
> Le serveur démarre sur **http://localhost:3000**

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
> L'application démarre sur **http://localhost:4200**

---

## 📱 Fonctionnalités

- **Formulaire d'inscription** en 2 étapes (Prénom, Nom, Contact → Profil)
- **Écran de succès** après validation
- **Dashboard Admin** sur `/admin` (mot de passe : `karangue2026`)
  - Tableau des visiteurs responsive (cartes sur mobile, tableau sur desktop)
  - **Export Excel** en un clic
- Charte graphique **AI Karangue** (bleu nuit + turquoise)

## 🔌 API

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/visitors` | Enregistre un visiteur |
| `GET` | `/api/visitors` | Liste tous les visiteurs |
