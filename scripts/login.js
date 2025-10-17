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

      try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error("Erreur d'inscription coach");
        }

        const result = await response.json();
        console.log("🆕 Coach inscrit :", result);

        if (result.token && result.user) {
          // Sauvegarde du cookie et de la session
          CookieManager.set("token", result.token);
          UserSession.saveUser(result.user);
          alert("Compte coach créé avec succès ✅");
          window.location.href = "../pages/coach_account.html";
        } else {
          alert("Erreur : données utilisateur manquantes.");
        }
      } catch (error) {
        console.error("❌ Erreur d'inscription coach :", error);
        alert("Impossible de créer le compte coach.");
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

      try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error("Erreur d'inscription utilisateur");
        }

        const result = await response.json();
        console.log("🆕 Utilisateur inscrit :", result);

        if (result.token && result.user) {
          // Sauvegarde du cookie et de la session
          CookieManager.set("token", result.token);
          UserSession.saveUser(result.user);
          alert("Compte utilisateur créé avec succès ✅");
          window.location.href = "../pages/user_account.html";
        } else {
          alert("Erreur : données utilisateur manquantes.");
        }
      } catch (error) {
        console.error("❌ Erreur d'inscription utilisateur :", error);
        alert("Impossible de créer le compte utilisateur.");
      }
    });
  }
});
