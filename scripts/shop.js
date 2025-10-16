// scripts for the shop page

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ shop.js chargé !");

  const shopGrid = document.querySelector(".shop-grid");
  if (!shopGrid) {
    console.error("⚠️ Aucun conteneur '.shop-grid' trouvé dans la page !");
    return;
  }

  try {
    console.log("➡️ Récupération des produits depuis le back...");
    const response = await fetch("http://127.0.0.1:5000/api/v1/product_shop");

    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }

    const products = await response.json();
    console.log("📦 Produits reçus :", products);

    shopGrid.innerHTML = "";

    products.forEach(product => {
      // On affiche seulement les produits actifs et en stock
      if (!product.is_active || !product.is_in_stock) return;

      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <div class="product-image">
          <img src="${product.picture}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="description">${product.description || ''}</p>
          <p class="price">${product.price ? product.price + " €" : "Prix indisponible"}</p>
          <button class="btn-primary">Ajouter au panier</button>
        </div>
      `;

      shopGrid.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Erreur :", error);
    shopGrid.innerHTML = `<p style="color:red;">Impossible de charger les produits 😢</p>`;
  }
});
