import { users, chats, messages, type User, type InsertUser, type Chat, type InsertChat, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  getRelievers(): Promise<User[]>;

  // Chat operations  
  createChat(chat: InsertChat): Promise<Chat>;
  getChat(id: number): Promise<Chat | undefined>;
  getChatsByReliever(relieverId: number): Promise<Chat[]>;
  updateChatStatus(id: number, status: string): Promise<void>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getChatMessages(chatId: number): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private currentId: { users: number; chats: number; messages: number };

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.currentId = { users: 1, chats: 1, messages: 1 };

    // Add some test relievers
    [
      {
        username: "Emma Thompson",
        password: "password123",
        isReliever: true,
        bio: "Certified counselor with 5 years of experience in stress management and anxiety relief.",
        skills: ["Active Listening", "Stress Management", "Anxiety Relief"],
        moodExpertise: ["Stressed", "Anxious", "Neutral"],
        online: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
      },
      {
        username: "David Chen",
        password: "password123",
        isReliever: true,
        bio: "Experienced in helping people navigate through difficult emotions and find their inner peace.",
        skills: ["Emotional Support", "Meditation", "Mindfulness"],
        moodExpertise: ["Sad", "Anxious", "Happy"],
        online: false,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
      },
      {
        username: "Sarah Wilson",
        password: "password123",
        isReliever: true,
        bio: "Specializing in positive psychology and helping people maintain their excitement and motivation.",
        skills: ["Positive Psychology", "Goal Setting", "Motivation"],
        moodExpertise: ["Happy", "Excited", "Neutral"],
        online: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      }
    ].forEach(reliever => this.createUser(reliever));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      isReliever: insertUser.isReliever ?? false,
      avatar: insertUser.avatar ?? null,
      skills: insertUser.skills ?? null,
      bio: insertUser.bio ?? null,
      moodExpertise: insertUser.moodExpertise ?? null,
      online: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getRelievers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.isReliever);
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const id = this.currentId.chats++;
    const newChat: Chat = {
      id,
      relieverId: chat.relieverId,
      userAlias: chat.userAlias,
      status: chat.status,
      createdAt: new Date()
    };
    this.chats.set(id, newChat);
    return newChat;
  }

  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getChatsByReliever(relieverId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.relieverId === relieverId
    );
  }

  async updateChatStatus(id: number, status: string): Promise<void> {
    const chat = await this.getChat(id);
    if (!chat) throw new Error("Chat not found");
    this.chats.set(id, { ...chat, status });
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentId.messages++;
    const newMessage: Message = {
      id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      createdAt: new Date()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.chatId === chatId)
      .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0));
  }
}

export const storage = new MemStorage();