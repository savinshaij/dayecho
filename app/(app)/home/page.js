"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { IoIosArrowForward } from "react-icons/io";
import { FaTimes, FaSpinner, FaBook, FaTasks } from "react-icons/fa";
import { FiInbox } from "react-icons/fi";

const getQuoteOfDay = async () => {
  const dayOfYear = new Date().getDay();
  const response = await fetch(`/quotes.json`);
  const data = await response.json();
  const index = dayOfYear % data.length;
  return data[index];
};

export default function Page() {
  const [posts, setPosts] = useState([]);
  const { data: session, status: sessionStatus } = useSession();
  const userName = session?.user.name;

  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false);
  const [quote, setQuote] = useState(null);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [diaryEntries, setDiaryEntries] = useState(0);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    setIsInputSpinnerOn(true);
    fetch('/api/getPost')
      .then(res => res.json())
      .then(msgs => {
        setPosts(msgs.Fetchedmessage.reverse());
        setIsInputSpinnerOn(false);
      });

    const fetchQuote = async () => {
      const quoteData = await getQuoteOfDay();
      setQuote(quoteData);
    };
    fetchQuote();

    // Mock data - replace with actual API calls
    setPendingTasks(3); // Example: 3 pending tasks
    setDiaryEntries(2); // Example: 2 diary entries
  }, []);

  if (sessionStatus === "loading") {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <FaSpinner className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="h-screen md:p-20 md:py-0 mt-20 overflow-auto w-full">
      <div className="w-full flex flex-col md:flex-row h-screen">
        <div className="flex-1 w-full overflow-y-auto">
          <div className="px-6 w-full md:px-20 md:pt-6 md:pb-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-4xl md:text-7xl font-bold text-white mb-6"
            >
              Hey, <span className="text-primary">{userName}</span>
            </motion.h1>

            {quote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-primary rounded-xl p-5 mb-8 shadow-lg"
              >
                <h2 className="text-gray-900 font-bold text-xl text-center mb-3">
                  Quote of the Day
                </h2>
                <p className="text-gray-800 text-lg text-center italic">
                  &quot;{quote.quote}&quot;
                </p>
                <p className="text-gray-800 text-sm text-end mt-3">
                  — {quote.author}
                </p>
              </motion.div>
            )}

            {/* Diary and Tasks Quick Links */}
            <div className="flex  md:gap-4 gap-2 md:mb-8 mb-4">
              {/* Diary Box */}
              <Link href="/diary" className="flex-1">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-bgs rounded-xl md:p-5 p-3 border border-gray-500 hover:border-primary transition-all duration-200 h-full flex items-center justify-between"
                >
                  <div className="flex items-center md:gap-4 gap-2">
                    <div className="bg-primary/20 md:p-3 p-2 rounded-full">
                      <FaBook className="text-primary text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-textc">Diary</h3>
                      {/* <p className="text-sm text-textc/70">
                        {diaryEntries > 0 ? `${diaryEntries} entries` : 'No entries yet'}
                      </p> */}
                    </div>
                  </div>
                  <IoIosArrowForward className="text-primary text-xl" />
                </motion.div>
              </Link>

              {/* Tasks Box */}
              <Link href="/tasks" className="flex-1">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-bgs rounded-xl md:p-5 p-3 border border-gray-500 hover:border-primary transition-all duration-200 h-full flex items-center justify-between"
                >
                  <div className="flex items-center md:gap-4 gap-2">
                    <div className="relative">
                      <div className="bg-primary/20 md:p-3 p-2 rounded-full">
                        <FaTasks className="text-primary text-xl" />
                      </div>
                    
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-textc">Tasks</h3>
                      {/* <p className="text-sm text-textc/70">
                        {pendingTasks > 0 ? `${pendingTasks} pending` : 'All caught up'}
                      </p> */}
                    </div>
                  </div>
                  <IoIosArrowForward className="text-primary text-xl" />
                </motion.div>
              </Link>
            </div>

            {/* Posts Section */}
            <div className="mb-12">
              <h2 className="text-xl text-gray-400 font-medium mb-6 text-center">Community Posts</h2>

              {isInputSpinnerOn && (
                <div className="flex justify-center my-6">
                  <FaSpinner className="animate-spin text-primary w-8 h-8" />
                </div>
              )}

              <div className="mx-auto space-y-6">
                {isInputSpinnerOn ? (
                  <div className="flex justify-center my-10">
                    <FaSpinner className="animate-spin text-primary w-10 h-10" />
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-bgs rounded-xl overflow-hidden border border-gray-700"
                    >
                      {post.image && (
                        <div
                          onClick={() => setModalImage(post.image)}
                          className="cursor-pointer group relative"
                        >
                          <Image
                            src={post.image}
                            alt="Post Image"
                            width={800}
                            height={500}
                            className="w-full p-2 h-64 bg-[#00000015] object-contain border-b border-gray-700 transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                              View Full Image
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bgp font-bold">
                              {post.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <span className="text-textc font-semibold">{post.name}</span>
                          </div>
                          <span className="text-textc/70 text-sm">{post.date}</span>
                        </div>

                        {post.subject && (
                          <h2 className="text-primary text-xl font-bold mb-4">
                            {post.subject}
                          </h2>
                        )}

                        <p className="text-textc mb-4 text-sm whitespace-pre-line">
                          {post.message}
                        </p>

                        {post.tag && (
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-bgp text-primary px-3 py-1 rounded-full text-xs font-medium">
                              #{post.tag}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FiInbox className="mx-auto text-4xl text-gray-500 mb-3" />
                    <p className="text-gray-500">No posts available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white z-50 hover:bg-black/80"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <Image
              src={modalImage}
              alt="Fullscreen Image"
              width={1600}
              height={900}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}