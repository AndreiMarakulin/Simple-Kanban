require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  transports: ["websocket"],
});

const wsRouter = require("./src/sockets");

io.on("connection", async(socket) => {
  // console.log("a user connected");
  await wsRouter(io, socket);
});

const errorHadler = require("./src/middleware/ErrorHandlingMiddleware");
const auth = require("./src/middleware/authMiddleware");
const api = require("./src/routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(auth.initialize({}));
app.use("/api", api);

app.use(errorHadler);

const PORT = process.env.PORT || 12321;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
