"use client";
import React, { useState, useEffect } from 'react';
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Todos from '@/components/todo/Todos';
const Diary = () => {
  const { data: session } = useSession();
  const { status: sessionStatus } = useSession();
  const name = session?.user.name;
  const email = session?.user.email;
  const [allPost, setAllPost] = useState([]);
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)
  useEffect(() => {
    setIsInputSpinnerOn(true);
    fetch("/api/getMyPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      }),
    }).then(res => {
      res.json().then(msgs => {
        setIsInputSpinnerOn(false);
        setAllPost(msgs.Fetchedmessage);

        console.log(allPost.length)

      })
    })
  }, [])


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
              <div className=' h-full w-full  mt-20 md:mt-0   md:bg-[#ffffff06] rounded-3xl'>
                <div className=' mb-5  py-8  '>
                  <h1 className=' text-white text-3xl  font-bold  md:text-5xl  mb-10 '>My <span className=' text-primary'>Posts</span></h1>
                  {allPost.length === 0 ? <div className=' w-full  text-xl text-[#ffffff77] text-center'> No Posts Yet</div> : null}
                  <div className='w-full h-full  flex flex-col-reverse'>
                    {isInputSpinnerOn && <div className=' flex w-full justify-center items-center'><div className="inputloader  "></div></div>}
                    {allPost.map((msgs) => (
                      <motion.div className=' mb-5 ' key={msgs.subject}
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{ opacity: 0, }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                      >
                        <div className=' mx-5'>
                          <div className=' flex'>
                            <h2 className=' text-primary font-bold text-lg md:text-xl'>{msgs.name}</h2>
                          </div>
                          <p className=' text-gray-300  my-1  font-medium text-base md:text-lg'>{msgs.subject}:</p>
                          <p className=' text-gray-400 font-normal whitespace-pre-wrap text-sm md:text-base'>{msgs.message}</p>
                          <div>
                            <p className='pt-3  text-primary text-xs md:text-sm my-1'>{msgs.tag}</p>
                          </div>
                          <p className=' text-end  text-gray-400 font-normal text-xs md:text-base my-1'>{msgs.date}</p>
                        </div>
                        <hr className='h-px  my-1 bg-[#ffffff21] border-0 ' />
                      </motion.div>
                    ))}
                  </div>



                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </>
    );
  }
};

export default Diary;



