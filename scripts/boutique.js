// scripts/boutique.js

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ boutique.js chargé");

  const shopGrid = document.querySelector('.shop-grid');

  if (!shopGrid) {
    console.warn("⚠️ Conteneur .shop-grid non trouvé");
    return;
  }

  try {
    const products = await ApiService.getAllProducts();
    console.log("📦 Produits chargés:", products);

    if (!products || products.length === 0) {
      shopGrid.innerHTML = '<p class="no-products">Aucun produit disponible pour le moment.</p>';
      return;
    }

    shopGrid.innerHTML = products.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          ${product.picture ? 
            `<img src="${product.picture}" alt="${product.name}">` :
            `<div class="placeholder-image">Pas d'image</div>`
          }
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description || 'No description'}</p>
          <div class="product-footer">
            <span class="product-price">${product.price}€</span>
            <button class="btn-primary add-to-cart" data-product-id="${product.id}">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-product-id');
        addToCart(productId, products);
      });
    });

  } catch (error) {
    console.error("❌ Erreur lors du chargement des produits:", error);
    shopGrid.innerHTML = '<p class="error-message">Erreur lors du chargement des produits.</p>';
  }
});

function addToCart(productId, products) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error("Produit non trouvé:", productId);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      picture: product.picture,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`${product.name} ajouté au panier !`);
  console.log("🛒 Panier mis à jour:", cart);
}