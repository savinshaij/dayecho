"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiSearch, FiUserPlus, FiUserCheck, FiUserX, FiMessageSquare, FiUsers, FiMail } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/friends/search?query=${query}`);
      setResults(res.data);
      setMessage({ text: "", type: "" });
    } catch (err) {
      setMessage({ text: "Search failed", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const sendRequest = async (toId) => {
  if (!userId) {
    setMessage({ text: "You must be signed in", type: "error" });
    return;
  }

  if (userId === toId) {
    setMessage({ text: "You cannot send a request to yourself", type: "error" });
    return;
  }

  setIsLoading(true);
  try {
    const res = await axios.post("/api/friends/request", {
      fromId: userId,
      toId,
    });

    setMessage({
      text: res.data.message || "Friend request sent",
      type: "success",
    });

    await loadSentRequests();
  } catch (err) {
    console.error("❌ Friend request error:", err);
    setMessage({
      text: err.response?.data?.error || "Failed to send request",
      type: "error",
    });
  } finally {
    setIsLoading(false);
  }
};


  const cancelRequest = async (toId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/cancel", { fromId: userId, toId });
      setMessage({ text: "Request cancelled", type: "success" });
      loadSentRequests();
    } catch (err) {
      setMessage({ text: "Failed to cancel request", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };


  const acceptRequest = async (fromId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/accept", { userId, fromId });
      setMessage({ text: "Friend request accepted", type: "success" });
      loadFriends();
      loadRequests();
    } catch (err) {
      setMessage({ text: "Could not accept request", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (fromId) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const res = await axios.post("/api/friends/reject", {
        userId,  // this is the current user (receiver)
        fromId,  // this is the sender of the friend request
      });

      setMessage({ text: res.data.message || "Request rejected", type: "success" });

      // Reload the updated list of requests
      await loadRequests();
    } catch (err) {
      console.error("❌ Reject error:", err);
      setMessage({
        text: err.response?.data?.error || "Could not reject request",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const removeFriend = async (friendId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/remove", { userId, friendId });
      setMessage({ text: "Friend removed", type: "success" });
      loadFriends();
    } catch (err) {
      setMessage({ text: "Could not remove friend", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const res = await axios.get(`/api/friends/list?id=${userId}`);
      setFriends(res.data);
    } catch {
      setMessage({ text: "Could not load friends", type: "error" });
    }
  };

  const loadRequests = async () => {
    try {
      const res = await axios.get(`/api/friends/incoming?id=${userId}`);
      setRequests(res.data);
    } catch {
      setMessage({ text: "Could not load requests", type: "error" });
    }
  };

  const loadSentRequests = async () => {
    try {
      const res = await axios.get(`/api/friends/pending?id=${userId}`);

      setSentRequests(res.data);
    } catch {
      setMessage({ text: "Could not load sent requests", type: "error" });
    }
  };

  useEffect(() => {
    if (status === "authenticated" && userId) {
      loadFriends();
      loadRequests();
      loadSentRequests();
    }
  }, [status, userId]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="max-w-3xl mx-auto p-4 md:pt-24">
      <h2 className="text-3xl font-bold text-center mb-8 text-textc">Friends Network</h2>

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-700 mb-6">
        {[
          { id: "friends", icon: <FiUsers />, label: "Friends" },
          { id: "search", icon: <FiSearch />, label: "Search" },
          { id: "requests", icon: <FiMail />, label: "Requests" },
          { id: "sent", icon: <FiUserPlus />, label: "Sent" }
        ].map((t) => (
          <button
            key={t.id}
            className={`px-4 py-3 flex items-center space-x-2 transition-colors ${tab === t.id
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-textc"
              }`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Message Alert */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-3 rounded-lg ${message.type === "success"
              ? "bg-green-900 text-green-100"
              : "bg-red-900 text-red-100"
              }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

     

      {/* Friends Tab */}
      {tab === "friends" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-textc">
              Your Friends ({friends.length})
            </h3>
          </div>

          {friends.length === 0 ? (
            <div className="bg-bgp rounded-lg p-8 text-center border border-gray-700">
              <FiUsers className="mx-auto text-4xl text-gray-500 mb-3" />
              <p className="text-gray-400">You haven&apos;t added any friends yet</p>
              <button
                onClick={() => setTab("search")}
                className="mt-3 text-primary hover:underline"
              >
                Find friends to connect with
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((f) => (
                <div key={f._id} className="bg-bgp rounded-lg p-4 shadow border border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bgp font-bold">
                      {f.name?.charAt(0)?.toUpperCase() || "F"}
                    </div>
                    <div>
                      <h3 className="font-medium text-textc">{f.name}</h3>
                      <p className="text-sm text-gray-400">Last active: {new Date(f.lastActive).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/friends/chat/${f._id}`}
                      className="flex items-center space-x-1 bg-primary hover:bg-yellow-500 text-bgp px-3 py-1 rounded text-sm"
                    >
                      <FiMessageSquare size={14} />
                      <span>Chat</span>
                    </Link>
                    <button
                      onClick={() => removeFriend(f._id)}
                      className="flex items-center space-x-1 bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiUserX size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}



       {/* Search Tab */}
      {tab === "search" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                className="w-full bg-bgp text-textc rounded-l-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search by name or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchUsers()}
              />
            </div>
            <button
              onClick={searchUsers}
              disabled={isLoading}
              className={`bg-primary hover:bg-yellow-500 text-bgp px-4 py-2 rounded-r-lg transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results
              .filter((u) => u._id !== userId)
              .map((u) => {
                const isFriend = friends.some(f => f._id === u._id);
                const hasRequest = requests.some(r => r._id === u._id);
                const hasSentRequest = sentRequests.some(r => r._id === u._id);

                return (
                  <div key={u._id} className="bg-bgp rounded-lg p-4 shadow border border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bgp font-bold">
                        {u.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <h3 className="font-medium text-textc">{u.name}</h3>
                        <p className="text-sm text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isFriend ? (
                        <button
                          onClick={() => removeFriend(u._id)}
                          className="flex items-center space-x-1 bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm"
                        >
                          <FiUserX size={14} />
                          <span>Remove</span>
                        </button>
                      ) : hasRequest ? (
                        <>
                          <button
                            onClick={() => acceptRequest(u._id)}
                            className="flex items-center space-x-1 bg-green-900 hover:bg-green-800 text-white px-3 py-1 rounded text-sm"
                          >
                            <FiUserCheck size={14} />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => rejectRequest(u._id)}
                            className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            <FiUserX size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : hasSentRequest ? (
                        <button
                          onClick={() => cancelRequest(u._id)}
                          className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          <FiUserX size={14} />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => sendRequest(u._id)}
                          className="flex items-center space-x-1 bg-primary hover:bg-yellow-500 text-bgp px-3 py-1 rounded text-sm"
                        >
                          <FiUserPlus size={14} />
                          <span>Add</span>
                        </button>
                      )}
                      {isFriend ? (
                        <Link
                          href={`/friends/chat/${u._id}`}
                          className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          <FiMessageSquare size={14} />
                          <span>Message</span>
                        </Link>
                      ) : (
                        <div className="flex items-center space-x-1 bg-gray-800 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed opacity-50">
                          <FiMessageSquare size={14} />
                          <span>Only for Friends</span>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}


      {/* Requests Tab */}
      {tab === "requests" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-textc">
              Friend Requests ({requests.length})
            </h3>
          </div>

          {requests.length === 0 ? (
            <div className="bg-bgp rounded-lg p-8 text-center border border-gray-700">
              <FiMail className="mx-auto text-4xl text-gray-500 mb-3" />
              <p className="text-gray-400">No pending friend requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((r) => (
                <div key={r._id} className="bg-bgp rounded-lg p-4 shadow border border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bgp font-bold">
                      {r.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="font-medium text-textc">{r.name}</h3>
                      <p className="text-sm text-gray-400">Sent {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => acceptRequest(r._id)}
                      className="flex items-center space-x-1 bg-green-900 hover:bg-green-800 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiUserCheck size={14} />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => rejectRequest(r._id)}
                      className="flex items-center space-x-1 bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiUserX size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Sent Requests Tab */}
      {tab === "sent" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-textc">
              Sent Friend Requests ({sentRequests.length})
            </h3>
          </div>

          {sentRequests.length === 0 ? (
            <div className="bg-bgp rounded-lg p-8 text-center border border-gray-700">
              <FiUserPlus className="mx-auto text-4xl text-gray-500 mb-3" />
              <p className="text-gray-400">You haven’t sent any friend requests yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentRequests.map((r) => (
                <div key={r._id} className="bg-bgp rounded-lg p-4 shadow border border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bgp font-bold">
                      {r.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="font-medium text-textc">{r.name}</h3>
                      <p className="text-sm text-gray-400">{r.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => cancelRequest(r._id)}
                      className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiUserX size={14} />
                      <span>Cancel</span>
                    </button>
                    <div className="flex items-center space-x-1 bg-gray-800 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed opacity-50">
                      <FiMessageSquare size={14} />
                      <span>Only for Friends</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
}