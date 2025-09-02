class ParticleSystem {
    constructor(container) {
      this.container = container;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mousePosition = { x: 0, y: 0 };
      this.isMouseMoving = false;
      
      this.setupCanvas();
      this.createParticles();
      this.bindEvents();
      this.animate();
    }
  
    setupCanvas() {
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.container.appendChild(this.canvas);
      
      this.resizeCanvas();
    }
  
    resizeCanvas() {
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
    }
  
    createParticles() {
      const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          originalOpacity: Math.random() * 0.5 + 0.2
        });
      }
    }
  
    bindEvents() {
      window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.particles = [];
        this.createParticles();
      });
  
      this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mousePosition.x = e.clientX - rect.left;
        this.mousePosition.y = e.clientY - rect.top;
        this.isMouseMoving = true;
        
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
          this.isMouseMoving = false;
        }, 100);
      });
    }
  
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Mouse interaction
        if (this.isMouseMoving) {
          const dx = this.mousePosition.x - particle.x;
          const dy = this.mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            particle.opacity = Math.min(1, particle.originalOpacity + (100 - distance) / 100);
            const force = (100 - distance) / 100 * 0.5;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
          } else {
            particle.opacity = particle.originalOpacity;
          }
        } else {
          particle.opacity = particle.originalOpacity;
        }
        
        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        this.ctx.fill();
        
        // Draw connections
        this.particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
              this.ctx.beginPath();
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(otherParticle.x, otherParticle.y);
              this.ctx.strokeStyle = `rgba(255, 255, 255, ${(80 - distance) / 80 * 0.1})`;
              this.ctx.lineWidth = 0.5;
              this.ctx.stroke();
            }
          }
        });
      });
      
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // Initialize particles when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      new ParticleSystem(particlesContainer);
    }
  });