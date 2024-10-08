"use client";
import React, { useState, useEffect } from 'react';
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
// Create your Next.js component
const Updates = () => {
  const { status: sessionStatus } = useSession();

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="inputloader "></div>
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
                <h1 className=' text-4xl font-bold text-white my-4 text-center'>Whats <span className='  text-primary '>New</span></h1>


                <div>
                  <section className='   py-2'>
                    <h2 className=' text-xl font-semibold text-textc  py-2'>⭐Echo Points</h2>
                    <p className='  text-[#ffffff8d]  py-2'>
                      Earn Echo Points by maintaining a consistent diary entry routine! Simply jot down your thoughts and experiences each day for three consecutive days, and your Echo Points will increase by 1. But remember, consistency is key! If you miss posting for three days in a row, your streak resets, and you&apos;ll need to start again. Additionally, each time you post a diary entry, you&apos;ll earn additional Echo Points, encouraging you to keep up the habit and share your journey ,you can find it from profile .
                    </p>
                    <hr />
                  </section>

                  <section>
                    <h2 className=' text-lg font-semibold text-textc  py-2'>⭐2048 Game</h2>
                    <p className='  text-[#ffffff8d]  py-2'>
                    2048 is a popular puzzle game played on a 4x4 grid where players combine numbered tiles by swiping in four directions to create a tile with the number 2048. With each move, a new tile appears on the grid, and if two tiles with the same number collide, they merge into one with their sum. The game continues until the grid fills up, and no more valid moves can be made, at which point the players score is calculated based on the values of the tiles. The objective is to reach the 2048 tile, though players can continue playing to achieve higher scores even after reaching this goal.
                    </p>
                    <hr />
                  </section>

                  <section>
                    <h2 className=' text-lg font-semibold text-textc  py-2'>⭐Task Todo</h2>
                    <p className='  text-[#ffffff8d]   py-2'>
                      Introducing Task Todo, your ultimate productivity companion! With Task Todo, you can organize your tasks, prioritize your to-do lists, and stay on top of your goals with ease. Say goodbye to forgetting important tasks or feeling overwhelmed by your workload. Task Todo helps you streamline your day, improve efficiency, and track your progress effortlessly. Experience the advantages of task management and take control of your productivity today!
                    </p>
                    <hr />
                  </section>
                </div>
              </div>

            </div>
          </div>

        </div>

      </>
    );
  }
};

export default Updates;
