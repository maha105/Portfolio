// Corporate Professional Portfolio Interactions

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initMobileMenu();
  initScrollSpy();
  initStatsCounter();
  initProjectFilters();
  initTerminalTabs();
  initClipboardButtons();
  initContactForm();
});

// 1. Smooth Cursor Ambient Follower
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursor-glow');
  if (!cursorGlow) return;

  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const followCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(followCursor);
    };
    requestAnimationFrame(followCursor);
  } else {
    cursorGlow.style.display = 'none';
  }
}

// 2. Mobile Navigation Toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// 3. Active Section Scroll Spy
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 130;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-blue-400', 'border-b-2', 'border-blue-400');
            link.classList.remove('text-slate-400');
          } else {
            link.classList.remove('text-blue-400', 'border-b-2', 'border-blue-400');
            link.classList.add('text-slate-400');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll);
  onScroll();
}

// 4. Animated Numerical Counters on Scroll
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter-val');
  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1600;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('stats-bar');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// 5. Interactive Project Category Filtering
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-800', 'text-slate-300', 'hover:bg-slate-700');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// 6. Terminal Tab Switcher
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const panels = document.querySelectorAll('.terminal-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('text-blue-400', 'border-blue-500/40', 'bg-blue-950/40');
        t.classList.add('text-slate-400', 'border-transparent');
      });
      tab.classList.add('text-blue-400', 'border-blue-500/40', 'bg-blue-950/40');
      tab.classList.remove('text-slate-400', 'border-transparent');

      const targetPanel = tab.getAttribute('data-panel');
      panels.forEach(panel => {
        if (panel.id === targetPanel) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}

// 7. Clipboard Copy Actions with Toast Notification
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Copied to clipboard!';

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(label);
        }).catch(() => {
          fallbackCopy(text, label);
        });
      } else {
        fallbackCopy(text, label);
      }
    });
  });
}

function fallbackCopy(text, label) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(label);
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 8. Contact Form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const subject = document.getElementById('form-subject')?.value.trim() || 'Full Stack Role Inquiry';
    const message = document.getElementById('form-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }

    const mailtoUrl = `mailto:meesalamaha0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Maha,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
    window.open(mailtoUrl, '_blank');

    showToast('✉️ Opening mail client...');
    form.reset();
  });
}
