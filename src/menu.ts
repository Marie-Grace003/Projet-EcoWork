import { BookstoreService } from "./services/bookstore.service.js";
import { ask, askNumber, askConfirm, closeReadline } from "./utils/index.js";
import { CategoriesLivre } from "./models/index.js";

export class Menu {
    private service: BookstoreService;

    constructor(service: BookstoreService) {
        this.service = service;
    }

    /**
     * Afficher le menu principal
     */
    async afficherMenuPrincipal(): Promise<void> {
        let continuer = true;

        while (continuer) {
            console.log("\n" + "=".repeat(60));
            console.log("📚 SYSTÈME DE GESTION DE BIBLIOTHÈQUE");
            console.log("=".repeat(60));
            console.log("\n📖 GESTION DES LIVRES");
            console.log("  1. Ajouter un livre");
            console.log("  2. Modifier un livre");
            console.log("  3. Supprimer un livre");
            console.log("  4. Afficher tous les livres");
            console.log("  5. Rechercher un livre");
            console.log("\n👥 GESTION DES MEMBRES");
            console.log("  6. Inscrire un membre");
            console.log("  7. Modifier un membre");
            console.log("  8. Afficher tous les membres");
            console.log("\n📋 GESTION DES EMPRUNTS");
            console.log("  9. Emprunter un livre");
            console.log("  10. Retourner un livre");
            console.log("  11. Afficher les emprunts actifs");
            console.log("  12. Afficher l'historique complet");
            console.log("\n📊 STATISTIQUES");
            console.log("  13. Afficher les statistiques");
            console.log("\n  0. Quitter");
            console.log("=".repeat(60));

            const choix = await askNumber("\n👉 Votre choix : ", 0, 13);

            switch (choix) {
                case 1:
                    await this.ajouterLivre();
                    break;
                case 2:
                    await this.modifierLivre();
                    break;
                case 3:
                    await this.supprimerLivre();
                    break;
                case 4:
                    this.afficherLivres();
                    break;
                case 5:
                    await this.rechercherLivre();
                    break;
                case 6:
                    await this.inscrireMembre();
                    break;
                case 7:
                    await this.modifierMembre();
                    break;
                case 8:
                    this.afficherMembres();
                    break;
                case 9:
                    await this.emprunterLivre();
                    break;
                case 10:
                    await this.retournerLivre();
                    break;
                case 11:
                    this.afficherEmpruntsActifs();
                    break;
                case 12:
                    this.afficherHistorique();
                    break;
                case 13:
                    this.afficherStatistiques();
                    break;
                case 0:
                    continuer = false;
                    break;
            }

            if (continuer) {
                await ask("\n⏸️  Appuyez sur Entrée pour continuer...");
            }
        }

        console.log("\n👋 Merci d'avoir utilisé le système de gestion de bibliothèque !");
        closeReadline();
    }

    // ========================================
    // MÉTHODES POUR LES LIVRES
    // ========================================

    private async ajouterLivre(): Promise<void> {
        console.log("\n📖 AJOUTER UN NOUVEAU LIVRE");
        console.log("-".repeat(40));

        const titre = await ask("Titre : ");
        const auteur = await ask("Auteur : ");
        const isbn = await ask("ISBN : ");
        const anneePublication = await askNumber("Année de publication : ", 1000, 2100);
        
        console.log("\nCatégories disponibles : Roman, Sciences, Histoire, Autre");
        const categorie = await ask("Catégorie : ") as CategoriesLivre;
        
        const nombrePages = await askNumber("Nombre de pages : ", 1);

        const livre = this.service.ajouterLivre({
            titre,
            auteur,
            isbn,
            anneePublication,
            categorie,
            nombrePages,
        });

        console.log(`\n✅ Livre ajouté avec succès ! ID: ${livre.id}`);
    }

    private async modifierLivre(): Promise<void> {
        console.log("\n✏️ MODIFIER UN LIVRE");
        console.log("-".repeat(40));

        this.afficherLivres();

        const livreId = await ask("\nID du livre à modifier : ");
        const livre = this.service.obtenirLivre(livreId);

        if (!livre) {
            console.log("❌ Livre non trouvé");
            return;
        }

        console.log(`\nModification du livre : ${livre.titre}`);
        console.log("(Laissez vide pour conserver la valeur actuelle)");

        const titre = await ask(`Titre [${livre.titre}] : `);
        const auteur = await ask(`Auteur [${livre.auteur}] : `);
        const isbn = await ask(`ISBN [${livre.isbn}] : `);
        const anneeStr = await ask(`Année [${livre.anneePublication}] : `);
        const categorie = await ask(`Catégorie [${livre.categorie}] : `);
        const pagesStr = await ask(`Pages [${livre.nombrePages}] : `);

        const modifications: any = {};
        if (titre) modifications.titre = titre;
        if (auteur) modifications.auteur = auteur;
        if (isbn) modifications.isbn = isbn;
        if (anneeStr) modifications.anneePublication = parseInt(anneeStr);
        if (categorie) modifications.categorie = categorie as CategoriesLivre;
        if (pagesStr) modifications.nombrePages = parseInt(pagesStr);

        const resultat = this.service.modifierLivre(livreId, modifications);

        if (typeof resultat === "string") {
            console.log(`❌ ${resultat}`);
        } else {
            console.log("✅ Livre modifié avec succès !");
        }
    }

    private async supprimerLivre(): Promise<void> {
        console.log("\n🗑️ SUPPRIMER UN LIVRE");
        console.log("-".repeat(40));

        this.afficherLivres();

        const livreId = await ask("\nID du livre à supprimer : ");
        const confirme = await askConfirm("⚠️  Êtes-vous sûr de vouloir supprimer ce livre ?");

        if (!confirme) {
            console.log("❌ Suppression annulée");
            return;
        }

        const resultat = this.service.supprimerLivre(livreId);
        console.log(resultat.startsWith("Impossible") ? `❌ ${resultat}` : `✅ ${resultat}`);
    }

    private afficherLivres(): void {
        const livres = this.service.afficherLivres();

        if (livres.length === 0) {
            console.log("\n📚 Aucun livre enregistré");
            return;
        }

        console.log("\n📚 LISTE DES LIVRES");
        console.log("-".repeat(100));
        console.log(
            "ID".padEnd(12) +
            "Titre".padEnd(30) +
            "Auteur".padEnd(20) +
            "Année".padEnd(8) +
            "Disponible",
        );
        console.log("-".repeat(100));

        livres.forEach((livre) => {
            console.log(
                livre.id.padEnd(12) +
                livre.titre.substring(0, 28).padEnd(30) +
                livre.auteur.substring(0, 18).padEnd(20) +
                livre.anneePublication.toString().padEnd(8) +
                (livre.disponible ? "✅ Oui" : "❌ Non"),
            );
        });

        console.log("-".repeat(100));
        console.log(`Total : ${livres.length} livre(s)`);
    }

    private async rechercherLivre(): Promise<void> {
        console.log("\n🔍 RECHERCHER UN LIVRE");
        console.log("-".repeat(40));
        console.log("(Laissez vide les critères non souhaités)");

        const titre = await ask("Titre : ");
        const auteur = await ask("Auteur : ");
        const isbn = await ask("ISBN : ");
        const dispStr = await ask("Disponible uniquement ? (o/n) : ");

        const critere: any = {};
        if (titre) critere.titre = titre;
        if (auteur) critere.auteur = auteur;
        if (isbn) critere.isbn = isbn;
        if (dispStr.toLowerCase() === "o") critere.disponible = true;

        const resultats = this.service.rechercherLivres(critere);

        if (resultats.length === 0) {
            console.log("\n❌ Aucun livre trouvé");
            return;
        }

        console.log(`\n✅ ${resultats.length} livre(s) trouvé(s) :`);
        console.log("-".repeat(100));

        resultats.forEach((livre) => {
            console.log(`\n📖 ${livre.titre}`);
            console.log(`   ID: ${livre.id}`);
            console.log(`   Auteur: ${livre.auteur}`);
            console.log(`   ISBN: ${livre.isbn}`);
            console.log(`   Année: ${livre.anneePublication}`);
            console.log(`   Catégorie: ${livre.categorie}`);
            console.log(`   Pages: ${livre.nombrePages}`);
            console.log(`   Disponible: ${livre.disponible ? "Oui" : "Non"}`);
        });
    }

    // ========================================
    // MÉTHODES POUR LES MEMBRES
    // ========================================

    private async inscrireMembre(): Promise<void> {
        console.log("\n👤 INSCRIRE UN NOUVEAU MEMBRE");
        console.log("-".repeat(40));

        const nom = await ask("Nom : ");
        const prenom = await ask("Prénom : ");
        const email = await ask("Email : ");

        const membre = this.service.inscrireMembre({ nom, prenom, email });

        console.log(`\n✅ Membre inscrit avec succès ! ID: ${membre.id}`);
    }

    private async modifierMembre(): Promise<void> {
        console.log("\n✏️ MODIFIER UN MEMBRE");
        console.log("-".repeat(40));

        this.afficherMembres();

        const membreId = await ask("\nID du membre à modifier : ");
        const membre = this.service.obtenirMembre(membreId);

        if (!membre) {
            console.log("❌ Membre non trouvé");
            return;
        }

        console.log(`\nModification du membre : ${membre.prenom} ${membre.nom}`);
        console.log("(Laissez vide pour conserver la valeur actuelle)");

        const nom = await ask(`Nom [${membre.nom}] : `);
        const prenom = await ask(`Prénom [${membre.prenom}] : `);
        const email = await ask(`Email [${membre.email}] : `);

        const modifications: any = {};
        if (nom) modifications.nom = nom;
        if (prenom) modifications.prenom = prenom;
        if (email) modifications.email = email;

        const resultat = this.service.modifierMembre(membreId, modifications);

        if (typeof resultat === "string") {
            console.log(`❌ ${resultat}`);
        } else {
            console.log("✅ Membre modifié avec succès !");
        }
    }

    private afficherMembres(): void {
        const membres = this.service.afficherMembres();

        if (membres.length === 0) {
            console.log("\n👥 Aucun membre enregistré");
            return;
        }

        console.log("\n👥 LISTE DES MEMBRES");
        console.log("-".repeat(100));
        console.log(
            "ID".padEnd(12) +
            "Nom".padEnd(20) +
            "Prénom".padEnd(20) +
            "Email".padEnd(30) +
            "Emprunts",
        );
        console.log("-".repeat(100));

        membres.forEach((membre) => {
            console.log(
                membre.id.padEnd(12) +
                membre.nom.substring(0, 18).padEnd(20) +
                membre.prenom.substring(0, 18).padEnd(20) +
                membre.email.substring(0, 28).padEnd(30) +
                `${membre.empruntsActifs}/3`,
            );
        });

        console.log("-".repeat(100));
        console.log(`Total : ${membres.length} membre(s)`);
    }

    // ========================================
    // MÉTHODES POUR LES EMPRUNTS
    // ========================================

    private async emprunterLivre(): Promise<void> {
        console.log("\n📋 EMPRUNTER UN LIVRE");
        console.log("-".repeat(40));

        console.log("\n📚 Livres disponibles :");
        const livresDisponibles = this.service.rechercherLivres({ disponible: true });

        if (livresDisponibles.length === 0) {
            console.log("❌ Aucun livre disponible");
            return;
        }

        livresDisponibles.forEach((livre) => {
            console.log(`  ${livre.id} - ${livre.titre} (${livre.auteur})`);
        });

        const livreId = await ask("\nID du livre : ");

        console.log("\n👥 Membres inscrits :");
        this.afficherMembres();

        const membreId = await ask("\nID du membre : ");

        const resultat = this.service.emprunterLivre(livreId, membreId);

        if (typeof resultat === "string") {
            console.log(`❌ ${resultat}`);
        } else {
            console.log("\n✅ Emprunt enregistré avec succès !");
            console.log(`   ID: ${resultat.id}`);
            console.log(`   Livre: ${resultat.livre.titre}`);
            console.log(`   Membre: ${resultat.membre.prenom} ${resultat.membre.nom}`);
            console.log(`   Date de retour prévue: ${resultat.dateRetourPrevue.toLocaleDateString()}`);
        }
    }

    private async retournerLivre(): Promise<void> {
        console.log("\n↩️ RETOURNER UN LIVRE");
        console.log("-".repeat(40));

        const empruntsActifs = this.service.afficherEmpruntsActifs();

        if (empruntsActifs.length === 0) {
            console.log("\n❌ Aucun emprunt actif");
            return;
        }

        console.log("\n📋 Emprunts actifs :");
        empruntsActifs.forEach((emprunt) => {
            console.log(
                `  ${emprunt.id} - ${emprunt.livre.titre} (${emprunt.membre.prenom} ${emprunt.membre.nom})`,
            );
        });

        const empruntId = await ask("\nID de l'emprunt : ");

        const resultat = this.service.retournerLivre(empruntId);
        console.log(resultat.startsWith("Emprunt") || resultat.startsWith("Ce livre") ? `❌ ${resultat}` : `✅ ${resultat}`);
    }

    private afficherEmpruntsActifs(): void {
        const emprunts = this.service.afficherEmpruntsActifs();

        if (emprunts.length === 0) {
            console.log("\n📋 Aucun emprunt actif");
            return;
        }

        console.log("\n📋 EMPRUNTS ACTIFS");
        console.log("-".repeat(120));
        console.log(
            "ID".padEnd(12) +
            "Livre".padEnd(30) +
            "Membre".padEnd(25) +
            "Date emprunt".padEnd(15) +
            "Retour prévu".padEnd(15) +
            "En retard",
        );
        console.log("-".repeat(120));

        emprunts.forEach((emprunt) => {
            const enRetard = new Date() > emprunt.dateRetourPrevue;
            console.log(
                emprunt.id.padEnd(12) +
                emprunt.livre.titre.substring(0, 28).padEnd(30) +
                `${emprunt.membre.prenom} ${emprunt.membre.nom}`.substring(0, 23).padEnd(25) +
                emprunt.dateEmprunt.toLocaleDateString().padEnd(15) +
                emprunt.dateRetourPrevue.toLocaleDateString().padEnd(15) +
                (enRetard ? "⚠️ Oui" : "✅ Non"),
            );
        });

        console.log("-".repeat(120));
        console.log(`Total : ${emprunts.length} emprunt(s) actif(s)`);
    }

    private afficherHistorique(): void {
        const emprunts = this.service.afficherHistorique();

        if (emprunts.length === 0) {
            console.log("\n📋 Aucun emprunt enregistré");
            return;
        }

        console.log("\n📋 HISTORIQUE COMPLET DES EMPRUNTS");
        console.log("-".repeat(130));
        console.log(
            "ID".padEnd(12) +
            "Livre".padEnd(28) +
            "Membre".padEnd(22) +
            "Emprunt".padEnd(12) +
            "Retour prévu".padEnd(15) +
            "Retour effectif".padEnd(18) +
            "Statut",
        );
        console.log("-".repeat(130));

        emprunts.forEach((emprunt) => {
            const statut = emprunt.DateRetourEffective
                ? emprunt.estEnRetard
                    ? "⚠️ Retard"
                    : "✅ OK"
                : "📋 En cours";

            console.log(
                emprunt.id.padEnd(12) +
                emprunt.livre.titre.substring(0, 26).padEnd(28) +
                `${emprunt.membre.prenom} ${emprunt.membre.nom}`.substring(0, 20).padEnd(22) +
                emprunt.dateEmprunt.toLocaleDateString().padEnd(12) +
                emprunt.dateRetourPrevue.toLocaleDateString().padEnd(15) +
                (emprunt.DateRetourEffective
                    ? emprunt.DateRetourEffective.toLocaleDateString()
                    : "-"
                ).padEnd(18) +
                statut,
            );
        });

        console.log("-".repeat(130));
        console.log(`Total : ${emprunts.length} emprunt(s)`);
    }

    // ========================================
    // STATISTIQUES
    // ========================================

    private afficherStatistiques(): void {
        const nbLivres = this.service.nombreLivres();
        const nbMembres = this.service.nombreMembre();
        const nbEmprunts = this.service.compterEmprunts();
        const empruntsActifs = this.service.afficherEmpruntsActifs();
        const livresDisponibles = this.service.rechercherLivres({ disponible: true });

        console.log("\n📊 STATISTIQUES DE LA BIBLIOTHÈQUE");
        console.log("=".repeat(50));
        console.log(`📚 Nombre total de livres : ${nbLivres}`);
        console.log(`   - Disponibles : ${livresDisponibles.length}`);
        console.log(`   - Empruntés : ${nbLivres - livresDisponibles.length}`);
        console.log(`\n👥 Nombre de membres : ${nbMembres}`);
        console.log(`\n📋 Emprunts :`);
        console.log(`   - Actifs : ${empruntsActifs.length}`);
        console.log(`   - Total historique : ${nbEmprunts}`);

        // Calculer les retards
        const retards = empruntsActifs.filter((e) => new Date() > e.dateRetourPrevue);
        if (retards.length > 0) {
            console.log(`\n⚠️  Emprunts en retard : ${retards.length}`);
        }

        console.log("=".repeat(50));
    }
}
