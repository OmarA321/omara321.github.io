// Main JavaScript file for portfolio functionality
class Portfolio {
    constructor() {
      this.initializeTheme();
      this.initializeNavigation();
      this.initializeScrollEffects();
      this.initializeFormHandling();
      this.updateNavbarBackground();
      this.initializeBackgroundShapes(); 
    }

    // Initialize floating background shapes
initializeBackgroundShapes() {
  const shapesContainer = document.createElement('div');
  shapesContainer.className = 'background-shapes';
  document.body.appendChild(shapesContainer);

  // Create 8 floating shapes
  for (let i = 0; i < 8; i++) {
    const shape = document.createElement('div');
    shape.className = 'background-shape';
    
    const size = Math.random() * 100 + 50; // 50-150px
    const x = Math.random() * 100; // 0-100%
    const y = Math.random() * 100; // 0-100%
    const delay = Math.random() * 15; // 0-15s delay
    
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${x}%`;
    shape.style.top = `${y}%`;
    shape.style.animationDelay = `${delay}s`;
    shape.style.animationDuration = `${15 + Math.random() * 10}s`; // 15-25s
    
    shapesContainer.appendChild(shape);
  }
}

    updateNavbarBackground() {
      const navbar = document.querySelector('.navbar');
      const isDarkTheme = document.body.classList.contains('dark-theme');
      
      if (navbar) {
        if (window.scrollY > 100) {
          if (isDarkTheme) {
            navbar.style.background = 'rgba(26, 32, 44, 0.98)';
          } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          }
          navbar.style.backdropFilter = 'blur(20px)';
        } else {
          if (isDarkTheme) {
            navbar.style.background = 'rgba(26, 32, 44, 0.95)';
          } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          }
          navbar.style.backdropFilter = 'blur(10px)';
        }
      }
    }
  
    // Theme switching functionality
    initializeTheme() {
      const themeToggle = document.getElementById('themeToggle');
      const body = document.body;
      
      // Check for saved theme or default to light
      const savedTheme = localStorage.getItem('theme') || 'light';
      body.classList.toggle('dark-theme', savedTheme === 'dark');
      this.updateThemeIcon(savedTheme === 'dark');
      
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          body.classList.toggle('dark-theme');
          const isDark = body.classList.contains('dark-theme');
          
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          this.updateThemeIcon(isDark);
          
          // Update navbar background immediately
          this.updateNavbarBackground();

          
          // Smooth transition
          document.documentElement.style.setProperty('--transition-duration', '0.3s');
        });
      }
    }
  
    updateThemeIcon(isDark) {
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  
    // Navigation functionality
    initializeNavigation() {
      const hamburger = document.getElementById('hamburger');
      const navMenu = document.getElementById('navMenu');
      
      if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
          navMenu.classList.toggle('active');
          hamburger.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
          });
        });
   
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
          }
        });
      }
   
      // Navbar scroll effect
      // Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  if (navbar) {
    if (window.scrollY > 100) {
      if (isDarkTheme) {
        navbar.style.background = 'rgba(26, 32, 44, 0.98)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      }
      navbar.style.backdropFilter = 'blur(20px)';
    } else {
      if (isDarkTheme) {
        navbar.style.background = 'rgba(26, 32, 44, 0.95)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      }
      navbar.style.backdropFilter = 'blur(10px)';
    }
  }
});
    }
   
    // Scroll effects and animations
    initializeScrollEffects() {
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
   
      // Scroll indicator
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        });
      }
   
      // Progress bar on scroll
      const progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
   
      window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
      });
    }
   
    // Form handling
    initializeFormHandling() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.textContent;
          
          // Show loading state
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
          
          // Simulate form submission (replace with actual endpoint)
          try {
            await this.simulateFormSubmission(new FormData(form));
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
          } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
          } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }
        });
      });
    }
   
    // Simulate form submission
    async simulateFormSubmission(formData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success/failure
          Math.random() > 0.1 ? resolve() : reject();
        }, 2000);
      });
    }
   
    // Show notification
    showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after delay
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }
   
    // Utility methods
    static debounce(func, wait) {
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
   
    static throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
   }
   
   // Advanced scroll animations
   class ScrollAnimations {
    constructor() {
      this.elements = document.querySelectorAll('[data-scroll]');
      this.initializeObserver();
    }
   
    initializeObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const animationType = entry.target.dataset.scroll;
            this.animateElement(entry.target, animationType);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
   
      this.elements.forEach(el => observer.observe(el));
    }
   
    animateElement(element, type) {
      switch (type) {
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
        case 'slide-up':
          element.style.animation = 'slideInFromTop 0.8s ease forwards';
          break;
        default:
          element.style.animation = 'fadeInUp 0.8s ease forwards';
      }
    }
   }
   
   // Initialize everything when DOM is loaded
   document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    new ScrollAnimations();
    
    // Add loading animation to body
    document.body.classList.add('loaded');
   });
   
   // Performance optimization
   window.addEventListener('load', () => {
    // Remove any loading states
    document.querySelectorAll('.loading').forEach(el => {
      el.classList.remove('loading');
    });
    
    // Trigger any load-dependent animations
    document.dispatchEvent(new CustomEvent('portfolioLoaded'));
   });
   
   // Export for use in other files
   window.Portfolio = Portfolio;