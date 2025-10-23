// scripts/cart.js
// ==========================================================
// Gestion du panier d'achat
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ cart.js chargé");
  loadCart();
});

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const emptyCartState = document.getElementById('emptyCartState');
  const itemCount = document.getElementById('itemCount');

  if (!cartItemsContainer) {
    console.warn("⚠️ Conteneur #cartItemsContainer non trouvé");
    return;
  }

  if (cart.length === 0) {
    // Afficher l'état vide
    cartItemsContainer.style.display = 'none';
    if (emptyCartState) emptyCartState.style.display = 'block';
    if (itemCount) itemCount.textContent = '0';
    updateSummary(0, 0, 0, 0);
    return;
  }

  // Masquer l'état vide et afficher les produits
  cartItemsContainer.style.display = 'block';
  if (emptyCartState) emptyCartState.style.display = 'none';
  if (itemCount) itemCount.textContent = cart.length;

  // Afficher les produits
  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="item-image">
        ${item.picture ? 
          `<img src="${item.picture}" alt="${item.name}">` :
          `<img src="../public/images/ready/product-placeholder.jpg" alt="${item.name}" onerror="this.style.display='none'">`
        }
      </div>
      <div class="item-details">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>${item.description || 'Premium quality product'}</p>
          <span class="item-category">${item.category || 'Product'}</span>
        </div>
        <div class="item-actions">
          <div class="quantity-controls">
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
            <span class="qty-display" id="qty-${item.id}">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
          <div class="item-price-section">
            <span class="item-unit-price">$${item.price.toFixed(2)} each</span>
            <span class="item-total-price" id="price-${item.id}">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remove item">×</button>
        </div>
      </div>
    </div>
  `).join('');

  // Calculer et afficher le résumé
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.10;
  const total = subtotal + shipping + tax;

  updateSummary(subtotal, shipping, tax, total);
}

function updateSummary(subtotal, shipping, tax, total) {
  const subtotalAmount = document.getElementById('subtotalAmount');
  const shippingAmount = document.getElementById('shippingAmount');
  const taxAmount = document.getElementById('taxAmount');
  const totalAmount = document.getElementById('totalAmount');

  if (subtotalAmount) subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingAmount) shippingAmount.textContent = `$${shipping.toFixed(2)}`;
  if (taxAmount) taxAmount.textContent = `$${tax.toFixed(2)}`;
  if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
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
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart');
    loadCart();
  }
}

function applyPromoCode() {
  const promoInput = document.getElementById('promoCodeInput');
  const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';

  if (!promoCode) {
    alert('Please enter a promo code');
    return;
  }

  // Exemple de codes promo
  const validCodes = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
    'WELCOME': 0.15
  };

  if (validCodes[promoCode]) {
    const discount = validCodes[promoCode];
    alert(`Promo code applied! You saved ${(discount * 100)}%`);
    console.log(`✅ Promo code ${promoCode} applied with ${discount * 100}% discount`);
    // TODO: Appliquer la réduction dans le calcul du total
  } else {
    alert('Invalid promo code');
  }
}

async function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }

  if (!AuthManager.isAuthenticated()) {
    alert('You must be logged in to checkout');
    window.location.href = '../pages/connexion.html';
    return;
  }

  const user = AuthManager.getCurrentUser();
  
  // Préparer la commande
  const orderData = {
    user_id: user.id,
    items: cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1 + 9.99,
    status: 'pending'
  };

  console.log("📋 Order data:", orderData);

  try {
    // TODO: Créer l'endpoint API pour les commandes
    // const order = await ApiService.createOrder(orderData);
    
    alert('Order placed successfully! ✅\n\nOrder confirmation will be sent to your email.');
    localStorage.removeItem('cart');
    loadCart();
    
    // Rediriger vers la page de confirmation ou le dashboard
    setTimeout(() => {
      if (AuthManager.isCoach()) {
        window.location.href = '../pages/trainer.html';
      } else {
        window.location.href = '../pages/subscriber.html';
      }
    }, 2000);

  } catch (error) {
    console.error("❌ Error creating order:", error);
    alert('Error placing order. Please try again.');
  }
}