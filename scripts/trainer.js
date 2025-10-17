// scripts/trainer.js
// ==========================================================
// Gestion du tableau de bord coach (trainer)
// ==========================================================

const API_BASE_URL = "http://localhost:5000/api/v1";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ trainer.js chargé");

  // Vérifier si l'utilisateur est connecté
  const token = CookieManager.get("token");
  const user = UserSession.getUser();

  if (!token || !user) {
    alert("Vous devez être connecté pour accéder à cette page.");
    window.location.href = "../pages/connexion.html";
    return;
  }

  // Vérifier que c'est bien un coach
  if (!user.is_coach) {
    alert("Cette page est réservée aux coachs.");
    window.location.href = "../pages/subscriber.html";
    return;
  }

  try {
    // Charger la liste des clients
    await loadCoachClients(user.id, token);
    
    // Par défaut, charger le premier client (si disponible)
    const firstClientId = await getFirstClientId(user.id, token);
    
    if (firstClientId) {
      await loadClientData(firstClientId, token);
      
      // Initialiser le chat
      initializeChat(user.id, firstClientId, token);
      
      // Initialiser les boutons d'action
      initializeActionButtons(firstClientId, token);
    } else {
      console.log("Aucun client trouvé pour ce coach");
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    alert("Erreur lors du chargement de vos données.");
  }
});

// ============================================
// Récupérer le premier client du coach
// ============================================
async function getFirstClientId(coachId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/coach/${coachId}/users`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) return null;

    const clients = await response.json();
    return clients.length > 0 ? clients[0].id : null;
  } catch (error) {
    console.error("❌ Erreur getFirstClientId:", error);
    return null;
  }
}

// ============================================
// Charger les clients du coach
// ============================================
async function loadCoachClients(coachId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/coach/${coachId}/users`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.log("Aucun client trouvé");
      return;
    }

    const clients = await response.json();
    console.log("✅ Clients chargés:", clients);

    // Vous pouvez créer un sélecteur de clients ici si nécessaire
    // Pour l'instant, on affiche le premier client par défaut
    
  } catch (error) {
    console.error("❌ Erreur loadCoachClients:", error);
  }
}

// ============================================
// Charger les données d'un client spécifique
// ============================================
async function loadClientData(clientId, token) {
  try {
    // Charger le profil du client
    const response = await fetch(`${API_BASE_URL}/user/${clientId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Erreur lors du chargement du profil client");

    const clientData = await response.json();

    // Mettre à jour le profil dans le HTML
    document.querySelector(".client-info h3").textContent = 
      `${clientData.first_name} ${clientData.last_name}`;
    
    document.querySelector(".client-stats").textContent = 
      `${clientData.weight}kg • ${clientData.size}m • 29 years old`;

    // Mettre à jour l'image si disponible
    if (clientData.picture) {
      document.querySelector(".client-image img").src = clientData.picture;
    }

    // Afficher les objectifs si présents
    if (clientData.physical_constraint) {
      document.querySelector(".client-goal").textContent = 
        `Goal: ${clientData.physical_constraint}`;
    }

    console.log("✅ Profil client chargé:", clientData);

    // Charger le planning d'exercices du client
    await loadClientWorkout(clientId, token);
    
    // Charger le planning nutritionnel du client
    await loadClientNutrition(clientId, token);
    
    // Charger les messages avec le client
    await loadMessages(clientId, token);

  } catch (error) {
    console.error("❌ Erreur loadClientData:", error);
  }
}

// ============================================
// Charger le planning d'exercices du client
// ============================================
async function loadClientWorkout(clientId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/workout?user_id=${clientId}`, {
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

      console.log("✅ Planning d'exercices du client chargé:", workouts);
    }
  } catch (error) {
    console.error("❌ Erreur loadClientWorkout:", error);
  }
}

// ============================================
// Charger le planning nutritionnel du client
// ============================================
async function loadClientNutrition(clientId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/nutrition?user_id=${clientId}`, {
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

      console.log("✅ Planning nutritionnel du client chargé:", nutrition);
    }
  } catch (error) {
    console.error("❌ Erreur loadClientNutrition:", error);
  }
}

// ============================================
// Charger les messages avec le client
// ============================================
async function loadMessages(clientId, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/message?user_id=${clientId}`, {
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
  } catch (error) {
    console.error("❌ Erreur loadMessages:", error);
  }
}

// ============================================
// Initialiser le chat
// ============================================
function initializeChat(coachId, clientId, token) {
  const chatInput = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input button");

  sendButton.addEventListener("click", async () => {
    const messageText = chatInput.value.trim();
    
    if (!messageText) return;

    try {
      // Envoyer le message
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          text: messageText,
          user_id: clientId,
          coach_id: coachId,
          is_from_user: false // Le message vient du coach
        })
      });

      if (response.ok) {
        // Ajouter le message dans le chat
        const chatMessages = document.querySelector(".chat-messages");
        const messageDiv = document.createElement("div");
        messageDiv.className = "message coach-message";
        
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

// ============================================
// Initialiser les boutons d'action
// ============================================
function initializeActionButtons(clientId, token) {
  // Bouton "Change Schedule"
  const changeScheduleBtn = document.querySelector(".planning-card:first-child .btn-primary");
  if (changeScheduleBtn) {
    changeScheduleBtn.addEventListener("click", () => {
      // Rediriger vers une page de modification ou ouvrir un modal
      alert("Fonctionnalité de modification du planning à implémenter");
      // Vous pouvez créer une modal ou rediriger vers une page dédiée
    });
  }

  // Bouton "Change Diet"
  const changeDietBtn = document.querySelector(".planning-card:nth-child(2) .btn-primary");
  if (changeDietBtn) {
    changeDietBtn.addEventListener("click", () => {
      alert("Fonctionnalité de modification du régime à implémenter");
    });
  }
}