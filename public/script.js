const socket = io();

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

canvas.addEventListener("mousedown", (e) => {
    const pos = getPosition(e);
    drawing = true;
    x = pos.x;
    y = pos.y;
    socket.emit("start", { x, y });
});

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const pos = getPosition(e);
    drawLine(x, y, pos.x, pos.y, "black");
    socket.emit("draw", { x1: x, y1: y, x2: pos.x, y2: pos.y });
    x = pos.x;
    y = pos.y;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const pos = getPosition(e);
    drawing = true;
    x = pos.x;
    y = pos.y;
    socket.emit("start", { x, y });
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!drawing) return;
    const pos = getPosition(e);
    drawLine(x, y, pos.x, pos.y, "black");
    socket.emit("draw", { x1: x, y1: y, x2: pos.x, y2: pos.y });
    x = pos.x;
    y = pos.y;
});

canvas.addEventListener("touchend", () => {
    drawing = false;
    ctx.beginPath();
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
