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
// Fade from solid blue to video after 3 seconds
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
}, 3000);

// Hero Button Scroll Down with ease-in-out
document.getElementById('scroll-down-btn')?.addEventListener('click', () => {
  const start = window.scrollY;
  const end = start + window.innerHeight;
  const duration = 800;
  const easeInOut = t => t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;

  let startTime = null;

  const animate = time => {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOut(progress);

    window.scrollTo(0, start + (end - start) * ease);

    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
});

