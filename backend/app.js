const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = 3001;
const index = require("./routes/index");

var logger = require('morgan');
const app = express();


const server = http.createServer(app);
app.use(logger("My custom logging :status :method :url :res[content-length] - and it took :response-time ms"))

app.use("/new", index);

server.listen(port, () => console.log(`Listening on port ${port}`));

const io = socketIo(server, { cors: { origin: "*" } });

let interval;

io.on("connection", (socket) => {
    console.log("New socket client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    })
});

const getApiAndEmit = (socket) => {
    const response = new Date();
    socket.emit("GetTime", response);
}