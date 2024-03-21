"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import Card from '@/components/profileCard/ProfileCard';
import Link from 'next/link';
import Image from 'next/image';
//

//

const Profile = () => {

    const { data: session } = useSession();
    const { status: sessionStatus } = useSession();
    const [userName, setuserName] = useState(session?.user?.name);
    const [email, setEmail] = useState(session?.user.email);





    if (sessionStatus === "loading") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-between p-24">
                <div class="inputloader"></div>
            </div>
        );
    }
    else if (sessionStatus === "unauthenticated") {
        redirect("/");
    }
    else {
        return (
            <div className='flex justify-between h-screen w-full overflow-hidden overscroll-none'>
                <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
                    <div className='hidden  md:grid w-[50%] h-screen'>
                        <Menu />
                    </div>
                    <div className='md:hidden  grid'>
                        <BottomMenu />
                    </div>
                    <div className='md:my-20 w-full  flex justify-center items-center  rounded-2xl   '>
                        <div className=" h-full w-full md:px-28  px-3 py-16  md:py-20   md:bg-[#363f48] md:rounded-3xl overflow-y-scroll ">


                            <div className='  pt-20 md:pt-3   w-full'>
                                <h2 className=' pb-1 text-center text-4xl md:text-7xl font-bold text-textc'>{session?.user?.name}</h2>
                                <h2 className=' text-center text-lg md:text-2xl  font-medium text-[#ffffff46]'>{session?.user?.email}</h2>
                            </div>
                            {/* <div className='hidden md:flex justify-center items-center   w-full pt-14 pb-6'>
                                <h2 className=' flex justify-center items-center w-full text-lg font-light text-primary '>Echo points:</h2>
                                <h2 className=' flex justify-center items-center w-full text-lg font-bold text-primary '>{echoPoints}</h2> 
                                <Image

                                    src="/ep.svg"
                                    width={32}
                                    height={32}
                                    alt="Echo Points"
                                 
                                />
                                <h2 className=' md:text-3xl font-bold text-primary '> {localStorage.getItem('echoPoints')}</h2>
                            </div> */}

                            <div className='w-full flex justify-center items-center md:mt-20 mt-14 mb-7'>
                               
                                <div className=' py-2 px-4 bg-bgs md:bg-bgp rounded-2xl flex justify-center items-center'>
<h2 className=' md:text-xl  text-white '>Echo Points&nbsp;</h2>
                                <h2 className=' md:text-2xl  text-primary '> {localStorage.getItem('echoPoints')}</h2>
                                </div>
                                

                            </div>
                            <div className='   bg-[#ffffff06]  px-5 md:px-10  rounded-3xl  w-full'>
                                <h2 className=' text-base text-center py-4 md:text-xl  font-medium text-textc'>More</h2>
                                <Link href="/about">
                                    <div className=' mb-4 bg-[#ffffff06] px-4 py-2 md:py-4  md:px-8 rounded-2xl border-[1px] border-[#ffffff47]   w-full'>
                                        <h2 className=' text-sm font-semibold md:text-xl text-textc py-1 '>About </h2>
                                        <p className=' text-xs md:text-lg font-light text-[#ffffff4d]'>click here to know all about DayEcho</p>
                                    </div>
                                </Link>
                                <Link href="/help">
                                    <div className=' mb-4 bg-[#ffffff06] px-4 py-2 md:py-4 md:px-8 rounded-2xl border-[1px] border-[#ffffff47]   w-full'>
                                        <h2 className=' text-sm font-semibold md:text-xl text-textc py-1'>Help </h2>
                                        <p className=' text-xs md:text-lg font-light text-[#ffffff4d]'>click here for any help</p>
                                    </div>
                                </Link>
                                <h2 className=' text-base text-center pb-4 md:text-xl  font-medium text-textc'>Accounts</h2>
                                <div className=' mb-4 bg-[#0000000a] px-4 py-2 md:py-4 md:px-8 rounded-2xl border-[1px] border-[#ffffff47]   w-full' onClick={() => { signOut() }} >
                                    <h2 className=' text-sm font-semibold md:text-xl text-textc py-1'>Logout </h2>
                                    <p className=' text-xs md:text-lg font-light text-[#ffffff4d]'>click here to logout from this account</p>
                                </div>
                                <h2 className=' text-base text-center py-4 md:text-xl font-normal text-white'>Developer </h2>
                                <div className=' pb-20   w-full'>
                                    <Card />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
};

export default Profile;




// const actionIconVariants = {
//     open: { scale: 1, y: 0 },
//     closed: { scale: 0, y: -7 },
// };