document.addEventListener("DOMContentLoaded", () => {
  // ... (rest of your existing global variables and navbar/sidebar logic) ...
  const toggleBtn = document.getElementById("menu-toggle-btn");
  const iconPath = document.getElementById("menu-icon-path");
  const sidebar = document.getElementById("sidebar-multi-level-sidebar");
  const navbar = document.getElementById("navbar");

  const hamburgerPath = "M4 6h16M4 12h16M4 18h16";
  const closePath = "M6 18L18 6M6 6l12 12";

  // Overlay for sidebar
  const hamburgerOverlay = document.createElement("div");
  hamburgerOverlay.className = `
    fixed inset-0 z-20 bg-black bg-opacity-50
    opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out
  `;
  document.body.appendChild(hamburgerOverlay);

  let isSidebarOpen = false;

// ---------------- NAVBAR SCROLL BEHAVIOR -------------------
let lastScrollY = window.scrollY;
let navHidden = false;

// Ensure transition exists
navbar.style.transition = "transform 0.3s ease, background-color 0.3s ease";
sidebar.style.transition = "transform 0.3s ease";

// Helper: toggle navbar bg
function updateNavbarBackground() {
  if (window.scrollY > 0 || isSidebarOpen) {
    navbar.classList.add("navbar-bg");
  } else {
    navbar.classList.remove("navbar-bg");
  }
}

// Scroll handler
function handleNavbarScroll() {
  const scrollY = window.scrollY;

  // Don't hide navbar if sidebar is open
  if (!isSidebarOpen) {
    if (scrollY > lastScrollY && !navHidden && scrollY > navbar.offsetHeight) {
      navbar.style.transform = "translateY(-100%)";
      if (!isSidebarOpen) {
        sidebar.style.transform = "translateY(-100%)";
      }
      navHidden = true;
    } else if (scrollY < lastScrollY && navHidden) {
      navbar.style.transform = "translateY(0)";
      sidebar.style.transform = "translateY(0)";
      navHidden = false;
    }
  }

  updateNavbarBackground();
  lastScrollY = scrollY;
}

window.addEventListener("scroll", handleNavbarScroll);



  // ---------------- SIDEBAR ANIMATION -------------------
  function showSidebar() {
    if (toggleBtn.disabled) return;
    toggleBtn.disabled = true;

    setTimeout(() => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      navbar.style.paddingRight = `${scrollbarWidth}px`;
    }, 10);

    sidebar.classList.remove("hidden");
    sidebar.style.maxHeight = "0px";
    void sidebar.offsetHeight;
    sidebar.style.transition = "max-height 800ms ease, transform 0.3s ease";
    sidebar.style.maxHeight = `${window.innerHeight - 48}px`;

    const menuItems = sidebar.querySelectorAll(".sidebar-menu-item");
    menuItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(10px)";
      item.style.transition = "none";
    });

    menuItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = "opacity 800ms ease, transform 800ms ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 200 + i * 120);
    });

    hamburgerOverlay.classList.replace("opacity-0", "opacity-100");
    hamburgerOverlay.classList.replace("pointer-events-none", "pointer-events-auto");

    toggleBtn?.setAttribute("aria-expanded", "true");
    iconPath?.setAttribute("d", closePath);
    isSidebarOpen = true;
    updateNavbarBackground();

    setTimeout(() => {
      toggleBtn.disabled = false;
    }, 850);
  }

  function hideSidebar() {
    if (toggleBtn.disabled) return;
    toggleBtn.disabled = true;

    sidebar.style.maxHeight = "0px";

    hamburgerOverlay.classList.replace("opacity-100", "opacity-0");
    hamburgerOverlay.classList.replace("pointer-events-auto", "pointer-events-none");

    toggleBtn?.setAttribute("aria-expanded", "false");
    iconPath?.setAttribute("d", hamburgerPath);
    isSidebarOpen = false;
    updateNavbarBackground();

    setTimeout(() => {
      sidebar.classList.add("hidden");
      sidebar.style.transition = "";
      sidebar.style.maxHeight = "";
      sidebar.style.transform = "";

      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      navbar.style.paddingRight = "";

      // Reset all open submenus and their header styles
      document.querySelectorAll('#sidebar-menu .sidebar-menu-body.open').forEach(body => {
        body.classList.remove('open');
        body.style.maxHeight = null;
        body.style.opacity = 0;

        const header = body.previousElementSibling;
        if (header) {
          header.classList.remove('open');
        }
      });

      toggleBtn.disabled = false;
    }, 850);
  }

  // Toggle handlers
  toggleBtn?.addEventListener("click", () => {
    isSidebarOpen ? hideSidebar() : showSidebar();
  });

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (
      isSidebarOpen &&
      !sidebar.contains(e.target) &&
      !toggleBtn.contains(e.target) &&
      !e.target.closest('#sidebar-menu')
    ) {
      hideSidebar();
    }
  });

  // Close on window resize
  window.addEventListener("resize", () => {
    if (isSidebarOpen && window.innerWidth >= 768) {
      hideSidebar();
    }
  });

  // ---------------- ACCORDION LOGIC ----------------
  document.querySelectorAll('#sidebar-menu .sidebar-menu-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = body.classList.contains('open');

      // Close all currently open accordion bodies and reset their headers
      document.querySelectorAll('#sidebar-menu .sidebar-menu-body.open').forEach(openBody => {
        openBody.classList.remove('open');
        openBody.style.maxHeight = null;
        openBody.style.opacity = 0;

        const otherHeader = openBody.previousElementSibling;
        if (otherHeader) {
          otherHeader.classList.remove('open');
        }
      });

      // Open the clicked accordion item if it was closed
      if (!isOpen) {
        body.classList.add('open');
        body.style.maxHeight = body.scrollHeight + "px";
        body.style.opacity = 1;

        header.classList.add('open');
      }
    });
  });

  // ---------------- SUBMENU ACTIVE LOGIC ----------------
  document.querySelectorAll('#sidebar-menu .submenu-link').forEach(link => {
    link.addEventListener('click', () => {
      // Remove 'active' from all other submenu links
      document.querySelectorAll('#sidebar-menu .submenu-link').forEach(l => {
        l.classList.remove('active');
      });
      // Add 'active' to the clicked link
      link.classList.add('active');

      // Optional: Close the sidebar after clicking a submenu link
      if (isSidebarOpen) {
        hideSidebar();
      }
    });
  });

  // Initial call to set navbar background on page load
  updateNavbarBackground();
});

const headers = document.querySelectorAll('.sidebar-menu-header');
const sidebarMenu = document.getElementById('sidebar-menu');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const anyOpen = [...headers].some(h => h.classList.contains('open'));

    // Toggle logic (you may already have it)
    header.classList.toggle('open');

    // After toggle, re-check
    const stillAnyOpen = [...headers].some(h => h.classList.contains('open'));

    if (stillAnyOpen) {
      sidebarMenu.classList.add('has-open');
    } else {
      sidebarMenu.classList.remove('has-open');
    }
  });
});
