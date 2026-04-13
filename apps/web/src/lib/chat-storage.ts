/**
 * Chat persistence using localStorage.
 * Saves conversations so they survive page reloads and navigation.
 */

const STORAGE_KEY = "arbistudio-conversations";
const MAX_CONVERSATIONS = 50;

export interface StoredConversation {
  id: string;
  title: string;
  messages: StoredMessage[];
  imageStyle: string;
  selectedFormats: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  parts: Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
  }>;
  createdAt: string;
}

function getStorage(): StoredConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStorage(conversations: StoredConversation[]) {
  if (typeof window === "undefined") return;
  try {
    // Keep only the most recent conversations
    const trimmed = conversations.slice(0, MAX_CONVERSATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full — remove oldest
    const trimmed = conversations.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

export function listConversations(): StoredConversation[] {
  return getStorage().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getConversation(id: string): StoredConversation | null {
  return getStorage().find((c) => c.id === id) || null;
}

export function saveConversation(conversation: StoredConversation) {
  const all = getStorage();
  const index = all.findIndex((c) => c.id === conversation.id);
  if (index >= 0) {
    all[index] = { ...conversation, updatedAt: new Date().toISOString() };
  } else {
    all.unshift({ ...conversation, updatedAt: new Date().toISOString() });
  }
  setStorage(all);
}

export function deleteConversation(id: string) {
  const all = getStorage().filter((c) => c.id !== id);
  setStorage(all);
}

export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Extract a title from the first user message
 */
export function extractTitle(messages: StoredMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Nueva conversacion";
  const text = firstUser.parts?.find((p) => p.type === "text")?.text || "";
  // Remove the [CONTEXT] tag
  const clean = text.replace(/\[CONTEXT:.*?\]\n?/g, "").trim();
  return clean.length > 50 ? clean.slice(0, 50) + "..." : clean || "Nueva conversacion";
}
