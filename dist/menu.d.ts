import { BookstoreService } from "./services/bookstore.service.js";
export declare class Menu {
    private service;
    constructor(service: BookstoreService);
    /**
     * Afficher le menu principal
     */
    afficherMenuPrincipal(): Promise<void>;
    private ajouterLivre;
    private modifierLivre;
    private supprimerLivre;
    private afficherLivres;
    private rechercherLivre;
    private inscrireMembre;
    private modifierMembre;
    private afficherMembres;
    private emprunterLivre;
    private retournerLivre;
    private afficherEmpruntsActifs;
    private afficherHistorique;
    private afficherStatistiques;
}
//# sourceMappingURL=menu.d.ts.map