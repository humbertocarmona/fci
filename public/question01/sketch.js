// Variáveis para as bolas
let ballA;
let ballB;
let gA = 4.9; // Gravidade inicial para a bola A (m/s^2)
let gB = 9.8; // Gravidade inicial para a bola B (m/s^2)
let t = 0;   // Tempo
let dt = 0.5; // Incremento de tempo em segundos
let groundY;
let heightMeasureInterval = 50; // Intervalo de medição de altura
let startButtonA, startButtonB, startButtonC;
let simulationStarted = false; // Variável para controlar a simulação

function setup() {
  createCanvas(600, 500);
  groundY = height - 100; // Definindo a posição y do solo
  
  // Inicializando as bolas
  ballA = new Ball(100, 0, gA, 'A'); // Posição x, y, gravidade e rótulo
  ballB = new Ball(300, 0, gB, 'B'); // Posição x diferente para visualização, gravidade e rótulo

  // Criar botão de ajuste A
  startButtonA = createButton('ITEM A: aproximadamente a metade do tempo para a bola mais pesada em comparação com a mais leve.');
  startButtonA.position(10, height + 10);
  startButtonA.mousePressed(startSimulationA);

  // Criar botão de ajuste B
  startButtonB = createButton('ITEM B: aproximadamente a metade do tempo para a bola mais leve em comparação com a mais pesada');
  startButtonB.position(10, height + 40);
  startButtonB.mousePressed(startSimulationB);

  // Criar botão de ajuste C
  startButtonC = createButton('ITEM C: aproximadamente o mesmo para ambas as bolas');
  startButtonC.position(10, height + 70);
  startButtonC.mousePressed(startSimulationC);
  
  // Criar botão de ajuste D
  startButtonD = createButton('ITEM D: consideravelmente menor para a bola mais pesada, mas não necessariamente a metade do tempo.');
  startButtonD.position(10, height + 100);
  startButtonD.mousePressed(startSimulationD);
  
   // Criar botão de ajuste E
  startButtonE = createButton('ITEM E: consideravelmente menor para a bola mais leve, mas não necessariamente a metade do tempo.');
  startButtonE.position(10, height + 130);
  startButtonE.mousePressed(startSimulationE);
}

function draw() {
  background(220);
  
  // Desenhar o solo
  fill(100);
  rect(0, groundY, width, height - groundY);
  
  // Desenhar a régua vertical
  drawHeightRuler();
  
  // Mostrar informações sobre as bolas
  displayBallInfo();
  
  if (simulationStarted) {
    // Atualizar a posição das bolas
    ballA.update(dt);
    ballB.update(dt);
    
    // Incrementar o tempo
    t += dt;
  }
  
  // Desenhar as bolas
  ballA.show();
  ballB.show();
  
  // Exibir cronômetros e verificar se as bolas atingiram o solo
  checkAndDisplayTimer(ballA);
  checkAndDisplayTimer(ballB);
}
function startSimulationA() {
  ballA.gravity = 2.44; // Ajustar a gravidade da bola A
  ballB.gravity = 9.8; // Ajustar a gravidade da bola B
  simulationStarted = true;
  resetSimulation(); // Resetar a simulação após ajuste
}

function startSimulationB() {
  ballA.gravity = 9.8; // Ajustar a gravidade da bola A
  ballB.gravity = 2.44; // Ajustar a gravidade da bola B
  simulationStarted = true;
  resetSimulation(); // Resetar a simulação após ajuste
}

function startSimulationC() {
  ballA.gravity = 9.8; // Ajustar a gravidade da bola A
  ballB.gravity = 9.8; // Ajustar a gravidade da bola B
  simulationStarted = true;
  resetSimulation(); // Resetar a simulação após ajuste
}
function startSimulationD() {
  ballA.gravity = 4.9; // Ajustar a gravidade da bola A
  ballB.gravity = 9.8; // Ajustar a gravidade da bola B
  simulationStarted = true;
  resetSimulation(); // Resetar a simulação após ajuste
}

function startSimulationE() {
  ballA.gravity = 9.8; // Ajustar a gravidade da bola A
  ballB.gravity = 4.9; // Ajustar a gravidade da bola B
  simulationStarted = true;
  resetSimulation(); // Resetar a simulação após ajuste
}
function resetSimulation() {
  t = 0;
  ballA.reset();
  ballB.reset();
}

function checkAndDisplayTimer(ball) {
  displayTimer(ball);
  if (ball.y >= groundY - ball.radius) {
    ball.stopTimer();
  }
}

function displayTimer(ball) {
  fill(0);
  textSize(16);
  textAlign(CENTER, TOP);
  text("Tempo: " + ball.timer.toFixed(1) + "s", ball.x, ball.y + ball.radius + 10);
}

function drawHeightRuler() {
  fill(0);
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= height; i += heightMeasureInterval) {
    let y = map(i, 0, height, groundY, 0);
    line(width - 20, y, width, y); // Linha da régua
    text(i/400 + "m", width - 25, y); // Rótulo da altura
  }
}

function displayBallInfo() {
  fill(0);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text("Bola A: Massa = 1x", 10, groundY + 30);
  text("Bola B: Massa = 2x", 10, groundY + 50);
}

class Ball {
  constructor(x, y, gravity, label) {
    this.gravity = gravity;
    this.radius = 20;
    this.x = x;
    this.y = y+this.radius;
    this.velocity = 0;
    this.timer = 0;
    this.timerStopped = false;
    this.label = label;
  }
  
  update(dt) {
    if (!this.timerStopped) {
      // Atualizar o cronômetro
      this.timer += dt;
      
      // Atualizar a velocidade e posição com base na física
      this.velocity += this.gravity * dt;
      this.y += this.velocity * dt;
      
      // Verificar se a bola atingiu o solo
      if (this.y >= groundY - this.radius) {
        this.y = groundY - this.radius; // Ajustar a posição da bola para o topo do solo
        this.velocity = 0; // Parar a bola
        this.stopTimer(); // Parar o cronômetro
      }
    }
  }
  
  show() {
    fill(127);
    ellipse(this.x, this.y, this.radius * 2);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.label, this.x, this.y);
  }
    stopTimer() {
    this.timerStopped = true;
  }
    reset() {
    this.y = 0;
    this.velocity = 0;
    this.timer = 0;
    this.timerStopped = false;
  }
}
