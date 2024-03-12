"use client";
import Menu from '@/components/menu/Menu '
import Link from 'next/link';
import { FiAlertCircle } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useRef, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BottomMenu from '@/components/menu/BottomMenu';


export default function Page() {
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)
  const { data: session, status: sessionStatus } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name;
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [tag, setTag] = useState('')
  const date = getDate();
  const [modal, setModal] = useState(false);

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const showDate = date + '/' + month + "/" + year;
    return (showDate);
  }
  if (sessionStatus === "loading") {
    return <div class="inputloader "></div>;
  }
  if (sessionStatus === "unauthenticated") {
    redirect("/")
  }

  const handleSubmit = async (e) => {
    setIsInputSpinnerOn(true)
    e.preventDefault();
    const trimmedValue = message.trim();
    if (message === "" || trimmedValue === "" || subject === "" || tag === "") {
      return null;
    }
    setMessage(trimmedValue);
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
        setIsInputSpinnerOn(false);
        setModal(true);



      } else {
        console.log("failed posting message.");
      }
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  };


  return (
    <div className='flex justify-between h-screen w-full   '>
      {isInputSpinnerOn && <div className="inputloader  absolute top-[50%]  left-[46%] "></div>}
      <SpringModal isOpen={modal} setIsOpen={setModal} />
      <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full '>
        <div className='hidden  md:grid w-[50%] h-screen     '>
          <Menu />
        </div>
        <div className='md:hidden  grid'>
          <BottomMenu />
        </div>
        <div className='      w-full   my-20 md:px-20 flex justify-center items-center  rounded-2xl  '>
          <div className=" w-full h-full  px-10    bg-[#323a43] rounded-3xl overflow-y-scroll  ">
            <div className=' flex justify-center items-center w-full h-full   '>
              <form onSubmit={handleSubmit}  >
              
              {/* <div className='  h-60  ' /> */}
                <input placeholder='Subject...' className=' md:mt-0 mt-60  pl-6  border-solid outline-none md:text-base text-sm text-white w-full bg-bgp my-3 py-3 rounded-xl ' type="text" value={subject} onChange={e => setSubject(e.target.value)} />
                <textarea placeholder='content...' className='   pl-6  outline-none md:text-base text-sm text-white w-full bg-bgp my-3 md:h-72   h-56  py-5 rounded-xl overflow-y-scroll  ' type="text" value={message} onChange={e => setMessage(e.target.value)} />
                <input placeholder='#food #tech etc...' className=' border-solid  pl-6  outline-none md:text-base text-sm text-white w-full bg-bgp my-3  py-3 rounded-xl ' type="text" value={tag} onChange={e => setTag(e.target.value)} />
                <div className=' w-full flex justify-end  mb-24'>
                  <button className='transition-all active:scale-90 w-full  py-2 px-4 my-3  rounded-lg bg-primary text-gray-700 font-medium  text-sm ' type='submit'>post</button>
                </div>
               


              </form>


            </div>

          </div>
        </div>
      </div>
    </div>
  )
}



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
                Post Successful!
              </h3>
              <p className="text-center mb-6">
                Thank you for sharing your thoughts! Your post is now live.
              </p>
              <div className="flex gap-2">
                <Link href="/home" className='w-full' >
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white hover:opacity-90 transition-opacity text-bgs font-semibold w-full py-2 rounded"
                  >
                    Go back to home
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



