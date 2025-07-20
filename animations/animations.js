// fontLoader.js

document.addEventListener('DOMContentLoaded', () => {
    const contentElement = document.body;
    let fontLoaded = false;

    // Apply the 'preload' class to your <body> in HTML: <body class="preload">
    // And in your CSS:
    // body.preload { visibility: hidden; opacity: 0; }
    // body { transition: opacity 0.5s ease-in; }

    document.fonts.ready.then(() => {
        // Check for common Inter weights (adjust if you use others)
        if (document.fonts.check('400 1em Inter') || document.fonts.check('700 1em Inter')) {
            console.log('Inter font(s) loaded via FontFaceSet API!');
            fontLoaded = true;
            // Add a very slight delay before showing, just in case of a repaint issue
            setTimeout(() => {
                contentElement.style.visibility = 'visible';
                contentElement.style.opacity = '1';
                contentElement.classList.remove('preload'); // Remove if using class-based hiding
                // Dispatch custom event once font is loaded and page is visible
                document.dispatchEvent(new CustomEvent('fontLoadedAndPageVisible'));
            }, 50); // Small delay, e.g., 50ms
        } else {
            console.warn('Inter font not explicitly detected by document.fonts.check. Showing content with fallback.');
            contentElement.style.visibility = 'visible';
            contentElement.style.opacity = '1';
            contentElement.classList.remove('preload');
            document.dispatchEvent(new CustomEvent('fontLoadedAndPageVisible'));
        }
    }).catch(error => {
        console.error('Error while waiting for fonts:', error);
        contentElement.style.visibility = 'visible';
        contentElement.style.opacity = '1';
        contentElement.classList.remove('preload');
        document.dispatchEvent(new CustomEvent('fontLoadedAndPageVisible'));
    });

    // Robust Timeout Fallback: Always show content after a reasonable delay
    setTimeout(() => {
        if (!fontLoaded) { // Only force show if font wasn't already confirmed
            console.warn('Timeout reached. Forcibly displaying page content.');
            contentElement.style.visibility = 'visible';
            contentElement.style.opacity = '1';
            contentElement.classList.remove('preload');
            document.dispatchEvent(new CustomEvent('fontLoadedAndPageVisible'));
        }
    }, 3000); // Max 3 seconds wait
});

let currentY = 0;
let velocity = 0;
const friction = 0.98;
const stopThreshold = 0.05;
const maxInputVelocity = 3;
const maxTotalVelocity = 50;
const scrollScale = 0.2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function animate() {
  velocity *= friction;
  if (Math.abs(velocity) < stopThreshold) {
    velocity = 0;
    return;
  }

  currentY += velocity;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  currentY = clamp(currentY, 0, maxScroll);
  window.scrollTo(0, currentY);
  requestAnimationFrame(animate);
}

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  let inputVelocity = e.deltaY * scrollScale;
  inputVelocity = clamp(inputVelocity, -maxInputVelocity, maxInputVelocity);
  velocity += inputVelocity;
  velocity = clamp(velocity, -maxTotalVelocity, maxTotalVelocity);
  if (Math.abs(velocity) >= stopThreshold) {
    requestAnimationFrame(animate);
  }
}, {
  passive: false
});

window.addEventListener('load', () => {
  currentY = window.scrollY;
});


// Parallax Background Effect
document.addEventListener('DOMContentLoaded', () => {
  const parallaxContainer = document.querySelector('.parallax');

  if (!parallaxContainer) return;

  const parallaxSpeed = 0.4; // Adjust for stronger/weaker parallax

  function updateParallax() {
    const scrollY = window.pageYOffset;
    const containerOffsetTop = parallaxContainer.offsetTop;
    const containerHeight = parallaxContainer.offsetHeight;

    const containerBottom = containerOffsetTop + containerHeight;

    // Only apply effect when the container is in the viewport
    if (scrollY + window.innerHeight > containerOffsetTop && scrollY < containerBottom) {
      const distanceScrolled = scrollY - containerOffsetTop;
      const backgroundY = distanceScrolled * parallaxSpeed;
      parallaxContainer.style.backgroundPosition = `center calc(50% + ${backgroundY}px)`;
    }
  }

  // Optimize scroll performance with `requestAnimationFrame`
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Set initial position
  updateParallax();
});



// COMMENTS PARALLAX
    const mobileBreakpoint = 768;
  function isDesktop() {
    return window.innerWidth >= mobileBreakpoint;
  }

  const column1 = document.querySelector('.comment-card-parallax-1');
  const column2 = document.querySelector('.comment-card-parallax-2');

  const column1Intensity = 0.1;
  const column2Intensity = 0.25;

  function applyColumnParallax() {
    if (!isDesktop()) {
      if (column1) column1.style.transform = 'none';
      if (column2) column2.style.transform = 'none';
      return;
    }

    const viewportHeight = window.innerHeight;

    if (column1) {
      const rect1 = column1.getBoundingClientRect();
      const column1Center = rect1.top + rect1.height / 2;
      const offset1 = (column1Center - viewportHeight / 2) * column1Intensity;
      column1.style.transform = `translateY(${offset1}px)`;
    }

    if (column2) {
      const rect2 = column2.getBoundingClientRect();
      const column2Center = rect2.top + rect2.height / 2;
      const offset2 = (column2Center - viewportHeight / 2) * column2Intensity;
      column2.style.transform = `translateY(${offset2}px)`;
    }
  }

  function handleResponsiveLayout() {
    applyColumnParallax();
  }

  document.addEventListener('DOMContentLoaded', handleResponsiveLayout);

  window.addEventListener('resize', handleResponsiveLayout);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyColumnParallax();
        ticking = false;
      });
      ticking = true;
    }
  });



// textAnimations.js
document.addEventListener('fontLoadedAndPageVisible', () => {
  console.log('Font loaded and page visible, initializing text animations.');

  // Combine both classes
  const textElements = document.querySelectorAll('.rise, .sliding-up');

  textElements.forEach(textElement => {
    // Avoid double-processing if innerHTML already contains spans
    if (textElement.querySelector('span')) return;

    const words = textElement.textContent.trim().split(' ');
    textElement.innerHTML = words.map((word, index) => {
      const separator = (index < words.length - 1) ? '&nbsp;' : '';
      return `<span style="animation-delay: ${index * 0.1}s">${word}${separator}</span>`;
    }).join('');

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(textElement);
  });
});
