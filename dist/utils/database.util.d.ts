import { LivreComplet, Membre, Emprunt } from "../models/index.js";
/**
 * Structure de la base de données
 */
export interface Database {
    livres: LivreComplet[];
    membres: Membre[];
    emprunts: Emprunt[];
    counters: {
        livreId: number;
        membreId: number;
        empruntId: number;
    };
}
/**
 * Charge les données depuis le fichier JSON
 * @returns Les données de la base ou une base vide si le fichier n'existe pas
 */
export declare function loadDatabase(): Database;
/**
 * Sauvegarde les données dans le fichier JSON
 * @param db - Les données à sauvegarder
 */
export declare function saveDatabase(db: Database): void;
/**
 * Réinitialise la base de données
 */
export declare function resetDatabase(): void;
//# sourceMappingURL=database.util.d.ts.map