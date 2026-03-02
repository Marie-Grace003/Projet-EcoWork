import * as fs from "fs";
import * as path from "path";
import { LivreComplet, Membre, Emprunt } from "../models/index.js";

// Chemin vers le fichier de base de données
const DB_PATH = path.join(__dirname, "..", "data", "db.json");


/**
 * Structure de la base de données
 */
export interface Database {
    livres: LivreComplet[];
    membres: Membre[];
    emprunts: Emprunt[];
    // Compteurs pour les IDs auto-incrémentés
    counters: {
        livreId: number;
        membreId: number;
        empruntId: number;
    };
}

/**
 * Structure par défaut de la base de données
 */
const defaultDatabase: Database = {
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
export function loadDatabase(): Database {
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

        const db: Database = JSON.parse(data);

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
    } catch (error) {
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
export function saveDatabase(db: Database): void {
    try {
        // Créer le dossier data s'il n'existe pas
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Écrire les données dans le fichier avec indentation
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

        console.log("💾 Données sauvegardées dans db.json");
    } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde :", error);
    }
}

/**
 * Réinitialise la base de données
 */
export function resetDatabase(): void {
    saveDatabase(defaultDatabase);
    console.log("🔄 Base de données réinitialisée");
}
