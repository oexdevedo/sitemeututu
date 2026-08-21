document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 2. Sticky Floating Header Glassmorphism & Shadow on Scroll
  const header = document.querySelector('.main-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. ScrollSpy: Highlight Active Navigation Link on Scroll (Desktop and Mobile)
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-item');
  const sections = document.querySelectorAll('section[id], div[id]');

  const updateActiveNav = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 4. Smooth Anchor Scrolling with dynamic offset for header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  // 5. Navigate to the next section on ArrowDown key press
  let isScrolling = false;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isScrolling) return;

      const sequence = [
        '.hero-section',
        '.pillars-grid',
        '.features-intro',
        '.features-grid-2x2',
        '.destinations-section',
        '.pricing-wrapper',
        '.booking-section'
      ];
      const pageSections = sequence.map(sel => document.querySelector(sel)).filter(el => el !== null);
      
      if (pageSections.length === 0) return;

      const currentScroll = window.scrollY;
      const headerOffset = 100;
      let nextSection = null;

      for (let i = 0; i < pageSections.length; i++) {
        // Calculate absolute top position relative to document
        const elementRect = pageSections[i].getBoundingClientRect();
        const absoluteTop = elementRect.top + window.scrollY;
        
        const adjustedTop = absoluteTop - headerOffset;
        
        // Find the first section that is significantly below our current scroll
        if (adjustedTop > currentScroll + 10) {
          nextSection = pageSections[i];
          break;
        }
      }

      // If we didn't find a next section, we are at the end, so go to the first section
      if (!nextSection) {
        nextSection = pageSections[0];
      }

      isScrolling = true;
      const elementPosition = nextSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Prevent multiple rapid keydowns from firing while scrolling
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    }
  });
});
