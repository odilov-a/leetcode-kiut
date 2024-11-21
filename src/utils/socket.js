const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} rejoined room ${room}`);
    });
    socket.on("chatMessage", (data) => {
      const { room, message, sender } = data;
      const timestamp = new Date().toISOString();
      io.to(room).emit("newMessage", { message, sender, timestamp });
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
