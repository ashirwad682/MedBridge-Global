"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import MedicalAIOrb from "./MedicalAIOrb";
import { ChatMessageData } from "@/app/api/chat/route";
import { useBooking } from "@/components/booking/BookingContext";
import {
  X,
  Plus,
  UserCheck,
  Calendar,
  Layers,
  HelpCircle,
  AlertCircle,
  Activity,
  HeartPulse,
  RotateCcw,
  Minus,
} from "lucide-react";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

const MEDICAL_PROMPT_SUGGESTIONS = [
  {
    id: "find-doctor",
    title: "Find the Right Doctor",
    icon: UserCheck,
    query: "Can you help me find the right doctor across your medical departments?",
  },
  {
    id: "explore-specialties",
    title: "Explore Medical Specialties",
    icon: Layers,
    query: "What medical specialties and clinical capabilities do you offer?",
  },
  {
    id: "book-appointment",
    title: "Book an Appointment",
    icon: Calendar,
    query: "How do I book an appointment on MedBridge?",
    directBooking: true,
  },
  {
    id: "understand-symptoms",
    title: "Understand Symptoms",
    icon: Activity,
    query: "I have symptoms and want to understand which specialist I should consult.",
  },
  {
    id: "general-guidance",
    title: "General Health Guidance",
    icon: HeartPulse,
    query: "What preventative wellness and healthcare guidelines does MedBridge recommend?",
  },
  {
    id: "contact-support",
    title: "Contact Patient Support",
    icon: HelpCircle,
    query: "How can I contact MedBridge care coordinators?",
  },
];

export default function ChatWindow({
  isOpen,
  onClose,
  onMinimize,
}: ChatWindowProps) {
  const { openBooking } = useBooking();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setErrorBanner(null);

    const userMessage: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to AI Assistant. Please try again.");
      }

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        throw new Error("Received an empty response.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorBanner(err.message);
      } else {
        setErrorBanner("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  const handleStartNewConversation = () => {
    setMessages([]);
    setErrorBanner(null);
  };

  if (!isOpen) return null;

  const hasMessages = messages.length > 0;

  return (
    <div
      role="dialog"
      aria-label="MedBridge AI Medical Assistant"
      className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[92vw] sm:w-[410px] md:w-[420px] h-[575px] max-h-[84vh] bg-white/85 dark:bg-[#0c0f1c]/90 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] border border-white/80 dark:border-white/12 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_25px_65px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* 1. Header (Clean, Light with "AI Chat" Title & Controls) */}
      <header className="px-4 sm:px-5 py-3 border-b border-neutral-200/50 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md select-none text-neutral-900 dark:text-white">
        {/* Left Action / Brand */}
        <div className="flex items-center gap-2">
          {hasMessages ? (
            <button
              type="button"
              onClick={handleStartNewConversation}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 border border-white/80 dark:border-white/15 text-[10.5px] font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center p-0.5">
                <Image
                  src="/images/medbridge-icon.png"
                  alt="MedBridge AI Logo"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain dark:hidden"
                />
                <Image
                  src="/images/medbridge-icon-white.png"
                  alt="MedBridge AI Logo"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain hidden dark:block"
                />
              </div>
              <span className="text-[10.5px] font-bold tracking-[0.14em] text-neutral-500 dark:text-neutral-400 uppercase">
                MedBridge
              </span>
            </div>
          )}
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
            AI Chat
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Right Controls (Minimize & Close) */}
        <div className="flex items-center gap-1">
          {hasMessages && (
            <button
              type="button"
              onClick={handleRegenerateLast}
              className="w-7 h-7 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Regenerate Last Response"
              aria-label="Regenerate last response"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          {onMinimize && (
            <button
              type="button"
              onClick={onMinimize}
              className="w-7 h-7 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Minimize"
              aria-label="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            title="Close AI Chat"
            aria-label="Close AI Chat"
          >
            <X className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* 2. Scrollable Dynamic Body (Welcome State OR Conversation Feed) */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 flex flex-col justify-between bg-transparent">
        {!hasMessages ? (
          /* ============================================================ */
          /* COMPACT WELCOME EXPERIENCE WITH GLOWING MEDICAL AI ORB       */
          /* ============================================================ */
          <div className="flex flex-col items-center justify-center text-center my-auto py-2 animate-in fade-in zoom-in-95 duration-200">
            {/* Central Glowing Medical AI Orb */}
            <div className="mb-4">
              <MedicalAIOrb size="lg" />
            </div>

            {/* Headline */}
            <h2 className="text-lg sm:text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white leading-snug mb-1.5">
              Your Health, One Conversation Away.
            </h2>

            {/* Supporting Text */}
            <p className="text-[11.5px] sm:text-xs text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed mb-4 font-normal">
              I&rsquo;m MedBridge AI, your healthcare companion. I can help you find the right specialist, understand healthcare services, and book appointments.
            </p>

            {/* Smart Prompt Suggestions (Compact 2-Column Grid) */}
            <div className="w-full">
              <span className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-2">
                Suggested Prompts
              </span>

              <div className="grid grid-cols-2 gap-1.5 text-left">
                {MEDICAL_PROMPT_SUGGESTIONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.directBooking) {
                          openBooking();
                        } else {
                          handleSendMessage(item.query);
                        }
                      }}
                      className="group p-2 sm:p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/[0.12] border border-white/80 dark:border-white/12 transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white/80 dark:bg-white/10 border border-white/90 dark:border-white/15 flex items-center justify-center text-[#7657ff] dark:text-[#a99aff] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                        <Icon className="w-3 h-3 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SCROLLABLE CONVERSATION FEED                                 */
          /* ============================================================ */
          <div className="space-y-2.5 pb-2">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSuggestionClick={(query) => handleSendMessage(query)}
                onRegenerate={handleRegenerateLast}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 my-2 animate-in fade-in">
                <MedicalAIOrb size="sm" className="mt-0.5" />
                <div className="px-3.5 py-2 rounded-2xl rounded-tl-xs bg-neutral-100 border border-neutral-200/60 flex items-center gap-1.5 shadow-2xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-bounce" />
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorBanner && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{errorBanner}</span>
                <button
                  type="button"
                  onClick={handleRegenerateLast}
                  className="font-bold underline uppercase text-[10px]"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* 3. Floating Message Composer at Bottom */}
        <div className="mt-auto pt-1">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onActionClick={() => {
              if (hasMessages) {
                handleStartNewConversation();
              } else {
                openBooking();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
