import { BookstoreService } from "./services/bookstore.service.js";
import { Menu } from "./menu.js";

/**
 * Point d'entrée de l'application
 */
async function main() {
    console.log("\n🚀 Démarrage du système de gestion de bibliothèque...\n");

    // Initialiser le service (charge automatiquement les données depuis db.json)
    const bookstoreService = new BookstoreService();

    // Créer et afficher le menu
    const menu = new Menu(bookstoreService);
    await menu.afficherMenuPrincipal();

    console.log("\n✨ Application terminée.\n");
}

// Lancer l'application
main().catch((error) => {
    console.error("❌ Erreur fatale :", error);
    process.exit(1);
});

