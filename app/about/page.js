"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
// Create your Next.js component
const About = () => {
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
                <h1 className=' text-4xl font-bold text-primary my-4'>About DayEcho</h1>

                <p className='md:text-lg text-sm md:font-normal font-light text-textc' >Welcome to DayEcho, the digital canvas for your daily narratives. At DayEcho, we believe that every day is a unique story waiting to be shared and cherished. Our platform is more than just a space; it&apos;s a community-driven hub where your voice finds its resonance.</p>


                <h1 className=' text-3xl font-semibold text-primary my-4'>Our Mission</h1>
                <p className='md:text-lg text-sm md:font-normal font-light text-textc' >
                  DayEcho is on a mission to empower individuals to express themselves, connect with others, and preserve the moments that make life extraordinary. We envision a world where sharing daily experiences becomes a source of inspiration, understanding, and connection.
                </p>
                <h1 className=' text-3xl font-bold text-primary my-4'> Key Features</h1>

                <p className='md:text-lg text-sm md:font-normal font-light text-textc' >
                  <div className=' my-5'> <span className=' text-xl font-bold text-white'>Community Bonds:</span> DayEcho is a vibrant community where users from all walks of life come together to share their stories, experiences, and perspectives. Explore a diverse range of content and discover the richness of human connection.<br /></div>

                  <div className=' my-5'><span className=' text-xl font-bold text-white'> Personal Diaries:</span> Create your own digital diary, a sanctuary for your thoughts, reflections, and personal growth. Document your journey, celebrate your victories, and find solace in the act of self-expression.<br /></div>

                  <div className=' my-5'> <span className=' text-xl font-bold text-white'>Meaningful Connections:</span>  Connect with like-minded individuals, form friendships, and build a network that appreciates the uniqueness of your story. DayEcho is not just a platform; it&apos;s a social space designed for genuine interactions.<br /></div>
                </p>
                <h1 className=' text-3xl font-semibold text-primary my-4'> Why DayEcho?</h1>

                <p className='md:text-lg text-sm md:font-normal font-light text-textc' >
                  In a world filled with noise, DayEcho is your quiet corner to be heard. We understand the importance of authenticity, and we provide the tools for you to express yourself genuinely. Join us in this journey of sharing, connecting, and embracing the beauty of the everyday.
                </p>
                <h1 className=' text-3xl font-semibold text-primary my-4'>   Get Started</h1>

                <p className='md:text-lg text-sm md:font-normal font-light text-textc' >
                  Ready to embark on a journey of self-discovery and community connection&quest; Sign up for DayEcho today and start sharing your daily echoes with the world.
                </p>


                <p className='md:text-lg text-sm md:font-normal font-light text-textc my-4'>Thank you for being a part of our community. </p>
                <p className='md:text-lg text-sm md:font-normal font-light text-textc my-4'>  The DayEcho Team</p>

              </div>

            </div>
          </div>

        </div>

      </>
    );
  }
};

export default About;
