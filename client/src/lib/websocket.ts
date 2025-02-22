import { create } from 'zustand';

interface WebSocketStore {
  socket: WebSocket | null;
  connect: (userId?: number) => void;
  sendMessage: (type: string, payload: any) => void;
}

export const useWebSocket = create<WebSocketStore>((set, get) => ({
  socket: null,
  
  connect: (userId?: number) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      if (userId) {
        socket.send(JSON.stringify({
          type: 'identify',
          payload: { userId }
        }));
      }
    };
    
    set({ socket });
  },
  
  sendMessage: (type: string, payload: any) => {
    const { socket } = get();
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
    }
  }
}));
