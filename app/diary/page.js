"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
// Create your Next.js component
const Diary = () => {
  const { status: sessionStatus } = useSession();

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

          <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
            <div className='hidden  md:grid w-[50%] h-screen     '>
              <Menu />
            </div>
            <div className='md:hidden  grid' >
              <BottomMenu />
            </div>

            <div className='md:my-20 mb-20 md:mb-0 md:px-24 px-5 w-full  flex justify-center items-center  rounded-2xl overflow-y-scroll '>
              <div className='   w-full h-full pt-20 md:pt-0  '>
                <label className=' text-6xl font-medium text-textc '>My,</label><br />
                <label className=' text-6xl font-bold text-primary my-2 '>Diary</label>
              </div>


              <div className=' fixed  bottom-28 rounded-3xl  right-0 mx-8 h-14  w-14 bg-white '>
                <div className=' flex justify-center items-center h-full w-full text-gray-700 text-4xl font-bold'>
                  +
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
