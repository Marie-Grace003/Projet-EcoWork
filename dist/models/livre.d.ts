export type CategoriesLivre = "Roman" | "Sciences" | "Histoire" | "Autre";
export interface Livre {
    id: string;
    titre: string;
    auteur: string;
    isbn: string;
    anneePublication: number;
    disponible: boolean;
}
export interface LivreComplet extends Livre {
    categorie: CategoriesLivre;
    nombrePages: number;
}
//# sourceMappingURL=livre.d.ts.map