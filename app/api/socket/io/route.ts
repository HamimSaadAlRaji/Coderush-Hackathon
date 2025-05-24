import { NextRequest } from "next/server";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: SocketIOServer;

export async function GET(req: NextRequest) {
  if (!io) {
    const httpServer = (req as any).socket?.server as NetServer;
    io = new SocketIOServer(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
      });

      socket.on("send-message", (message) => {
        console.log("Broadcasting message:", message);
        socket.to(message.conversationId).emit("receive-message", message);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket server initialized", { status: 200 });
}