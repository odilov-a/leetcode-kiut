const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinPrivateRoom", (senderId, receiverId) => {
      const room = `room_${senderId}_${receiverId}`;
      socket.join(room);
      console.log(`User ${socket.id} joined private room ${room}`);
    });

    socket.on("privateChatMessage", (data) => {
      const { senderId, receiverId, message } = data;
      const room = `room_${senderId}_${receiverId}`;
      const timestamp = new Date().toISOString();
      io.to(room).emit("newPrivateMessage", { message, senderId, timestamp });
      socket.emit("messageReceived", { status: "Message delivered" });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
