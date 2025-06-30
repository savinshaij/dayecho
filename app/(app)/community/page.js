"use client";

import { ref, onValue } from "firebase/database";
import database from "@/lib/firebase";
import { sendMessage } from "@/lib/chat";
import React, { useState, useEffect, useRef } from "react";
import { IoSend, IoArrowBackSharp } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from 'next/image'
export default function Chat() {
  const { data: session } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data ? Object.values(data) : [];
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(name, email, newMessage);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
  <div className="flex flex-col h-screen  md:px-5 text-white">
    {/* Top Bar - Mobile */}
    <div className="md:hidden flex items-center p-5   bg-bgs border-b border-gray-700 sticky top-0 z-20">
      <Link href="/home" className="mr-3">
        <IoArrowBackSharp className="h-5 w-5 text-white" />
      </Link>
      <h1 className="text-lg font-semibold">Community Chat</h1>
    </div>

    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
      {loading ? (
        <div className="h-full flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="animate-spin text-primary w-10 h-10" />
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex justify-center items-center px-4">
          <div className="text-center text-gray-400">
            <FiClock className="w-10 h-10 mx-auto mb-2" />
            <p>No messages yet. Be the first to say hello!</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.email === email ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm md:text-base break-words ${
                message.email === email
                  ? "bg-primary text-black rounded-br-none"
                  : "bg-[#3a4b5c] text-white rounded-bl-none"
              }`}
            >
              <div className="flex justify-between items-center mb-1 text-xs">
                <span
                  className={`font-semibold ${
                    message.email === email ? "text-black" : "text-primary"
                  }`}
                >
                  {message.userName}
                </span>
                <span className="text-gray-400 ml-2">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm md:text-base">{message.messageText}</p>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>

    {/* Input Box - Fixed at bottom */}
    <div className="bg-bgs rounded-xl border-t border-gray-700 sticky bottom-0 z-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="px-3 py-3"
      >
        <div className="flex items-center gap-2 w-full">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-full bg-[#3e4b55] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full transition-all duration-200 ${
              newMessage.trim()
                ? "bg-primary hover:opacity-90"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            <IoSend className="h-5 w-5 text-black" />
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
