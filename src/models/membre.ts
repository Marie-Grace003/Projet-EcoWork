export interface Membre {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    dateInscription: Date;
    empruntsActifs: number;
}

export const MAX_EMPRUNTS = 3;

export const NBRE_JOURS_EMPRUNT = 14;
