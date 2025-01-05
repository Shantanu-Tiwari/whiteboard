const canvas = document.getElementById("canvas");
canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let drawing = false;
let x = 0;
let y = 0;

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();
    if (event.touches) {
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top,
        };
    } else {
        return {
            x: event.offsetX,
            y: event.offsetY,
        };
    }
}

function startDrawing(event) {
    event.preventDefault();
    const pos = getPosition(event);
    drawing = true;
    x = pos.x;
    y = pos.y;
}

function draw(event) {
    if (!drawing) return;
    const pos = getPosition(event);
    drawLine(x, y, pos.x, pos.y, "black");
    x = pos.x;
    y = pos.y;
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function drawLine(x1, y1, x2, y2, color = "black") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
