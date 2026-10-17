/* ============================
   main.js – Stranger Things Theme
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Page Load Overlay ──
  const overlay = document.getElementById('page-load-overlay');
  if (overlay) {
    setTimeout(() => overlay.classList.add('hidden'), 1200);
  }

  // ── Hamburger Toggle ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Navbar Scroll ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── Reveal on Scroll ──
  const revealElements = document.querySelectorAll('.reveal, .fade-in-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Upside Down Particles ──
  createParticles();

  // ── Profile Photo from localStorage ──
  loadProfilePhoto();

  // ── Photo Upload (About page) ──
  const photoInput = document.getElementById('photo-input');
  const editPhotoBtn = document.getElementById('edit-photo-btn');
  if (editPhotoBtn && photoInput) {
    editPhotoBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);
  }

  // ── Flickering Light Effect for title ──
  addFlickerEffect();
});

// ── Create Upside Down Floating Particles ──
function createParticles() {
  const container = document.getElementById('magical-bg') || document.getElementById('stranger-bg');
  if (!container) return;

  const particleCount = 25;
  const colors = [
    'rgba(228, 7, 18, 0.4)',
    'rgba(124, 77, 255, 0.3)',
    'rgba(0, 229, 255, 0.3)',
    'rgba(255, 171, 0, 0.2)',
    'rgba(139, 0, 0, 0.4)',
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(particle);
  }
}

// ── Profile Photo Load ──
function loadProfilePhoto() {
  const stored = localStorage.getItem('ds-profile-photo');
  if (!stored) return;

  // Navbar profile
  const navImg = document.getElementById('nav-profile-img');
  if (navImg) {
    navImg.src = stored;
    navImg.style.display = 'block';
  }

  // About page hero
  const aboutPhoto = document.querySelector('.about-photo-large');
  if (aboutPhoto) {
    aboutPhoto.innerHTML = '';
    const img = document.createElement('img');
    img.src = stored;
    img.alt = 'Profile Photo';
    aboutPhoto.appendChild(img);
  }

  // Sidebar profile
  const sidebarPhoto = document.querySelector('.profile-photo');
  if (sidebarPhoto) {
    sidebarPhoto.innerHTML = '';
    const img = document.createElement('img');
    img.src = stored;
    img.alt = 'Profile Photo';
    sidebarPhoto.appendChild(img);
  }
}

// ── Handle Photo Upload ──
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev) {
    const dataUrl = ev.target.result;
    localStorage.setItem('ds-profile-photo', dataUrl);
    loadProfilePhoto();
  };
  reader.readAsDataURL(file);
}

// ── Flicker Effect ──
function addFlickerEffect() {
  const heroTitle = document.querySelector('.hero h1');
  if (!heroTitle) return;

  setInterval(() => {
    if (Math.random() > 0.92) {
      heroTitle.style.opacity = '0.3';
      setTimeout(() => {
        heroTitle.style.opacity = '1';
      }, 80 + Math.random() * 120);
    }
  }, 300);
}

// ── PDF Modal ──
function openPdfModal(title, pdfUrl) {
  let modal = document.getElementById('pdf-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pdf-modal';
    modal.className = 'pdf-modal';
    modal.innerHTML = `
      <div class="pdf-modal-content">
        <div class="pdf-modal-header">
          <span class="pdf-modal-title"></span>
          <button class="pdf-modal-close" onclick="closePdfModal()">&times;</button>
        </div>
        <div class="pdf-modal-body">
          <iframe src="" frameborder="0"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePdfModal();
    });
  }
  modal.querySelector('.pdf-modal-title').textContent = title;
  modal.querySelector('iframe').src = pdfUrl;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const modal = document.getElementById('pdf-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.querySelector('iframe').src = '';
    document.body.style.overflow = '';
  }
}

// ── Tools Filter ──
function initToolsFilter() {
  const searchInput = document.getElementById('tools-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const toolCards = document.querySelectorAll('.tool-card');

  if (!searchInput) return;

  let activeRole = 'all';

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeRole = chip.dataset.role;
      filterTools();
    });
  });

  searchInput.addEventListener('input', filterTools);

  function filterTools() {
    const query = searchInput.value.toLowerCase();
    toolCards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const roles = (card.dataset.roles || '').toLowerCase();
      const desc = (card.querySelector('.tool-desc')?.textContent || '').toLowerCase();
      const matchesSearch = !query || name.includes(query) || desc.includes(query) || roles.includes(query);
      const matchesRole = activeRole === 'all' || roles.includes(activeRole);
      card.style.display = matchesSearch && matchesRole ? '' : 'none';
    });
  }
}

// Auto-init tools filter if on tools page
if (document.querySelector('.tools-container')) {
  document.addEventListener('DOMContentLoaded', initToolsFilter);
}
