"use client";

import { IoSend } from "react-icons/io5";
import { FaBook,FaHome ,FaUserFriends,FaRegQuestionCircle,FaRegUserCircle} from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import React from "react"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Menu() {
    const { data: session } = useSession()
    const path = usePathname();
    const userName = session?.user.name;
    const userEmail = session?.user.email;
    let user = userName || userEmail;


    return (
        <div className=" fixed  h-full  ">
            <aside className="flex flex-col w-[60%]  md:w-[160%]   h-screen px-7  border-gray-800 py-8 overflow-y-auto bg-bgs border-r rtl:border-r-0 rtl:border-l ">
                <div className="flex justify-center my-5">
                   <h3 className="  text-primary font-bold text-3xl font-sans">DayEcho</h3>
                </div>
               
                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav className="tabs">
                    <Link href="/home" className={path === '/home' ? 'active' : ''}>
                            
                    <FaHome /> 
                        
                         
                            <span className="mx-4 font-medium">Home</span>
                        </Link>
                    <Link href="/community" className={path === '/community' ? 'active' : ''}>
                            
                            
                    <MdGroups />
                            <span className="mx-4 font-medium">Community</span>
                        </Link>
                        <Link
                            className={path === '/diary' ? 'active' : ''}
                            href="/diary"
                        >
                           <FaBook />
                            <span className="mx-4 font-medium"> My Diary</span>
                        </Link>
                        <Link
                            className={path === '/create' ? 'active' : ''}
                            href="/create"
                        >
                          <IoSend />
                            <span className="mx-4 font-medium">Create post</span>
                        </Link>
                        <Link
                           className={path === '/friends' ? 'active' : ''}
                            href="/friends"
                        >
                          <FaUserFriends/>
                            <span className="mx-4 font-medium">Frends</span>
                        </Link>
                       
                        <Link
                            className={path === '/help' ? 'active' : ''}
                            href="/help"
                        >
                           <FaRegQuestionCircle />
                            <span className="mx-4 font-medium">Help</span>
                        </Link>
                        <Link
                            className={path === '/profile' ? 'active' : ''}
                            href="/profile"
                        >
                            <FaRegUserCircle />
                            <span className="mx-4 font-medium">Profile</span>
                        </Link>
                        <Link
                           className={path === '/about' ? 'active' : ''}
                            href="/about"
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                
                                xmlns="http://www.w3.org/2000/svg"
                            >
                               <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"
                               stroke="currentColor"
                               strokeWidth={2}
                               strokeLinecap="round"
                               strokeLinejoin="round"
                               />

                            </svg>
                            <span className="mx-4 font-medium">About</span>
                        </Link>
               
                    </nav>
                    <a href="#" className="flex items-center px-4 -mx-2 justify-center">
                        <img
                            className="object-cover mx-2 rounded-full h-9 w-9"
                            src="/avatar.png"
                            alt="avatar"
                        />
                        <span className="mx-2 font-medium text-white ">
                            {user}
                        </span>
                    </a>
                </div>
            </aside>

        </div>

    );


}


