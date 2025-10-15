// scripts/coach-list.js

document.addEventListener("DOMContentLoaded", async () => {
  const coachGrid = document.querySelector(".coaches-grid");

  // Si le conteneur n'existe pas, on arrête
  if (!coachGrid) return;

  try {
    // 1️⃣ On récupère les données du back-end
    const response = await fetch("http://127.0.0.1:5000/api/v1/user/coach");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des coaches");
    }

    const coaches = await response.json();

    // 2️⃣ On vide le contenu statique actuel
    coachGrid.innerHTML = "";

    // 3️⃣ On parcourt les coaches et on crée les cartes dynamiquement
    coaches.forEach(coach => {
      const card = document.createElement("div");
      card.classList.add("coach-card");

      card.innerHTML = `
        <div class="coach-image">
          <img src="../public/images/ready/${coach.image || 'default.jpg'}" alt="Coach ${coach.name}">
        </div>
        <div class="coach-info">
          <h3>${coach.name}</h3>
          <p class="specialty">${coach.specialty || 'No specialty'}</p>
          <p class="experience">${coach.experience || ''}</p>
          <div class="rating">⭐ ${coach.rating || 'N/A'}/5</div>
          <button class="btn-primary">Choose this coach</button>
        </div>
      `;

      coachGrid.appendChild(card);
    });

  } catch (error) {
    console.error("Erreur :", error);
    coachGrid.innerHTML = `<p style="color:red;">Impossible de charger la liste des coaches 😢</p>`;
  }
});
