import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/socket';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-conversation', (conversationId: string) => {
        socket.join(conversationId);
      });

      socket.on('leave-conversation', (conversationId: string) => {
        socket.leave(conversationId);
      });

      socket.on('send-message', (data) => {
        socket.to(data.conversationId).emit('receive-message', data);
      });

      socket.on('typing', (data) => {
        socket.to(data.conversationId).emit('user-typing', data);
      });

      socket.on('stop-typing', (data) => {
        socket.to(data.conversationId).emit('user-stop-typing', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;