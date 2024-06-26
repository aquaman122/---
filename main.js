const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const groundHeight = 50;

const mortar = {
    x: 100,
    y: canvas.height - groundHeight,
    angle: 45,
    power: 50,
};

const target = {
    x: Math.random() * (canvas.width - 100) + 50,
    y: canvas.height - groundHeight - 10,
    radius: 10,
};

let projectiles = [];

function drawGround() {
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

function drawMortar() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(mortar.x, mortar.y, 10, 0, Math.PI * 2);
    ctx.fill();

    const barrelLength = 30;
    const barrelX = mortar.x + barrelLength * Math.cos(mortar.angle * Math.PI / 180);
    const barrelY = mortar.y - barrelLength * Math.sin(mortar.angle * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(mortar.x, mortar.y);
    ctx.lineTo(barrelX, barrelY);
    ctx.stroke();
}

function drawTarget() {
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawProjectile(projectile) {
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function updateProjectiles() {
    projectiles = projectiles.filter(p => p.y < canvas.height - groundHeight);
    projectiles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;  // gravity
    });
}

function launchProjectile() {
    const angleRad = mortar.angle * Math.PI / 180;
    const vx = mortar.power * Math.cos(angleRad);
    const vy = -mortar.power * Math.sin(angleRad);

    projectiles.push({
        x: mortar.x,
        y: mortar.y,
        vx: vx,
        vy: vy,
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawMortar();
    drawTarget();
    projectiles.forEach(drawProjectile);
}

function update() {
    updateProjectiles();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            mortar.angle = Math.min(mortar.angle + 1, 90);
            break;
        case 'ArrowDown':
            mortar.angle = Math.max(mortar.angle - 1, 0);
            break;
        case 'ArrowLeft':
            mortar.power = Math.max(mortar.power - 1, 10);
            break;
        case 'ArrowRight':
            mortar.power = Math.min(mortar.power + 1, 100);
            break;
        case ' ':
            launchProjectile();
            break;
    }
});

gameLoop();