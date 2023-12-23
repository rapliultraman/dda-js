const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize
const initialVelocityInput = document.getElementById("velocity");
const outputVelocity = document.getElementById("vOutput");
outputVelocity.innerHTML = initialVelocityInput.value;

initialVelocityInput.oninput = function() {
  outputVelocity.innerHTML = this.value;
}

const initialAngleInput = document.getElementById("angel");
const outputAngle = document.getElementById("aOutput");
outputAngle.innerHTML = initialAngleInput.value;

initialAngleInput.oninput = function() {
  outputAngle.innerHTML = this.value;
}

const initialGravityInput = document.getElementById("gravity");
const outputGravity = document.getElementById("gOutput");
outputGravity.innerHTML = initialGravityInput.value;

initialGravityInput.oninput = function() {
  outputGravity.innerHTML = this.value;
}

let x = 0;
let y = canvas.height;
let time = 0;

function drawProjectile() {
  const initialVelocity = parseFloat(initialVelocityInput.value);
  const initialAngle = (parseFloat(initialAngleInput.value) / 180) * Math.PI;
  const initialGravity = parseFloat(initialGravityInput.value);
  
  const vx = initialVelocity * Math.cos(initialAngle);
  const vy = initialVelocity * Math.sin(initialAngle) - initialGravity * time;

  x += vx;
  y -= vy;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  if (y > canvas.height || x > canvas.width) {
    clearInterval(interval);
  }

  time += 0.1;
}

const interval = setInterval(drawProjectile, 30);

