// Coach Navigation and Details Management

// Données des coachs (synchronisées avec list-coach.html)
const coachesData = {
  'elhadj-reziga': {
    id: 'elhadj-reziga',
    name: 'Elhadj Reziga',
    specialty: 'Personal Trainer Certifié',
    experience: '5 ans d\'expérience en musculation et cardio',
    rating: '4.7',
    location: 'Paris',
    bio: 'Spécialisée dans la remise en forme et la perte de poids. J\'aide mes clients à atteindre leurs objectifs avec des programmes personnalisés adaptés à leur niveau et leurs besoins. Passionné par le fitness depuis plus de 5 ans, j\'ai aidé plus de 100 personnes à transformer leur corps et leur vie.',
    image: '../public/images/ready/coach1.jpg',
    reviews: [
      {
        name: 'Sophie Martin',
        rating: 5,
        date: '15 Nov 2024',
        text: 'Excellente coach ! Très professionnelle et motivante. J\'ai perdu 10kg en 3 mois.'
      },
      {
        name: 'Thomas Dubois',
        rating: 4,
        date: '8 Nov 2024',
        text: 'Super accompagnement, programmes adaptés à mes besoins.'
      },
      {
        name: 'Marie Laurent',
        rating: 5,
        date: '2 Nov 2024',
        text: 'Très à l\'écoute et disponible. Les résultats sont au rendez-vous !'
      }
    ]
  },
  'sebastien-salgues': {
    id: 'sebastien-salgues',
    name: 'Sebastien Salgues',
    specialty: 'Coach Sportif Diplômé',
    experience: '8 ans dans le coaching fitness',
    rating: '4.9',
    location: 'Lyon',
    bio: 'Expert en préparation physique et musculation. Je vous accompagne pour développer votre force, votre endurance et sculpter votre physique. Mes programmes sont conçus pour maximiser vos résultats tout en respectant votre santé et vos capacités.',
    image: '../public/images/ready/coach2.jpg',
    reviews: [
      {
        name: 'Pierre Moreau',
        rating: 5,
        date: '20 Nov 2024',
        text: 'Sebastien m\'a aidé à prendre 8kg de muscle en 6 mois. Un vrai pro !'
      },
      {
        name: 'Julien Petit',
        rating: 5,
        date: '12 Nov 2024',
        text: 'Méthodes efficaces et suivi personnalisé. Parfait !'
      }
    ]
  },
  'sarah-reziga': {
    id: 'sarah-reziga',
    name: 'Sarah Reziga',
    specialty: 'Instructrice Yoga & Pilates',
    experience: '6 ans en yoga et bien-être',
    rating: '4.6',
    location: 'Marseille',
    bio: 'Passionnée de yoga et pilates, je vous guide vers un équilibre corps-esprit. Mes cours sont conçus pour améliorer votre souplesse, votre posture et votre bien-être général. Une approche douce mais efficace pour transformer votre corps.',
    image: '../public/images/ready/coach3.jpg',
    reviews: [
      {
        name: 'Claire Bernard',
        rating: 5,
        date: '18 Nov 2024',
        text: 'Les cours de yoga avec Sarah sont incroyables ! Très relaxants.'
      },
      {
        name: 'Emma Leroy',
        rating: 4,
        date: '10 Nov 2024',
        text: 'Bonne pédagogie, j\'ai beaucoup progressé en souplesse.'
      },
      {
        name: 'Lucie Fabre',
        rating: 5,
        date: '5 Nov 2024',
        text: 'Sarah est très à l\'écoute et crée une ambiance apaisante.'
      }
    ]
  },
  'alexandre-rousseau': {
    id: 'alexandre-rousseau',
    name: 'Alexandre Rousseau',
    specialty: 'Coach CrossFit Level 2',
    experience: '4 ans en CrossFit et entraînement fonctionnel',
    rating: '4.5',
    location: 'Toulouse',
    bio: 'Spécialisé en CrossFit et entraînement haute intensité. Si vous cherchez à repousser vos limites et développer une condition physique exceptionnelle, mes programmes de CrossFit sont faits pour vous. Dépassez-vous dans une ambiance motivante !',
    image: '../public/images/ready/coach4.jpg',
    reviews: [
      {
        name: 'Nicolas Garnier',
        rating: 5,
        date: '22 Nov 2024',
        text: 'Alex est un excellent coach ! Très technique et motivant.'
      },
      {
        name: 'Maxime Roux',
        rating: 4,
        date: '14 Nov 2024',
        text: 'Entraînements intenses mais très efficaces.'
      }
    ]
  },
  'camille-moreau': {
    id: 'camille-moreau',
    name: 'Camille Moreau',
    specialty: 'Nutritionniste Sportive',
    experience: '7 ans en nutrition et coaching',
    rating: '4.8',
    location: 'Bordeaux',
    bio: 'Alliant nutrition et sport, je vous accompagne pour une transformation complète. Mes programmes combinent des plans alimentaires équilibrés et des routines d\'entraînement efficaces pour obtenir des résultats durables et sains.',
    image: '../public/images/ready/coach5.jpg',
    reviews: [
      {
        name: 'Isabelle Fontaine',
        rating: 5,
        date: '25 Nov 2024',
        text: 'Approche holistique fantastique ! Résultats visibles rapidement.'
      },
      {
        name: 'Sandrine Blanc',
        rating: 5,
        date: '17 Nov 2024',
        text: 'Camille est très à l\'écoute et donne d\'excellents conseils.'
      },
      {
        name: 'Amélie Girard',
        rating: 4,
        date: '9 Nov 2024',
        text: 'Plans nutritionnels personnalisés et faciles à suivre.'
      }
    ]
  },
  'julien-leroy': {
    id: 'julien-leroy',
    name: 'Julien Leroy',
    specialty: 'Entraîneur Personal Running',
    experience: '3 ans en course à pied et endurance',
    rating: '4.4',
    location: 'Nantes',
    bio: 'Passionné de course à pied, je vous prépare pour vos défis running. Que vous souhaitiez courir votre premier 5km ou préparer un marathon, je vous accompagne avec des plans d\'entraînement progressifs et adaptés à votre niveau.',
    image: '../public/images/ready/coach6.jpg',
    reviews: [
      {
        name: 'David Mercier',
        rating: 4,
        date: '19 Nov 2024',
        text: 'Julien m\'a aidé à finir mon premier semi-marathon !'
      },
      {
        name: 'Laurent Bonnet',
        rating: 5,
        date: '11 Nov 2024',
        text: 'Excellent pour la préparation course. Très pédagogue.'
      }
    ]
  }
};

// Fonction pour créer un slug à partir d'un nom
function createSlug(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/[^\w\-]+/g, ''); // Enlever caractères spéciaux
}

// Fonction pour naviguer vers la page de détails d'un coach
function selectCoach(coachId) {
  window.location.href = `trainer.html?coach=${coachId}`;
}

// Fonction pour afficher les détails du coach sur la page trainer.html
function loadCoachDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const coachId = urlParams.get('coach');
  
  if (!coachId || !coachesData[coachId]) {
    console.error('Coach non trouvé');
    return;
  }
  
  const coach = coachesData[coachId];
  
  // Créer le HTML pour la page de détails
  const detailsHTML = `
    <div class="section-head">
      <h2>Détails du Coach</h2>
      <div class="section-head__right">
        <a href="list-coach.html" class="btn-secondary">
          <span data-text="Retour à la liste">Retour à la liste</span>
        </a>
      </div>
    </div>

    <div class="coach-details-hero">
      <div class="coach-details-image">
        <img src="${coach.image}" alt="${coach.name}" onerror="this.style.display='none'">
      </div>
      <div class="coach-details-content">
        <div class="coach-details-header">
          <h2>${coach.name}</h2>
          <p class="coach-specialty-detail">${coach.specialty}</p>
          <p class="coach-experience-detail">${coach.experience}</p>
          <div class="coach-rating-detail">⭐ ${coach.rating}/5</div>
          <div class="coach-location">📍 ${coach.location}</div>
        </div>
        <div class="coach-bio">
          ${coach.bio}
        </div>
        <div class="coach-action-buttons">
          <button class="btn-primary" onclick="bookCoach('${coach.id}')">
            Réserver ce Coach
          </button>
          <button class="btn-secondary">
            <span data-text="Envoyer un message">Envoyer un message</span>
          </button>
        </div>
      </div>
    </div>

    <div class="reviews-section">
      <h3>Avis des Clients (${coach.reviews.length})</h3>
      ${coach.reviews.map(review => `
        <div class="review-item-full">
          <div class="review-header">
            <span class="reviewer-name">${review.name}</span>
            <span class="review-date">${review.date}</span>
          </div>
          <div class="review-rating-full">${'⭐'.repeat(review.rating)}</div>
          <p class="review-text-full">${review.text}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  // Remplacer le contenu de la page
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    pageContent.innerHTML = detailsHTML;
  }
}

// Fonction pour réserver un coach
function bookCoach(coachId) {
  alert(`Vous avez sélectionné ${coachesData[coachId].name}. Cette fonctionnalité sera bientôt disponible !`);
  // Ici vous pourrez ajouter la logique de réservation (redirection, formulaire, etc.)
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Si nous sommes sur trainer.html avec un paramètre coach, charger les détails
  if (window.location.pathname.includes('trainer.html') && window.location.search.includes('coach=')) {
    loadCoachDetails();
  }
});