// Coach Dashboard Script - Intégré avec ton architecture existante
const API_BASE_URL = 'http://localhost:5000'; // À adapter selon ton environnement

// Fonction principale pour charger les coachs
async function loadCoaches() {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const emptyState = document.getElementById('emptyState');
  const coachesGrid = document.getElementById('coachesGrid');

  // Afficher le loading
  loadingState.style.display = 'block';
  errorState.style.display = 'none';
  emptyState.style.display = 'none';
  coachesGrid.innerHTML = '';

  try {
    // Récupération des coachs depuis ton API
    const response = await fetch(`${API_BASE_URL}/api/v1/users/coach/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const coaches = await response.json();

    // Cacher le loading
    loadingState.style.display = 'none';

    // Vérifier si des coachs existent
    if (!coaches || coaches.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    // Récupérer les reviews pour chaque coach (en parallèle)
    const coachesWithReviews = await Promise.all(
      coaches.map(async (coach) => {
        try {
          const reviewsResponse = await fetch(`${API_BASE_URL}/api/v1/reviews/coach/${coach.id}/reviews`);
          if (reviewsResponse.ok) {
            const reviews = await reviewsResponse.json();
            return { ...coach, reviews };
          }
        } catch (error) {
          console.warn(`Failed to fetch reviews for coach ${coach.id}:`, error);
        }
        return { ...coach, reviews: [] };
      })
    );

    // Rendre les cartes
    renderCoaches(coachesWithReviews);

    // Déclencher les animations
    animateCards();

  } catch (error) {
    console.error('Error loading coaches:', error);
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }
}

// Fonction pour rendre les cartes de coachs
function renderCoaches(coaches) {
  const coachesGrid = document.getElementById('coachesGrid');
  
  coaches.forEach((coach, index) => {
    const card = createCoachCard(coach, index);
    coachesGrid.appendChild(card);
  });
}

// Fonction pour créer une carte de coach
function createCoachCard(coach, index) {
  const card = document.createElement('div');
  card.className = 'coach-dashboard-card';
  card.setAttribute('data-index', index);
  
  // Calculer la note moyenne
  const avgRating = calculateAverageRating(coach.reviews);
  
  // Créer le HTML de la carte
  card.innerHTML = `
    <div class="coach-card-image">
      <img src="${coach.picture || '../public/images/ready/coach1.jpg'}" 
           alt="${coach.first_name} ${coach.last_name}"
           onerror="this.src='../public/images/ready/coach1.jpg'">
      ${avgRating > 0 ? `
        <div class="coach-rating-badge">
          <span>⭐</span>
          <span>${avgRating.toFixed(1)}/5</span>
        </div>
      ` : ''}
    </div>
    
    <div class="coach-card-info">
      <div class="coach-card-header">
        <h3>${coach.first_name} ${coach.last_name}</h3>
        <p class="coach-specialty">${coach.coach_certif || 'Certified Coach'}</p>
        <p class="coach-experience">${formatExperience(coach.coach_experience)}</p>
      </div>
      
      ${coach.coach_description || coach.city ? `
        <div class="coach-card-details">
          ${coach.coach_description ? `
            <div class="coach-detail-item">
              <span class="icon">📋</span>
              <span>${truncateText(coach.coach_description, 100)}</span>
            </div>
          ` : ''}
          
          ${coach.city ? `
            <div class="coach-detail-item">
              <span class="icon">📍</span>
              <span>${coach.city}</span>
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      ${coach.reviews && coach.reviews.length > 0 ? `
        <div class="coach-reviews-preview">
          <div class="reviews-header">
            <h4>Recent Reviews</h4>
            <span class="reviews-count">(${coach.reviews.length})</span>
          </div>
          ${renderReviews(coach.reviews.slice(0, 2))}
        </div>
      ` : ''}
      
      <div class="coach-card-action">
        <button class="btn-select-coach" onclick="selectCoach('${coach.id}', '${coach.first_name} ${coach.last_name}')">
          Select This Coach
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Fonction pour rendre les reviews
function renderReviews(reviews) {
  return reviews.map(review => `
    <div class="review-item">
      <div class="review-rating">
        ${renderStars(review.rating)}
      </div>
      <p class="review-text">${escapeHtml(review.text)}</p>
    </div>
  `).join('');
}

// Fonction pour rendre les étoiles
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  let stars = '';
  
  for (let i = 0; i < fullStars && i < 5; i++) {
    stars += '⭐';
  }
  
  return stars;
}

// Fonction pour calculer la moyenne des notes
function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return sum / reviews.length;
}

// Fonction pour formater l'expérience
function formatExperience(experience) {
  if (!experience) return 'Experience not specified';
  
  // Si c'est déjà court, retourner tel quel
  if (experience.length < 50) return experience;
  
  // Extraire les années si mentionnées
  const yearsMatch = experience.match(/(\d+)\s*(?:year|yr|an)/i);
  if (yearsMatch) {
    return `${yearsMatch[1]} years of experience`;
  }
  
  return truncateText(experience, 50);
}

// Fonction pour tronquer le texte
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
}

// Fonction pour échapper le HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fonction pour animer les cartes
function animateCards() {
  const cards = document.querySelectorAll('.coach-dashboard-card');
  
  // Animation d'apparition progressive
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 100);
  });
  
  // Animations GSAP si disponible (comme dans ton app.js)
  if (typeof gsap !== 'undefined') {
    cards.forEach(card => {
      const img = card.querySelector('.coach-card-image img');
      
      // Animation au hover
      card.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.1,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
  }
}

// Fonction pour gérer la sélection d'un coach
function selectCoach(coachId, coachName) {
  console.log('Selected coach:', coachId, coachName);
  
  // Stocker le coach sélectionné (peut être utilisé pour la suite)
  sessionStorage.setItem('selectedCoachId', coachId);
  sessionStorage.setItem('selectedCoachName', coachName);
  
  // Options possibles :
  // 1. Redirection vers une page de détails
  // window.location.href = `coach-detail.html?id=${coachId}`;
  
  // 2. Redirection vers une page de réservation
  // window.location.href = `booking.html?coach=${coachId}`;
  
  // 3. Pour l'instant : confirmation
  alert(`Coach selected: ${coachName}\nID: ${coachId}\n\nYou can now implement the booking flow.`);
  
  // Exemple : ouvrir un formulaire de contact
  // openBookingModal(coachId, coachName);
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  loadCoaches();
});

// Fonction pour rafraîchir la liste (utilisable si besoin)
function refreshCoaches() {
  loadCoaches();
}