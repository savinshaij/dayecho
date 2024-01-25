"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
// Create your Next.js component
const Help = () => {
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
              <div className=' w-full h-full pt-20 md:pt-0  '>
                <h1 className=' text-4xl font-bold text-primary my-4 text-center'>Help & Support</h1>

                <p className='md:text-lg text-sm md:font-normal font-light text-textc' >

                  Welcome to the DayEcho Help Center! Whether you are a new user exploring the features or a seasoned member seeking assistance, we are here to help you make the most of your DayEcho experience.</p>


                <h1 className=' text-3xl font-semibold text-primary my-4 text-center'>Frequently Asked Questions FAQs</h1>

                <ul  >
                  <li className='md:text-lg text-sm  my-3 font-bold text-textc'>
                    How do I create an account?
                    <li className='md:text-lg text-sm md:font-normal font-light text-textc'>
                      To create an account, click on &ldquo;Sign Up&ldquo; and follow the simple registration process. You can sign up using your email or link your account with social media for a seamless experience.
                    </li>
                  </li>
                  <li className='md:text-lg text-sm  my-3 font-bold text-textc'>
                    How can I post to the community?
                    <li className='md:text-lg text-sm md:font-normal font-light text-textc'>
                      Posting to the community is easy! Once you&apos;re logged in, click on the &ldquo;Post&ldquo; button, add your content, and share it with the DayEcho community.
                    </li>
                  </li>
                  <li className='md:text-lg text-sm  my-3 font-bold text-textc'>
                    Where can I find my personal diary?
                    <li className='md:text-lg text-sm md:font-normal font-light text-textc'>
                      Your personal diary is accessible from your profile. Click on your profile picture, and you will find the &ldquo;Diary&ldquo; section where you can write and manage your daily entries.
                    </li>
                  </li>
                </ul>



                <p className='md:text-lg text-sm  my-5 font-bold text-primary'>If you have a specific question or need personalized assistance, our support team is ready to help. You can reach us through the following channels:</p>
                <p className='md:text-lg text-sm md:font-normal font-light text-textc'>

                  Email Support: savinshaij19@gmail.com <br />
                  Community Forums: Join discussions and seek help from the DayEcho community.
                </p>



                <p className='md:text-lg text-sm md:font-normal font-light text-textc my-4'>
                  Thank you for choosing DayEcho! We are here to make your journey with us enjoyable and fulfilling.<br />

                  <p className=' py-7'>The DayEcho Support Team</p>
                </p>
              </div>

            </div>
          </div>

        </div>

      </>
    );
  }
};

export default Help;
