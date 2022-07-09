const boardModel = require("./model/boardModel");

/**
 * @param {import("socket.io").Server} io 
 * @param {import("socket.io").Socket} socket 
 */
module.exports = async (io, socket) => {
  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });

  socket.on("changeCardOrder", async (msg) => {
    const {boardId, sourceList, destinationList} = msg;
    await Promise.all([
      boardModel.updateCardOrder(boardId, sourceList.id, sourceList.cardOrder),
      boardModel.updateCardOrder(
        boardId,
        destinationList.id,
        destinationList.cardOrder
      ),
    ]);

    // console.log({"success": true})
    socket.broadcast.emit("changeCardOrder", msg);
    // io.emit("changeCardOrder", msg);
  });
};
