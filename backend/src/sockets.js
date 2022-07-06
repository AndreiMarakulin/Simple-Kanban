module.exports = async(io, socket) => {
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
      socket.on("message", (msg) => {
        console.log("message", msg);
      });
}