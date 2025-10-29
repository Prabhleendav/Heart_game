class GameEngine {
  constructor(canvas, callbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.callbacks = callbacks;
    this.isRunning = false;
    this.level = callbacks.level || 1;
    
    // Game state
    this.player = {
      x: 50,
      y: 400,
      width: 32,
      height: 32,
      velX: 0,
      velY: 0,
      speed: 5,
      jumpPower: 15,
      grounded: false,
      color: '#FF6B6B'
    };
    
    this.camera = { x: 0, y: 0 };
    this.gravity = 0.8;
    this.friction = 0.8;
    
    this.hearts = [];
    this.platforms = [];
    this.goal = null;
    this.score = 0;
    
    this.keys = {};
    
    this.initLevel();
    this.bindEvents();
  }
  
  initLevel() {
    // Clear existing objects
    this.hearts = [];
    this.platforms = [];
    
    if (this.level === 1) {
      this.initLevel1();
    } else if (this.level === 2) {
      this.initLevel2();
    }
  }
  
  initLevel1() {
    // Level 1: Garden of Love
    this.platforms = [
      // Ground platforms
      { x: 0, y: 550, width: 300, height: 50, color: '#4ECDC4' },
      { x: 400, y: 550, width: 200, height: 50, color: '#4ECDC4' },
      { x: 700, y: 550, width: 300, height: 50, color: '#4ECDC4' },
      
      // Mid-level platforms
      { x: 250, y: 450, width: 100, height: 20, color: '#45B7B8' },
      { x: 450, y: 350, width: 120, height: 20, color: '#45B7B8' },
      { x: 650, y: 250, width: 100, height: 20, color: '#45B7B8' },
      
      // High platforms
      { x: 350, y: 200, width: 80, height: 20, color: '#45B7B8' },
      { x: 800, y: 150, width: 150, height: 20, color: '#45B7B8' }
    ];
    
    // Hearts to collect
    this.hearts = [
      { x: 150, y: 500, collected: false },
      { x: 300, y: 400, collected: false },
      { x: 500, y: 300, collected: false },
      { x: 700, y: 200, collected: false },
      { x: 380, y: 150, collected: false },
      { x: 850, y: 100, collected: false }
    ];
    
    // Goal (representing the girlfriend)
    this.goal = { x: 875, y: 100, width: 40, height: 40, reached: false };
  }
  
  initLevel2() {
    // Level 2: Castle of Hearts
    this.player.x = 50;
    this.player.y = 400;
    
    this.platforms = [
      // Ground
      { x: 0, y: 550, width: 200, height: 50, color: '#F38BA8' },
      { x: 300, y: 550, width: 150, height: 50, color: '#F38BA8' },
      { x: 550, y: 550, width: 250, height: 50, color: '#F38BA8' },
      
      // Castle-like structure
      { x: 200, y: 450, width: 80, height: 20, color: '#FAB2C6' },
      { x: 350, y: 400, width: 100, height: 20, color: '#FAB2C6' },
      { x: 500, y: 300, width: 80, height: 20, color: '#FAB2C6' },
      { x: 650, y: 200, width: 120, height: 20, color: '#FAB2C6' },
      
      // Final platform
      { x: 850, y: 100, width: 100, height: 20, color: '#FAB2C6' }
    ];
    
    this.hearts = [
      { x: 100, y: 500, collected: false },
      { x: 240, y: 400, collected: false },
      { x: 400, y: 350, collected: false },
      { x: 540, y: 250, collected: false },
      { x: 700, y: 150, collected: false },
      { x: 880, y: 50, collected: false }
    ];
    
    this.goal = { x: 880, y: 50, width: 40, height: 40, reached: false };
  }
  
  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  update() {
    this.handleInput();
    this.updatePhysics();
    this.checkCollisions();
    this.updateCamera();
  }
  
  handleInput() {
    if (this.keys['ArrowLeft']) {
      this.player.velX = -this.player.speed;
    } else if (this.keys['ArrowRight']) {
      this.player.velX = this.player.speed;
    } else {
      this.player.velX *= this.friction;
    }
    
    if ((this.keys['ArrowUp'] || this.keys['Space']) && this.player.grounded) {
      this.player.velY = -this.player.jumpPower;
      this.player.grounded = false;
    }
  }
  
  updatePhysics() {
    this.player.velY += this.gravity;
    this.player.x += this.player.velX;
    this.player.y += this.player.velY;
    
    // World boundaries
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.y > this.canvas.height) {
      this.callbacks.onGameOver();
      return;
    }
  }
  
  checkCollisions() {
    this.player.grounded = false;
    
    // Platform collisions
    this.platforms.forEach(platform => {
      if (this.player.x < platform.x + platform.width &&
          this.player.x + this.player.width > platform.x &&
          this.player.y < platform.y + platform.height &&
          this.player.y + this.player.height > platform.y) {
        
        // Landing on top
        if (this.player.velY > 0 && this.player.y < platform.y) {
          this.player.y = platform.y - this.player.height;
          this.player.velY = 0;
          this.player.grounded = true;
        }
      }
    });
    
    // Heart collisions
    this.hearts.forEach(heart => {
      if (!heart.collected &&
          this.player.x < heart.x + 20 &&
          this.player.x + this.player.width > heart.x &&
          this.player.y < heart.y + 20 &&
          this.player.y + this.player.height > heart.y) {
        
        heart.collected = true;
        this.score++;
        this.callbacks.onScoreChange(this.score);
      }
    });
    
    // Goal collision
    if (this.goal && !this.goal.reached &&
        this.player.x < this.goal.x + this.goal.width &&
        this.player.x + this.player.width > this.goal.x &&
        this.player.y < this.goal.y + this.goal.height &&
        this.player.y + this.player.height > this.goal.y) {
      
      this.goal.reached = true;
      
      if (this.level === 1) {
        // Go to level 2
        this.level = 2;
        this.callbacks.onLevelComplete();
        this.initLevel();
      } else {
        // Victory!
        this.callbacks.onVictory();
      }
    }
  }
  
  updateCamera() {
    this.camera.x = this.player.x - this.canvas.width / 2;
    if (this.camera.x < 0) this.camera.x = 0;
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = this.level === 1 ? '#87CEEB' : '#FFB6C1';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.translate(-this.camera.x, 0);
    
    // Draw platforms
    this.platforms.forEach(platform => {
      this.ctx.fillStyle = platform.color;
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add some texture
      this.ctx.fillStyle = 'rgba(255, 255, 255)';
      this.ctx.fillRect(platform.x, platform.y, platform.width, 5);
    });
    
    // Draw hearts
    this.hearts.forEach(heart => {
      if (!heart.collected) {
        this.ctx.font = '20px Arial';
        this.ctx.fillText('💖', heart.x, heart.y + 20);
      }
    });
    
    // Draw goal
    if (this.goal && !this.goal.reached) {
      this.ctx.font = '30px Arial';
      this.ctx.fillText('👸', this.goal.x, this.goal.y + 35);
      
      // Add sparkles around the goal
      const time = Date.now() * 0.01;
      for (let i = 0; i < 3; i++) {
        const sparkleX = this.goal.x + 20 + Math.sin(time + i) * 25;
        const sparkleY = this.goal.y + 20 + Math.cos(time + i * 0.7) * 15;
        this.ctx.font = '12px Arial';
        this.ctx.fillText('✨', sparkleX, sparkleY);
      }
    }
    
    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw player face
    this.ctx.font = '25px Arial';
    this.ctx.fillText('🤴', this.player.x - 3, this.player.y + 25);
    
    this.ctx.restore();
    
    // Draw UI elements
    this.ctx.fillStyle = '#333';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Level ${this.level}: ${this.level === 1 ? 'Garden of Love' : 'Castle of Hearts'}`, 10, 30);
  }
  
  gameLoop() {
    if (!this.isRunning) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  start() {
    this.isRunning = true;
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
  }
}

export default GameEngine;