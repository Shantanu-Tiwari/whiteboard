const socket = io();

const canvas = document.getElementById("canvas");
canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let drawing = false;
let x = 0;
let y = 0;
let color = "#000000";

const colorPicker = document.getElementById("color-picker");
colorPicker.addEventListener("input", (e) => {
    color = e.target.value;
});

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    const position = getPosition(e);
    x = position.x;
    y = position.y;
    socket.emit("start", { x, y, color });
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const position = getPosition(e);
    drawLine(x, y, position.x, position.y, color);
    socket.emit("draw", { x1: x, y1: y, x2: position.x, y2: position.y, color });
    x = position.x;
    y = position.y;
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const position = getPosition(e);
    drawing = true;
    x = position.x;
    y = position.y;
    socket.emit("start", { x, y, color });
});

canvas.addEventListener("touchend", () => {
    e.preventDefault();
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("touchmove", (e) => {
    if (!drawing) return;
    const position = getPosition(e);
    drawLine(x, y, position.x, position.y, color);
    socket.emit("draw", { x1: x, y1: y, x2: position.x, y2: position.y, color });
    x = position.x;
    y = position.y;
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

socket.on("start", (data) => {
    ctx.strokeStyle = data.color;
    ctx.moveTo(data.x, data.y);
});

socket.on("draw", (data) => {
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color);
});
