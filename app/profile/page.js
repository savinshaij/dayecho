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
               <div class="inputloader "></div>
            </div>
        );
    }
    else if (sessionStatus === "unauthenticated") {
        redirect("/");
    }
    else {
        return (
            <>

                <div className='flex justify-between h-screen w-full   '>
                    
                    <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
                        <div className='hidden  md:grid w-[50%] h-screen     '>
                            <Menu />
                        </div>
                        <div className='md:hidden  grid' >
                            <BottomMenu/>
                        </div>

                        <div className='      md:my-20  flex justify-center items-center  rounded-2xl overflow-y-scroll '>
                            <div className="flex items-center justify-center  px-10  md:py-20   md:bg-[#363f48] rounded-3xl ">
                                <div className="  w-full max-w-[550px] ">
                                    <form onSubmit={handleProfileInfoUpdate}>
                                        <div className="md:mb-5 mb-3">
                                            <label

                                                className="md:mb-3 mb-2 block md:text-base text-sm font-medium text-textc"
                                            >
                                                User Name
                                            </label>
                                            <input
                                                type="text"
                                                name="UserName"
                                                id="UserName"
                                                value={userName}
                                                placeholder="User Name"
                                                className="w-full rounded-md border border-[#e0e0e0] bg-[#38414b] md:py-3 py-2 px-6 md:text-base text-sm font-medium text-[#6B7280] outline-none focus:border-primary focus:shadow-md"
                                            />
                                        </div>
                                        <div className="md:mb-5 mb-3">
                                            <label

                                                className="md:mb-3 mb-2 block md:text-base text-sm font-medium text-textc"
                                            >
                                                Email
                                            </label>
                                            <input
                                                 type="email"
                                                 name="email"
                                                 id="email"
                                                 value={email}
                                                
                                                className="w-full rounded-md border border-[#e0e0e0] bg-[#38414b] md:py-3 py-2 px-6 md:text-base text-sm font-medium text-[#6B7280] outline-none focus:border-primary focus:shadow-md"
                                            />
                                        </div>
                                       

                                        <div className="md:mb-5 mb-3">
                                          
                                        </div>
                                       


                                      
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </>
        );
    }
};

export default Profile;
