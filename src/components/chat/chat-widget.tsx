"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getBotReply } from "@/lib/chat/get-bot-reply";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: number;
  role: "user" | "bot";
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 0,
    role: "bot",
    text: "こんにちは!ConstructFlow AIアシスタントです。\n案件・顧客・見積など、このシステムの使い方についてお気軽にご質問ください。",
  },
];

function BotAvatar() {
  return (
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarFallback className="bg-primary/10 text-primary">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5">
        <div className="flex gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: nextIdRef.current++, role: "user", text },
    ]);
    setIsTyping(true);
    try {
      const reply = await getBotReply(text);
      setMessages((prev) => [
        ...prev,
        { id: nextIdRef.current++, role: "bot", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextIdRef.current++,
          role: "bot",
          text: "すみません、応答の取得に失敗しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-20 z-50 flex h-[min(560px,calc(100dvh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-xl">
          <div className="flex items-center gap-3 border-b bg-primary px-4 py-3 text-primary-foreground">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                ConstructFlow AIアシスタント
              </p>
              <p className="text-xs text-primary-foreground/80">
                システムの使い方をご案内します
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              onClick={() => setOpen(false)}
              aria-label="チャットを閉じる"
            >
              <X />
            </Button>
          </div>

          <p className="border-b bg-muted/50 px-4 py-1.5 text-[11px] text-muted-foreground">
            ※デモ用のモック応答です。実際のAI APIには接続していません
          </p>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) =>
              message.role === "bot" ? (
                <div key={message.id} className="flex items-end gap-2">
                  <BotAvatar />
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm whitespace-pre-wrap">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm whitespace-pre-wrap text-primary-foreground">
                    {message.text}
                  </div>
                </div>
              )
            )}
            {isTyping && <TypingIndicator />}
          </div>

          <form
            className="flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="質問を入力…"
              aria-label="質問を入力"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              aria-label="送信"
            >
              <Send />
            </Button>
          </form>
        </div>
      )}

      <Button
        size="icon-lg"
        className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={
          open ? "AIアシスタントを閉じる" : "AIアシスタントを開く"
        }
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </>
  );
}
