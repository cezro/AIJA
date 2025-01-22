export enum Role {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export type Message = {
  role: Role;
  content: string;
};

export type ChatSummary = {
  id: string;
  userId: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};
