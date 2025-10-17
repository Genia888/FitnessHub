// scripts/connexion.js
// ==========================================================
// Gestion de la connexion (login) + stockage du token/cookie
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ connexion.js chargé");

  const form = document.getElementById("login-form");
  if (!form) {
    console.warn("⚠️ Aucun formulaire #login-form trouvé sur la page.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupère les valeurs du formulaire
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // URL de l'API de connexion
    const url = "http://127.0.0.1:5000/api/v1/auth/login";

    console.log("➡️ Envoi POST vers :", url);
    console.log("📤 Payload :", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Réponse non OK
      if (!response.ok) {
        let errText = `Erreur HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson && errJson.error) {
            errText = errJson.error;
          } else if (errJson && errJson.message) {
            errText = errJson.message;
          }
        } catch (_) { /* ignore */ }
        throw new Error(errText);
      }

      // ✅ L'API retourne { access_token, user }
      const data = await response.json();
      console.log("📥 Réponse serveur :", data);

      const token = data.access_token;
      const user = data.user;

      if (!token || !user) {
        console.warn("⚠️ Réponse du serveur ne contient pas access_token et user.", data);
        alert("Connexion réussie, mais serveur n'a pas retourné d'informations de session attendues.");
        if (user) {
          UserSession.saveUser(user);
        }
        return;
      }

      // Sauvegarde du token (cookie) et des infos utilisateur (localStorage)
      CookieManager.set("token", token);
      UserSession.saveUser(user);
      console.log("🔐 Token et user stockés en local.");

      // Redirection selon le rôle
      if (user.is_coach) {
        window.location.href = "../pages/coach_account.html";
      } else {
        window.location.href = "../pages/user_account.html";
      }

    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      alert(error.message || "Erreur lors de la connexion. Vérifiez vos identifiants.");
    }
  });
});