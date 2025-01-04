const socket = io();

const canvas = document.getElementById("canvas");
canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let drawing = false;
let x = 0;
let y = 0;

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    x = e.offsetX;
    y = e.offsetY;
    socket.emit("start", { x, y });
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const newX = e.offsetX;
    const newY = e.offsetY;
    drawLine(x, y, newX, newY, "black");
    socket.emit("draw", { x1: x, y1: y, x2: newX, y2: newY });
    x = newX;
    y = newY;
});

function drawLine(x1, y1, x2, y2, color = "black") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

socket.on("start", (data) => {
    ctx.moveTo(data.x, data.y);
});

socket.on("draw", (data) => {
    drawLine(data.x1, data.y1, data.x2, data.y2, "black");
});
