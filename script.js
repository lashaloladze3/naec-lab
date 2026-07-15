const header = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
const modal = document.getElementById('orderModal');
const modalClose = document.getElementById('modalClose');
const orderForm = document.getElementById('orderForm');
const packageSelect = document.getElementById('package');
const toast = document.getElementById('toast');
let lastFocusedElement = null;

document.getElementById('year').textContent = new Date().getFullYear();

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
});

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.addEventListener('click', event => {
  if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('open');
      faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const openModal = packageName => {
  lastFocusedElement = document.activeElement;

  if (packageName && [...packageSelect.options].some(option => option.value === packageName)) {
    packageSelect.value = packageName;
  }

  modal.classList.add('open');
  document.body.classList.add('modal-open');
  window.setTimeout(() => document.getElementById('name').focus(), 100);
};

const closeModal = () => {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

document.querySelectorAll('.order-trigger').forEach(trigger => {
  trigger.addEventListener('click', event => {
    if (trigger.classList.contains('subject-card')) {
      event.preventDefault();
    }

    openModal(trigger.dataset.package);
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

orderForm.addEventListener('submit', event => {
  event.preventDefault();
  closeModal();
  orderForm.reset();
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 4200);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
