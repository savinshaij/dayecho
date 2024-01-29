"use client";
import Menu from '@/components/menu/Menu '

import React, { useState, useRef, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BottomMenu from '@/components/menu/BottomMenu';

import { useRouter } from 'next/navigation';
export default function Page() {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();
    console.log(session);
    const  email =session?.user?.email;
    console.log(email);
    const  name = session?.user?.name;
    const  [message, setMessage] = useState('')
    const  [subject, setSubject] = useState('')
    const  [tag, setTag] = useState('')
    const  date = getDate();
    

    function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const showDate =date + '/' + month + "/" + year;
        return ( showDate);
      }
    if (sessionStatus === "loading") {
        return <div class="inputloader "></div>;
    }
    if (sessionStatus === "unauthenticated") {
        redirect("/")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch("api/postPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name, 
                    email,
                    subject,
                    message,
                    tag,
                    date 
                }),
            });

          
            if (res.ok) {
                setMessage('');
                setSubject('');
                setTag('');
                router.push('/home');
                
                
            } else {
                console.log("failed posting message.");
            }
        } catch (error) {
            console.log("Error sending message: ", error);
        }
    };

   
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
                    <div className=" w-full h-full  px-10    bg-[#323a43] rounded-3xl overflow-y-scroll  ">
                        <div className=' flex justify-center items-center w-full h-full  py-52 '>
                            <form  onSubmit={handleSubmit} >
                            <input placeholder='Subject...' className='   pl-6  outline-none md:text-lg text-sm text-white w-full bg-bgp my-3 py-4 rounded-xl ' type="text"  value={subject} onChange={e => setSubject(e.target.value)}/>
                            <textarea placeholder='content...' className='   pl-6  outline-none md:text-lg text-sm text-white w-full bg-bgp my-3 md:h-80  h-56  py-5 rounded-xl overflow-y-scroll  ' type="text"  value={message} onChange={e => setMessage(e.target.value)} />
                            <input placeholder='hashtags.' className='   pl-6  outline-none md:text-lg text-sm text-white w-full bg-bgp my-3  py-4 rounded-xl ' type="text"  value={tag} onChange={e => setTag(e.target.value)} />
                            <div className=' w-full flex justify-end'>
                            <button className='transition-all active:scale-95  py-2 px-6 my-3  rounded-xl bg-primary text-gray-700 font-medium text-base text-end' type='submit'>post</button>
                            </div>

                            </form>
                           

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}


