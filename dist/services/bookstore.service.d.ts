import { LivreComplet, Membre, Emprunt } from "../models/index.js";
export declare class BookstoreService {
    private db;
    constructor();
    /**
     * Ajouter un livre avec ID auto-incrémenté
     */
    ajouterLivre(livre: Omit<LivreComplet, "id" | "disponible">): LivreComplet;
    /**
     * Modifier un livre existant
     */
    modifierLivre(livreId: string, modifications: Partial<Omit<LivreComplet, "id">>): LivreComplet | string;
    /**
     * Supprimer un livre
     */
    supprimerLivre(livreId: string): string;
    /**
     * Rechercher des livres
     */
    rechercherLivres(critere: {
        titre?: string;
        auteur?: string;
        isbn?: string;
        categorie?: string;
        disponible?: boolean;
    }): LivreComplet[];
    /**
     * Afficher les livres
     */
    afficherLivres(): LivreComplet[];
    /**
     * Compter les livres
     */
    nombreLivres(): number;
    /**
     * Obtenir un livre par ID
     */
    obtenirLivre(livreId: string): LivreComplet | undefined;
    /**
     * Inscrire un membre avec ID auto-incrémenté
     */
    inscrireMembre(membre: Omit<Membre, "id" | "dateInscription" | "empruntsActifs">): Membre;
    /**
     * Modifier un membre existant
     */
    modifierMembre(membreId: string, modifications: Partial<Omit<Membre, "id" | "dateInscription">>): Membre | string;
    /**
     * Afficher les membres
     */
    afficherMembres(): Membre[];
    /**
     * Compter les membres
     */
    nombreMembre(): number;
    /**
     * Obtenir un membre par ID
     */
    obtenirMembre(membreId: string): Membre | undefined;
    /**
     * Emprunter un livre
     */
    emprunterLivre(livreId: string, membreId: string): Emprunt | string;
    /**
     * Retourner un livre emprunté
     */
    retournerLivre(empruntId: string): string;
    /**
     * Afficher les emprunts
     */
    afficherEmprunts(): Emprunt[];
    /**
     * Afficher les emprunts actifs (non retournés)
     */
    afficherEmpruntsActifs(): Emprunt[];
    /**
     * Afficher l'historique complet des emprunts
     */
    afficherHistorique(): Emprunt[];
    /**
     * Afficher les emprunts d'un membre spécifique
     */
    afficherEmpruntsParMembre(membreId: string): Emprunt[];
    /**
     * Compter les emprunts
     */
    compterEmprunts(): number;
    /**
     * Obtenir un emprunt par ID
     */
    obtenirEmprunt(empruntId: string): Emprunt | undefined;
}
//# sourceMappingURL=bookstore.service.d.ts.map