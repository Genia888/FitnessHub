// scripts/trainer.js
// ==========================================================
// Gestion du tableau de bord coach (trainer)
// ==========================================================

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

// Variable globale pour stocker le client actuellement sélectionné
let currentClientId = null;
let currentCoachId = null;
let currentToken = null;

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

  // Stocker les variables globales
  currentCoachId = user.id;
  currentToken = token;

  try {
    // Charger la liste des clients dans la sidebar
    await loadCoachClients(user.id, token);
    
    // Initialiser la recherche de clients
    initializeClientSearch();
    
    // ✅ NOUVEAU : Vérifier si un client spécifique est demandé dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientIdFromUrl = urlParams.get('client');
    
    if (clientIdFromUrl) {
      console.log(`🎯 Client spécifique demandé depuis l'URL: ${clientIdFromUrl}`);
      // Attendre un peu que la liste des clients soit chargée
      setTimeout(() => {
        selectClientById(clientIdFromUrl, token);
      }, 500);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données:", error);
    alert("Erreur lors du chargement de vos données.");
  }
});

// ============================================
// Charger les clients du coach
// ============================================
async function loadCoachClients(coachId, token) {
  const clientsList = document.getElementById("clientsList");
  
  try {
    const response = await fetch(`${API_BASE_URL}/user/coach/${coachId}/users`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      clientsList.innerHTML = '<div class="empty-message">No clients found</div>';
      return;
    }

    const clients = await response.json();
    console.log("✅ Clients chargés:", clients);
    
    if (clients.length === 0) {
      clientsList.innerHTML = '<div class="empty-message">No clients yet</div>';
      return;
    }

    // Afficher la liste des clients
    clientsList.innerHTML = "";
    
    clients.forEach((client, index) => {
      const clientCard = createClientCard(client);
      clientsList.appendChild(clientCard);
      
      // Charger automatiquement le premier client seulement si aucun client n'est spécifié dans l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const clientIdFromUrl = urlParams.get('client');
      
      if (!clientIdFromUrl && index === 0) {
        selectClient(client.id, token);
        clientCard.classList.add("active");
      }
    });
    
  } catch (error) {
    console.error("❌ Erreur loadCoachClients:", error);
    clientsList.innerHTML = '<div class="error-message">Error loading clients</div>';
  }
}

// ============================================
// Créer une carte client
// ============================================
function createClientCard(client) {
  const clientCard = document.createElement("div");
  clientCard.className = "client-card";
  clientCard.dataset.clientId = client.id;
  clientCard.dataset.clientName = `${client.first_name} ${client.last_name}`.toLowerCase();
  
  const profileImage = client.picture || "../public/images/ready/client1.jpg";
  
  clientCard.innerHTML = `
    <div class="client-card-image">
      <img src="${profileImage}" alt="${client.first_name} ${client.last_name}">
    </div>
    <div class="client-card-info">
      <h4>${client.first_name} ${client.last_name}</h4>
      <p class="client-card-email">${client.email}</p>
      ${client.weight ? `<p class="client-card-stats">${client.weight}kg${client.size ? ` • ${client.size}m` : ''}</p>` : ''}
    </div>
  `;
  
  // Ajouter l'événement de clic
  clientCard.addEventListener("click", () => {
    // Retirer la classe active de tous les clients
    document.querySelectorAll(".client-card").forEach(card => {
      card.classList.remove("active");
    });
    
    // Ajouter la classe active au client sélectionné
    clientCard.classList.add("active");
    
    // Charger les données du client
    selectClient(client.id, currentToken);
  });
  
  return clientCard;
}

// ============================================
// ✅ NOUVELLE FONCTION : Sélectionner un client par son ID
// ============================================
function selectClientById(clientId, token) {
  console.log(`🔍 Recherche du client avec ID: ${clientId}`);
  
  // Trouver la carte du client correspondant
  const clientCards = document.querySelectorAll(".client-card");
  let foundClient = false;
  
  clientCards.forEach(card => {
    if (card.dataset.clientId === clientId) {
      // Retirer la classe active de tous les clients
      clientCards.forEach(c => c.classList.remove("active"));
      
      // Ajouter la classe active au client trouvé
      card.classList.add("active");
      
      // Charger les données du client
      selectClient(clientId, token);
      
      // Scroller vers le client dans la liste
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      foundClient = true;
      console.log(`✅ Client trouvé et sélectionné: ${clientId}`);
    }
  });
  
  if (!foundClient) {
    console.warn(`⚠️ Client avec ID ${clientId} non trouvé dans la liste`);
  }
}

// ============================================
// Sélectionner un client
// ============================================
async function selectClient(clientId, token) {
  currentClientId = clientId;
  
  try {
    // Charger toutes les données du client
    await loadClientData(clientId, token);
    
    // Réactiver le chat
    enableChat();
    
    // Réinitialiser le chat pour ce client
    initializeChat(currentCoachId, clientId, token);
    
  } catch (error) {
    console.error("❌ Erreur lors de la sélection du client:", error);
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
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Erreur lors du chargement du profil client");

    const clientData = await response.json();

    // Mettre à jour le profil dans le HTML
    const nameElement = document.querySelector(".client-info h3");
    if (nameElement) {
      nameElement.textContent = `${clientData.first_name} ${clientData.last_name}`;
    }
    
    const statsElement = document.querySelector(".client-stats");
    if (statsElement) {
      if (clientData.weight && clientData.size) {
        const age = clientData.birthday ? calculateAge(clientData.birthday) : null;
        statsElement.textContent = `${clientData.weight}kg • ${clientData.size}m${age ? ` • ${age} years old` : ''}`;
      } else {
        statsElement.textContent = "No stats available";
      }
    }

    // Mettre à jour l'image si disponible
    const imageElement = document.querySelector(".client-image img");
    if (imageElement) {
      imageElement.src = clientData.picture || "../public/images/ready/client1.jpg";
      imageElement.alt = `${clientData.first_name} ${clientData.last_name}`;
    }

    // Afficher les objectifs si présents
    const goalElement = document.querySelector(".client-goal");
    if (goalElement) {
      goalElement.textContent = clientData.physical_constraint 
        ? `Goal: ${clientData.physical_constraint}` 
        : "Goal: Not specified";
    }

    // Mettre à jour le progrès si disponible
    const progressElement = document.querySelector(".client-progress");
    if (progressElement) {
      progressElement.textContent = "Progress: Track in progress";
    }

    console.log("✅ Profil client chargé:", clientData);

    // Charger le planning d'exercices du client
    await loadClientWorkout(clientId, token);
    
    // Charger le planning nutritionnel du client
    await loadClientNutrition(clientId, token);
    
    // Charger les messages avec le client
    await loadMessages(clientId, token);
    
    // Mettre à jour le nom dans le chat
    const chatClientName = document.getElementById("chatClientName");
    if (chatClientName) {
      chatClientName.textContent = `${clientData.first_name}`;
    }

  } catch (error) {
    console.error("❌ Erreur loadClientData:", error);
  }
}

// ============================================
// Calculer l'âge depuis la date de naissance
// ============================================
function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// ============================================
// Charger le planning d'exercices du client
// ============================================
async function loadClientWorkout(clientId, token) {
  const exerciseList = document.querySelector(".exercise-list");
  
  try {
    const response = await fetch(`${API_BASE_URL}/workout/user/${clientId}/workout`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      exerciseList.innerHTML = '<div class="empty-message">No exercise plan yet</div>';
      return;
    }

    const workouts = await response.json();

    if (workouts && workouts.length > 0) {
      exerciseList.innerHTML = "";

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
    } else {
      exerciseList.innerHTML = '<div class="empty-message">No exercise plan yet</div>';
    }
  } catch (error) {
    console.error("❌ Erreur loadClientWorkout:", error);
    exerciseList.innerHTML = '<div class="error-message">Error loading exercises</div>';
  }
}

// ============================================
// Charger le planning nutritionnel du client
// ============================================
async function loadClientNutrition(clientId, token) {
  const nutritionList = document.querySelector(".nutrition-list");
  
  try {
    const response = await fetch(`${API_BASE_URL}/nutrition/user/${clientId}/nutrition`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      nutritionList.innerHTML = '<div class="empty-message">No nutrition plan yet</div>';
      return;
    }

    const nutrition = await response.json();

    if (nutrition && nutrition.length > 0) {
      nutritionList.innerHTML = "";

      nutrition.forEach(meal => {
        const mealItem = document.createElement("div");
        mealItem.className = "meal-item";
        mealItem.innerHTML = `
          <span class="meal-time">${meal.category || "Meal"}</span>
          <span class="meal-details">${meal.description || "No description"}${meal.calories ? ` (${meal.calories} cal)` : ''}</span>
        `;
        nutritionList.appendChild(mealItem);
      });

      console.log("✅ Planning nutritionnel du client chargé:", nutrition);
    } else {
      nutritionList.innerHTML = '<div class="empty-message">No nutrition plan yet</div>';
    }
  } catch (error) {
    console.error("❌ Erreur loadClientNutrition:", error);
    nutritionList.innerHTML = '<div class="error-message">Error loading nutrition</div>';
  }
}

// ============================================
// Charger les messages avec le client
// ============================================
async function loadMessages(clientId, token) {
  const chatMessages = document.querySelector(".chat-messages");
  
  try {
    const response = await fetch(`${API_BASE_URL}/message/user/${clientId}/messages`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      chatMessages.innerHTML = '<div class="empty-message">No messages yet. Start the conversation!</div>';
      return;
    }

    const messages = await response.json();

    if (messages && messages.length > 0) {
      chatMessages.innerHTML = "";

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
    } else {
      chatMessages.innerHTML = '<div class="empty-message">No messages yet. Start the conversation!</div>';
    }
  } catch (error) {
    console.error("❌ Erreur loadMessages:", error);
    chatMessages.innerHTML = '<div class="error-message">Error loading messages</div>';
  }
}

// ============================================
// Activer le chat
// ============================================
function enableChat() {
  const chatInput = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input button");
  
  if (chatInput) chatInput.disabled = false;
  if (sendButton) sendButton.disabled = false;
}

// ============================================
// Initialiser le chat
// ============================================
function initializeChat(coachId, clientId, token) {
  const chatInput = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input button");

  if (!chatInput || !sendButton) return;

  // Retirer les anciens événements
  const newSendButton = sendButton.cloneNode(true);
  sendButton.parentNode.replaceChild(newSendButton, sendButton);

  newSendButton.addEventListener("click", async () => {
    await sendMessage(coachId, clientId, token);
  });

  // Retirer l'ancien événement keypress
  const newChatInput = chatInput.cloneNode(true);
  chatInput.parentNode.replaceChild(newChatInput, chatInput);

  newChatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      newSendButton.click();
    }
  });
}

// ============================================
// Envoyer un message
// ============================================
async function sendMessage(coachId, clientId, token) {
  const chatInput = document.querySelector(".chat-input input");
  const messageText = chatInput.value.trim();
  
  if (!messageText) return;

  try {
    // Envoyer le message
    const response = await fetch(`${API_BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: messageText,
        user_id: clientId,
        coach_id: coachId,
        is_from_user: false,
        is_read: false
      })
    });

    if (response.ok) {
      // Ajouter le message dans le chat
      const chatMessages = document.querySelector(".chat-messages");
      
      // Supprimer le message vide si présent
      const emptyMessage = chatMessages.querySelector(".empty-message");
      if (emptyMessage) {
        emptyMessage.remove();
      }
      
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
}

// ============================================
// Initialiser la recherche de clients
// ============================================
function initializeClientSearch() {
  const searchInput = document.getElementById("clientSearch");
  
  if (!searchInput) return;
  
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const clientCards = document.querySelectorAll(".client-card");
    
    clientCards.forEach(card => {
      const clientName = card.dataset.clientName;
      
      if (clientName.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
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
      alert("Fonctionnalité de modification du planning à implémenter");
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