// scripts/auth-manager.js
// ==========================================================
// Gestion centralisée de l'authentification et des redirections
// ==========================================================

const AuthManager = {
  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = CookieManager.get("token");
    const user = UserSession.getUser();
    return !!(token && user);
  },

  /**
   * Vérifie si l'utilisateur est un coach
   * @returns {boolean}
   */
  isCoach() {
    const user = UserSession.getUser();
    return user && user.is_coach === true;
  },

  /**
   * Protège une page (redirige vers connexion si non authentifié)
   * @param {string} requiredRole - 'coach', 'user', ou null pour tous
   */
  protectPage(requiredRole = null) {
    if (!this.isAuthenticated()) {
      alert("Vous devez être connecté pour accéder à cette page.");
      window.location.href = "../pages/connexion.html";
      return false;
    }

    if (requiredRole === 'coach' && !this.isCoach()) {
      alert("Cette page est réservée aux coachs.");
      window.location.href = "../pages/subscriber.html";
      return false;
    }

    if (requiredRole === 'user' && this.isCoach()) {
      alert("Cette page est réservée aux utilisateurs.");
      window.location.href = "../pages/trainer.html";
      return false;
    }

    return true;
  },

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    CookieManager.remove("token");
    UserSession.logout();
    window.location.href = "../pages/connexion.html";
  },

  /**
   * Récupère le token pour les requêtes API
   * @returns {string|null}
   */
  getToken() {
    return CookieManager.get("token");
  },

  /**
   * Récupère l'utilisateur courant
   * @returns {object|null}
   */
  getCurrentUser() {
    return UserSession.getUser();
  },

  /**
   * Redirige vers le dashboard approprié selon le rôle
   */
  redirectToDashboard() {
    if (this.isCoach()) {
      window.location.href = "../pages/trainer.html";
    } else {
      window.location.href = "../pages/subscriber.html";
    }
  },

  /**
   * Redirige vers la page de profil appropriée selon le rôle
   */
  redirectToAccount() {
    if (this.isCoach()) {
      window.location.href = "../pages/coach_account.html";
    } else {
      window.location.href = "../pages/user_account.html";
    }
  },

  /**
   * Met à jour la navigation selon l'état de connexion
   */
  updateNavigation() {
    const isAuth = this.isAuthenticated();
    const isCoach = this.isCoach();

    const isSubscriberPage = window.location.pathname.includes('subscriber.html');
    const isTrainerPage = window.location.pathname.includes('trainer.html');
    const isCoachAccountPage = window.location.pathname.includes('coach_account.html');
    const isUserAccountPage = window.location.pathname.includes('user_account.html');
    const isCartPage = window.location.pathname.includes('cart.html');
    const isBoutiquePage = window.location.pathname.includes('boutique.html');
    const isCoachPage = window.location.pathname.includes('coach.html');
    const isAbonnementPage = window.location.pathname.includes('abonnement.html');
    const isLoginPage = window.location.pathname.includes('login.html');
    
    const isRoot = !window.location.pathname.includes('/pages/');
    const navContainers = document.querySelectorAll('.top-mnu ul, .main-menu__inner ul');
    const dashboardLinks = [];
    const accountLinks = [];

    // ✅ AJOUTÉ : Gérer l'affichage du lien Coaches pour les coachs
    ensureCoachesLinkForCoach();
    
    // ✅ AJOUTÉ : Gérer l'affichage du lien My Cart
    ensureCartLink();
    
    // ✅ NOUVEAU : Gérer l'affichage du lien Subscriber pour les non-connectés
    ensureSubscriberLink();

    navContainers.forEach((ul) => {
      if (!isAuth) {
        removeDashboardLink(ul);
        removeAccountLink(ul);
        return;
      }

      if (isSubscriberPage || isTrainerPage) {
        removeDashboardLink(ul);
      } else {
        const dashLink = ensureDashboardLink(ul);
        if (dashLink) dashboardLinks.push(dashLink);
      }

      if (isCoachAccountPage || isUserAccountPage) {
        removeAccountLink(ul);
      } else {
        const accountLink = ensureAccountLink(ul);
        if (accountLink) accountLinks.push(accountLink);
      }
    });

    dashboardLinks.forEach((link) => {
      const item = link.closest('li') || link;
      if (!isAuth) {
        if (item) item.style.display = 'none';
        link.removeAttribute('href');
        link.onclick = null;
        return;
      }
      if (item) item.style.display = '';
      link.href = isCoach ? '/pages/trainer.html' : '/pages/subscriber.html';
      link.onclick = null;
    });

    accountLinks.forEach((link) => {
      const item = link.closest('li') || link;
      if (!isAuth) {
        if (item) item.style.display = 'none';
        link.removeAttribute('href');
        link.onclick = null;
        return;
      }
      if (item) item.style.display = '';
      link.href = isCoach ? '/pages/coach_account.html' : '/pages/user_account.html';
      link.onclick = null;
    });

    const navLinks = document.querySelectorAll('.top-mnu a, .main-menu__inner a');
    navLinks.forEach(link => {
      const dataText = (link.getAttribute('data-text') || '').trim();
      const text = (link.textContent || '').trim();
      const href = link.getAttribute('href') || '';
      const li = link.closest('li');

      const setSignIn = () => {
        link.setAttribute('data-text', 'Sign in');
        link.textContent = 'Sign in';
        link.href = isRoot ? 'pages/connexion.html' : 'connexion.html';
        link.onclick = null;
        if (li) li.style.display = '';
      };

      const setLogOut = () => {
        link.setAttribute('data-text', 'Log out');
        link.textContent = 'Log out';
        link.href = '#';
        link.onclick = (e) => { e.preventDefault(); logout(); };
        if (li) li.style.display = '';
      };

      if (!isAuth) {
        if (/Dashboard|My Dashboard|My Account|Account|Log out/i.test(dataText || text)) {
          if (li) li.style.display = 'none';
        }
        if (/sign in|connexion|login/i.test(dataText || text || href)) {
          setSignIn();
        }
      } else {
        if (/sign in|connexion|login/i.test(dataText || text || href)) {
          setLogOut();
        }

        // ✅ Cacher les boutons selon la page actuelle
        if (isCartPage && /My Cart|Cart/i.test(dataText || text)) {
          if (li) li.style.display = 'none';
        }
        
        if (isBoutiquePage && /Shop/i.test(dataText || text)) {
          if (li) li.style.display = 'none';
        }
        
        if (isCoachPage && /Coach|Coaches/i.test(dataText || text)) {
          if (li) li.style.display = 'none';
        }
        
        if (isAbonnementPage && /Plans|Subscription/i.test(dataText || text)) {
          if (li) li.style.display = 'none';
        }
      }
    });
  },
};

// Initialiser la navigation au chargement de chaque page
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.updateNavigation();
  setTimeout(() => {
    AuthManager.updateNavigation();
  }, 100);
});

// Mettre à jour la navigation quand la page devient visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    AuthManager.updateNavigation();
  }
});

// Fonction globale de déconnexion
function logout() {
  AuthManager.logout();
}

function ensureDashboardLink(ul) {
  if (!ul) return null;

  let link = ul.querySelector('a[data-nav="my-dashboard"]');
  if (!link) {
    link = ul.querySelector('a[data-text="My Dashboard"]');
  }

  if (!link) {
    const li = document.createElement('li');
    link = document.createElement('a');
    link.textContent = 'My Dashboard';
    link.setAttribute('data-text', 'My Dashboard');
    link.dataset.nav = 'my-dashboard';
    link.href = '#';
    li.appendChild(link);
    
    const accountAnchor = ul.querySelector('a[data-nav="my-account"]');
    const accountLi = accountAnchor ? accountAnchor.closest('li') : null;
    const logoutAnchor = ul.querySelector('a[data-text="Log out"]');
    const logoutLi = logoutAnchor ? logoutAnchor.closest('li') : null;
    
    if (accountLi) {
      ul.insertBefore(li, accountLi);
    } else if (logoutLi) {
      ul.insertBefore(li, logoutLi);
    } else {
      ul.appendChild(li);
    }
  } else {
    link.dataset.nav = 'my-dashboard';
    link.textContent = 'My Dashboard';
    link.setAttribute('data-text', 'My Dashboard');
    
    const accountAnchor = ul.querySelector('a[data-nav="my-account"]');
    const accountLi = accountAnchor ? accountAnchor.closest('li') : null;
    const logoutAnchor = ul.querySelector('a[data-text="Log out"]');
    const logoutLi = logoutAnchor ? logoutAnchor.closest('li') : null;
    const dashboardLi = link.closest('li');
    
    if (accountLi && dashboardLi && dashboardLi !== accountLi.previousElementSibling) {
      ul.insertBefore(dashboardLi, accountLi);
    } else if (logoutLi && dashboardLi && dashboardLi !== logoutLi.previousElementSibling) {
      ul.insertBefore(dashboardLi, logoutLi);
    }
  }

  return link;
}

function removeDashboardLink(ul) {
  if (!ul) return;
  const existing = ul.querySelector('a[data-nav="my-dashboard"]');
  if (existing) {
    const li = existing.closest('li');
    if (li) {
      li.remove();
    } else {
      existing.remove();
    }
  }
}

function ensureAccountLink(ul) {
  if (!ul) return null;

  let link = ul.querySelector('a[data-nav="my-account"]');
  if (!link) {
    link = ul.querySelector('a[data-text="My Account"], a[data-text="Account"]');
  }

  if (!link) {
    const li = document.createElement('li');
    link = document.createElement('a');
    link.textContent = 'My Account';
    link.setAttribute('data-text', 'My Account');
    link.dataset.nav = 'my-account';
    link.href = '#';
    li.appendChild(link);
    
    const logoutAnchor = ul.querySelector('a[data-text="Log out"]');
    const logoutLi = logoutAnchor ? logoutAnchor.closest('li') : null;
    
    if (logoutLi) {
      ul.insertBefore(li, logoutLi);
    } else {
      ul.appendChild(li);
    }
  } else {
    link.dataset.nav = 'my-account';
    link.textContent = 'My Account';
    link.setAttribute('data-text', 'My Account');
    
    const logoutAnchor = ul.querySelector('a[data-text="Log out"]');
    const logoutLi = logoutAnchor ? logoutAnchor.closest('li') : null;
    const accountLi = link.closest('li');
    
    if (logoutLi && accountLi && accountLi !== logoutLi.previousElementSibling) {
      ul.insertBefore(accountLi, logoutLi);
    }
  }

  return link;
}

function removeAccountLink(ul) {
  if (!ul) return;
  const existing = ul.querySelector('a[data-nav="my-account"]');
  if (existing) {
    const li = existing.closest('li');
    if (li) li.remove();
    else existing.remove();
  }
}

function removeMyClientsLink(ul) {
  if (!ul) return;
  const existing = ul.querySelector('li.nav-my-clients');
  if (existing) {
    existing.remove();
  }
}

function ensureCoachesLinkForCoach() {
  const isCoach = AuthManager.isCoach();
  const isCoachPage = window.location.pathname.includes('coach.html');
  const shouldDisplay = isCoach && !isCoachPage;
  const isRoot = !window.location.pathname.includes('/pages/');
  const targetHref = isRoot ? 'pages/coach.html' : 'coach.html';
  
  const navSelectors = ['.top-mnu ul', '.main-menu__inner ul'];
  
  navSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((ul) => {
      let coachLink = ul.querySelector('a[data-text="Coaches"]');
      let coachLi = coachLink ? coachLink.closest('li') : null;
      
      if (shouldDisplay) {
        if (coachLi) {
          coachLi.style.display = '';
          coachLink.href = targetHref;
        }
      } else if (isCoach && isCoachPage) {
        if (coachLi) {
          coachLi.style.display = 'none';
        }
      }
    });
  });
}

function ensureCartLink() {
  const isCartPage = window.location.pathname.includes('cart.html');
  const isRoot = !window.location.pathname.includes('/pages/');
  const targetHref = isRoot ? 'pages/cart.html' : 'cart.html';
  
  const navSelectors = ['.top-mnu ul', '.main-menu__inner ul'];
  
  navSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((ul) => {
      let cartLink = ul.querySelector('a[data-text="My Cart"]');
      let cartLi = cartLink ? cartLink.closest('li') : null;
      
      if (!cartLink) {
        cartLi = document.createElement('li');
        cartLink = document.createElement('a');
        cartLink.textContent = 'My Cart';
        cartLink.setAttribute('data-text', 'My Cart');
        cartLink.href = targetHref;
        cartLi.appendChild(cartLink);
        
        const shopLink = ul.querySelector('a[data-text="Shop"]');
        const shopLi = shopLink ? shopLink.closest('li') : null;
        const dashboardLink = ul.querySelector('a[data-text="My Dashboard"]');
        const dashboardLi = dashboardLink ? dashboardLink.closest('li') : null;
        
        if (shopLi && shopLi.nextElementSibling) {
          ul.insertBefore(cartLi, shopLi.nextElementSibling);
        } else if (dashboardLi) {
          ul.insertBefore(cartLi, dashboardLi);
        } else {
          ul.appendChild(cartLi);
        }
      } else {
        cartLink.href = targetHref;
      }
      
      if (isCartPage && cartLi) {
        cartLi.style.display = 'none';
      } else if (cartLi) {
        cartLi.style.display = '';
      }
    });
  });
}

// ✅ NOUVEAU : Fonction pour gérer le lien Subscriber pour les non-connectés
function ensureSubscriberLink() {
  const isAuth = AuthManager.isAuthenticated();
  const isLoginPage = window.location.pathname.includes('login.html');
  const shouldDisplay = !isAuth && !isLoginPage;
  const isRoot = !window.location.pathname.includes('/pages/');
  const targetHref = isRoot ? 'pages/login.html' : 'login.html';
  
  const navSelectors = ['.top-mnu ul', '.main-menu__inner ul'];
  
  navSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((ul) => {
      let subscriberLink = ul.querySelector('a[data-text="Subscriber"]');
      let subscriberLi = subscriberLink ? subscriberLink.closest('li') : null;
      
      if (shouldDisplay) {
        if (!subscriberLink) {
          // Créer le lien s'il n'existe pas
          subscriberLi = document.createElement('li');
          subscriberLink = document.createElement('a');
          subscriberLink.textContent = 'Subscriber';
          subscriberLink.setAttribute('data-text', 'Subscriber');
          subscriberLink.href = targetHref;
          subscriberLi.appendChild(subscriberLink);
          
          // Insérer avant "Sign in"
          const signInLink = ul.querySelector('a[data-text="Sign in"]');
          const signInLi = signInLink ? signInLink.closest('li') : null;
          
          if (signInLi) {
            ul.insertBefore(subscriberLi, signInLi);
          } else {
            ul.appendChild(subscriberLi);
          }
        } else {
          // Mettre à jour le href et afficher
          subscriberLink.href = targetHref;
          subscriberLi.style.display = '';
        }
      } else {
        // Cacher ou supprimer le lien si connecté ou sur login.html
        if (subscriberLi) {
          subscriberLi.style.display = 'none';
        }
      }
    });
  });
}