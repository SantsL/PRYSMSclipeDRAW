const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors()); // Permite que qualquer domínio acesse (ideal para dev)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Durante o desenvolvimento. Troque por seu domínio depois.
    methods: ["GET", "POST"]
  }
});

// Eventos de conexão
io.on("connection", (socket) => {
  console.log(`✅ Novo usuário conectado: ${socket.id}`);

  // Entrar em uma sala
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`👤 ${socket.id} entrou na sala ${room}`);
    io.to(room).emit("message", `Um novo jogador entrou na sala ${room}`);
  });

  // Receber desenho
  socket.on("draw", (data) => {
    io.to(data.room).emit("draw", data); // Envia para todos da sala
  });

  // Receber chat
  socket.on("chat", (data) => {
    io.to(data.room).emit("chat", data); // Envia mensagem para a sala
  });

  // Desconectar
  socket.on("disconnect", () => {
    console.log(`❌ Usuário desconectado: ${socket.id}`);
  });
});

// Usa a porta dinâmica exigida pelo Railway
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.IO rodando na porta ${PORT}`);
});
