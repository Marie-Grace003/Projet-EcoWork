/**
 * Initialise l'interface readline
 */
export declare function initReadline(): void;
/**
 * Ferme l'interface readline
 */
export declare function closeReadline(): void;
/**
 * Pose une question à l'utilisateur et retourne une Promise avec la réponse
 * @param question - La question à poser
 * @returns Promise contenant la réponse de l'utilisateur
 */
export declare function ask(question: string): Promise<string>;
/**
 * Demande un nombre à l'utilisateur avec validation
 * @param question - La question à poser
 * @param min - Valeur minimale acceptée (optionnel)
 * @param max - Valeur maximale acceptée (optionnel)
 * @returns Promise contenant le nombre valide
 */
export declare function askNumber(question: string, min?: number, max?: number): Promise<number>;
/**
 * Demande une confirmation (oui/non) à l'utilisateur
 * @param question - La question à poser
 * @returns Promise<boolean> true si oui, false si non
 */
export declare function askConfirm(question: string): Promise<boolean>;
//# sourceMappingURL=readline.util.d.ts.map