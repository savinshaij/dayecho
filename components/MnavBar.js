// NavBar.js
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from 'next/image'
import DropDown from './dropDown/DropDown';

const MnavBar = () => {

    const path = usePathname();
    const { data: session } = useSession()
    const status = session?.status;
    const isAdmin = false;
    const userName = session?.user.name;
    const userEmail = session?.user.email;
    let user = userName || userEmail;

    if(path !== "/" && path !== "/login" && path !== "/register"){
        return (
            <div className='md:hidden fixed w-full z-50 px-6 py-3 bg-[#36404a] '>
                <nav className="flex justify-between items-center  w-full">
                <Image
                
      src="/de.svg"
      width={32}
      height={32}
      alt="DayEcho"
    />
                    <DropDown/>
                </nav>
            </div>
        );
    }
};

export default MnavBar;
