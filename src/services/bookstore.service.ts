import {
    LivreComplet,
    Membre,
    Emprunt,
    MAX_EMPRUNTS,
    NBRE_JOURS_EMPRUNT,
} from "../models/index.js";
import { Database, loadDatabase, saveDatabase } from "../utils/index.js";

export class BookstoreService {
    private db: Database;

    constructor() {
        // Charger les données depuis db.json au démarrage
        this.db = loadDatabase();
    }

    // ========================================
    // GESTION DES LIVRES
    // ========================================

    /**
     * Ajouter un livre avec ID auto-incrémenté
     */
    ajouterLivre(livre: Omit<LivreComplet, "id" | "disponible">): LivreComplet {
        const newBook: LivreComplet = {
            ...livre,
            id: `LIV-${this.db.counters.livreId.toString().padStart(4, "0")}`,
            disponible: true,
        };

        this.db.counters.livreId++;
        this.db.livres.push(newBook);
        saveDatabase(this.db);

        return newBook;
    }

    /**
     * Modifier un livre existant
     */
    modifierLivre(
        livreId: string,
        modifications: Partial<Omit<LivreComplet, "id">>,
    ): LivreComplet | string {
        const livre = this.db.livres.find((l) => l.id === livreId);

        if (!livre) {
            return "Livre non trouvé";
        }

        // Appliquer les modifications
        Object.assign(livre, modifications);
        saveDatabase(this.db);

        return livre;
    }

    /**
     * Supprimer un livre
     */
    supprimerLivre(livreId: string): string {
        const index = this.db.livres.findIndex((l) => l.id === livreId);

        if (index === -1) {
            return "Livre non trouvé";
        }

        const livre = this.db.livres[index];
        
        if (!livre) {
            return "Livre non trouvé";
        }

        // Vérifier si le livre est emprunté
        if (!livre.disponible) {
            return "Impossible de supprimer : le livre est actuellement emprunté";
        }

        this.db.livres.splice(index, 1);
        saveDatabase(this.db);

        return `Livre "${livre.titre}" supprimé avec succès`;
    }

    /**
     * Rechercher des livres
     */
    rechercherLivres(critere: {
        titre?: string;
        auteur?: string;
        isbn?: string;
        categorie?: string;
        disponible?: boolean;
    }): LivreComplet[] {
        return this.db.livres.filter((livre) => {
            let match = true;

            if (critere.titre) {
                match =
                    match &&
                    livre.titre.toLowerCase().includes(critere.titre.toLowerCase());
            }

            if (critere.auteur) {
                match =
                    match &&
                    livre.auteur.toLowerCase().includes(critere.auteur.toLowerCase());
            }

            if (critere.isbn) {
                match = match && livre.isbn.includes(critere.isbn);
            }

            if (critere.categorie) {
                match = match && livre.categorie === critere.categorie;
            }

            if (critere.disponible !== undefined) {
                match = match && livre.disponible === critere.disponible;
            }

            return match;
        });
    }

    /**
     * Afficher les livres
     */
    afficherLivres(): LivreComplet[] {
        return this.db.livres;
    }

    /**
     * Compter les livres
     */
    nombreLivres(): number {
        return this.db.livres.length;
    }

    /**
     * Obtenir un livre par ID
     */
    obtenirLivre(livreId: string): LivreComplet | undefined {
        return this.db.livres.find((l) => l.id === livreId);
    }

    // ========================================
    // GESTION DES MEMBRES
    // ========================================

    /**
     * Inscrire un membre avec ID auto-incrémenté
     */
    inscrireMembre(
        membre: Omit<Membre, "id" | "dateInscription" | "empruntsActifs">,
    ): Membre {
        const newMember: Membre = {
            ...membre,
            id: `MEM-${this.db.counters.membreId.toString().padStart(4, "0")}`,
            dateInscription: new Date(),
            empruntsActifs: 0,
        };

        this.db.counters.membreId++;
        this.db.membres.push(newMember);
        saveDatabase(this.db);

        return newMember;
    }

    /**
     * Modifier un membre existant
     */
    modifierMembre(
        membreId: string,
        modifications: Partial<Omit<Membre, "id" | "dateInscription">>,
    ): Membre | string {
        const membre = this.db.membres.find((m) => m.id === membreId);

        if (!membre) {
            return "Membre non trouvé";
        }

        // Appliquer les modifications
        Object.assign(membre, modifications);
        saveDatabase(this.db);

        return membre;
    }

    /**
     * Afficher les membres
     */
    afficherMembres(): Membre[] {
        return this.db.membres;
    }

    /**
     * Compter les membres
     */
    nombreMembre(): number {
        return this.db.membres.length;
    }

    /**
     * Obtenir un membre par ID
     */
    obtenirMembre(membreId: string): Membre | undefined {
        return this.db.membres.find((m) => m.id === membreId);
    }

    // ========================================
    // GESTION DES EMPRUNTS/RETOURS
    // ========================================

    /**
     * Emprunter un livre
     */
    emprunterLivre(livreId: string, membreId: string): Emprunt | string {
        const livre = this.db.livres.find((l) => l.id === livreId);
        const membre = this.db.membres.find((m) => m.id === membreId);

        if (!livre) return "Livre non trouvé";
        if (!membre) return "Membre non trouvé";

        if (!livre.disponible) return "Livre non disponible";

        if (membre.empruntsActifs >= MAX_EMPRUNTS) {
            return `${membre.prenom} a atteint la limite d'emprunts autorisés (${MAX_EMPRUNTS})`;
        }

        const dateEmprunt = new Date();
        const dateRetourPrevue = new Date();
        dateRetourPrevue.setDate(
            dateRetourPrevue.getDate() + NBRE_JOURS_EMPRUNT,
        );

        const emprunt: Emprunt = {
            id: `EMP-${this.db.counters.empruntId.toString().padStart(4, "0")}`,
            dateEmprunt,
            dateRetourPrevue,
            estEnRetard: false,
            livre,
            membre,
        };

        this.db.counters.empruntId++;
        livre.disponible = false;
        membre.empruntsActifs++;

        this.db.emprunts.push(emprunt);
        saveDatabase(this.db);

        return emprunt;
    }

    /**
     * Retourner un livre emprunté
     */
    retournerLivre(empruntId: string): string {
        const emprunt = this.db.emprunts.find((e) => e.id === empruntId);

        if (!emprunt) {
            return "Emprunt non trouvé";
        }

        if (emprunt.DateRetourEffective) {
            return "Ce livre a déjà été retourné";
        }

        // Marquer la date de retour
        emprunt.DateRetourEffective = new Date();

        // Vérifier si le retour est en retard
        if (emprunt.DateRetourEffective > emprunt.dateRetourPrevue) {
            emprunt.estEnRetard = true;
        }

        // Rendre le livre disponible
        const livre = this.db.livres.find((l) => l.id === emprunt.livre.id);
        if (livre) {
            livre.disponible = true;
        }

        // Décrémenter les emprunts actifs du membre
        const membre = this.db.membres.find((m) => m.id === emprunt.membre.id);
        if (membre && membre.empruntsActifs > 0) {
            membre.empruntsActifs--;
        }

        saveDatabase(this.db);

        if (emprunt.estEnRetard) {
            const joursRetard = Math.floor(
                (emprunt.DateRetourEffective.getTime() -
                    emprunt.dateRetourPrevue.getTime()) /
                    (1000 * 60 * 60 * 24),
            );
            return `Livre retourné avec ${joursRetard} jour(s) de retard`;
        }

        return "Livre retourné avec succès";
    }

    /**
     * Afficher les emprunts
     */
    afficherEmprunts(): Emprunt[] {
        return this.db.emprunts;
    }

    /**
     * Afficher les emprunts actifs (non retournés)
     */
    afficherEmpruntsActifs(): Emprunt[] {
        return this.db.emprunts.filter((e) => !e.DateRetourEffective);
    }

    /**
     * Afficher l'historique complet des emprunts
     */
    afficherHistorique(): Emprunt[] {
        return this.db.emprunts;
    }

    /**
     * Afficher les emprunts d'un membre spécifique
     */
    afficherEmpruntsParMembre(membreId: string): Emprunt[] {
        return this.db.emprunts.filter((e) => e.membre.id === membreId);
    }

    /**
     * Compter les emprunts
     */
    compterEmprunts(): number {
        return this.db.emprunts.length;
    }

    /**
     * Obtenir un emprunt par ID
     */
    obtenirEmprunt(empruntId: string): Emprunt | undefined {
        return this.db.emprunts.find((e) => e.id === empruntId);
    }
}

