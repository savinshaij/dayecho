"use client";
import Menu from '@/components/menu/Menu '
import React from 'react'
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BottomMenu from '@/components/menu/BottomMenu';
export default function Page() {
    const { data: session, status: sessionStatus } = useSession();
    if (sessionStatus === "loading"){
        return <h1>Loading...</h1>;
    }
    if (sessionStatus === "unauthenticated") {
        redirect("/")
    }
    return (
        <div className='flex justify-between h-screen w-full  '>            
        <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full '>
            <div className='hidden  md:grid w-[50%] h-screen     '>
                <Menu />
            </div>
            <div className='md:hidden  grid'>
                <BottomMenu/>
            </div>
            <div className='      w-full  my-20 md:px-20 flex justify-center items-center  rounded-2xl  '>
                <div className=" w-full h-full  px-10    bg-[#323a43] rounded-3xl overflow-y-scroll  ">
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>
                    <div className=' h-5 my-14 w-full  bg-slate-500'></div>

                </div>
            </div>
        </div>
    </div>   
    )
}


