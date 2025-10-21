// scripts/cart.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ cart.js chargé");
  loadCart();
});

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.querySelector('.cart-items');
  const totalContainer = document.querySelector('.cart-total');

  if (!cartContainer) {
    console.warn("⚠️ Conteneur .cart-items non trouvé");
    return;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    if (totalContainer) {
      totalContainer.innerHTML = '<p class="total">Total: 0€</p>';
    }
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <div class="cart-item-image">
        ${item.picture ? 
          `<img src="${item.picture}" alt="${item.name}">` :
          `<div class="placeholder-image">📦</div>`
        }
      </div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cart-item-price">${item.price}€ x ${item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <button class="btn-quantity" onclick="updateQuantity(${index}, -1)">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="btn-quantity" onclick="updateQuantity(${index}, 1)">+</button>
        <button class="btn-remove" onclick="removeFromCart(${index})">🗑️</button>
      </div>
    </div>
  `).join('');

  if (totalContainer) {
    totalContainer.innerHTML = `
      <div class="total-section">
        <p class="total">Total: ${total.toFixed(2)}€</p>
        <button class="btn-primary" onclick="checkout()">Passer la commande</button>
        <button class="btn-secondary" onclick="clearCart()">Vider le panier</button>
      </div>
    `;
  }
}

function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart[index]) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
  }
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  if (confirm('Voulez-vous vraiment vider votre panier ?')) {
    localStorage.removeItem('cart');
    loadCart();
  }
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert('Votre panier est vide');
    return;
  }

  if (!AuthManager.isAuthenticated()) {
    alert('Vous devez être connecté pour passer commande');
    window.location.href = '../pages/connexion.html';
    return;
  }

  alert('Fonctionnalité de commande à venir !');
  console.log("📋 Commande:", cart);
}