import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertChatSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

interface WSMessage {
  type: string;
  payload: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const clients = new Map<number, WebSocket>();

  app.post('/api/auth/register', async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      res.status(400).json({ error: message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(user);
  });

  app.get('/api/relievers', async (req, res) => {
    const relievers = await storage.getRelievers();
    res.json(relievers);
  });

  app.patch('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      res.status(400).json({ error: message });
    }
  });

  wss.on('connection', (ws) => {
    let userId: number | null = null;

    ws.on('message', async (data) => {
      try {
        const wsMessage: WSMessage = JSON.parse(data.toString());

        switch (wsMessage.type) {
          case 'identify': {
            userId = wsMessage.payload.userId;
            if (userId) clients.set(userId, ws);
            break;
          }

          case 'start_chat': {
            const chatData = insertChatSchema.parse(wsMessage.payload);
            const newChat = await storage.createChat(chatData);

            if (newChat.relieverId) {
              const reliever = await storage.getUser(newChat.relieverId);
              const relieverWs = clients.get(newChat.relieverId);

              if (reliever && relieverWs?.readyState === WebSocket.OPEN) {
                relieverWs.send(JSON.stringify({
                  type: 'chat_request',
                  payload: newChat
                }));
              }
            }
            break;
          }

          case 'send_message': {
            const msgData = insertMessageSchema.parse(wsMessage.payload);
            const newMessage = await storage.createMessage(msgData);

            if (newMessage.chatId) {
              const existingChat = await storage.getChat(newMessage.chatId);

              if (existingChat?.relieverId) {
                const relieverWs = clients.get(existingChat.relieverId);
                if (relieverWs?.readyState === WebSocket.OPEN) {
                  relieverWs.send(JSON.stringify({
                    type: 'new_message',
                    payload: newMessage
                  }));
                }
              }
            }
            break;
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        ws.send(JSON.stringify({ type: 'error', payload: message }));
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
        storage.updateUser(userId, { online: false }).catch(console.error);
      }
    });
  });

  return httpServer;
}