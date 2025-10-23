// scripts/api-service.js
// ==========================================================
// Service centralisé pour tous les appels API
// ==========================================================

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";

const ApiService = {
  async request(endpoint, options = {}) {
    const token = AuthManager.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },

  // ==================== AUTH ====================
  
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // ==================== USERS ====================

  async getAllUsers() {
    return this.request('/user');
  },

  async getUserById(userId) {
    return this.request(`/user/${userId}`);
  },

  async updateUser(userId, updateData) {
    return this.request(`/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async getAllCoaches() {
    return this.request('/user?is_coach=true');
  },

  async getCoachClients(coachId) {
    return this.request(`/user/coach/${coachId}/users`);
  },

  // ==================== SUBSCRIPTIONS ====================

  async getAllSubscriptions() {
    return this.request('/subscription');
  },

  async createSubscription(subscriptionData) {
    return this.request('/subscription', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    });
  },

  async getUserSubscriptions(userId) {
    return this.request(`/subscription/user/${userId}`);
  },

  // ==================== PRODUCTS ====================

  async getAllProducts() {
    return this.request('/product_shop');
  },

  async getProductById(productId) {
    return this.request(`/product_shop/${productId}`);
  },

  // ==================== WORKOUT SCHEDULE ====================

  async getUserWorkoutSchedule(userId) {
    return this.request(`/workout/user/${userId}`);
  },

  async createWorkoutSchedule(workoutData) {
    return this.request('/workout', {
      method: 'POST',
      body: JSON.stringify(workoutData)
    });
  },

  async updateWorkoutSchedule(workoutId, updateData) {
    return this.request(`/workout/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async deleteWorkoutSchedule(workoutId) {
    return this.request(`/workout/${workoutId}`, {
      method: 'DELETE'
    });
  },

  // ==================== NUTRITION SCHEDULE ====================

  async getUserNutritionSchedule(userId) {
    return this.request(`/nutrition/user/${userId}`);
  },

  async createNutritionSchedule(nutritionData) {
    return this.request('/nutrition', {
      method: 'POST',
      body: JSON.stringify(nutritionData)
    });
  },

  async updateNutritionSchedule(nutritionId, updateData) {
    return this.request(`/nutrition/${nutritionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async deleteNutritionSchedule(nutritionId) {
    return this.request(`/nutrition/${nutritionId}`, {
      method: 'DELETE'
    });
  },

  // ==================== MESSAGES ====================

  async getMessages(senderId, receiverId) {
    return this.request(`/message/conversation/${senderId}/${receiverId}`);
  },

  async sendMessage(messageData) {
    return this.request('/message', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  },

  // ==================== REVIEWS ====================

  async getCoachReviews(coachId) {
    return this.request(`/review/user/${coachId}`);
  },

  async createReview(reviewData) {
    return this.request('/review', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }
};