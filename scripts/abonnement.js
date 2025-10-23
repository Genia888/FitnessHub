// scripts/abonnement.js
// ==========================================================
// Gestion de la page abonnements
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ abonnement.js chargé");

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

  // Extraire le prix (enlever tout sauf les chiffres)
  const price = parseFloat(planPrice.replace(/[^\d.]/g, ''));
  let coach_id = null;
  // Si l'utilisateur a un coach assigné, le récupérer (exemple: user.assigned_coach_id)
  if (user.assigned_coach_id) {
    coach_id = user.assigned_coach_id;
  } else if (user.role === 'subscriber' && user.coach_id) {
    coach_id = user.coach_id;
  }
  try {
    // Créer l'abonnement
    const subscription = await ApiService.createSubscription({
      user_id: user.id,
      ...(coach_id && { coach_id }),
      plan_name: planName,
      price: price,
      status: 'active',
      start_date: new Date().toISOString(),
      // end_date sera calculé automatiquement par le backend (1 mois plus tard)
    });

    console.log("✅ Abonnement créé:", subscription);
    alert(`Abonnement ${planName} activé avec succès !`);
    // Rediriger vers le dashboard
    window.location.href = '../pages/subscriber.html';
  } catch (error) {
    let msg = "Erreur lors de la souscription. Veuillez réessayer.";
    if (error && error.message) {
      msg += `\n${error.message}`;
    }
    console.error("❌ Erreur lors de la création de l'abonnement:", error);
    alert(msg);
  }
}