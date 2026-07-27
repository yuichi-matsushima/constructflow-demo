import { matchMockResponse } from "./mock-responses";

// 将来 fetch("/api/chat", ...) による実API呼び出しに差し替える想定の境界
export async function getBotReply(message: string): Promise<string> {
  const delay = 500 + Math.random() * 800;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return matchMockResponse(message);
}
