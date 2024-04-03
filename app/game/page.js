"use client";
import React, { useState, useEffect } from 'react';
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
import { FiAlertCircle } from "react-icons/fi";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Game from '@/components/games/2028/app/Game';
const Diary = () => {
  const { data: session } = useSession();
  const { status: sessionStatus } = useSession();
  const name = session?.user.name;
  const email = session?.user.email;
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

        <div className='flex  justify-between h-screen w-full     '>
         
          <div className='   flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
            <div className='hidden  md:grid w-[50%] h-screen     '>
              <Menu />
            </div>
            <div className='md:hidden  grid' >
              <BottomMenu />
            </div>

            <motion.div className='md:my-20 mb-20 md:mb-0 md:px-24 px-5 w-full rounded-2xl overflow-y-scroll '
              initial={{ opacity: 0, }}
              animate={{ opacity: 1, }}
              exit={{ opacity: 0, }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <div className=' py-4  w-full  md:bg-[#ffffff0d] rounded-3xl'>
<Game/>
              </div>
            </motion.div>
          </div>

        </div>

      </>
    );
  }
};

export default Diary;



