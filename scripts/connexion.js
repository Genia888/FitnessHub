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

    console.log("➡️ Connexion via ApiService.login");
    console.log("📤 Payload :", payload);

    try {
      // Utiliser le service centralisé
      const data = await ApiService.login(payload.email, payload.password);
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
      AuthManager.redirectToAccount();

    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      alert(error.message || "Erreur lors de la connexion. Vérifiez vos identifiants.");
    }
  });
});