"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bookstore_service_js_1 = require("./services/bookstore.service.js");
const menu_js_1 = require("./menu.js");
/**
 * Point d'entrée de l'application
 */
async function main() {
    console.log("\n🚀 Démarrage du système de gestion de bibliothèque...\n");
    // Initialiser le service (charge automatiquement les données depuis db.json)
    const bookstoreService = new bookstore_service_js_1.BookstoreService();
    // Créer et afficher le menu
    const menu = new menu_js_1.Menu(bookstoreService);
    await menu.afficherMenuPrincipal();
    console.log("\n✨ Application terminée.\n");
}
// Lancer l'application
main().catch((error) => {
    console.error("❌ Erreur fatale :", error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map