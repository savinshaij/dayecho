"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { onValue, push, ref, off } from "firebase/database";
import database from "@/lib/firebase";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivateChatPage() {
  const { id: friendId } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendName, setFriendName] = useState("Friend");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const chatPath = [userId, friendId].sort().join("_");

  useEffect(() => {
    async function fetchFriendName() {
      try {
        // Replace with your actual API call
        setFriendName("Friend"); // Placeholder
      } catch (err) {
        console.error("Failed to fetch friend's name:", err);
      }
    }
    
    if (friendId) fetchFriendName();
  }, [friendId]);

  useEffect(() => {
    const msgRef = ref(database, `privateChats/${chatPath}`);
    
    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedMessages = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg
        })).sort((a, b) => new Date(a.time) - new Date(b.time));
        setMessages(formattedMessages);
        scrollToBottom();
      } else {
        setMessages([]);
      }
    };

    onValue(msgRef, handleData);

    return () => {
      off(msgRef, 'value', handleData);
    };
  }, [chatPath]);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    const msgRef = ref(database, `privateChats/${chatPath}`);
    await push(msgRef, {
      text: newMessage,
      sender: userId,
      name: userName,
      time: new Date().toISOString(),
    });

    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds/86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col pt-16 md:pt-0 h-screen bg-bgp md:items-center md:justify-center">
      {/* Chat Container - Responsive Width */}
      <div className="w-full  h-full md:h-[80vh] md:max-w-2xl md:rounded-xl md:shadow-lg md:border md:border-gray-700 flex flex-col bg-bgp">
        {/* Simple Chat Header */}
        <div className="bg-bgs p-2 md:p-4 md:rounded-xl border-b border-gray-700 flex items-center">
          <Link href="/friends" className="mr-4 text-textc hover:text-primary  transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bgp font-bold mr-3">
            {friendName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-textc">{friendName}</h2>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-gray-500"
            >
              <div className="bg-bgs p-6 rounded-xl text-center max-w-md">
                <h3 className="text-lg font-medium text-textc mb-2">No messages yet</h3>
                <p className="text-sm">Start your conversation with {friendName}</p>
              </div>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                    msg.sender === userId
                      ? "bg-primary text-bgp rounded-br-none"
                      : "bg-gray-700 text-textc rounded-bl-none"
                  }`}
                >
                  {msg.sender !== userId && (
                    <p className="font-medium text-xs mb-1">
                      {msg.name || "Unknown"}
                    </p>
                  )}
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 text-right opacity-80">
                    {formatRelativeTime(msg.time)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 bg-bgs">
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Message ${friendName}...`}
              className="flex-1 bg-bgp text-textc rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={`ml-2 p-2 rounded-lg transition-colors ${
                !newMessage.trim()
                  ? "text-gray-500 cursor-not-allowed"
                  : "bg-primary text-bgp hover:bg-yellow-500"
              }`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}