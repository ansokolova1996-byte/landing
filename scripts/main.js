import { projects } from './portfolio-data.js';

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initAccordion() {
  const accordionRoot = document.querySelector('[data-accordion]');
  if (!accordionRoot) return;

  const items = accordionRoot.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const header = item.querySelector('.faq-item__header');
    const content = item.querySelector('.faq-item__content');
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      items.forEach((otherItem) => {
        const otherHeader = otherItem.querySelector('.faq-item__header');
        const otherContent = otherItem.querySelector('.faq-item__content');
        if (!otherHeader || !otherContent) return;

        otherHeader.setAttribute('aria-expanded', 'false');
        otherContent.hidden = true;
      });

      header.setAttribute('aria-expanded', String(!isExpanded));
      content.hidden = isExpanded;
    });
  });
}

function createPortfolioCard(project) {
  const card = document.createElement('article');
  card.className = 'card portfolio-card';

  const tagsMarkup = project.tags
    .map((tag) => `<span class="portfolio-card__tag">${tag}</span>`)
    .join('');

  card.innerHTML = `
    <div class="portfolio-card__meta">
      <span>${project.category}</span>
      <span>${project.year}</span>
    </div>
    <h3 class="portfolio-card__title">${project.title}</h3>
    <p class="portfolio-card__result">${project.result}</p>
    <p class="card__text">${project.shortDescription}</p>
    <div class="portfolio-card__tags">${tagsMarkup}</div>
    <button type="button" class="portfolio-card__cta" aria-label="Подробнее о проекте ${
      project.title
    }">
      <span>Подробнее</span>
      <span>↗</span>
    </button>
  `;

  return card;
}

function initPortfolioGrid(projectsData) {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  container.innerHTML = '';
  projectsData.forEach((project) => {
    container.appendChild(createPortfolioCard(project));
  });
}

function initTestimonialsSlider() {
  const track = document.querySelector('[data-testimonials-track]');
  if (!track) return;

  const prevButton = document.querySelector('[data-testimonials-prev]');
  const nextButton = document.querySelector('[data-testimonials-next]');

  const testimonials = [
    {
      name: 'Алексей, продакт‑менеджер SaaS‑сервиса',
      role: 'B2B‑платформа аналитики',
      quote:
        'Настя помогла посмотреть на наш продукт глазами пользователя. После редизайна онбординга и основных экранов мы увидели существенный рост активации.'
    },
    {
      name: 'Мария, основатель EdTech‑проекта',
      role: 'Онлайн‑школа по данным',
      quote:
        'С Настей очень комфортно работать: структурно, по шагам, без «космического» дизайна ради дизайна. Команда наконец перестала спорить о кнопках и сфокусировалась на метриках.'
    },
    {
      name: 'Игорь, руководитель продуктовой команды',
      role: 'Финтех‑сервис',
      quote:
        'Ценим, что Настя глубоко погружается в домен и предлагает решения, которые учитывают и бизнес, и разработку. Совместная работа заметно разгрузила нашу команду.'
    }
  ];

  testimonials.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.setAttribute('data-index', String(index));
    card.innerHTML = `
      <p class="testimonial-card__quote">“${item.quote}”</p>
      <div class="testimonial-card__meta">
        <span class="testimonial-card__name">${item.name}</span>
        <span class="testimonial-card__role"> · ${item.role}</span>
      </div>
    `;
    track.appendChild(card);
  });

  let activeIndex = 0;

  function updateSlider() {
    const offset = -activeIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    track.style.transition = 'transform 0.35s ease-out';
  }

  function goToNext() {
    activeIndex = (activeIndex + 1) % testimonials.length;
    updateSlider();
  }

  function goToPrev() {
    activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    updateSlider();
  }

  prevButton?.addEventListener('click', goToPrev);
  nextButton?.addEventListener('click', goToNext);

  setInterval(goToNext, 7000);
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successMessage = form.querySelector('.contact-form__success');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

    fields.forEach((field) => {
      const input = field;
      const value = input.value.trim();
      const isFieldValid = value.length > 0;

      input.setAttribute('aria-invalid', String(!isFieldValid));
      if (!isFieldValid) {
        isValid = false;
      }
    });

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid instanceof HTMLElement) {
        firstInvalid.focus();
      }
      return;
    }

    form.reset();
    if (successMessage instanceof HTMLElement) {
      successMessage.hidden = false;
      setTimeout(() => {
        successMessage.hidden = true;
      }, 4000);
    }
  });
}

function initYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

function initFloatingCta() {
  const button = document.querySelector('[data-floating-cta]');
  const contactSection = document.getElementById('contact');
  if (!button || !contactSection) return;

  button.addEventListener('click', () => {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initAccordion();
  initPortfolioGrid(projects);
  initTestimonialsSlider();
  initContactForm();
  initYear();
  initFloatingCta();
});

