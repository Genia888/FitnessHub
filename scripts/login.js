// scripts/login.js
// ==========================================================
// Gestion de l'inscription (coach OU utilisateur) + cookies
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ login.js chargé");

  // --- FORMULAIRE COACH ---
  const coachForm = document.getElementById("coach-register-form");
  if (coachForm) {
    coachForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(coachForm);
      const data = Object.fromEntries(formData.entries());
      data.is_coach = true; // ✅ différencie les coachs
      data.is_nutrition = false; // ajout pour cohérence avec le backend

      try {
        // Utiliser le service centralisé
        const result = await ApiService.register(data);
        console.log("🆕 Coach inscrit :", result);

        //  ATTENTION : l'API retourne "access_token" pas "token"
        if (result.access_token && result.user) {
          // Sauvegarde du cookie et de la session
          CookieManager.set("token", result.access_token);
          UserSession.saveUser(result.user);
          alert("Compte coach créé avec succès ✅");
          AuthManager.redirectToAccount();
        } else {
          alert("Erreur : données utilisateur manquantes.");
        }
      } catch (error) {
        console.error("❌ Erreur d'inscription coach :", error);
        alert(error.message || "Impossible de créer le compte coach.");
      }
    });
  }

  // --- FORMULAIRE CLIENT ---
  const memberForm = document.getElementById("member-register-form");
  if (memberForm) {
    memberForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(memberForm);
      const data = Object.fromEntries(formData.entries());
      data.is_coach = false; // ✅ différencie les membres "lambda"
      data.is_nutrition = false; // ajout pour cohérence avec le backend

      try {
        //  Utiliser le service centralisé
        const result = await ApiService.register(data);
        console.log("🆕 Utilisateur inscrit :", result);

        // ATTENTION : l'API retourne "access_token" pas "token"
        if (result.access_token && result.user) {
          // Sauvegarde du cookie et de la session
          CookieManager.set("token", result.access_token);
          UserSession.saveUser(result.user);
          alert("Compte utilisateur créé avec succès ✅");
          AuthManager.redirectToAccount();
        } else {
          alert("Erreur : données utilisateur manquantes.");
        }
      } catch (error) {
        console.error("❌ Erreur d'inscription utilisateur :", error);
        alert(error.message || "Impossible de créer le compte utilisateur.");
      }
    });
  }
});