// scripts/coach_account.js

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ coach_account.js chargé");

  if (!AuthManager.protectPage('coach')) {
    return;
  }

  const user = AuthManager.getCurrentUser();

  try {
    const coachData = await ApiService.getUserById(user.id);
    console.log("👨‍🏫 Données coach:", coachData);

    fillCoachForm(coachData);

    const accountForm = document.getElementById('coach-account-form');
    if (accountForm) {
      accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateCoachAccount(user.id);
      });
    }

    const profilePictureInput = document.getElementById('profile-picture-input');
    if (profilePictureInput) {
      profilePictureInput.addEventListener('change', handleProfilePictureChange);
    }

    await loadCoachStats(user.id);

  } catch (error) {
    console.error("❌ Erreur lors du chargement du profil:", error);
    alert("Erreur lors du chargement de votre profil.");
  }
});

function fillCoachForm(coachData) {
  const fields = {
    'first-name': coachData.first_name,
    'last-name': coachData.last_name,
    'email': coachData.email,
    'birthday': coachData.birthday,
    'address1': coachData.adress1,
    'address2': coachData.adress2,
    'postal-code': coachData.postal_code,
    'city': coachData.city,
    'coach-certif': coachData.coach_certif,
    'coach-experience': coachData.coach_experience,
    'coach-description': coachData.coach_description
  };

  Object.keys(fields).forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element && fields[fieldId]) {
      element.value = fields[fieldId];
    }
  });

  const isNutritionCheckbox = document.getElementById('is-nutrition');
  if (isNutritionCheckbox) {
    isNutritionCheckbox.checked = coachData.is_nutrition;
  }

  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    if (coachData.picture)
      profileImage.src = coachData.picture;
    else
      profileImage.src = "http://localhost:5500/public/images/ready/profil.webp";
  }

  const coachNameElements = document.querySelectorAll('.coach-name, .account-name');
  coachNameElements.forEach(el => {
    el.textContent = `${coachData.first_name} ${coachData.last_name}`;
  });
}

async function updateCoachAccount(userId) {
  const formData = new FormData(document.getElementById('coach-account-form'));
  const updateData = {};

  for (let [key, value] of formData.entries()) {
    const fieldName = key.replace(/-/g, '_');
    updateData[fieldName] = value;
  }

  const isNutritionCheckbox = document.getElementById('is-nutrition');
  if (isNutritionCheckbox) {
    updateData.is_nutrition = isNutritionCheckbox.checked;
  }

  try {
    const updatedCoach = await ApiService.updateUser(userId, updateData);
    console.log("✅ Profil coach mis à jour:", updatedCoach);

    UserSession.saveUser(updatedCoach);

    alert("Profil mis à jour avec succès !");

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
  }
}

async function loadCoachStats(coachId) {
  try {
    const clients = await ApiService.getCoachClients(coachId);
    const reviews = await ApiService.getCoachReviews(coachId);

    const statsContainer = document.querySelector('.coach-stats');
    if (statsContainer) {
      const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '-';

      statsContainer.innerHTML = `
        <div class="stat-item">
          <h4>${clients.length}</h4>&nbsp;
          <p>Clients actifs</p>
        </div>
        <div class="stat-item">
          <h4>${reviews.length}</h4>&nbsp;
          <p>Avis reçus</p>
        </div>
        <div class="stat-item">
          <h4>${avgRating}</h4>&nbsp;
          <p>Note moyenne</p>
        </div>
      `;
    }

  } catch (error) {
    console.error("❌ Erreur lors du chargement des statistiques:", error);
  }
}

function handleProfilePictureChange(event) {
  const file = event.target.files[0];
  
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Veuillez sélectionner une image valide');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
      profileImage.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);

  console.log("📸 Photo sélectionnée:", file.name);
  alert("Fonctionnalité d'upload de photo à venir !");
}