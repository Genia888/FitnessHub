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

    // Détermine l'URL d'API à utiliser :
    // - si action du form est une URL absolue, on l'utilise,
    // - sinon on préfixe par http://127.0.0.1:5000 (ton backend local).
    let action = form.getAttribute("action") || "/api/v1/auth/login";
    let url = action;
    if (!/^https?:\/\//i.test(action)) {
      // si action commence par '/', laisse tel quel ; sinon ajoute '/'
      if (!action.startsWith("/")) action = "/" + action;
      url = "http://127.0.0.1:5000" + action;
    }

    console.log("➡️ Envoi POST vers :", url);
    console.log("📤 Payload :", payload);

    // Optionnel : afficher un petit feedback utilisateur (si tu veux)
    // const submitBtn = form.querySelector('button[type="submit"]');
    // if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Connexion...'; }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Réponse non OK
      if (!response.ok) {
        // essaie de lire le message d'erreur renvoyé par le serveur
        let errText = `Erreur HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson && errJson.message) errText = errJson.message;
          else if (typeof errJson === "string") errText = errJson;
        } catch (_) { /* ignore */ }
        throw new Error(errText);
      }

      // Normalement JSON { token, user } ou { access_token, user } ou user directement
      const data = await response.json();
      console.log("📥 Réponse serveur :", data);

      // Normalisation : chercher token et user dans différentes formes possibles
      const token = data.token || data.access_token || (data.data && data.data.token) || null;
      const user = data.user || data.data || (data && typeof data === "object" && data.id ? data : null);

      if (!token || !user) {
        console.warn("⚠️ Réponse du serveur ne contient pas token et user comme attendu.", data);
        alert("Connexion réussie, mais serveur n'a pas retourné d'informations de session attendues.");
        // On peut néanmoins tenter de sauvegarder user si présent
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
      // Message simple pour l'utilisateur
      alert(error.message || "Erreur lors de la connexion. Vérifiez vos identifiants.");
    } finally {
      // if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign in'; }
    }
  });
});
