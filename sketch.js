let fireworks = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); // Fondo azul oscuro

  // Crear estrellas estáticas
  for (let i = 0; i < 100; i++) {
    stars.push(createVector(random(width), random(height)));
  }
}

function draw() {
  // Actualizar y mostrar los fuegos artificiales
  background(0, 25); // Agregar un poco de transparencia para crear un efecto de rastro
  fill(255);
  noStroke();
  for (let star of stars) {
    ellipse(star.x, star.y, 2, 2);
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].isFinished()) {
      fireworks.splice(i, 1);
    }
  }
}

function mousePressed() {
  let firework = new Firework(mouseX, mouseY);
  fireworks.push(firework);
}

class Firework {
  constructor(x, y) {
    this.firework = new Particle(x, y, true);
    this.exploded = false;
    this.particles = [];
    this.size = random(5, 10); // Tamaño aleatorio
    this.color = color(random(255), random(255), random(255)); // Color aleatorio
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, 0.2));
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(p5.Vector.random2D().mult(0.05)); // Aplicar una fuerza aleatoria
      this.particles[i].update();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    if (!this.exploded) {
      this.firework.display();
    }

    for (let particle of this.particles) {
      particle.display();
    }
  }

  isFinished() {
    return this.exploded && this.particles.length === 0;
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      let r = random(255);
      let g = random(255);
      let b = random(255);
      let speed = random(2, 10); // Velocidad aleatoria para las partículas de la explosión
      let particleSize = random(2, 5); // Tamaño aleatorio para las partículas de la explosión
      let particle = new Particle(this.firework.pos.x, this.firework.pos.y, false, color(r, g, b), particleSize, speed);
      this.particles.push(particle);
    }
  }
}

class Particle {
  constructor(x, y, firework, pcolor, size, speed) {
    this.pos = createVector(x, y);
    this.firework = firework;
    if (this.firework) {
      this.vel = createVector(random(-2, 2), random(-10, -5)); // Velocidad inicial con movimiento horizontal
      this.lifespan = 255;
    } else {
      this.vel = p5.Vector.random2D().mult(speed); // Velocidad aleatoria para las partículas con magnitud ajustable
      this.lifespan = 255;
    }
    this.acc = createVector(0, 0);
    this.color = pcolor || color(255); // Color aleatorio o el color especificado
    this.size = size || 2; // Tamaño de la partícula
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9); // Hacer que la caída sea más lenta
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    strokeWeight(2);
    stroke(this.color, this.lifespan);
    fill(this.color, this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size, this.size); // Usar el tamaño de la partícula
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}




