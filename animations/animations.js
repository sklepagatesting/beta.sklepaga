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


        // Parallax
    document.addEventListener('DOMContentLoaded', () => {
      const parallaxContainer = document.querySelector('.parallax');

      if (parallaxContainer) {
        // Function to update the background position based on scroll
        function updateParallaxBackgroundPosition() {
          const scrollPosition = window.pageYOffset;
          // Get the container's position relative to the document
          const containerTop = parallaxContainer.getBoundingClientRect().top + scrollPosition;
          const containerHeight = parallaxContainer.offsetHeight;

          // Check if the container is currently in the viewport
          if (scrollPosition + window.innerHeight > containerTop && scrollPosition < containerTop + containerHeight) {
            // Adjust the parallax speed by changing this multiplier.
            // A higher value makes the background move faster relative to scroll.
            // A value between 0 and 1 creates the subtle parallax.
            const parallaxSpeed = 0.4; // Experiment with this value (e.g., 0.1 to 0.5)

            // Calculate the new Y position for the background
            // We subtract containerTop to make the parallax relative to the element's position.
            const backgroundY = (scrollPosition - containerTop) * parallaxSpeed;

            // Apply the new background-position-y.
            // We use 'center' for X and dynamic 'backgroundY' for Y.
            parallaxContainer.style.backgroundPositionY = `calc(50% + ${backgroundY}px)`;
          }
        }

        // Attach the updateParallax function to the scroll event
        window.addEventListener('scroll', updateParallaxBackgroundPosition);

        // Initial call to set the correct position on load
        updateParallaxBackgroundPosition();
      }
    });