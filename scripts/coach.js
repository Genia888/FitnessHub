document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ coach.js chargé !");

  const coachGrid = document.querySelector(".coaches-grid");
  if (!coachGrid) {
    console.error("⚠️ Aucun conteneur '.coaches-grid' trouvé dans la page !");
    return;
  }

  try {
    console.log("➡️ Récupération des données depuis le back...");
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/coach");

    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }

    const coaches = await response.json();
    console.log("📦 Données reçues :", coaches);

    coachGrid.innerHTML = "";

    // ✅ On parcourt chaque coach
    coaches.forEach(coach => {
      // Calcul du nom complet
      const fullName = `${coach.first_name || ""} ${coach.last_name || ""}`.trim();

      // Moyenne des notes si disponibles
      let averageRating = "N/A";
      if (coach.reviews && coach.reviews.length > 0) {
        const total = coach.reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = (total / coach.reviews.length).toFixed(1);
      }

      // Création de la carte HTML
      const card = document.createElement("div");
      card.classList.add("coach-card");

      card.innerHTML = `
        <div class="coach-image">
          <img src="${coach.picture || '../public/images/ready/default.jpg'}" alt="Coach ${fullName}">
        </div>
        <div class="coach-info">
          <h3>${fullName}</h3>
          <p class="specialty">${coach.coach_description || 'Spécialité non renseignée'}</p>
          <p class="experience">${coach.coach_experience || ''}</p>
          <div class="rating">⭐ ${averageRating}/5</div>
          <button class="btn-primary">Choisir ce coach</button>
        </div>
      `;

      coachGrid.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Erreur :", error);
    coachGrid.innerHTML = `<p style="color:red;">Impossible de charger la liste des coaches 😢</p>`;
  }
});
