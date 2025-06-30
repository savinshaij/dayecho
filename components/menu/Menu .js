"use client";

import { IoSend, IoLogOutOutline } from "react-icons/io5";
import { FaBook, FaHome, FaUserFriends, FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Menu() {
    const { data: session } = useSession();
    const path = usePathname();
    const userName = session?.user?.name || "";
    const userEmail = session?.user?.email || "";
    const user = userName || userEmail;
    const firstLetter = user?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="fixed h-full">
            <aside className="flex flex-col w-[60%] md:w-80 h-screen px-5 py-8 overflow-y-auto bg-bgs border-r border-gray-700">
                {/* Logo */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center my-5"
                >
                    <h3 className="text-primary font-bold text-3xl font-sans">DayEcho</h3>
                </motion.div>
               
                {/* Main Navigation */}
                <div className="flex flex-col justify-between flex-1 mt-2">
                    <nav className="space-y-2">
                        <Link 
                            href="/home" 
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/home' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <FaHome className="text-lg" />
                            <span className="mx-4 font-medium">Home</span>
                        </Link>
                        <Link 
                            href="/friends" 
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/friends' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <FaUserFriends className="text-lg" />
                            <span className="mx-4 font-medium">Friends</span>
                        </Link>
                        <Link 
                            href="/community" 
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/community' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <MdGroups className="text-lg" />
                            <span className="mx-4 font-medium">Community</span>
                        </Link>
                        
                        <Link
                            href="/diary"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/diary' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <FaBook className="text-lg" />
                            <span className="mx-4 font-medium">My Diary</span>
                        </Link>
                        
                        <Link
                            href="/create"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/create' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <IoSend className="text-lg" />
                            <span className="mx-4 font-medium">Create post</span>
                        </Link>
                        
                        <Link
                            href="/help"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/help' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <FaRegQuestionCircle className="text-lg" />
                            <span className="mx-4 font-medium">Help</span>
                        </Link>
                        
                        <Link
                            href="/about"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${path === '/about' ? 'bg-primary/10 text-primary' : 'text-textc hover:bg-gray-700'}`}
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span className="mx-4 font-medium">About</span>
                        </Link>
                    </nav>
                    
                    {/* Bottom Section - Profile & Logout */}
                    <div className="mt-auto space-y-4 pt-4 border bg-bgs rounded-xl p-5 border-gray-600">
                        <Link
                            href="/profile"
                            className={`flex items-center px-4 py-3  border border-gray-600 rounded-lg transition-colors ${path === '/profile' ? 'bg-primary/10 text-primary' : 'text-textc  hover:bg-gray-700'}`}
                        >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-bgp font-bold">
                                {firstLetter}
                            </div>
                            <span className="mx-4 font-medium">Profile</span>
                        </Link>
                        
                        <button
                            onClick={() => signOut()}
                            className="flex bg-bgp items-center w-full px-4 py-3 rounded-lg text-textc hover:bg-gray-700 transition-colors"
                        >
                            <IoLogOutOutline className="text-lg" />
                            <span className="mx-4 font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
}