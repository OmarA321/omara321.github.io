// Animation utilities and effects
class AnimationController {
    constructor() {
      this.observeElements();
      this.initializeCounters();
      this.initializeTypewriter();
    }
  
    // Intersection Observer for scroll animations
    observeElements() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Trigger counter animation if element has data-target
            if (entry.target.dataset.target) {
              this.animateCounter(entry.target);
            }
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
  
      // Observe elements with reveal class
      document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
      });
  
      // Observe stat numbers
      document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
      });
    }
  
    // Animate counter numbers
    animateCounter(element) {
      const target = parseInt(element.dataset.target);
      const duration = 2000;
      const start = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target;
        }
      };
      
      requestAnimationFrame(animate);
    }
  
    // Typewriter effect
    initializeTypewriter() {
      const typewriterElements = document.querySelectorAll('.typewriter');
      
      typewriterElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        element.style.whiteSpace = 'nowrap';
        element.style.overflow = 'hidden';
        
        setTimeout(() => {
          this.typeWriter(element, text, 100);
        }, index * 1000);
      });
    }
  
    typeWriter(element, text, speed) {
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          // Remove cursor after typing is complete
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 1000);
        }
      };
      
      type();
    }
  
    // Stagger animation for elements
    static staggerAnimation(selector, animationClass, delay = 100) {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add(animationClass);
        }, index * delay);
      });
    }
  
    // Parallax scroll effect
    static initParallax() {
      const parallaxElements = document.querySelectorAll('.parallax');
      
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const rate = scrolled * -0.5;
          element.style.transform = `translateY(${rate}px)`;
        });
      });
    }
  
    // Smooth scroll to element
    static scrollToElement(targetId, offset = 80) {
      const target = document.getElementById(targetId);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  
    // Magnetic effect for buttons
    static initMagneticEffect() {
      const magneticElements = document.querySelectorAll('.magnetic');
      
      magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
          element.style.transform = 'translate(0px, 0px)';
        });
      });
    }
  
    // Loading animation
    static showLoading(element) {
      element.classList.add('loading');
      return () => {
        element.classList.remove('loading');
      };
    }
  
    // Gradient animation
    static initGradientAnimation() {
      const gradientElements = document.querySelectorAll('.animated-gradient');
      
      gradientElements.forEach(element => {
        let angle = 0;
        
        setInterval(() => {
          angle += 1;
          element.style.background = `linear-gradient(${angle}deg, #667eea, #764ba2, #f093fb, #667eea)`;
        }, 50);
      });
    }
  }
  
  // Initialize animations when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
    AnimationController.initParallax();
    AnimationController.initMagneticEffect();
  });
  
  // Utility function for adding animation classes
  function addRevealAnimation() {
    const elements = document.querySelectorAll('[data-reveal]');
    
    elements.forEach(element => {
      element.classList.add('reveal');
    });
  }
  
  // Call on page load
  window.addEventListener('load', addRevealAnimation);