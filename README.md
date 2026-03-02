# 📚 Système de Gestion de Bibliothèque - TypeScript

Projet TypeScript pour gérer une bibliothèque avec livres, membres et emprunts.

## 🚀 Installation Rapide

```bash
# 1. Installer les dépendances
npm install
npm install -D @types/node

# 2. Dans tsconfig.json, décommentez la ligne 18 :
# "types": ["node"],

# 3. Lancer l'application
npm start
```

## 🎯 Fonctionnalités

### Menu interactif avec 13 options :

**📖 GESTION DES LIVRES**
1. Ajouter un livre
2. Modifier un livre  
3. Supprimer un livre
4. Afficher tous les livres
5. Rechercher un livre

**👥 GESTION DES MEMBRES**
6. Inscrire un membre
7. Modifier un membre
8. Afficher tous les membres

**📋 GESTION DES EMPRUNTS**
9. Emprunter un livre
10. Retourner un livre (avec détection de retard)
11. Afficher les emprunts actifs
12. Afficher l'historique complet

**📊 STATISTIQUES**
13. Afficher les statistiques

**0. Quitter**

## ✅ Exigences du Devoir Implémentées

✅ Interface utilisateur interactive avec readline  
✅ Fonction ask() retournant une Promise  
✅ Validation des entrées utilisateur  
✅ Persistance des données (db.json)  
✅ IDs auto-incrémentés (LIV-0001, MEM-0001, EMP-0001)  
✅ Modifier un livre  
✅ Modifier un membre  
✅ Retourner un livre emprunté  
✅ Supprimer un livre  
✅ Rechercher des livres  
✅ Afficher l'historique des emprunts  

## 🏗️ Structure du Projet

```
src/
├── data/
│   └── db.json              # Base de données JSON (auto-créé)
├── models/                  # Interfaces TypeScript
│   ├── livre.ts
│   ├── membre.ts
│   ├── emprunt.ts
│   └── index.ts
├── services/
│   └── bookstore.service.ts # Logique métier complète
├── utils/
│   ├── readline.util.ts     # Gestion des entrées utilisateur
│   ├── database.util.ts     # Persistance JSON
│   └── index.ts
├── menu.ts                  # Menu interactif
├── main.ts                  # Point d'entrée
└── types.d.ts              # Déclarations TypeScript
```

## 📋 Format de db.json

```json
{
  "livres": [...],
  "membres": [...],
  "emprunts": [...],
  "counters": {
    "livreId": 1,
    "membreId": 1,
    "empruntId": 1
  }
}
```

Les compteurs sont auto-incrémentés à chaque ajout.

## 🔧 Scripts NPM

```bash
npm run build    # Compile TypeScript
npm run exec     # Exécute le programme
npm start        # Compile + Exécute
npm run dev      # Mode watch (recompile automatiquement)
```

## 💡 Utilisation

Au lancement, le menu s'affiche :

```
============================================================
📚 SYSTÈME DE GESTION DE BIBLIOTHÈQUE
============================================================

📖 GESTION DES LIVRES
  1. Ajouter un livre
  ...

👉 Votre choix :
```

Entrez simplement le numéro de l'option souhaitée.

## 🎨 Fonctionnalités Bonus

- ✨ Détection automatique des retards (calcul des jours)
- 📊 Module statistiques complet
- 🔍 Recherche multi-critères (titre, auteur, ISBN, disponibilité)
- 🎨 Interface avec émojis et tableaux formatés
- ✅ Validation stricte (nombres, confirmations)
- 💾 Sauvegarde automatique après chaque opération

## 🐛 Dépannage

### "Cannot find type definition file for 'node'"

```bash
npm install -D @types/node
```

Puis décommentez dans `tsconfig.json` :
```json
"types": ["node"],
```

### Le programme ne démarre pas

Vérifiez que vous avez compilé :
```bash
npm run build
node dist/main.js
```

### La base de données est vide

Normal au premier lancement ! Utilisez le menu pour ajouter des données.

## 📝 Exemple d'Utilisation

```
👉 Votre choix : 1

📖 AJOUTER UN NOUVEAU LIVRE
Titre : Le Petit Prince
Auteur : Antoine de Saint-Exupéry
ISBN : 978-2-07-061275-8
Année de publication : 1943
Catégorie : Roman
Nombre de pages : 96

✅ Livre ajouté avec succès ! ID: LIV-0001
```

## 🎓 Constantes

Dans `src/models/membre.ts` :

```typescript
export const MAX_EMPRUNTS = 3;         // Max emprunts par membre
export const NBRE_JOURS_EMPRUNT = 14;  // Durée d'un emprunt
```

Vous pouvez modifier ces valeurs selon vos besoins.

---

**Bon usage ! 🎉**
