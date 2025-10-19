// scripts/subscriber.js
// ==========================================================
// Gestion du tableau de bord client (subscriber)
// ==========================================================

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

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
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Erreur lors du chargement du profil");

    const userData = await response.json();

    // Mettre à jour le profil dans le HTML
    const nameElement = document.querySelector(".client-info h3");
    if (nameElement) {
      nameElement.textContent = `${userData.first_name} ${userData.last_name}`;
    }
    
    const statsElement = document.querySelector(".client-stats");
    if (statsElement && userData.weight && userData.size) {
      statsElement.textContent = `${userData.weight}kg • ${userData.size}m`;
    }

    // Mettre à jour l'image si disponible
    const imageElement = document.querySelector("#client-profile-image");
    if (imageElement && userData.picture) {
      imageElement.src = userData.picture;
      imageElement.alt = `${userData.first_name} ${userData.last_name}`;
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
    const response = await fetch(`${API_BASE_URL}/workout/user/${userId}/workout`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
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
          `;
          exerciseList.appendChild(exerciseItem);
        });

        console.log("✅ Planning d'exercices chargé:", workouts);
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
    const response = await fetch(`${API_BASE_URL}/nutrition/user/${userId}/nutrition`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
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
            <span class="meal-details">${meal.description || "No description"} (${meal.calories || 0} cal)</span>
          `;
          nutritionList.appendChild(mealItem);
        });

        console.log("✅ Planning nutritionnel chargé:", nutrition);
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
    const response = await fetch(`${API_BASE_URL}/message/user/${userId}/messages`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
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
          messageDiv.className = msg.is_from_user ? "message client-message" : "message coach-message";
          
          const date = new Date(msg.created_at);
          const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          
          messageDiv.innerHTML = `
            <span class="message-time">${time}</span>
            <p>${msg.text}</p>
          `;
          chatMessages.appendChild(messageDiv);
        });

        // Scroll vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;

        console.log("✅ Messages chargés:", messages);
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
    // Récupérer l'abonnement pour trouver le coach
    const subResponse = await fetch(`${API_BASE_URL}/subscription`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!subResponse.ok) {
      console.log("Aucun abonnement actif trouvé");
      return;
    }

    const subscriptions = await subResponse.json();
    
    // Trouver l'abonnement de l'utilisateur
    const userSubscription = subscriptions.find(sub => sub.user_id === userId);
    
    if (userSubscription && userSubscription.coach_id) {
      const coachId = userSubscription.coach_id;
      
      // Récupérer les infos du coach
      const coachResponse = await fetch(`${API_BASE_URL}/user/${coachId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (coachResponse.ok) {
        const coach = await coachResponse.json();
        
        // Mettre à jour les infos du coach
        const coachNameElement = document.querySelector(".coach-details h4");
        if (coachNameElement) {
          coachNameElement.textContent = `${coach.first_name} ${coach.last_name}`;
        }
        
        const coachDescElement = document.querySelector(".coach-details p:nth-child(2)");
        if (coachDescElement) {
          coachDescElement.textContent = coach.coach_description || "Fitness & Nutrition Specialist";
        }
        
        const coachImageElement = document.querySelector("#coach-profile-image");
        if (coachImageElement && coach.picture) {
          coachImageElement.src = coach.picture;
          coachImageElement.alt = `${coach.first_name} ${coach.last_name}`;
        }

        console.log("✅ Informations du coach chargées:", coach);
      }
    }
  } catch (error) {
    console.error("❌ Erreur loadCoachInfo:", error);
  }
}

// ============================================
// Initialiser le chat
// ============================================
function initializeChat(userId, token) {
  const chatInput = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input button");

  if (!chatInput || !sendButton) return;

  sendButton.addEventListener("click", async () => {
    const messageText = chatInput.value.trim();
    
    if (!messageText) return;

    try {
      // Récupérer l'ID du coach depuis l'abonnement
      const subResponse = await fetch(`${API_BASE_URL}/subscription`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!subResponse.ok) {
        alert("Vous devez être abonné à un coach pour envoyer des messages.");
        return;
      }

      const subscriptions = await subResponse.json();
      const userSubscription = subscriptions.find(sub => sub.user_id === userId);
      const coachId = userSubscription?.coach_id;

      if (!coachId) {
        alert("Coach non trouvé.");
        return;
      }

      // Envoyer le message
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: messageText,
          user_id: userId,
          coach_id: coachId,
          is_from_user: true,
          is_read: false
        })
      });

      if (response.ok) {
        // Ajouter le message dans le chat
        const chatMessages = document.querySelector(".chat-messages");
        const messageDiv = document.createElement("div");
        messageDiv.className = "message client-message";
        
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        messageDiv.innerHTML = `
          <span class="message-time">${time}</span>
          <p>${messageText}</p>
        `;
        chatMessages.appendChild(messageDiv);
        
        // Vider l'input
        chatInput.value = "";
        
        // Scroll vers le bas
        chatMessages.scrollTop = chatMessages.scrollHeight;

        console.log("✅ Message envoyé");
      } else {
        throw new Error("Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error);
      alert("Impossible d'envoyer le message.");
    }
  });

  // Envoyer avec la touche Entrée
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });
}