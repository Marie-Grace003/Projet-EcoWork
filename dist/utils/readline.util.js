"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initReadline = initReadline;
exports.closeReadline = closeReadline;
exports.ask = ask;
exports.askNumber = askNumber;
exports.askConfirm = askConfirm;
const readline = __importStar(require("readline"));
// Interface readline
let rl = null;
/**
 * Initialise l'interface readline
 */
function initReadline() {
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
function closeReadline() {
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
function ask(question) {
    return new Promise((resolve) => {
        if (!rl) {
            initReadline();
        }
        rl.question(question, (answer) => {
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
async function askNumber(question, min, max) {
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
async function askConfirm(question) {
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
//# sourceMappingURL=readline.util.js.map