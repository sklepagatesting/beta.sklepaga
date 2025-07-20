/* GLOBAL ANIMATION */
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    '.fly-in, .left-in, .right-in, .fly-in-slow, .left-in-slow, .right-in-slow'
  );

  const observer = new IntersectionObserver((entries) => {
    let delay = 0;

    entries
      .filter(entry => entry.isIntersecting)
      .forEach((entry) => {
        const el = entry.target;

        // Apply stagger delay
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('animate-in');

        delay += 200; // stagger between each visible element

        observer.unobserve(el);
      });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
});

// ---------------- HERO ----------------
// Fade from solid blue to video after 1 second
setTimeout(() => {
  const solid = document.getElementById('bg-solid');

  // Choose appropriate video/image depending on screen size
  const isMobile = window.innerWidth < 768;
  const video = document.getElementById(isMobile ? 'bg-video-mobile' : 'bg-video');
  const image = document.getElementById(isMobile ? 'bg-image-mobile' : 'bg-image');

  if (solid && video) {
    solid.style.opacity = '0';
    video.style.opacity = '1';
    
    // Attempt to play video
    video.play?.().catch(err => console.warn('Video play error:', err));

    // When video ends, fade to image
    video.onended = () => {
      video.style.opacity = '0';
      if (image) image.style.opacity = '1';
    };
  }
}, 1000);

