"use client";
import React, { useState, useEffect } from 'react';
import { IoSend } from "react-icons/io5";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { IoArrowBackSharp } from "react-icons/io5";
import Link from 'next/link';

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
                        <div className=' fixed md:hidden mt-16  w-full bg-bgp'>
                            <Link href='/home'>
                            <div className='flex w-full h-full justify-start items-center px-5'>
                                <div className=' flex justify-center items-center h-8 w-8  bg-bgs rounded-3xl my-2'>
                                    <IoArrowBackSharp className='h-5 w-5 text-textc ' />
                                </div>
                                
                            </div>
                            </Link>
                        

                        </div>

                        <div className='      w-full my-20 md:px-20 flex justify-center items-center  rounded-2xl  '>
                            <div className=" w-full h-full flex flex-col  justify-between   rounded-3xl ">
                                <div className=' px-2 h-full w-full   rounded-3xl overflow-y-scroll  md:bg-[#3e4b55]  '>


                                    <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2 my-3  rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-green-300'> name</span><br /> cvvccvcv vvccvv vccvccvcvcv vccvvcvc messages</p>
                                    <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2 my-3  rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-green-300'> name</span><br /> cvvccvcv vvccvv vccvccvcvcv vccvvcvc messages</p>

                                    <div className=' relative'>
                                        <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2 my-3  rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-yellow-300'> name</span><br /> cvvccjkkkkkkkkkkkkkkkkkkkkkkkkvcv vvccvv vccvccvcvcv vccvvcvc messages</p>
                                    </div>


                                    <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2  my-3 rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-red-400'> name</span><br /> cvvccvghcv vvccvv vccvccvcvcv vccvvcvc messages</p>
                                    <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2 my-3  rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-green-300'> name</span><br /> cvvccvcv vvccvv vccvccvcvcv vccvvcvc messages</p>

                                    <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2  my-3 rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-red-400'> name</span><br /> cvvccvcv vvccvv vccvccvcvcv vccvvcvc messages</p>
                                    <p className=' rounded-tl-none pb-3 px-3 pt-1 mx-2  my-3 rounded-3xl bg-bgs md:text-base text-sm text-textc  max-w-xs '> <span className=' my-2 md:text-lg text-base font-bold text-red-400'> name</span><br /> cvvccvcv vvccvv vccvccvcvcv vccvvcvc messages</p>
                                </div>
                                <div className=' w-full   fixed md:relative     bottom-1  md:py-0 py-4    justify-center md:pt-4 items-end    '>
                                    <div className='  md:pl-6 pl-4 pr-2  self-end   w-full md:h-14 h-12 border-[0.5px]    flex justify-center items-center gap-3   rounded-full bottom-1  bg-[#2c3338] border-gray-600'>
                                        <input placeholder='messages...' className='   pl-6 bg-transparent outline-none md:text-lg text-sm text-white w-full h-full  ' />
                                        <div className=' bg-primary py-2 px-2 rounded-full'>
                                            <IoSend className=' md:h-6 md:w-6 w-3 h-3 text-gray-800' />
                                        </div>

                                    </div>
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
