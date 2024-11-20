const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });
    socket.on("chatMessage", (data) => {
      const { room, message } = data;
      io.to(room).emit("newMessage", { message, sender: socket.id });
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocket };
