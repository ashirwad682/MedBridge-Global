"use client";

import React, { useState, useRef } from "react";
import { ArrowUp, Plus, Mic, Globe } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
  onActionClick?: () => void;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Ask MedBridge AI anything about your health...",
  onActionClick,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Optional Voice Input (SpeechRecognition if supported by browser)
  const handleToggleVoice = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="w-full pt-1 pb-0.5 bg-transparent shrink-0">
      {/* Floating Glass Card Composer */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full rounded-[24px] sm:rounded-[28px] bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:border-neutral-300 dark:hover:border-white/25 focus-within:border-[#7657ff]/60 dark:focus-within:border-[#8b6dff]/70 transition-all p-2 sm:p-2.5 flex items-center gap-2"
      >
        {/* Left Plus Action Button */}
        <button
          type="button"
          onClick={onActionClick}
          className="w-8 h-8 rounded-full bg-white/70 dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/20 border border-white/80 dark:border-white/15 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          title="Quick health actions"
          aria-label="Quick health actions"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-[13.5px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none transition-all disabled:opacity-50 font-normal px-1"
        />

        {/* Microphone Voice Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            isListening
              ? "bg-red-50 dark:bg-red-950/40 text-red-600 animate-pulse"
              : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-white/10"
          }`}
          title={isListening ? "Listening..." : "Dictate with voice"}
          aria-label="Dictate message"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Circular Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 dark:text-black disabled:bg-neutral-200 dark:disabled:bg-white/10 disabled:text-neutral-400 text-white flex items-center justify-center shrink-0 transition-all shadow-xs active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Discreet Medical Disclaimer */}
      <p className="text-[10px] sm:text-[10.5px] text-neutral-400 dark:text-neutral-500 text-center mt-2 font-normal">
        AI-generated general information, not a medical diagnosis. In emergencies call 911 / 112.
      </p>
    </div>
  );
}
