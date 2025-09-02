/* ===========================
   About Page Script
   - Scroll animations
   - Interactive elements
   - Dynamic content
   =========================== */

   (() => {
    // ---- CONFIG & INITIALIZATION ----
    let scrollAnimationObserver;
  
    // ---- SCROLL ANIMATIONS ----
    function initializeScrollAnimations() {
      const animatedElements = document.querySelectorAll('[data-scroll]');
      
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Respect user preference for reduced motion
        animatedElements.forEach(el => el.classList.add('revealed'));
        return;
      }
  
      scrollAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const animationType = entry.target.dataset.scroll;
            animateElement(entry.target, animationType);
            scrollAnimationObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
  
      animatedElements.forEach(el => {
        scrollAnimationObserver.observe(el);
      });
    }
  
    function animateElement(element, animationType) {
      element.classList.add('revealed');
      
      switch(animationType) {
        case 'fade-up':
          element.style.animation = 'fadeInUp 0.8s ease forwards';
          break;
        case 'fade-left':
          element.style.animation = 'fadeInLeft 0.8s ease forwards';
          break;
        case 'fade-right':
          element.style.animation = 'fadeInRight 0.8s ease forwards';
          break;
        case 'scale':
          element.style.animation = 'scaleIn 0.6s ease forwards';
          break;
        default:
          element.style.animation = 'fadeInUp 0.8s ease forwards';
      }
    }
  
    // ---- INTERACTIVE CARD EFFECTS ----
    function initializeCardEffects() {
      const cards = document.querySelectorAll('.value-card, .interest-card, .education-card, .fact-item');
      
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }
  
    // ---- PROFILE STATS COUNTER ----
    function animateProfileStats() {
      const statNumbers = document.querySelectorAll('.profile-stats .stat-number');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = target.textContent.replace('+', '');
            const isPlus = target.textContent.includes('+');
            
            animateCounter(target, parseInt(finalValue), isPlus);
            observer.unobserve(target);
          }
        });
      });
  
      statNumbers.forEach(stat => observer.observe(stat));
    }
  
    function animateCounter(element, target, hasPlus) {
      const duration = 2000;
      const start = performance.now();
      const startValue = 0;
  
      function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        element.textContent = current + (hasPlus ? '+' : '');
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + (hasPlus ? '+' : '');
        }
      }
  
      requestAnimationFrame(updateCounter);
    }
  
    // ---- DYNAMIC TEXT EFFECTS ----
    function initializeTextEffects() {
      const introText = document.querySelector('.intro-paragraphs');
      if (!introText) return;
  
      // Add subtle fade-in delay for paragraphs
      const paragraphs = introText.querySelectorAll('p');
      paragraphs.forEach((p, index) => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
          p.style.opacity = '1';
          p.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
      });
    }
  
    // ---- SECTION VISIBILITY TRACKING ----
    function initializeSectionTracking() {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-link');
  
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add any section-specific animations or effects here
            entry.target.classList.add('in-view');
          }
        });
      }, {
        threshold: 0.3
      });
  
      sections.forEach(section => {
        sectionObserver.observe(section);
      });
    }
  
    // ---- ACCESSIBILITY ENHANCEMENTS ----
    function initializeAccessibility() {
      // Add focus indicators for keyboard navigation
      const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      
      focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
          element.classList.add('keyboard-focused');
        });
        
        element.addEventListener('blur', () => {
          element.classList.remove('keyboard-focused');
        });
        
        element.addEventListener('mousedown', () => {
          element.classList.remove('keyboard-focused');
        });
      });
  
      // Ensure animated elements are revealed when focused
      document.addEventListener('focusin', (e) => {
        const focusedElement = e.target.closest('[data-scroll]');
        if (focusedElement && !focusedElement.classList.contains('revealed')) {
          focusedElement.classList.add('revealed');
          animateElement(focusedElement, focusedElement.dataset.scroll);
        }
      });
    }
  
    // ---- PERFORMANCE OPTIMIZATIONS ----
    function initializePerformanceOptimizations() {
      // Lazy load any heavy content if needed
      const heavyElements = document.querySelectorAll('[data-lazy]');
      
      if (heavyElements.length > 0) {
        const lazyObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              // Trigger lazy loading logic here if needed
              lazyObserver.unobserve(element);
            }
          });
        });
  
        heavyElements.forEach(el => lazyObserver.observe(el));
      }
    }
  
    // ---- INITIALIZATION ----
    function init() {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
      }
  
      // Initialize all features
      initializeScrollAnimations();
      initializeCardEffects();
      animateProfileStats();
      initializeTextEffects();
      initializeSectionTracking();
      initializeAccessibility();
      initializePerformanceOptimizations();
  
      // Add loaded class for any CSS transitions
      document.body.classList.add('page-loaded');
    }
  
    // ---- CLEANUP ----
    function cleanup() {
      if (scrollAnimationObserver) {
        scrollAnimationObserver.disconnect();
      }
    }
  
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden, pause any animations if needed
      } else {
        // Page is visible again, resume animations if needed
      }
    });
  
    // Initialize when script loads
    init();
  
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
  })();