# Frontend Vue.js – Projet Pédagogique

## Description

Ce projet est une interface frontend développée en **Vue.js**, réalisée dans le cadre d’un **projet pédagogique**.  
Il a pour objectif de démontrer les mécanismes de **création de compte utilisateur** ainsi que **l'authentification** via **JWT (JSON Web Token)**.

## Fonctionnalités

- Création de compte utilisateur
- Authentification via formulaire de connexion
- Récupération d’un token JWT émis par le backend
- Stockage sécurisé du token dans le Local Storage
- Déconnexion avec vidage automatique du Local Storage
- Utilisation du token pour les futures requêtes authentifiées

## Bonnes pratiques respectées

- Le token JWT est stocké dans le Local Storage uniquement après une authentification réussie.
- Le Local Storage est vidé automatiquement lors de la déconnexion, garantissant une meilleure sécurité des données utilisateur.
- Le code suit une structure claire et modulaire pour favoriser la maintenabilité et l’évolutivité.

## Détails techniques

- **Framework frontend :** Vue.js
- **Méthode d’authentification :** JSON Web Token (JWT)
- **Stockage du token :** Local Storage
- **Communication backend :** API REST (non incluse dans ce dépôt)

## Prérequis

- Node.js et npm installés
- Backend opérationnel (attente d’un token JWT en réponse à une requête de login)

## Installation

```bash
npm install

