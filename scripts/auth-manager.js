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
    CookieManager.delete("token");
    UserSession.clearUser();
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
    const user = this.getCurrentUser();
    const isAuth = this.isAuthenticated();
    
    // Sélectionner tous les liens de navigation
    const navLinks = document.querySelectorAll('.top-mnu a, .main-menu__inner a');
    
    navLinks.forEach(link => {
      const text = link.getAttribute('data-text');
      
      if (!isAuth) {
        // Utilisateur non connecté - navigation publique
        if (text === 'Dashboard' || text === 'My Dashboard' || text === 'My Account' || text === 'Clients' || text === 'Log out') {
          link.style.display = 'none';
        }
      } else {
        // Utilisateur connecté
        if (text === 'Sign in') {
          link.setAttribute('data-text', 'Log out');
          link.textContent = 'Log out';
          link.href = '#';
          link.onclick = (e) => {
            e.preventDefault();
            this.logout();
          };
        }

        // Navigation spécifique aux coachs
        if (this.isCoach()) {
          if (text === 'My Dashboard') {
            link.style.display = 'none';
          }
          if (text === 'Dashboard' || text === 'Clients') {
            link.style.display = '';
          }
        } else {
          // Navigation spécifique aux utilisateurs
          if (text === 'Dashboard' || text === 'Clients') {
            link.style.display = 'none';
          }
          if (text === 'My Dashboard') {
            link.style.display = '';
          }
        }
      }
    });
  }
};

// Initialiser la navigation au chargement de chaque page
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.updateNavigation();
});

// Fonction globale de déconnexion (appelée depuis le HTML)
function logout() {
  AuthManager.logout();
}