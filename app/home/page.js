"use client";
import Menu from '@/components/menu/Menu '
import Quote from 'inspirational-quotes'
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BottomMenu from '@/components/menu/BottomMenu';
export default function Page() {
    const [allPost,setAllPost]=useState([]);
    const { data: session, status: sessionStatus } = useSession();
    const userName = session?.user.name;
    const {text:quotes ,author:Author}= Quote.getQuote();

useEffect(() => {


}, [])

const getData= ()=>{
fetch('/api/getPost').then(res => {
    res.json().then(msgs => {
        setAllPost(msgs.Fetchedmessage);

        console.log(msgs.Fetchedmessage)
        
   })
})
}

    if (sessionStatus === "loading") {
        return <div class="inputloader "></div>;
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
                    <BottomMenu />
                </div>
                <div className='      w-full  my-20 md:px-20 flex justify-center items-center  rounded-2xl  '>
                    <div className=" w-full h-full  md:px-32 px-5   md:pt-16 md:bg-[#323a43] rounded-3xl overflow-y-scroll  ">
                        <div className=' my-5'>
                            <h1 className=' text-4xl md:text-5xl font-bold text-textc  my-4'>Hey, {userName}</h1>
                        </div>
                        <div className=' my-5 py-3 px-3 text-center  bg-primary rounded-2xl md:py-7 md:my-12'>
                            <h2 className=' text-gray-900 font-bold text-lg text-center md:text-2xl '> Today&apos;s Quote</h2>
                            <p className=' text-gray-800 mt-3  font-medium text-sm md:text-lg '>{quotes}</p>
                            <div className=' w-full px-14'>
                            <p className=' text-gray-800  mt-3  font-medium text-xs md:text-sm  text-end'>-{Author}</p>
                            </div>
                           
                        </div>
                        <div className=' my-5 '>
                            <div className='flex justify-between items-center gap-x-6'>
                            <h2 className=' text-textc font-semibold text-lg text-center md:text-3xl md:font-bold my-9 '>For you</h2>
                            <button  className=' bg-slate-400 px-3 py-2 rounded-lg' onClick={getData}>refresh</button>
                            </div>
                            
                            {allPost.map((msgs, index) => (
                            <div className=' mb-5 ' key={index}>
                                <div className=' mx-5'>
                                <h2 className=' text-primary font-bold text-lg md:text-xl'>{msgs.name}</h2>
                                <p className=' text-gray-300  my-1  font-semibold text-sm md:text-lg'>{msgs.subject}:</p>
                                <p className=' pl-3 text-gray-400  font-light text-xs md:text-base'>-{msgs.message}</p>
                                <p className=' text-end  text-gray-400 text-sm md:text-base my-1'>{msgs.date}</p>
                                </div>
                                <hr className='  text-slate-900' />
                            </div>
                            ))}
                           

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


