// scripts/subscriber.js
// ==========================================================
// Gestion du tableau de bord client (subscriber)
// ==========================================================


document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ subscriber.js chargé");

  // Vérifier si l'utilisateur est connecté
  const token = CookieManager.get("token");
  const user = UserSession.getUser();

  if (!token || !user) {
    alert("Vous devez être connecté pour accéder à cette page.");
    window.location.href = "../pages/connexion.html";
    return;
  }

  // Vérifier que c'est bien un utilisateur (pas un coach)
  if (user.is_coach) {
    alert("Cette page est réservée aux abonnés.");
    window.location.href = "../pages/trainer.html";
    return;
  }

  try {
    // Charger les données de l'utilisateur
    await loadUserProfile(user.id, token);
    
    // Charger le planning d'exercices
    await loadWorkoutSchedule(user.id, token);
    
    // Charger le planning nutritionnel
    await loadNutritionSchedule(user.id, token);
    
    // Charger les messages
    await loadMessages(user.id, token);
    
    // Charger les informations du coach
    await loadCoachInfo(user.id, token);
    
    // Initialiser le chat
    initializeChat(user.id, token);
    
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    alert("Erreur lors du chargement de vos données.");
  }
});

// ============================================
// Charger le profil utilisateur
// ============================================
async function loadUserProfile(userId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Erreur lors du chargement du profil");

    const userData = await response.json();

    // Mettre à jour le profil dans le HTML
    const nameElement = document.querySelector(".client-info h3");
    if (nameElement) {
      nameElement.textContent = `${userData.first_name || ''} ${userData.last_name || ''}`;
    }
    
    const statsElement = document.querySelector(".client-stats");
    if (statsElement) {
      statsElement.textContent = `${userData.weight || 0}kg • ${userData.size || 0}m`;
    }

    // Mettre à jour l'image si disponible
    const imageElement = document.querySelector("#client-profile-image");
    if (imageElement && userData.picture) {
      imageElement.src = userData.picture;
    } else if (imageElement) {
      imageElement.src = "../assets/images/default-avatar.png";
    }

    // Afficher les contraintes physiques si présentes
    const goalElement = document.querySelector(".client-goal");
    if (goalElement && userData.physical_constraint) {
      goalElement.textContent = `Goal: ${userData.physical_constraint}`;
    }

    console.log("✅ Profil utilisateur chargé:", userData);
  } catch (error) {
    console.error("❌ Erreur loadUserProfile:", error);
  }
}

// ============================================
// Charger le planning d'exercices
// ============================================
async function loadWorkoutSchedule(userId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/workout/?user_id=${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("Aucun planning d'exercices trouvé");
      return;
    }

    const workouts = await response.json();

    if (workouts && workouts.length > 0) {
      const exerciseList = document.querySelector(".exercise-list");
      
      if (exerciseList) {
        exerciseList.innerHTML = ""; // Vider la liste

        workouts.forEach(workout => {
          const exerciseItem = document.createElement("div");
          exerciseItem.className = "exercise-item";
          exerciseItem.innerHTML = `
            <span class="exercise-name">${workout.category || "Exercise"}</span>
            <span class="exercise-details">${workout.description || "No description"}</span>
            ${workout.time ? `<span class="exercise-time">${workout.time} min</span>` : ''}
          `;
          exerciseList.appendChild(exerciseItem);
        });

        console.log("✅ Planning d'exercices chargé:", workouts);
      }
    } else {
      const exerciseList = document.querySelector(".exercise-list");
      if (exerciseList) {
        exerciseList.innerHTML = "<p>Aucun exercice programmé pour le moment.</p>";
      }
    }
  } catch (error) {
    console.error("❌ Erreur loadWorkoutSchedule:", error);
  }
}

// ============================================
// Charger le planning nutritionnel
// ============================================
async function loadNutritionSchedule(userId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/nutrition/?user_id=${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("Aucun planning nutritionnel trouvé");
      return;
    }

    const nutrition = await response.json();

    if (nutrition && nutrition.length > 0) {
      const nutritionList = document.querySelector(".nutrition-list");
      
      if (nutritionList) {
        nutritionList.innerHTML = ""; // Vider la liste

        nutrition.forEach(meal => {
          const mealItem = document.createElement("div");
          mealItem.className = "meal-item";
          mealItem.innerHTML = `
            <span class="meal-time">${meal.category || "Meal"}</span>
            <span class="meal-details">${meal.description || "No description"}</span>
            ${meal.calories ? `<span class="meal-calories">${meal.calories} cal</span>` : ''}
          `;
          nutritionList.appendChild(mealItem);
        });

        console.log("✅ Planning nutritionnel chargé:", nutrition);
      }
    } else {
      const nutritionList = document.querySelector(".nutrition-list");
      if (nutritionList) {
        nutritionList.innerHTML = "<p>Aucun plan nutritionnel défini pour le moment.</p>";
      }
    }
  } catch (error) {
    console.error("❌ Erreur loadNutritionSchedule:", error);
  }
}

// ============================================
// Charger les messages
// ============================================
async function loadMessages(userId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/message/?user_id=${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("Aucun message trouvé");
      return;
    }

    const messages = await response.json();

    if (messages && messages.length > 0) {
      const chatMessages = document.querySelector(".chat-messages");
      
      if (chatMessages) {
        chatMessages.innerHTML = ""; // Vider les messages

        messages.forEach(msg => {
          const messageDiv = document.createElement("div");
          messageDiv.className = msg.is_from_user ? "message message-sent" : "message message-received";
          messageDiv.innerHTML = `
            <p>${msg.text || "Message vide"}</p>
            <span class="message-time">${new Date(msg.created_at).toLocaleString()}</span>
          `;
          chatMessages.appendChild(messageDiv);
        });

        // Scroller vers le bas pour voir les derniers messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        console.log("✅ Messages chargés:", messages);
      }
    } else {
      const chatMessages = document.querySelector(".chat-messages");
      if (chatMessages) {
        chatMessages.innerHTML = "<p>Aucun message pour le moment.</p>";
      }
    }
  } catch (error) {
    console.error("❌ Erreur loadMessages:", error);
  }
}

// ============================================
// Charger les informations du coach
// ============================================
async function loadCoachInfo(userId, token) {
  try {
    // D'abord récupérer l'abonnement de l'utilisateur pour obtenir l'ID du coach
    const subResponse = await fetch(`${API_BASE_URL}/subscription/?user_id=${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!subResponse.ok) {
      console.log("Aucun abonnement trouvé");
      return;
    }

    const subscriptions = await subResponse.json();
    
    if (!subscriptions || subscriptions.length === 0) {
      console.log("Aucun coach assigné");
      return;
    }

    const coachId = subscriptions[0].coach_id;

    // Maintenant récupérer les infos du coach
    const coachResponse = await fetch(`${API_BASE_URL}/user/${coachId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!coachResponse.ok) throw new Error("Erreur lors du chargement du coach");

    const coachData = await coachResponse.json();

    // Mettre à jour les informations du coach dans le HTML
    const coachNameElement = document.querySelector(".coach-details h4");
    if (coachNameElement) {
      coachNameElement.textContent = `${coachData.first_name || ''} ${coachData.last_name || ''}`;
    }

    const coachDescElement = document.querySelector(".coach-details p");
    if (coachDescElement) {
      coachDescElement.textContent = coachData.description || "Coach professionnel";
    }

    const coachExperienceElement = document.querySelector(".coach-experience");
    if (coachExperienceElement) {
      coachExperienceElement.textContent = `Expérience: ${coachData.experience || 'N/A'}`;
    }

    // Mettre à jour l'image du coach
    const coachImageElement = document.querySelector("#coach-profile-image");
    if (coachImageElement && coachData.picture) {
      coachImageElement.src = coachData.picture;
    } else if (coachImageElement) {
      coachImageElement.src = "../assets/images/default-coach.png";
    }

    console.log("✅ Informations du coach chargées:", coachData);
  } catch (error) {
    console.error("❌ Erreur loadCoachInfo:", error);
  }
}

// ============================================
// Initialiser le chat
// ============================================
function initializeChat(userId, token) {
  const chatInput = document.querySelector(".chat-input input");
  const chatButton = document.querySelector(".chat-input .btn-primary");

  if (chatButton && chatInput) {
    chatButton.addEventListener("click", async () => {
      const messageText = chatInput.value.trim();

      if (!messageText) {
        alert("Veuillez saisir un message.");
        return;
      }

      try {
        // Envoyer le message au backend
        const response = await fetch(`${API_BASE_URL}/message/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: userId,
            text: messageText,
            is_from_user: true
          })
        });

        if (!response.ok) throw new Error("Erreur lors de l'envoi du message");

        const result = await response.json();
        console.log("✅ Message envoyé:", result);

        // Ajouter le message à l'interface
        const chatMessages = document.querySelector(".chat-messages");
        if (chatMessages) {
          const messageDiv = document.createElement("div");
          messageDiv.className = "message message-sent";
          messageDiv.innerHTML = `
            <p>${messageText}</p>
            <span class="message-time">${new Date().toLocaleString()}</span>
          `;
          chatMessages.appendChild(messageDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Vider le champ de saisie
        chatInput.value = "";

      } catch (error) {
        console.error("❌ Erreur lors de l'envoi du message:", error);
        alert("Impossible d'envoyer le message.");
      }
    });

    // Permettre d'envoyer avec la touche Entrée
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        chatButton.click();
      }
    });
  }
}

// ============================================
// Fonction de déconnexion (déjà dans le HTML)
// ============================================
function logout() {
  CookieManager.delete("token");
  UserSession.clear();
  window.location.href = "../pages/connexion.html";
}