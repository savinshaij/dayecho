"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FiMail, FiHelpCircle, FiCalendar, FiLock, FiTrash2, FiLogOut, FiInfo, FiEdit, FiBook
} from 'react-icons/fi';
import { FaSpinner } from "react-icons/fa";
import { TbPencil } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { data: session, status } = useSession();
  const [echoPoints, setEchoPoints] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalDiary: 0 });
  const [activeTab, setActiveTab] = useState('account');
  const [postToDelete, setPostToDelete] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch Profile Data
  useEffect(() => {
   
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });

        const data = await res.json();

        const formattedPosts = data.posts?.map(post => ({
          ...post,
          formattedDate: post.date
            ? new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : 'Unknown date'
        })) || [];

        setUserInfo({
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
          points: data.points,
          var1: data.var1,
        });
        
        setPosts(formattedPosts);
        setStats({
          totalPosts: data.totalPosts,
          totalDiary: data.totalDiaries
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) fetchProfile();
  }, [session]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: postToDelete._id }),
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postToDelete._id));
        setStats(prev => ({
          totalPosts: postToDelete.isDiary ? prev.totalPosts : prev.totalPosts - 1,
          totalDiary: postToDelete.isDiary ? prev.totalDiary - 1 : prev.totalDiary
        }));
        setPostToDelete(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bgp">
        <FaSpinner className="animate-spin text-primary w-10 h-10" />
        
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/");


    return (
        <div className="flex min-h-screen overflow-y-auto p-0 bg-bgp text-textc">
            {/* Delete Confirmation Modal */}
        <AnimatePresence>
  {postToDelete && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-bgs rounded-xl p-6 max-w-md w-full border border-gray-700"
      >
        <h3 className="text-xl font-bold mb-4">Delete Post</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => setPostToDelete(null)}
            className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-[#3a4750] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeletePost}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


            {/* Mobile Tabs */}
            <div className="md:hidden fixed top-16 left-0 overflow-auto right-0 bg-bgs z-10  flex">
                <button 
                    onClick={() => setActiveTab('account')}
                    className={`flex-1 py-3 text-center font-medium ${activeTab === 'account' ? 'text-primary border-b-2 border-primary' : 'text-textc/70'}`}
                >
                    Account
                </button>
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 text-center font-medium ${activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : 'text-textc/70'}`}
                >
                    My Posts
                </button>
            </div>

            {/* Mobile Content */}
            <div className="flex flex-col md:hidden pt-40  px-3 pb-3 w-full h-screen ">

                <AnimatePresence mode="wait">
                    {activeTab === 'account' ? (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 w-full "
                        >
                            {/* Account Info */}
                            <div className="flex flex-col w-full items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[#f8d94c] flex items-center justify-center text-3xl font-bold mb-4">
                                    {session?.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-bold text-center">{session?.user?.name}</h2>
                                <p className="text-textc/70 text-sm mt-1">{session?.user?.email}</p>
                                
                                {/* <div className="mt-6 px-6 py-2 bg-[#3a4750] rounded-full flex items-center">
                                    <span className="text-primary font-bold text-xl mr-2">{echoPoints}</span>
                                    <span className="text-sm">Echo Points</span>
                                </div> */}
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-bgs rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center">
                                        <div className="bg-[#3a4750] p-2 rounded-lg mr-3">
                                            <TbPencil className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-textc/70 text-xs">Posts</h3>
                                            <p className="text-xl font-bold">{stats.totalPosts}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bgs rounded-xl p-4 border border-gray-700">
                                    <div className="flex items-center">
                                        <div className="bg-[#3a4750] p-2 rounded-lg mr-3">
                                            <FiBook className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-textc/70 text-xs">Diary</h3>
                                            <p className="text-xl font-bold">{stats.totalDiary}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="space-y-3  ">
                                <div className="p-3 rounded-lg bg-bgs hover:bg-[#3a4750] transition-colors cursor-pointer flex items-center border border-gray-700">
                                    <div className="bg-[#3a4750] p-2 rounded-lg mr-3">
                                        <FiCalendar className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Member since</h3>
                                        <p className="text-sm text-textc/70">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <Link href="/forgot-password" className="p-3 rounded-lg bg-bgs hover:bg-[#3a4750] transition-colors cursor-pointer flex items-center border border-gray-700">
                                    <div className="bg-[#3a4750] p-2 rounded-lg mr-3">
                                        <FiLock className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Account Security</h3>
                                        <p className="text-sm text-textc/70">Change password</p>
                                    </div>
                                </Link>

                                <div className="p-3 rounded-lg bg-bgs hover:bg-[#3a4750] transition-colors cursor-pointer flex items-center border border-gray-700">
                                    <div className="bg-[#3a4750] p-2 rounded-lg mr-3">
                                        <FiInfo className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">About DayEcho</h3>
                                        <p className="text-sm text-textc/70">Learn more</p>
                                    </div>
                                </div>
                            </div>

                          
                            <button 
                                onClick={() => signOut()}
                                className="w-full py-3 mt-6 bg-[#3a4750] hover:bg-[#4a5b6c] rounded-lg flex items-center justify-center transition-colors border border-gray-700"
                            >
                                <FiLogOut className="mr-2" />
                                Sign Out
                            </button>
                        
                        </motion.div>
                    ) : (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 w-full"
                        >
                            <h1 className="text-2xl font-bold mb-4">My Posts</h1>
                            
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <FaSpinner className="animate-spin text-primary w-10 h-10" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {posts.length > 0 ? (
                                        posts.map((post) => (
                                            <motion.div 
                                                whileHover={{ y: -2 }}
                                                className="bg-bgs rounded-xl  border border-gray-700"
                                                key={post._id}
                                            >
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-bold">{post.subject}</h3>
                                                            {post.isDiary && (
                                                                <span className="text-xs bg-[#3a4750] text-primary px-2 py-1 rounded-full mt-1 inline-block">
                                                                    Diary
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-textc/70 text-xs">{post.formattedDate}</span>
                                                    </div>
                                                    <p className="text-textc text-sm mb-3">{post.message}</p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex space-x-1">
                                                            {post.tags?.map((tag, index) => (
                                                                <span key={index} className="inline-block bg-[#3a4750] text-primary text-xs px-2 py-1 rounded-full">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <button 
                                                            onClick={() => setPostToDelete(post)}
                                                            className="text-textc/70 hover:text-red-400 transition-colors"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <FiEdit className="text-3xl text-textc/50 mb-4" />
                                            <h3 className="text-lg font-medium text-textc/70 mb-2">
                                                No content yet
                                            </h3>
                                            <p className="text-textc/50 text-sm">
                                                Start by creating your first post or diary entry.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                    <div className="  p-16  h-60 border-t border-gray-700">

                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full h-screen">
                {/* Left Column - Posts */}
                <div className="w-2/3 p-8 pl-28 pt-12 overflow-y-auto">
                    <h1 className="text-5xl font-bold mb-6">My<span className=" text-primary text-5xl font-extrabold "> Content</span> </h1>
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <FaSpinner className="animate-spin text-primary w-10 h-10" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <motion.div 
                                        whileHover={{ y: -2 }}
                                        className="bg-bgs rounded-xl  border border-gray-700"
                                        key={post._id}
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold">{post.subject}</h3>
                                                    {post.isDiary && (
                                                        <span className="text-xs bg-[#3a4750] text-primary px-2 py-1 rounded-full mt-1 inline-block">
                                                            Diary
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-textc/70 text-sm">{post.date}</span>
                                            </div>
                                            <p className="text-textc mb-4">{post.message}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex space-x-2">
                                                    {post.tags?.map((tag, index) => (
                                                        <span key={index} className="inline-block bg-[#3a4750] text-primary text-xs px-3 py-1 rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => setPostToDelete(post)}
                                                        className="text-textc/70 hover:text-red-400 transition-colors"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <FiEdit className="text-4xl text-textc/50 mb-4" />
                                    <h3 className="text-xl font-medium text-textc/70 mb-2">
                                        No content yet
                                    </h3>
                                    <p className="text-textc/50">
                                        Start by creating your first post or diary entry.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column - Profile */}
                <div className="w-1/3 p-8 bg-bgp border-l border-3 border-bgs overflow-y-auto">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="relative mb-6 group"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-[#f8d94c] flex items-center justify-center text-4xl font-bold shadow-lg">
                                {session?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </motion.div>
                        
                        <h2 className="text-2xl font-bold text-center mb-1">{session?.user?.name}</h2>
                        <p className="text-textc/70 text-sm">{session?.user?.email}</p>
                        
                        {/* <div className="mt-6 px-6 py-2 bg-[#3a4750] rounded-full flex items-center">
                            <span className="text-primary font-bold text-xl mr-2">{echoPoints}</span>
                            <span className="text-sm">Echo Points</span>
                        </div> */}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-bgs rounded-xl p-4 border border-gray-700">
                            <div className="flex items-center">
                                <div className="bg-[#3a4750] p-3 rounded-lg mr-3">
                                    <TbPencil className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-textc/70 text-xs">Posts</h3>
                                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-bgs rounded-xl p-4 border border-gray-700">
                            <div className="flex items-center">
                                <div className="bg-[#3a4750] p-3 rounded-lg mr-3">
                                    <FiBook className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-textc/70 text-xs">Diary</h3>
                                    <p className="text-2xl font-bold">{stats.totalDiary}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="space-y-4 mb-8">
                        <div className="p-4 rounded-xl bg-bgs hover:bg-[#3a4750] transition-colors cursor-pointer flex items-center border border-gray-700">
                            <div className="bg-[#3a4750] p-3 rounded-lg mr-4">
                                <FiCalendar className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Member since</h3>
                                <p className="text-sm text-textc/70">{new Date(userInfo?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <Link href="/forgot-password" className="p-4 rounded-xl bg-bgs hover:bg-[#3a4750] transition-colors cursor-pointer flex items-center border border-gray-700">
                            <div className="bg-[#3a4750] p-3 rounded-lg mr-4">
                                <FiLock className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">Account Security</h3>
                                <p className="text-sm text-textc/70">Change password</p>
                            </div>
                        </Link>
                    </div>

                    {/* About Section */}
                    <div className="p-4 rounded-xl bg-bgs border border-gray-700 mb-4">
                        <h3 className="font-medium mb-3 flex items-center">
                            <FiInfo className="mr-2" />
                            About DayEcho
                        </h3>
                        <div className="space-y-2">
                            <Link href="/about" className="block text-sm text-textc/70 hover:text-textc transition-colors">
                                Learn about our features
                            </Link>
                            <Link href="/help" className="block text-sm text-textc/70 hover:text-textc transition-colors">
                                <FiHelpCircle className="inline mr-2" />
                                Help Center
                            </Link>
                        </div>
                    </div>

                    

                    <button 
                        onClick={() => signOut()}
                        className="w-full py-3 bg-[#3a4750] hover:bg-[#4a5b6c] rounded-lg flex items-center justify-center transition-colors border border-gray-700"
                    >
                        <FiLogOut className="mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;