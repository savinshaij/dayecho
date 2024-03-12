"use client";

import { IoSend } from "react-icons/io5";
import { FaBook, FaHome, FaUserFriends, FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import React from "react"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomMenu() {
    const { data: session } = useSession()
    const path = usePathname();
    const userName = session?.user.name;
    const userEmail = session?.user.email;
    let user = userName || userEmail;


    return (

        <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2   rounded-full bottom-1 left-1/2 bg-bgs border-gray-600"
        
        >
            <nav className="grid h-full max-w-lg grid-cols-5 mx-auto bnav">
                <Link href="/home" className={path === '/home' ? 'active' : ''}>

                    <svg
                        className="w-5 h-5 mb-1 "
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <p className=' text-xs text-gray-500'>Home</p>
                </Link>



                <Link href="/community" className={path === '/community' ? 'active' : ''}>
                    <HiUserGroup className=' w-7 h-7 ' />
                    <p className=' text-xs text-gray-500'>Community</p>
                </Link>
                <Link href='/create' className="flex items-center justify-center">
                    <div className="flex items-center justify-center active:scale-75 duration-300 ">
                        <a

                            className="inline-flex  items-center justify-center w-10 h-10 font-medium bg-primary rounded-full "
                        >
                            <svg
                                className="w-4 h-4 text-black"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 1v16M1 9h16"
                                />
                            </svg>

                        </a>
                    </div>
                </Link>


                <Link href="/diary" className={path === '/diary' ? 'active' : ''}>
                    <FaBook className=' w-5 h-5  my-1  ' />
                    <p className=' text-xs text-gray-500'>Diary</p>
                </Link>

                <Link href="/profile" className={path === '/profile' ? 'active' : ''}>
                    <svg
                        className="w-5 h-5 mb-1 "
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <p className=' text-xs text-gray-500'>Profile</p>
                </Link>

            </nav>
        </div>

    );


}


