let ball1, ball2;
let gravity = 9.8; // Aceleração devido à gravidade
let velocity = 1; // Velocidade inicial horizontal
let impactPoints = []; // Lista para armazenar os pontos de impacto
let tableEdgeX; // Posição X da borda da mesa
let currentBallIndex = 0; // Índice da bola atual (0 para ball1, 1 para ball2)
let balls; // Array de bolas
let itemAButton, itemBButton, itemCButton, itemDButton, itemEButton;
let startSimulation = false; // Controle para iniciar a simulação
let massFactorA = 1; // Fator de massa para a bola A
let massFactorB = 1; // Fator de massa para a bola B

function setup() {
  createCanvas(700, 400);
  tableEdgeX = 50 + (width - 600); // Calculando a posição da borda da mesa
  // Criando as bolas com diferentes massas
  ball1 = new Ball(tableEdgeX, height - 160, 20, 'A'); // Ball(x, y, diameter, label)
  ball2 = new Ball(tableEdgeX, height - 160, 20, 'B');
  balls = [ball1, ball2];

  // Criando o botão ITEM A
  itemAButton = createButton("Opção A");
  itemAButton.position(width + 70, height / 2 - 60);
  itemAButton.mousePressed(applyEqualGravity);

  // Criando o botão ITEM B
  itemBButton = createButton("Opção B");
  itemBButton.position(width + 70, height / 2 - 30);
  itemBButton.mousePressed(applyHalfDistanceB);

  // Criando o botão ITEM C
  itemCButton = createButton("Opção C");
  itemCButton.position(width + 70, height / 2);
  itemCButton.mousePressed(applyHalfDistanceA);

  // Criando o botão ITEM D
  itemDButton = createButton("Opção D");
  itemDButton.position(width + 70, height / 2 + 30);
  itemDButton.mousePressed(applyShorterDistanceB);

  // Criando o botão ITEM E
  itemEButton = createButton("Opção E");
  itemEButton.position(width + 70, height / 2 + 60);
  itemEButton.mousePressed(applyShorterDistanceA);

  startButtonR = createButton("Resetar");
  startButtonR.position(width + 70, height / 2 + 90);
  startButtonR.mousePressed(restartSimulation);
  startButtonR.style("text-align", "left");
}

function draw() {
  background(220);

  // Desenhando o solo
  fill(100); // Cor cinza escuro
  rect(0, height - 10, width, 10); // Retângulo representando o solo

  // Desenhando a mesa com comprimento menor
  fill(139, 69, 19); // Cor marrom
  rect(50, height - 150, width - 600, 10); // Retângulo representando a mesa (comprimento menor)

  // Desenhando as réguas
  drawRuler();

  if (startSimulation) {
    // Atualizando e desenhando a bola atual
    balls[currentBallIndex].update();
    balls[currentBallIndex].display();

    // Verificando se a bola atual atingiu o solo e passando para a próxima bola
    if (balls[currentBallIndex].hasHitGround()) {
      if (currentBallIndex < balls.length - 1) {
        currentBallIndex++;
      }
    }
  }

  // Desenhando os pontos de impacto
  drawImpactPoints();

  // Desenhando os painéis de informação
  drawInfoPanels();
}

class Ball {
  constructor(x, y, diameter, label) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.label = label;
    this.velocityX = velocity; // Velocidade horizontal inicial
    this.velocityY = 0; // Velocidade vertical inicial
    this.onTable = true; // Estado inicial: bola está na mesa
    this.startTime = 0; // Tempo inicial para quando a bola cai
    this.impactX = null; // Posição X de impacto
    this.massFactor = 1; // Fator de multiplicação para a massa da bola (1 para ambos inicialmente)
  }

  update() {
    // Atualizando a posição horizontal da bola enquanto estiver na mesa
    if (this.onTable) {
      this.x += this.velocityX;

      // Verificando se a bola saiu da borda da mesa
      if (this.x + this.diameter / 2 > tableEdgeX) {
        this.onTable = false; // Bola saiu da mesa
        this.startTime = millis(); // Tempo inicial quando a bola cai
        this.startY = this.y; // Posição vertical inicial quando a bola sai da mesa
      }
    }

    // Atualizando a posição vertical e horizontal da bola quando sair da mesa
    if (!this.onTable) {
      let t = (millis() - this.startTime) / 1000; // Tempo em segundos desde que a bola saiu da mesa
      this.y = this.startY + 0.5 * gravity * t * t;
      this.x += this.velocityX * this.massFactor; // Ajustando a posição horizontal com base no fator de massa

      // Verificando se a bola atingiu o solo
      if (this.y + this.diameter / 2 >= height - 10) {
        // Bola atingiu o chão, parar a velocidade vertical
        this.velocityY = 0;
        // Evitando que a bola afunde no chão
        this.y = height - 10 - this.diameter / 2;
        this.velocityX = 0; // Parar a velocidade horizontal

        // Adicionando ponto de impacto na lista
        if (this.impactX === null) {
          this.impactX = this.x - tableEdgeX; // Calculando a distância a partir da borda da mesa
          impactPoints.push({ x: this.x, label: this.label });
        }
      }
    }
  }

  display() {
    // Desenhando a bola
    fill(255); // Cor branca para as bolas
    ellipse(this.x, this.y, this.diameter);
    // Desenhando a letra no centro da bola
    fill(0); // Cor preta para a letra
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }

  hasHitGround() {
    // Verifica se a bola atingiu o solo
    return this.y + this.diameter / 2 >= height - 10;
  }
}

function drawImpactPoints() {
  fill(255, 0, 0); // Cor vermelha para os pontos de impacto
  for (let point of impactPoints) {
    ellipse(point.x, height - 10, 5, 5); // Desenhando o ponto de impacto
    text(point.label, point.x, height - 20); // Desenhando a letra da bola no ponto de impacto
  }
}

function drawRuler() {
  stroke(0);

  // Desenhando a régua horizontal
  for (let i = 0; i < width; i += 10) {
    line(i, height - 10, i, height - 5);
    if (i % 50 === 0) {
      text(i, i, height - 15);
    }
  }

  // Desenhando a régua vertical passando pelo ponto de lançamento da bola
  for (let j = height - 10; j >= 0; j -= 10) {
    line(tableEdgeX, j, tableEdgeX - 5, j);
    if ((height - j) % 50 === 0) {
      text(height - j, tableEdgeX - 15, j);
    }
  }
}

function drawInfoPanels() {
  fill(255); // Cor branca para os painéis
  rect(10, 10, 220, 60); // Painel para os alcances horizontais
  rect(10, 80, 220, 30); // Painel para a altura de lançamento

  fill(0); // Cor preta para o texto
  textSize(12);

  // Exibindo os alcances horizontais das bolas
  textAlign(LEFT, TOP);
  text("Alcances Horizontais (a partir da borda):", 15, 15);
  text("Bola A: " + (ball1.impactX !== null ? nf(ball1.impactX, 1, 2) + " px" : "Em curso"), 15, 30);
  text("Bola B: " + (ball2.impactX !== null ? nf(ball2.impactX, 1, 2) + " px" : "Em curso"), 15, 45);

  // Exibindo a altura de lançamento
  text("Altura de Lançamento:", 15, 85);
  text(nf(height - 250, 1, 2) + " px", 15, 100);
}

function restartSimulation() {
  // Reinicializando as bolas e os pontos de impacto
  ball1 = new Ball(tableEdgeX, height - 160, 20, 'A');
  ball2 = new Ball(tableEdgeX, height - 160, 20, 'B');
  ball1.massFactor = massFactorA;
  ball2.massFactor = massFactorB;
  balls = [ball1, ball2];
  currentBallIndex = 0;
  impactPoints = [];
  startSimulation = false; 
}

function applyEqualGravity() {
  // Aplicando a gravidade igual para ambas as bolas
  massFactorA = 1; // Sem ajuste de distância
  massFactorB = 1; // Sem ajuste de distância
  restartSimulation();
  startSimulation = true; // Iniciar a simulação
}

function applyHalfDistanceB() {
  // Aplicando a condição para que a bola B percorra metade da distância horizontal em relação à bola A
  massFactorA = 1; // Fator de massa padrão para a bola A
  massFactorB = 0.5; // Fator de massa para a bola B
  restartSimulation();
  startSimulation = true; // Iniciar a simulação
}

function applyHalfDistanceA() {
  // Aplicando a condição para que a bola A percorra metade da distância horizontal em relação à bola B
  massFactorA = 0.5; // Fator de massa para a bola A
  massFactorB = 1; // Fator de massa padrão para a bola B
  restartSimulation();
  startSimulation = true; // Iniciar a simulação
}

function applyShorterDistanceB() {
  // Aplicando a condição para que a bola B percorra uma distância menor em relação à bola A
  massFactorA = 1; // Fator de massa padrão para a bola A
  massFactorB = 0.75; // Fator de massa menor para a bola B
  restartSimulation();
  startSimulation = true; // Iniciar a simulação
}

function applyShorterDistanceA() {
  // Aplicando a condição para que a bola A percorra uma distância menor em relação à bola B
  massFactorA = 0.75; // Fator de massa menor para a bola A
  massFactorB = 1; // Fator de massa padrão para a bola B
  restartSimulation();
  startSimulation = true; // Iniciar a simulação
}
