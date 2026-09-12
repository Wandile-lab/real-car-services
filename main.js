/* ─────────────────────────────────────────────
   Real Car Services — Main JavaScript
   ───────────────────────────────────────────── */

// ── Mobile menu toggle ──────────────────────────────
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon   = document.getElementById('menu-icon');

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuIcon.classList.replace('fa-times', 'fa-bars');
    menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuIcon.classList.toggle('fa-bars',  !isOpen);
    menuIcon.classList.toggle('fa-times',  isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
    }
});

// ── Nav scroll shadow ───────────────────────────────
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Section reveal on scroll ────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(idx * 0.08, 0.3)}s`;
    revealObserver.observe(el);
});

// ── Image reveal animations ─────────────────────────
const imgRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            imgRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.img-reveal, .gallery-item').forEach(el => {
    imgRevealObserver.observe(el);
});

// ── Service card stagger reveal ─────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const svcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity  = '1';
            entry.target.style.transform = 'translateY(0)';
            svcObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

if (!prefersReducedMotion) {
    document.querySelectorAll('.svc-card').forEach((card, i) => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(18px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
        svcObserver.observe(card);
    });
}

// ── Active nav link on scroll ───────────────────────
const navLinks = document.querySelectorAll('#main-nav .nav-link');

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${id}` || (id === 'hero' && link.getAttribute('href') === '#');
                link.classList.toggle('active', isActive);
            });
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => activeObserver.observe(s));

// ── Gallery lightbox ────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImg.src = item.getAttribute('data-src');
        lightboxImg.alt = img ? img.getAttribute('alt') : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });
