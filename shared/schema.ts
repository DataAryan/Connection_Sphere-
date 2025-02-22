import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moods = ['Happy', 'Sad', 'Stressed', 'Anxious', 'Neutral', 'Excited'] as const;
export type Mood = typeof moods[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isReliever: boolean("is_reliever").default(false).notNull(),
  avatar: text("avatar"),
  skills: text("skills").array(),
  bio: text("bio"),
  moodExpertise: text("mood_expertise").array(),
  online: boolean("online").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  relieverId: integer("reliever_id").references(() => users.id),
  userAlias: text("user_alias").notNull(),
  status: text("status").notNull(), // active, ended
  createdAt: timestamp("created_at").defaultNow()
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id),
  senderId: text("sender_id").notNull(), // user ID or alias
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    isReliever: true,
    avatar: true,
    skills: true,
    bio: true,
    moodExpertise: true
  });

export const insertChatSchema = createInsertSchema(chats)
  .pick({
    relieverId: true,
    userAlias: true,
    status: true
  });

export const insertMessageSchema = createInsertSchema(messages)
  .pick({
    chatId: true,
    senderId: true,
    content: true
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;