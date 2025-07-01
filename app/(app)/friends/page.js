"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiSearch, FiUserPlus, FiUserCheck, FiUserX, FiMessageSquare, FiUsers, FiMail, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [tab, setTab] = useState("friends");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendsView, setFriendsView] = useState('list');
  
  // Modal states
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
    action: null,
    actionText: "",
    cancelText: "Cancel"
  });

  const showModal = (title, message, type, action, actionText = "Confirm") => {
    setModal({
      show: true,
      title,
      message,
      type,
      action,
      actionText,
      cancelText: "Cancel"
    });
  };

  const hideModal = () => {
    setModal({
      show: false,
      title: "",
      message: "",
      type: "",
      action: null,
      actionText: "",
      cancelText: "Cancel"
    });
  };

  const searchUsers = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/friends/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      showModal("Search Failed", err.response?.data?.error || "Could not complete search", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sendRequest = async (toId) => {
    if (!userId) {
      showModal("Error", "You must be signed in", "error");
      return;
    }

    if (userId === toId) {
      showModal("Error", "You cannot send a request to yourself", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/friends/request", {
        fromId: userId,
        toId,
      });
      showModal("Request Sent", res.data.message || "Friend request sent successfully", "success");
      await loadSentRequests();
    } catch (err) {
      showModal("Error", err.response?.data?.error || "Failed to send request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCancelRequest = (toId) => {
    showModal(
      "Cancel Request", 
      "Are you sure you want to cancel this friend request?", 
      "confirm",
      () => cancelRequest(toId),
      "Yes, Cancel"
    );
  };

  const cancelRequest = async (toId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/cancel", { fromId: userId, toId });
      await loadSentRequests();
      hideModal();
    } catch (err) {
      showModal("Error", "Failed to cancel request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAcceptRequest = (fromId) => {
    showModal(
      "Accept Request", 
      "Are you sure you want to accept this friend request?", 
      "confirm",
      () => acceptRequest(fromId),
      "Yes, Accept"
    );
  };

  const acceptRequest = async (fromId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/accept", { userId, fromId });
      await loadFriends();
      await loadRequests();
      hideModal();
    } catch (err) {
      showModal("Error", "Could not accept request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRejectRequest = (fromId) => {
    showModal(
      "Reject Request", 
      "Are you sure you want to reject this friend request?", 
      "confirm",
      () => rejectRequest(fromId),
      "Yes, Reject"
    );
  };

  const rejectRequest = async (fromId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/reject", { userId, fromId });
      await loadRequests();
      hideModal();
    } catch (err) {
      showModal("Error", "Could not reject request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRemoveFriend = (friendId) => {
    showModal(
      "Remove Friend", 
      "Are you sure you want to remove this friend?", 
      "confirm",
      () => removeFriend(friendId),
      "Yes, Remove"
    );
  };

  const removeFriend = async (friendId) => {
    setIsLoading(true);
    try {
      await axios.post("/api/friends/remove", { userId, friendId });
      await loadFriends();
      hideModal();
    } catch (err) {
      showModal("Error", "Could not remove friend", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/friends/list?id=${userId}`);
      setFriends(res.data);
    } catch {
      showModal("Error", "Could not load friends", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/friends/incoming?id=${userId}`);
      setRequests(res.data);
    } catch {
      showModal("Error", "Could not load requests", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSentRequests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/friends/pending?id=${userId}`);
      setSentRequests(res.data);
    } catch {
      showModal("Error", "Could not load sent requests", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && userId) {
      loadFriends();
      loadRequests();
      loadSentRequests();
    }
  }, [status, userId]);

  return (
    <div className="max-w-3xl mx-auto p-4 md:pt-24 bg-bgp min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-textc">Friends Network</h2>

      {/* Main Tabs */}
      <div className="flex border-b border-bgs mb-6">
        {[
          { id: "friends", icon: <FiUsers className="text-lg" />, label: "Friends" },
          { id: "search", icon: <FiSearch className="text-lg" />, label: "Search" }
        ].map((t) => (
          <button
            key={t.id}
            className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-all ${
              tab === t.id
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-gray-400 hover:text-textc"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      )}

      {/* Friends Tab Content */}
      {tab === "friends" && (
        <div className="space-y-4">
          {/* Friends Sub-tabs */}
          <div className="flex gap-1 p-1 rounded-lg bg-bgs">
            {[
              { id: 'list', label: `Friends (${friends.length})` },
              { id: 'requests', label: `Requests (${requests.length})` },
              { id: 'sent', label: `Sent (${sentRequests.length})` }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFriendsView(item.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-all ${
                  friendsView === item.id
                    ? 'bg-primary text-bgp font-medium shadow-sm'
                    : 'text-textc/80 hover:text-textc'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Friends List View */}
          {friendsView === 'list' && (
            <div className="space-y-3">
              {friends.length === 0 ? (
                <div className="text-center py-12 rounded-lg border-2 border-dashed border-bgs">
                  <FiUsers className="mx-auto text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-400 mb-4">Your friends list is empty</p>
                  <button
                    onClick={() => setTab("search")}
                    className="text-primary hover:underline text-sm"
                  >
                    Discover people to connect with
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {friends.map((friend) => (
                    <div key={friend._id} className="bg-bgs rounded-lg p-4 border border-bgs hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-bgp font-bold text-lg">
                          {friend.name?.charAt(0)?.toUpperCase() || "F"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-textc truncate">{friend.name}</h3>
                          <p className="text-xs text-gray-400">
                            Active {new Date(friend.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/friends/chat/${friend._id}`}
                          className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-bgp py-1.5 rounded text-sm font-medium"
                        >
                          <FiMessageSquare size={14} />
                          <span>Chat</span>
                        </Link>
                        <button
                          onClick={() => confirmRemoveFriend(friend._id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-900/80 hover:bg-red-900 text-white py-1.5 rounded text-sm font-medium"
                        >
                          <FiUserX size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requests View */}
          {friendsView === 'requests' && (
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="text-center py-12 rounded-lg border-2 border-dashed border-bgs">
                  <FiMail className="mx-auto text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-400">No pending friend requests</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div key={request._id} className="bg-bgs rounded-lg p-4 border border-bgs hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-bgp font-bold text-lg">
                          {request.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-medium text-textc">{request.name}</h3>
                          <p className="text-xs text-gray-400">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmAcceptRequest(request._id)}
                          className="flex items-center gap-1 bg-green-900/80 hover:bg-green-900 text-white px-3 py-1.5 rounded text-sm font-medium"
                        >
                          <FiUserCheck size={14} />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => confirmRejectRequest(request._id)}
                          className="flex items-center gap-1 bg-red-900/80 hover:bg-red-900 text-white px-3 py-1.5 rounded text-sm font-medium"
                        >
                          <FiUserX size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sent Requests View */}
          {friendsView === 'sent' && (
            <div className="space-y-3">
              {sentRequests.length === 0 ? (
                <div className="text-center py-12 rounded-lg border-2 border-dashed border-bgs">
                  <FiUserPlus className="mx-auto text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-400">No sent requests</p>
                </div>
              ) : (
                sentRequests.map((request) => (
                  <div key={request._id} className="bg-bgs rounded-lg p-4 border border-bgs hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-bgp font-bold text-lg">
                          {request.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-medium text-textc">{request.name}</h3>
                          <p className="text-xs text-gray-400">{request.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => confirmCancelRequest(request._id)}
                        className="flex items-center gap-1 bg-bgp hover:bg-bgs border border-bgs text-textc px-3 py-1.5 rounded text-sm font-medium"
                      >
                        <FiUserX size={14} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Tab Content */}
      {tab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch />
              </div>
              <input
                type="search"
                className="w-full bg-bgs text-textc rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-bgs"
                placeholder="Search by name or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
              />
            </div>
            <button
              onClick={searchUsers}
              disabled={isLoading}
              className={`bg-primary hover:bg-primary/90 text-bgp px-4 py-2 rounded-lg transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Searching...
                </span>
              ) : "Search"}
            </button>
          </div>

          <div className="space-y-3">
            {results
              .filter(user => user._id !== userId)
              .map((user) => {
                const isFriend = friends.some(f => f._id === user._id);
                const hasRequest = requests.some(r => r._id === user._id);
                const hasSentRequest = sentRequests.some(r => r._id === user._id);

                return (
                  <div key={user._id} className="bg-bgs rounded-lg p-4 border border-bgs hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-bgp font-bold text-lg">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-textc truncate">{user.name}</h3>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isFriend ? (
                          <button
                            onClick={() => confirmRemoveFriend(user._id)}
                            className="flex items-center gap-1 bg-red-900/80 hover:bg-red-900 text-white px-3 py-1.5 rounded text-sm font-medium"
                          >
                            <FiUserX size={14} />
                            <span>Remove</span>
                          </button>
                        ) : hasRequest ? (
                          <button
                            onClick={() => confirmAcceptRequest(user._id)}
                            className="flex items-center gap-1 bg-green-900/80 hover:bg-green-900 text-white px-3 py-1.5 rounded text-sm font-medium"
                          >
                            <FiUserCheck size={14} />
                            <span>Accept</span>
                          </button>
                        ) : hasSentRequest ? (
                          <button
                            onClick={() => confirmCancelRequest(user._id)}
                            className="flex items-center gap-1 bg-bgp hover:bg-bgs border border-bgs text-textc px-3 py-1.5 rounded text-sm font-medium"
                          >
                            <FiUserX size={14} />
                            <span>Cancel</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => sendRequest(user._id)}
                            className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-bgp px-3 py-1.5 rounded text-sm font-medium"
                          >
                            <FiUserPlus size={14} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={hideModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-bgs rounded-lg border border-bgp max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg font-bold ${
                  modal.type === "error" ? "text-red-500" : 
                  modal.type === "success" ? "text-green-500" : "text-primary"
                }`}>
                  {modal.title}
                </h3>
                <button onClick={hideModal} className="text-gray-400 hover:text-textc">
                  <FiX />
                </button>
              </div>
              <p className="text-textc mb-6">{modal.message}</p>
              <div className="flex justify-end gap-3">
                {modal.type === "confirm" && (
                  <button
                    onClick={hideModal}
                    className="px-4 py-2 rounded-lg bg-bgp text-textc hover:bg-bgs border border-bgs"
                  >
                    {modal.cancelText}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (modal.action) modal.action();
                    if (modal.type !== "confirm") hideModal();
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    modal.type === "error" ? "bg-red-900 hover:bg-red-800 text-white" :
                    modal.type === "success" ? "bg-green-900 hover:bg-green-800 text-white" :
                    "bg-primary hover:bg-primary/90 text-bgp"
                  }`}
                >
                  {modal.actionText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}