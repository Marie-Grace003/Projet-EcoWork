"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDatabase = loadDatabase;
exports.saveDatabase = saveDatabase;
exports.resetDatabase = resetDatabase;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Chemin vers le fichier de base de données
const DB_PATH = path.join(__dirname, "..", "data", "db.json");
/**
 * Structure par défaut de la base de données
 */
const defaultDatabase = {
    livres: [],
    membres: [],
    emprunts: [],
    counters: {
        livreId: 1,
        membreId: 1,
        empruntId: 1,
    },
};
/**
 * Charge les données depuis le fichier JSON
 * @returns Les données de la base ou une base vide si le fichier n'existe pas
 */
function loadDatabase() {
    try {
        // Vérifier si le fichier existe
        if (!fs.existsSync(DB_PATH)) {
            console.log("📁 Fichier db.json non trouvé, création d'une nouvelle base...");
            saveDatabase(defaultDatabase);
            return defaultDatabase;
        }
        // Lire le fichier
        const data = fs.readFileSync(DB_PATH, "utf-8");
        // Parser le JSON
        if (!data || data.trim() === "") {
            console.log("📁 Fichier db.json vide, initialisation...");
            saveDatabase(defaultDatabase);
            return defaultDatabase;
        }
        const db = JSON.parse(data);
        // Convertir les dates (car JSON ne gère pas les objets Date)
        db.membres.forEach((m) => {
            m.dateInscription = new Date(m.dateInscription);
        });
        db.emprunts.forEach((e) => {
            e.dateEmprunt = new Date(e.dateEmprunt);
            e.dateRetourPrevue = new Date(e.dateRetourPrevue);
            if (e.DateRetourEffective) {
                e.DateRetourEffective = new Date(e.DateRetourEffective);
            }
            // Convertir les dates imbriquées dans membre
            e.membre.dateInscription = new Date(e.membre.dateInscription);
        });
        console.log("✅ Données chargées depuis db.json");
        return db;
    }
    catch (error) {
        console.error("❌ Erreur lors du chargement de la base :", error);
        console.log("📁 Création d'une nouvelle base...");
        saveDatabase(defaultDatabase);
        return defaultDatabase;
    }
}
/**
 * Sauvegarde les données dans le fichier JSON
 * @param db - Les données à sauvegarder
 */
function saveDatabase(db) {
    try {
        // Créer le dossier data s'il n'existe pas
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        // Écrire les données dans le fichier avec indentation
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
        console.log("💾 Données sauvegardées dans db.json");
    }
    catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}
/**
 * Réinitialise la base de données
 */
function resetDatabase() {
    saveDatabase(defaultDatabase);
    console.log("🔄 Base de données réinitialisée");
}
//# sourceMappingURL=database.util.js.map