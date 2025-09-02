/* ===========================
   Contact Page Script
   - EmailJS integration
   - Form validation and handling
   - Scroll animations
   =========================== */

   (() => {
    // ---- EmailJS Configuration ----
    // Replace these with your actual EmailJS credentials
    const EMAILJS_CONFIG = {
      publicKey: 'gkdJ0l-4T0ckih5nK', // Your EmailJS public key
      serviceId: 'service_3lu1efo', // Your EmailJS service ID
      templateId: 'template_02pkajg' // Your EmailJS template ID
    };
  
    // ---- DOM Elements ----
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm?.querySelector('.submit-btn');
    const statusMessage = document.getElementById('statusMessage');
    const statusIcon = statusMessage?.querySelector('.status-icon');
    const statusText = statusMessage?.querySelector('.status-text');
  
    // ---- Initialize EmailJS ----
    function initEmailJS() {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS library not loaded');
      }
      emailjs.init(EMAILJS_CONFIG.publicKey);
      console.log('EmailJS initialized successfully');
    }
  
    // ---- Form Validation ----
    function validateForm(formData) {
      const errors = [];
  
      if (!formData.name.trim()) {
        errors.push('Name is required');
      }
  
      if (!formData.email.trim()) {
        errors.push('Email is required');
      } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
      }
  
      if (!formData.message.trim()) {
        errors.push('Message is required');
      } else if (formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
      }
  
      return errors;
    }
  
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    // ---- Status Messages ----
    function showStatus(type, message) {
      if (!statusMessage) return;
      
      statusMessage.style.display = 'block';
      statusMessage.className = `status-message ${type}`;
      
      if (statusIcon) {
        if (type === 'success') {
          statusIcon.className = 'status-icon fas fa-check-circle';
        } else {
          statusIcon.className = 'status-icon fas fa-exclamation-circle';
        }
      }
      
      if (statusText) {
        statusText.textContent = message;
      }
  
      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          hideStatus();
        }, 5000);
      }
    }
  
    function hideStatus() {
      if (statusMessage) {
        statusMessage.style.display = 'none';
      }
    }
  
    // ---- Button States ----
    function setButtonLoading(loading) {
      if (!submitBtn) return;
  
      submitBtn.disabled = loading;
      submitBtn.classList.toggle('loading', loading);
      
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) {
        if (loading) {
          btnText.textContent = 'Sending...';
        } else {
          btnText.textContent = 'Send Message';
        }
      }
    }
  
    // ---- Main Form Submission Handler ----
    async function handleFormSubmit(event) {
      event.preventDefault();
      hideStatus();
  
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };
  
      // Validate form
      const errors = validateForm(data);
      if (errors.length > 0) {
        showStatus('error', errors.join(', '));
        return;
      }
  
      setButtonLoading(true);
  
      try {
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS not loaded');
        }
  
        // Send email using EmailJS
        const response = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            // Make sure these match your EmailJS template variables
            from_name: data.name,
            from_email: data.email,
            message: data.message,
            reply_to: data.email // This allows you to reply directly
          }
        );
  
        if (response.status === 200) {
         // showStatus('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
          contactForm.reset();
          
          // Track successful form submission (optional)
          trackFormSubmission('success');
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('EmailJS Error:', error);
        
        // Fallback to mailto if EmailJS fails
        handleMailtoFallback(data);
        
        showStatus('error', 'There was an issue with the email service. Opening your email client as a fallback...');
        
        // Track failed form submission (optional)
        trackFormSubmission('error', error.message);
      } finally {
        setButtonLoading(false);
      }
    }
  
    // ---- Mailto Fallback ----
    function handleMailtoFallback(data) {
      const subject = encodeURIComponent(`Website Contact from ${data.name}`);
      const body = encodeURIComponent(`
  Name: ${data.name}
  Email: ${data.email}
  
  Message:
  ${data.message}
      `);
      
      const mailtoLink = `mailto:omaraldulaimi492@gmail.com?subject=${subject}&body=${body}`;
      
      // Small delay to let the status message show
      setTimeout(() => {
        window.open(mailtoLink);
      }, 1000);
    }
  
    // ---- Analytics Tracking (Optional) ----
    function trackFormSubmission(status, error = null) {
      // Google Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: status,
          value: status === 'success' ? 1 : 0
        });
      }
      
      // Console logging for debugging
      console.log(`Form submission: ${status}`, error ? `Error: ${error}` : '');
    }
  
    // ---- Input Enhancement ----
    function enhanceFormInputs() {
      const inputs = contactForm.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
          input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
          if (!input.value.trim()) {
            input.parentElement.classList.remove('focused');
          }
        });
        
        // Check if input has value on load
        if (input.value.trim()) {
          input.parentElement.classList.add('focused');
        }
        
        // Real-time validation feedback
        input.addEventListener('input', () => {
          input.classList.remove('error', 'valid');
          
          if (input.value.trim()) {
            if (input.type === 'email') {
              if (isValidEmail(input.value)) {
                input.classList.add('valid');
              } else {
                input.classList.add('error');
              }
            } else {
              input.classList.add('valid');
            }
          }
        });
      });
    }
  
    // ---- Scroll Animations ----
    function initializeScrollAnimations() {
      const animatedElements = document.querySelectorAll('[data-scroll]');
      
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animatedElements.forEach(el => el.classList.add('revealed'));
        return;
      }
  
      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const animationType = entry.target.dataset.scroll;
            animateElement(entry.target, animationType);
            scrollObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
  
      animatedElements.forEach(el => scrollObserver.observe(el));
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
        default:
          element.style.animation = 'fadeInUp 0.8s ease forwards';
      }
    }
  
    // ---- Interactive Elements ----
    function initializeInteractiveElements() {
      // Animate contact method cards
      const contactMethods = document.querySelectorAll('.contact-method');
      contactMethods.forEach((method, index) => {
        method.style.animationDelay = `${index * 0.1}s`;
      });
  
      // Animate social cards
      const socialCards = document.querySelectorAll('.social-card');
      socialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(-2px)';
        });
      });
  
      // FAQ items hover effects
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.style.transform = 'translateY(-6px)';
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.transform = '';
        });
      });
    }
  
    // ---- Initialization ----
    function init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
      }
  
      // Check if required elements exist
      if (!contactForm) {
        console.warn('Contact form not found');
        return;
      }
  
      try {
        // Initialize EmailJS
        initEmailJS();
      } catch (error) {
        console.error('EmailJS initialization failed:', error);
        console.warn('EmailJS not available, using mailto fallback only');
      }
  
      // Initialize other features
      enhanceFormInputs();
      initializeScrollAnimations();
      initializeInteractiveElements();
  
      // Add form submit handler
      contactForm.addEventListener('submit', handleFormSubmit);
    }
  
    // Start initialization
    init();
  })();