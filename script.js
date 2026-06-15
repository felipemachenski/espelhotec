const canvas = document.getElementById('mirrorCanvas');
const ctx = canvas.getContext('2d');

// Posição central do espelho (na base do plano horizontal de simulação)
const mirrorY = canvas.height - 80;
const mirrorStartX = 50;
const mirrorEndX = canvas.width - 50;
const centerX = canvas.width / 2;

// Posição inicial do "Laser" (mouse)
let mouseX = 150;
let mouseY = 100;

// Atualiza as coordenadas com o movimento do mouse dentro do canvas
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    
    // Garante que o feixe venha sempre de cima do espelho
    if (mouseY >= mirrorY) {
        mouseY = mirrorY - 5;
    }
});

function drawSimulation() {
    // 1. Limpar tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Desenhar o Solo/Base do Espelho
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, mirrorY, canvas.width, canvas.height - mirrorY);

    // 3. Desenhar a linha Normal (Pontilhada)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, mirrorY);
    ctx.stroke();
    ctx.setLineDash([]); // Reseta linha tracejada

    // Textos auxiliares nas linhas fixas
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Linha Normal', centerX - 45, 15);

    // 4. Desenhar o Espelho Plano (Linha brilhante azul)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(mirrorStartX, mirrorY);
    ctx.lineTo(mirrorEndX, mirrorY);
    ctx.stroke();
    ctx.shadowBlur = 0; // Reseta efeito glow

    // Legenda do Espelho
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Espelho Plano', mirrorStartX, mirrorY + 30);

    // 5. Cálculos de Ângulos (Óptica Geométrica)
    // Vetor do ponto do mouse até o ponto de incidência (centerX, mirrorY)
    const dx = centerX - mouseX;
    const dy = mirrorY - mouseY;
    
    // Ângulo de incidência com a normal (em radianos)
    let angleIncident = Math.atan2(dx, dy);

    // 6. Desenhar Raio Incidente (Vindo do Mouse)
    ctx.strokeStyle = '#ef4444'; // Vermelho laser
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(centerX, mirrorY);
    ctx.stroke();

    // Fonte de luz (bolinha no mouse)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 6, 0, Math.PI * 2);
    ctx.fill();

    // 7. Desenhar Raio Refletido (Lei da Reflexão: Ângulo Incidente = Ângulo Refletido)
    // Calculando o destino do raio refletido para fora do canvas baseado no ângulo simétrico
    const reflectLength = 500; // comprimento longo para sair da tela
    const reflectX = centerX + Math.sin(angleIncident) * reflectLength;
    const reflectY = mirrorY - Math.cos(angleIncident) * reflectLength;

    ctx.strokeStyle = '#22c55e'; // Verde para o raio refletido
    ctx.shadowColor = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(centerX, mirrorY);
    ctx.lineTo(reflectX, reflectY);
    ctx.stroke();
    ctx.shadowBlur = 0; // Desliga o brilho para o resto do desenho

    // 8. Exibir Ângulos na Tela (Convertidos para Graus)
    const angleDegrees = Math.abs(Math.round(angleIncident * (180 / Math.PI)));
    
    ctx.fillStyle = '#ef4444';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Ângulo Incidente (i): ${angleDegrees}°`, 40, 50);

    ctx.fillStyle = '#22c55e';
    ctx.fillText(`Ângulo Refletido (r): ${angleDegrees}°`, canvas.width - 220, 50);

    // Loop de animação contínua
    requestAnimationFrame(drawSimulation);
}

// Inicia a animação
drawSimulation();
