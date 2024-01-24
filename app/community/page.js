"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
// Create your Next.js component
const Profile = () => {
    const { data: session } = useSession();
    const { status: sessionStatus } = useSession();
    const [userName, setuserName] = useState(session?.user?.name);
    const [email, setEmail] = useState(session?.user?.email);

    function handleProfileInfoUpdate(ev) {


    }

    if (sessionStatus === "loading") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                loading.....
            </div>
        );
    }
    else if (sessionStatus === "unauthenticated") {
        redirect("/");
    }
    else {
        return (
            <>
                <div className='flex justify-between h-screen w-full  overflow-hidden '>
                    
                    <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full '>
                        <div className='hidden  md:grid w-[50%] h-screen     '>
                            <Menu />
                        </div>
                        <div className='md:hidden  grid' >
                            <BottomMenu/>
                        </div>

                        <div className='      w-full  my-20 md:px-20 flex justify-center items-center  rounded-2xl  '>
                            <div className=" w-full h-full flex items-center justify-center    bg-[#323a43] rounded-3xl ">
                               
                            </div>
                        </div>
                    </div>

                </div>

            </>
        );
    }
};

export default Profile;
