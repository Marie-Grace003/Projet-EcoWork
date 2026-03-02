import { LivreComplet } from "./livre";
import { Membre } from "./membre";
export interface Emprunt {
    id: string;
    dateEmprunt: Date;
    dateRetourPrevue: Date;
    DateRetourEffective?: Date;
    estEnRetard: boolean;
    livre: LivreComplet;
    membre: Membre;
}
//# sourceMappingURL=emprunt.d.ts.map