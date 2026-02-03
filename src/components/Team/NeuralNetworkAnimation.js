/**
 * Neural Network Background Animation
 * A lightweight, customizable particle-based background animation
 */
class NeuralNetworkAnimation {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error(`Failed to get 2D context for canvas "${canvasId}"`);
        }

        this.particles = [];
        this.animationId = null;

        // Configuration with defaults
        this.config = {
            particleCount: options.particleCount || 80,
            particleColor: options.particleColor || 'rgba(0, 243, 255, 0.5)',
            lineColor: options.lineColor || '0, 243, 255',
            maxDistance: options.maxDistance || 150,
            particleSpeed: options.particleSpeed || 0.5,
            maxParticleSize: options.maxParticleSize || 2,
            lineWidth: options.lineWidth || 0.5,
            backgroundColor: options.backgroundColor || '#05070a'
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        // Handle window resize
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Recreate particles on resize to fill new space
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];

        // Adjust particle count based on screen size for performance
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? Math.floor(this.config.particleCount * 0.5) : this.config.particleCount;

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                radius: Math.random() * this.config.maxParticleSize + 0.5
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.particleColor;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.config.particleColor;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawLine(p1, p2, distance) {
        const opacity = 1 - (distance / this.config.maxDistance);
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(${this.config.lineColor}, ${opacity * 0.6})`;
        this.ctx.lineWidth = this.config.lineWidth;
        this.ctx.stroke();
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
        }

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    }

    animate() {
        // Clear and fill background
        this.ctx.fillStyle = this.config.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add subtle radial gradient overlay
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(10, 22, 40, 0.3)');
        gradient.addColorStop(1, 'rgba(5, 7, 10, 0.5)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            this.updateParticle(p1);
            this.drawParticle(p1);

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                if (distance < this.config.maxDistance) {
                    this.drawLine(p1, p2, distance);
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeHandler);
        this.particles = [];
    }
}

export default NeuralNetworkAnimation;
