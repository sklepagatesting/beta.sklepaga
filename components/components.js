// === CAROUSEL SETUP ===
const carousel = document.getElementById('carouselCards');
const prevArrow = document.getElementById('prevArrow');
const nextArrow = document.getElementById('nextArrow');
const gap = 24;

// Get all direct children (cards)
const getCards = () => Array.from(carousel.querySelectorAll(':scope > *'));

// Center a card by index
function scrollToCard(index) {
  const cards = getCards();
  if (index < 0 || index >= cards.length) return;

  const card = cards[index];
  const cardLeft = card.offsetLeft;
  const cardWidth = card.offsetWidth;
  const containerCenter = carousel.clientWidth / 2;
  const scrollLeft = cardLeft - containerCenter + cardWidth / 2;

  carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });

  waitForScrollEnd(updateArrowVisibility);
}

function waitForScrollEnd(callback) {
  let lastScrollLeft = carousel.scrollLeft;
  let frame;

  function checkScroll() {
    const currentScrollLeft = carousel.scrollLeft;
    if (Math.abs(currentScrollLeft - lastScrollLeft) < 1) {
      cancelAnimationFrame(frame);
      callback();
    } else {
      lastScrollLeft = currentScrollLeft;
      frame = requestAnimationFrame(checkScroll);
    }
  }

  frame = requestAnimationFrame(checkScroll);
}

// Get index of centered card
function getCenteredCardIndex() {
  const cards = getCards();
  const scrollCenter = carousel.scrollLeft + carousel.clientWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(scrollCenter - cardCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

// Arrow button click events
nextArrow.addEventListener('click', () => {
  const currentIndex = getCenteredCardIndex();
  scrollToCard(currentIndex + 1);
});

prevArrow.addEventListener('click', () => {
  const currentIndex = getCenteredCardIndex();
  scrollToCard(currentIndex - 1);
});

// Enable/disable arrows
function updateArrowVisibility() {
  const scrollLeft = carousel.scrollLeft;
  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
  const buffer = 2;

  prevArrow.disabled = scrollLeft <= buffer;
  nextArrow.disabled = scrollLeft >= maxScrollLeft - buffer;

  // Cursor logic — show grab only if scrollable
  if (prevArrow.disabled && nextArrow.disabled) {
    carousel.style.cursor = 'default';
  } else {
    carousel.style.cursor = 'grab';
  }
}

// Update arrows and cursor on scroll/resize
carousel.addEventListener('scroll', updateArrowVisibility);
window.addEventListener('resize', updateArrowVisibility);
updateArrowVisibility(); // Initial



   // ACCORDION
  document.querySelectorAll('#accordion .accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const icon = header.querySelector('svg');

      const isOpen = body.classList.contains('open');

      // Close all
      document.querySelectorAll('#accordion .accordion-body').forEach(b => {
        b.classList.remove('open');
        b.style.maxHeight = null;
        b.style.opacity = 0;
        b.previousElementSibling.querySelector('svg').classList.remove('rotate-180');
      });

      // Open current if it was closed
      if (!isOpen) {
        body.classList.add('open');
        body.style.maxHeight = body.scrollHeight + "px";
        body.style.opacity = 1;
        icon.classList.add('rotate-180');
      }
    });
  });






