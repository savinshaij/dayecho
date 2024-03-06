"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

// Create your Next.js component

const getCurrentDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month indexes are zero-based
  const year = currentDate.getFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
  return formattedDate;
};


const Diary = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [show, setShow] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const { data: session } = useSession()
  const name = session?.user.name;
  const email = session?.user.email;
  const date = getCurrentDate();

  const handleSubmit = async (e) => {
    
    
    try {
        const res = await fetch("api/diaryPost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              title,
               mood,
               content,
               date  
            }),
        });

      
        if (res.ok) {
           
            router.push('/diary');
            
            
        } else {
            console.log("failed posting diary.");
        }
    } catch (error) {
        console.log("Error sending diary: ", error);
    }
};

 const goback =()=>{

  router.push('/diary');
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

        <div className='flex justify-between h-screen w-full  overflow-hidden '>

          <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
            <div className='hidden  md:grid w-[50%] h-screen     '>
              <Menu />
            </div>
            <div className='md:hidden  grid' >
              <BottomMenu />
            </div>

            <div className='md:my-20 mb-20 md:mb-0 md:px-24 px-5 w-full rounded-2xl overflow-y-scroll md:py-6'>
              <div className='w-full flex '>
              <div className='   w-full  pt-20 md:pt-0  my-6 '>
                <label className=' md:text-6xl text-xl font-medium text-textc '>Todays,</label>
                <label className=' md:text-6xl text-xl font-bold text-primary my-2 '>Diary</label>
                
              </div>
              <div className='pt-20 md:pt-0  flex justify-end w-full items-center px-3'><label className=' text-right md:text-4xl text-lg font-medium text-primary my-2 '> {date}</label></div>
              
              </div>
            


              <div className=' h-full  w-full bg-[#ffffff08] md:rounded-3xl rounded-xl px-5 mb-1'>
                <div className=' mb-5 flex  gap-3'>
                  <input className='bg-[#ffffff0f] w-full px-4 md:rounded-xl rounded-md text-sm md:text-lg py-3 text-white outline-none' placeholder='Titile of the day!' type="text"  value={title} onChange={e => setTitle(e.target.value)} />
                  <input className='bg-[#ffffff0f] w-[30%] px-4 md:rounded-xl rounded-md py-3 text-sm md:text-lg text-white outline-none ' placeholder='How was your mood today' type="text"  value={mood} onChange={e => setMood(e.target.value)}/>
                </div>

                <textarea className=' select-none outline-none w-full whitespace-pre-wrap md:rounded-2xl rounded-md  h-[60vh] bg-[#ffffff0f] md:text-lg text-sm text-white md:px-8 md:py-8 px-3 py-3 ' placeholder='your diary!'  type="text"  value={content} onChange={e => setContent(e.target.value)}></textarea>
                <div  className='w-full flex gap-2'>
                <button className=' bg-white text-black md:text-lg text-base font-semibold  md:py-3 py-2 w-full md:rounded-xl rounded-md  my-5 ' onClick={handleSubmit}>save</button>
                <button className='  border-2 border-[#ffffff39] text-white md:text-lg text-base  font-medium md:py-3 w-[30%] md:rounded-xl rounded-md  my-5 ' onClick={goback}>cancel</button>
                </div>
                
              </div>

            </div>
          </div>

        </div>

      </>
    );
  }
};

export default Diary;
