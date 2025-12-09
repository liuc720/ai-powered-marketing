// ========== UTILITY FUNCTIONS ==========

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========== HEADER SCROLL EFFECT ==========

const header = document.querySelector('.site-header');
let lastScrollTop = 0;

function handleHeaderScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollTop = scrollTop;
}

window.addEventListener('scroll', debounce(handleHeaderScroll, 10));

// ========== MOBILE NAVIGATION ==========

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

if (navToggle && nav) {
  // Toggle mobile menu
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && 
        !nav.contains(e.target) && 
        !navToggle.contains(e.target)) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = '';
    }
  });
}

// ========== FORM VALIDATION AND SUBMISSION ==========

const ctaForm = document.querySelector(".cta-form");
const emailInput = document.querySelector('.cta-form input[type="email"]');
const submitBtn = document.querySelector('.cta-form button[type="submit"]');
const formError = document.querySelector('.form-error');

if (ctaForm && emailInput && submitBtn) {
  
  // Real-time validation on input
  emailInput.addEventListener('input', () => {
    if (formError && formError.classList.contains('visible')) {
      formError.classList.remove('visible');
    }
  });

  // Form submission
  ctaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
      showError("Please enter your email address");
      emailInput.focus();
      return;
    }
    
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      emailInput.focus();
      return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call (replace with your actual endpoint)
    try {
      // await fetch('/api/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success!
      showSuccess();
      ctaForm.reset();
      
    } catch (error) {
      showError("Something went wrong. Please try again.");
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function showError(message) {
  if (formError) {
    formError.textContent = message;
    formError.classList.add('visible');
    
    // Shake animation
    emailInput.style.animation = 'none';
    setTimeout(() => {
      emailInput.style.animation = 'shake 0.5s ease';
    }, 10);
  }
}

function showSuccess() {
  // Create success message
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="#10b981" stroke="white" stroke-width="2"/>
      <path d="M6 10l3 3 5-5" stroke="white" stroke-width="2" fill="none"/>
    </svg>
    <span>Thank you! We'll be in touch soon.</span>
  `;
  successMsg.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1000;
    animation: slideInFromRight 0.4s ease;
    font-weight: 600;
    color: #0a0a0a;
  `;
  
  document.body.appendChild(successMsg);
  
  // Remove after 4 seconds
  setTimeout(() => {
    successMsg.style.animation = 'fadeOut 0.4s ease';
    setTimeout(() => successMsg.remove(), 400);
  }, 4000);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  @keyframes fadeOut {
    to { opacity: 0; transform: translateX(20px); }
  }
`;
document.head.appendChild(style);

// ========== SCROLL ANIMATIONS ==========

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after animation to improve performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in-up').forEach(el => {
  observer.observe(el);
});

// ========== BACK TO TOP BUTTON ==========

const backToTopBtn = document.querySelector('.back-to-top');

function handleBackToTop() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

if (backToTopBtn) {
  window.addEventListener('scroll', debounce(handleBackToTop, 100));
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#"
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========== SERVICE CARDS HOVER EFFECT ==========

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  });
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
      scale3d(1.02, 1.02, 1.02)
    `;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ========== CASE CARDS ANIMATION ==========

const caseCards = document.querySelectorAll('.case-card');

caseCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// ========== PRELOAD ANIMATIONS ==========

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ========== KEYBOARD ACCESSIBILITY ==========

// Add focus visible styles for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add keyboard-nav styles
const keyboardNavStyle = document.createElement('style');
keyboardNavStyle.textContent = `
  .keyboard-nav *:focus {
    outline: 3px solid #e63946 !important;
    outline-offset: 2px !important;
  }
`;
document.head.appendChild(keyboardNavStyle);

// ========== PERFORMANCE MONITORING ==========

// Log page load performance (optional - remove in production)
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  if (perfData) {
    console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
  }
});

// ========== INITIALIZE ==========

console.log('GC parallax website initialized successfully! 🚀');
