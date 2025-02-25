import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';
import { io, Socket } from 'socket.io-client';

const URL = `${process.env.NEXT_PUBLIC_API_SERVER}/${process.env.NEXT_PUBLIC_CLIENT_ID}`;
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false,
  },
);
