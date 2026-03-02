import * as readline from "readline";

// Interface readline
let rl: readline.Interface | null = null;

/**
 * Initialise l'interface readline
 */
export function initReadline(): void {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
}

/**
 * Ferme l'interface readline
 */
export function closeReadline(): void {
    if (rl) {
        rl.close();
        rl = null;
    }
}

/**
 * Pose une question à l'utilisateur et retourne une Promise avec la réponse
 * @param question - La question à poser
 * @returns Promise contenant la réponse de l'utilisateur
 */
export function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        if (!rl) {
            initReadline();
        }

        rl!.question(question, (answer: string) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Demande un nombre à l'utilisateur avec validation
 * @param question - La question à poser
 * @param min - Valeur minimale acceptée (optionnel)
 * @param max - Valeur maximale acceptée (optionnel)
 * @returns Promise contenant le nombre valide
 */
export async function askNumber(
    question: string,
    min?: number,
    max?: number,
): Promise<number> {
    while (true) {
        const answer = await ask(question);
        const num = parseInt(answer, 10);

        if (isNaN(num)) {
            console.log("❌ Veuillez entrer un nombre valide.");
            continue;
        }

        if (min !== undefined && num < min) {
            console.log(`❌ Le nombre doit être supérieur ou égal à ${min}.`);
            continue;
        }

        if (max !== undefined && num > max) {
            console.log(`❌ Le nombre doit être inférieur ou égal à ${max}.`);
            continue;
        }

        return num;
    }
}

/**
 * Demande une confirmation (oui/non) à l'utilisateur
 * @param question - La question à poser
 * @returns Promise<boolean> true si oui, false si non
 */
export async function askConfirm(question: string): Promise<boolean> {
    while (true) {
        const answer = await ask(`${question} (o/n): `);
        const lower = answer.toLowerCase();

        if (lower === "o" || lower === "oui") {
            return true;
        }
        if (lower === "n" || lower === "non") {
            return false;
        }

        console.log("❌ Veuillez répondre par 'o' (oui) ou 'n' (non).");
    }
}
