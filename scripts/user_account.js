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

    // Charger le plan d'abonnement
    await loadUserSubscription(user.id);

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
    'created-at': userData.created_at,
    'allergy-comment': userData.allergy_comment,
    'physical-constraint': userData.physical_constraint
  };

  Object.keys(fields).forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element && fields[fieldId] && fieldId != 'created-at') {
      element.value = fields[fieldId];
    }
    else if (element && fields[fieldId] )
    {
      const options = { year: 'numeric', month: 'long' }; // mois en format long (ex: octobre), année en format numérique
      element.innerHTML = 'Subscriber from ' + new Date(fields[fieldId]).toLocaleDateString('fr-FR', options);

    }
  });
  const profileImage = document.getElementById('profileImage');
  if (profileImage && userData.picture) {
    if (userData.picture)
      profileImage.src = userData.picture;
    else
      profileImage.src = "http://localhost:5500/public/images/ready/profil.webp";
  }
  const certifImage = document.getElementById('certifImage');
  if (certifImage && userData.coach_certif) {
    certifImage.src = userData.coach_certif;
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

// Charger le plan d'abonnement de l'utilisateur
async function loadUserSubscription(userId) {
  const subscriptionStatusElement = document.getElementById('subscription-status');
  
  if (!subscriptionStatusElement) {
    console.warn("⚠️ Élément subscription-status non trouvé");
    return;
  }

  try {
    const subscriptions = await ApiService.getUserSubscriptions(userId);
    
    // Log détaillé pour déboguer
    console.log("🔍 Abonnements reçus:", subscriptions);
    console.log("🔍 Nombre d'abonnements:", subscriptions ? subscriptions.length : 0);
    
    if (!subscriptions || subscriptions.length === 0) {
      subscriptionStatusElement.textContent = 'No active subscription';
      subscriptionStatusElement.className = 'user-status inactive';
      return;
    }

    // Log de chaque abonnement
    subscriptions.forEach((sub, index) => {
      console.log(`📋 Abonnement ${index + 1}:`, {
        id: sub.id,
        plan_name: sub.plan_name,
        status: sub.status,
        start_date: sub.begin_date || sub.start_date,
        end_date: sub.end_date
      });
    });

    // Trier par date de début (plus récent en premier)
    const sortedSubscriptions = subscriptions.sort((a, b) => {
      const dateA = new Date(a.begin_date || a.start_date || 0);
      const dateB = new Date(b.begin_date || b.start_date || 0);
      return dateB - dateA; // Plus récent en premier
    });

    // Récupérer l'abonnement actif le plus récent
    const activeSubscription = sortedSubscriptions.find(sub => sub.status === 'active') || sortedSubscriptions[0];
    
    console.log("✅ Abonnement sélectionné:", activeSubscription);
    
    if (activeSubscription) {
      const planName = activeSubscription.plan_name || 'Basic';
      subscriptionStatusElement.textContent = `${planName} subscription active`;
      subscriptionStatusElement.className = 'user-status active';
      
      console.log("✅ Plan d'abonnement affiché:", planName);
    } else {
      subscriptionStatusElement.textContent = 'No active subscription';
      subscriptionStatusElement.className = 'user-status inactive';
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement de l'abonnement:", error);
    subscriptionStatusElement.textContent = 'Unable to load subscription';
    subscriptionStatusElement.className = 'user-status error';
  }
}
