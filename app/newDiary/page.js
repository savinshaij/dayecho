"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [modal, setModal] = useState(false);
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)
  const date = getCurrentDate();
  const [isDisabled, setIsDisabled] = useState(false);
  const handleSubmit = async (e) => {
setIsDisabled(true);
setIsInputSpinnerOn(true);
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
        setContent("")
        setMood("")
        setTitle("")
        setIsInputSpinnerOn(false)
        setIsDisabled(false);
        setModal(true);
       

      } else {
        console.log("failed posting diary.");
        setIsDisabled(false);
      }
    } catch (error) {
      console.log("Error sending diary: ", error);
      setIsDisabled(false);
    }
  };

  const goback = () => {

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
        <SpringModal isOpen={modal} setIsOpen={setModal} />
        {isInputSpinnerOn && <div className="inputloader absolute top-[50%]  left-[45%] "></div>}  
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



              <div className=' h-full  w-full md:bg-[#ffffff08] md:rounded-3xl rounded-xl md:px-5 pt-4'>
                <div className=' mb-5 flex  gap-3'>
                  <input className='bg-[#ffffff0f] w-full md:px-4 px-2 md:rounded-xl rounded-md text-sm md:text-lg py-3 text-white outline-none' placeholder='Titile of the day!' type="text" value={title} onChange={e => setTitle(e.target.value)} />
                  <input className='bg-[#ffffff0f] md:w-[30%] w-full md:px-4 px-2 md:rounded-xl rounded-md py-3 text-sm md:text-lg text-white outline-none ' placeholder='How was your mood today' type="text" value={mood} onChange={e => setMood(e.target.value)} />
                </div>

                <textarea className=' select-none outline-none w-full whitespace-pre-wrap md:rounded-2xl rounded-md  h-[60vh] bg-[#ffffff0f] md:text-lg text-sm text-white md:px-8 md:py-8 px-3 py-3 ' placeholder='your diary!' type="text" value={content} onChange={e => setContent(e.target.value)}></textarea>
                <div className='w-full flex gap-2'>
                  <button className=' bg-white text-black md:text-lg text-base font-semibold  md:py-3 py-2 w-full md:rounded-xl rounded-md  my-5 ' onClick={handleSubmit} disabled={isDisabled}>save</button>
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


const wrapperVariants = {
  open: {
      scaleY: 1,
      transition: {
          when: "beforeChildren",
          staggerChildren: 0.1,
      },
  },
  closed: {
      scaleY: 0,
      transition: {
          when: "afterChildren",
          staggerChildren: 0.1,
      },
  },
};



const itemVariants = {
  open: {
      opacity: 1,
      y: 0,
      transition: {
          when: "beforeChildren",
      },
  },
  closed: {
      opacity: 0,
      y: -15,
      transition: {
          when: "afterChildren",
      },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};

const SpringModal = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className=" bg-bgp text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-primary grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center text-primary mb-2">
                Saved!
              </h3>
              <p className="text-center mb-6">
                your todays diary  has been saved to the database. now you can view it from my diary section.
              </p>
              <div className="flex gap-2">
               <Link href="/diary" className='w-full' >
               <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-90 transition-opacity text-bgs font-semibold w-full py-2 rounded"
                >
                  Go back yo my Diary
                </button>
               </Link>
                
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
