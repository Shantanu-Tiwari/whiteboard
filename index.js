const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let liveUsers = 0;


app.use(express.static("public"));

io.on("connection", (socket) => {
    liveUsers++;
    io.emit("userCount", liveUsers);

    socket.on("start", (data) => {
        socket.broadcast.emit("start", data);
    });

    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
    });
    socket.on('clearCanvas', () => {
        socket.broadcast.emit('clearCanvas');
    });
    socket.on("disconnect", () => {
        liveUsers--;
        io.emit("userCount", liveUsers);
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
