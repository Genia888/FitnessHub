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
    const isSubscriberPage = window.location.pathname.includes('subscriber.html');
    const navContainers = document.querySelectorAll('.top-mnu ul, .main-menu__inner ul');
    const dashboardLinks = [];
    const accountLinks = [];

    navContainers.forEach((ul) => {
      if (!isAuth) {
        removeDashboardLink(ul);
        removeAccountLink(ul);
        return;
      }

      if (isSubscriberPage) {
        removeDashboardLink(ul);
      } else {
        const dashLink = ensureDashboardLink(ul);
        if (dashLink) dashboardLinks.push(dashLink);
      }

      if (!this.isCoach()) {
        const accountLink = ensureAccountLink(ul);
        if (accountLink) accountLinks.push(accountLink);
      } else {
        removeAccountLink(ul);
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
      link.href = '/pages/subscriber.html';
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
      link.href = '/pages/user_account.html';
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
        const isRoot = !window.location.pathname.includes('/pages/');
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
        if (/Dashboard|My Dashboard|My Account|Account|Clients|Log out/i.test(dataText || text)) {
          if (li) li.style.display = 'none';
        }
        if (/sign in|connexion|login/i.test(dataText || text || href)) {
          setSignIn();
        }
      } else {
        if (/sign in|connexion|login/i.test(dataText || text || href)) {
          setLogOut();
        }

        if (this.isCoach()) {
          if (/My Dashboard|My Account/i.test(dataText || text)) {
            if (li) li.style.display = 'none';
          }
        } else {
          const label = (dataText || text || '').trim();
          if (['Dashboard', 'Clients'].includes(label)) {
            if (li) li.style.display = 'none';
          }
          if (label === 'My Dashboard') {
            link.href = '/pages/subscriber.html';
            link.onclick = null;
            if (li) li.style.display = '';
          }
          if (/My Account/i.test(label)) {
            link.href = '/pages/user_account.html';
            link.onclick = null;
            if (li) li.style.display = '';
          }
        }
      }
    });
  }
};

// Initialiser la navigation au chargement de chaque page
document.addEventListener('DOMContentLoaded', () => {
  // Première tentative immédiate
  AuthManager.updateNavigation();
  
  // Deuxième tentative après un court délai pour s'assurer que tous les éléments sont chargés
  setTimeout(() => {
    AuthManager.updateNavigation();
  }, 100);
});

// Aussi mettre à jour la navigation quand la page devient visible (changement d'onglet)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    AuthManager.updateNavigation();
  }
});

// Fonction globale de déconnexion (appelée depuis le HTML)
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
    ul.appendChild(li);
  } else {
    link.dataset.nav = 'my-dashboard';
    link.textContent = 'My Dashboard';
    link.setAttribute('data-text', 'My Dashboard');
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
    const li = document.createElement('li');
    link = document.createElement('a');
    link.dataset.nav = 'my-account';
    link.textContent = 'My Account';
    link.setAttribute('data-text', 'My Account');
    li.appendChild(link);
    ul.appendChild(li);
  } else {
    link.dataset.nav = 'my-account';
    link.textContent = 'My Account';
    link.setAttribute('data-text', 'My Account');
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