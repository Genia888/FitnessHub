// scripts/abonnement.js
// ==========================================================
// Gestion de la page abonnements
// ==========================================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ abonnement.js chargé");

  // Afficher le plan actuel si connecté
  if (AuthManager.isAuthenticated() && !AuthManager.isCoach()) {
    await displayCurrentPlan();
  }

  // Gérer les clics sur les boutons d'abonnement
  const planButtons = document.querySelectorAll('.plan-card .btn-primary');

  planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const planCard = e.target.closest('.plan-card');
      const planName = planCard.querySelector('h3').textContent;
      const planPrice = planCard.querySelector('.price').textContent;
      
      selectPlan(planName, planPrice);
    });
  });
});

// Afficher le plan actuel
async function displayCurrentPlan() {
  const user = AuthManager.getCurrentUser();
  
  try {
    const subscriptions = await ApiService.getUserSubscriptions(user.id);
    
    if (!subscriptions || subscriptions.length === 0) return;
    
    // Trier par date pour obtenir le plus récent
    const sortedSubscriptions = subscriptions.sort((a, b) => {
      const dateA = new Date(a.begin_date || a.start_date || 0);
      const dateB = new Date(b.begin_date || b.start_date || 0);
      return dateB - dateA;
    });
    
    const currentSubscription = sortedSubscriptions.find(sub => sub.status === 'active');
    
    if (currentSubscription) {
      highlightCurrentPlan(currentSubscription.plan_name);
      updatePlanButtons(currentSubscription.plan_name);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du plan actuel:", error);
  }
}

// Mettre en évidence le plan actuel
function highlightCurrentPlan(currentPlanName) {
  const planCards = document.querySelectorAll('.plan-card');
  
  planCards.forEach(card => {
    const planName = card.querySelector('h3').textContent;
    
    if (planName === currentPlanName) {
      card.classList.add('current-plan');
      
      // Ajouter un badge "Plan actuel"
      if (!card.querySelector('.current-badge')) {
        const badge = document.createElement('div');
        badge.className = 'current-badge';
        badge.textContent = 'Current Plan';
        card.insertBefore(badge, card.firstChild);
      }
    } else {
      card.classList.remove('current-plan');
      const badge = card.querySelector('.current-badge');
      if (badge) badge.remove();
    }
  });
}

// Mettre à jour le texte des boutons
function updatePlanButtons(currentPlanName) {
  const planCards = document.querySelectorAll('.plan-card');
  
  planCards.forEach(card => {
    const planName = card.querySelector('h3').textContent;
    const button = card.querySelector('.btn-primary');
    
    if (planName === currentPlanName) {
      button.textContent = 'Current Plan';
      button.disabled = true;
      button.style.opacity = '0.6';
      button.style.cursor = 'not-allowed';
    } else {
      button.textContent = 'Switch to this plan';
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  });
}

/**
 * Sélectionne un plan d'abonnement
 */
async function selectPlan(planName, planPrice) {
  console.log("📋 Plan sélectionné:", planName, planPrice);

  // Vérifier si l'utilisateur est connecté
  if (!AuthManager.isAuthenticated()) {
    if (confirm('Vous devez être connecté pour souscrire à un abonnement. Voulez-vous vous connecter maintenant ?')) {
      window.location.href = '../pages/connexion.html';
    }
    return;
  }

  const user = AuthManager.getCurrentUser();

  if (AuthManager.isCoach()) {
    alert('Les coachs ne peuvent pas souscrire à des abonnements utilisateur');
    return;
  }

  // Vérifier si c'est un changement de plan
  try {
    const subscriptions = await ApiService.getUserSubscriptions(user.id);
    const currentSubscription = subscriptions?.find(sub => sub.status === 'active');
    
    if (currentSubscription) {
      const confirmMessage = `You currently have the ${currentSubscription.plan_name} plan.\n\nDo you want to switch to the ${planName} plan?\n\nYour current plan will be automatically replaced.`;
      
      if (!confirm(confirmMessage)) {
        return;
      }
    }
  } catch (error) {
    console.log("Aucun abonnement actuel trouvé");
  }

  // Extraire le prix (enlever tout sauf les chiffres)
  const price = parseFloat(planPrice.replace(/[^\d.]/g, ''));
  let coach_id = null;
  
  // Si l'utilisateur a un coach assigné, le récupérer
  if (user.assigned_coach_id) {
    coach_id = user.assigned_coach_id;
  } else if (user.role === 'subscriber' && user.coach_id) {
    coach_id = user.coach_id;
  }
  
  try {
    const subscriptionData = {
      user_id: user.id,
      ...(coach_id && { coach_id }),
      plan_name: planName,  // ✅ Vérifier que c'est le bon nom
      price: price,
      status: 'active',
      start_date: new Date().toISOString(),
    };
    
    // Log pour déboguer
    console.log("📤 Données envoyées à l'API:", subscriptionData);
    
    // Créer l'abonnement (l'ancien sera automatiquement désactivé par le backend)
    const subscription = await ApiService.createSubscription(subscriptionData);

    console.log("✅ Abonnement créé:", subscription);
    console.log("✅ Plan name reçu:", subscription.plan_name);
    
    alert(`Plan ${planName} activated successfully!\n\nYour subscription has been updated.`);
    
    // Mettre à jour l'affichage
    await displayCurrentPlan();
    
    // Optionnel : Rediriger vers le dashboard après 2 secondes
    setTimeout(() => {
      window.location.href = '../pages/subscriber.html';
    }, 2000);
    
  } catch (error) {
    let msg = "Erreur lors de la souscription. Veuillez réessayer.";
    if (error && error.message) {
      msg += `\n${error.message}`;
    }
    console.error("❌ Erreur lors de la création de l'abonnement:", error);
    alert(msg);
  }
}