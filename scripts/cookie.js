// scripts/cookie.js
// ================================================
//  GESTION DES COOKIES ET DU LOCALSTORAGE FITNESSHUB
// ================================================

// --- UTILITAIRES ---
// Petite fonction pratique pour manipuler les cookies facilement
const CookieManager = {
  set: (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  get: (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, val] = cookie.split("=");
      if (key === name) return decodeURIComponent(val);
    }
    return null;
  },
  remove: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};

// --- GESTION UTILISATEUR ---
const UserSession = {
  saveUser: (userData) => {
    console.log(userData.first_name);
    localStorage.setItem("fitnesshub_user", JSON.stringify(userData));
    CookieManager.set("user_id", userData.id);
    CookieManager.set("user_role", userData.is_coach ? "coach" : "client");
  },
  getUser: () => {
    const data = localStorage.getItem("fitnesshub_user");
    return data ? JSON.parse(data) : null;
  },
  isLoggedIn: () => !!localStorage.getItem("fitnesshub_user"),
  logout: () => {
    localStorage.removeItem("fitnesshub_user");
    CookieManager.remove("token");      // ✅ AJOUTÉ : Supprimer le token lors de la déconnexion
    CookieManager.remove("user_id");
    CookieManager.remove("user_role");
  }
};

// --- GESTION DU PANIER ---
const CartManager = {
  getCart: () => {
    const cart = localStorage.getItem("fitnesshub_cart");
    return cart ? JSON.parse(cart) : [];
  },
  addToCart: (product) => {
    const cart = CartManager.getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("fitnesshub_cart", JSON.stringify(cart));
    console.log("✅ Produit ajouté au panier :", product.name);
  },
  removeFromCart: (productId) => {
    const cart = CartManager.getCart().filter(item => item.id !== productId);
    localStorage.setItem("fitnesshub_cart", JSON.stringify(cart));
  },
  clearCart: () => localStorage.removeItem("fitnesshub_cart")
};

// --- GESTION DES ABONNEMENTS ---
const SubscriptionManager = {
  savePlan: (plan) => {
    localStorage.setItem("fitnesshub_subscription", JSON.stringify(plan));
  },
  getPlan: () => {
    const data = localStorage.getItem("fitnesshub_subscription");
    return data ? JSON.parse(data) : null;
  },
  clearPlan: () => localStorage.removeItem("fitnesshub_subscription")
};

// --- GESTION GLOBALE ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("🍪 cookie.js chargé !");

  // Exemple : vérification de session utilisateur
  if (UserSession.isLoggedIn()) {
    const user = UserSession.getUser();
    console.log(`👋 Bonjour ${user.first_name || 'utilisateur'} !`);
    getInfo(user);
  } else {
    console.log("👤 Aucun utilisateur connecté.");
  }
});

/* 
  get the information from the backend dynamicly 
  first step : first name, last name, title and user image
*/
function getInfo(user) {
  if (!user) return;

  const firstname = document.getElementById("firstName");
  if (firstname) firstname.value = user.first_name;
  
  const lastname = document.getElementById("lastName");
  if (lastname) lastname.value = user.last_name;
  
  const titlename = document.getElementById("titlename");
  if (titlename) titlename.innerHTML = user.first_name + ' ' + user.last_name;
  
  const profileImage = document.getElementById("profileImage");
  if (profileImage && user.picture) profileImage.src = user.picture;
}
