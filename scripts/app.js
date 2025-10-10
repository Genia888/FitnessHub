const burgerMenu = document.querySelector('.mnu-button__menu')
if (burgerMenu) {
  const menuBackground = document.querySelector('.main-menu-background')
  const mainMenu = document.querySelector('.main-menu')

  burgerMenu.addEventListener('click', menu => {
    burgerMenu.classList.toggle('active')

    if (burgerMenu.classList.contains('active')) {
      lenis.stop()
      menuBackground.classList.add('active')
      mainMenu.classList.add('active')
    } else {
      lenis.start()
      menuBackground.classList.remove('active')
      mainMenu.classList.remove('active')
    }
  })
}

gsap.utils.toArray('[data-parallax-wrapper]').forEach(container => {
  const img = container.querySelector('[data-parallax-target]')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scrub: true
    }
  })

  tl.fromTo(img, {
    yPercent: -15,
    ease: 'none'
  }, {
    yPercent: 15,
    ease: 'none'
  })
})

const accordionCol = document.querySelectorAll('.accordion__col')
accordionCol.forEach(col => {
  col.addEventListener('mouseenter', () => {
    accordionCol.forEach(c => {
      c.classList.remove('active')
      col.classList.add('active')
    })
  })
})

// Highlights accordion functionality
const highlightsAccordionCol = document.querySelectorAll('.highlights-accordion__col')
highlightsAccordionCol.forEach(col => {
  col.addEventListener('mouseenter', () => {
    highlightsAccordionCol.forEach(c => {
      c.classList.remove('active')
      col.classList.add('active')
    })
  })
})

const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

function globalGradient() {
  const interBubble = document.querySelector('.interactive')

  let curX = 0,
      curY = 0,
      tgX = 0,
      tgY = 0

  function move() {
    curX += (tgX - curX) / 20
    curY += (tgY - curY) / 20

    gsap.set(interBubble, {
      x: Math.round(curX),
      y: Math.round(curY)
    })

    requestAnimationFrame(() => {
      move()
    })
  }

  window.addEventListener('mousemove', (event) => {
    tgX = event.clientX
    tgY = event.clientY
  })

  move()
}
globalGradient()

document.addEventListener('DOMContentLoaded', function () {
  const subscriptionAccordion = document.getElementById('subscription-accordion-link');
  if (subscriptionAccordion) {
    subscriptionAccordion.style.cursor = 'pointer';
    subscriptionAccordion.addEventListener('click', function () {
      window.location.href = 'pages/abonnement.html';
    });
  }

  const coachAccordion = document.getElementById('coach-accordion-link');
  if (coachAccordion) {
    coachAccordion.style.cursor = 'pointer';
    coachAccordion.addEventListener('click', function () {
      window.location.href = 'pages/coach.html';
    });
  }

  const shopAccordion = document.getElementById('shop-accordion-link');
  if (shopAccordion) {
    shopAccordion.style.cursor = 'pointer';
    shopAccordion.addEventListener('click', function () {
      window.location.href = 'pages/boutique.html';
    });
  }
});