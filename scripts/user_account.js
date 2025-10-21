// scripts/user_account.js

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ user_account.js chargé");

  if (!AuthManager.protectPage('user')) {
    return;
  }

  const user = AuthManager.getCurrentUser();

  try {
    const userData = await ApiService.getUserById(user.id);
    console.log("👤 Données utilisateur:", userData);

    fillUserForm(userData);

    const accountForm = document.getElementById('account-form');
    if (accountForm) {
      accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateUserAccount(user.id);
      });
    }

    const profilePictureInput = document.getElementById('profile-picture-input');
    if (profilePictureInput) {
      profilePictureInput.addEventListener('change', handleProfilePictureChange);
    }

  } catch (error) {
    console.error("❌ Erreur lors du chargement du profil:", error);
    alert("Erreur lors du chargement de votre profil.");
  }
});

function fillUserForm(userData) {
  const fields = {
    'first-name': userData.first_name,
    'last-name': userData.last_name,
    'email': userData.email,
    'birthday': userData.birthday,
    'size': userData.size,
    'weight': userData.weight,
    'address1': userData.adress1,
    'address2': userData.adress2,
    'postal-code': userData.postal_code,
    'city': userData.city,
    'allergy-comment': userData.allergy_comment,
    'physical-constraint': userData.physical_constraint
  };

  Object.keys(fields).forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element && fields[fieldId]) {
      element.value = fields[fieldId];
    }
  });

  const profileImage = document.getElementById('profileImage');
  if (profileImage && userData.picture) {
    profileImage.src = userData.picture;
  }

  const userNameElements = document.querySelectorAll('.user-name, .account-name');
  userNameElements.forEach(el => {
    el.textContent = `${userData.first_name} ${userData.last_name}`;
  });
}

async function updateUserAccount(userId) {
  const formData = new FormData(document.getElementById('account-form'));
  const updateData = {};

  for (let [key, value] of formData.entries()) {
    const fieldName = key.replace(/-/g, '_');
    
    if (fieldName === 'size' || fieldName === 'weight') {
      updateData[fieldName] = parseFloat(value) || 0;
    } else {
      updateData[fieldName] = value;
    }
  }

  try {
    const updatedUser = await ApiService.updateUser(userId, updateData);
    console.log("✅ Profil mis à jour:", updatedUser);

    UserSession.saveUser(updatedUser);

    alert("Profil mis à jour avec succès !");

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
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

async function deleteAccount() {
  if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    return;
  }

  if (!confirm('Confirmez-vous vraiment la suppression de votre compte ?')) {
    return;
  }

  const user = AuthManager.getCurrentUser();

  try {
    console.log("🗑️ Suppression du compte:", user.id);
    alert("Fonctionnalité de suppression de compte à venir !");

  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error);
    alert("Erreur lors de la suppression du compte.");
  }
}