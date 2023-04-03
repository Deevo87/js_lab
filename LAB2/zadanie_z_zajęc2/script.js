var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');        

const a = 2 * Math.PI / 6;
const r = 10;
const b = 2 * Math.PI;

const main = () => {
    drawHexagon(r, r);
    drawCircle(b);
    drawTriangle();
}

function drawHexagon(x, y) {
    ctx.beginPath();
    ctx.strokeStyle='#ff7400';
    ctx.fillStyle='#e76f51';
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}


function drawCircle(R) {
    ctx.beginPath();
    ctx.strokeStyle='#ffc100';
    ctx.fillStyle='#ffc100';
    ctx.arc(10, 12, 5, 0, R);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function drawTriangle() {
    ctx.moveTo(2, 6);
    ctx.lineTo(10, 2);
    ctx.lineTo(20, 6);

    ctx.fill();
}

document.addEventListener('DOMContentLoaded', main);
