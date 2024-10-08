"use client";
import Menu from '@/components/menu/Menu '
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BottomMenu from '@/components/menu/BottomMenu';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const getQuoteOfDay = async () => {
    const dayOfYear = new Date().getDay();
    const response = await fetch(`/quotes.json`);

    const data = await response.json();
    const index = dayOfYear % data.length; // Modulo operation to ensure it cycles through quotes
    return data[index];
};


export default function Page() {
    const [allPost, setAllPost] = useState([]);
    const { data: session, status: sessionStatus } = useSession();
    const userName = session?.user.name;
    const email = session?.user.email;
    const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)
    const [quote, setQuote] = useState(null);
    const [echoPoints, setEchoPoints] = useState(0);
    const [todos, setTodos] = useState("No tasks to do");
    useEffect(() => {
        setIsInputSpinnerOn(true);
        fetch('/api/getPost').then(res => {
            res.json().then(msgs => {
                setIsInputSpinnerOn(false);
                setAllPost(msgs.Fetchedmessage);

                console.log(msgs.Fetchedmessage)

            })
        })
        console.log(session);

        const fetchQuote = async () => {
            const quoteData = await getQuoteOfDay();
            setQuote(quoteData);
        };
        fetchQuote();
        getPoint();

        const items = JSON.parse(localStorage.getItem("todos"));
        if (items) {
            setTodos(items[0]?.title);
            console.log("heyyyy")

        }

    }, [])
    const getPoint = async (e) => {

        try {
            const res = await fetch("api/getPoints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });


            if (res.ok) {
                const data = await res.json();

                localStorage.setItem('echoPoints', data.echoPoints);

                console.log(localStorage.getItem('echoPoints'));
                setEchoPoints(data.echoPoints);


            } else {
                console.log("failed getting  points.");
            }
        } catch (error) {
            console.log("Error while getting points: ", error);
        }
    };

    if (sessionStatus === "loading") {
        return <div className=' h-screen w-full flex justify-center items-center'><div class="inputloader "></div></div>;
    }
    if (sessionStatus === "unauthenticated") {
        redirect("/")
    }



    return (
        <div className='flex justify-between h-screen w-full  '>
            <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full '>
                <div className='hidden  md:grid w-[50%] h-screen     '

                >
                    <Menu />
                </div>
                <div className='md:hidden  grid'

                >
                    <BottomMenu />
                </div>
                <div className='      w-full my-16 md:px-20 flex justify-center items-center  rounded-2xl  '>
                    <div className=" w-full h-full  md:px-32 px-5   md:pt-16 md:bg-[#323a43] rounded-3xl scroll-smooth overflow-y-scroll  ">
                        < motion.div className=' my-5'
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1, }}
                            exit={{ opacity: 0, }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <h1 className='  text-4xl md:text-5xl font-bold text-textc  my-4'>Hey, {userName}</h1>
                        </motion.div>
                        {quote && (
                            <motion.div
                                initial={{ opacity: 0, }}
                                animate={{ opacity: 1, }}
                                exit={{ opacity: 0, }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                                className=' my-5 py-3 px-3 text-center  bg-primary rounded-2xl md:py-7 md:my-12'
                            >

                                <h2 className=' text-gray-900  font-bold text-lg text-center md:text-2xl '>Quote of the Day</h2>
                                <p className=' text-gray-800 mt-3  font-medium text-sm md:text-lg '>{quote.quote}</p>
                                <div className=' w-full px-14'>
                                    <p className=' text-gray-800  mt-3  font-medium text-xs md:text-sm  text-end'>-{quote.author}</p>
                                </div>

                            </motion.div>
                        )}
                        <div className=' w-full flex gap-3   mt-5 mb-3  '>
                            {/* <Link href='/myPosts'>
                                <div className='  flex flex-col justify-center items-center  text-2xl  '>
                                    <div className=' flex flex-col justify-center items-center h-14 w-14 active:scale-90 transition-all duration-200 bg-[#ffffff16] rounded-xl cursor-pointer'>
                                        📮
                                    </div>

                                    <div className='   w-full text-[10px]  text-center text-[#ffffff85]  '>
                                        my posts
                                    </div>
                                </div>
                            </Link>
                            <Link href='/game'>
                                <div className='  flex flex-col justify-center items-center  text-2xl '>

                                    <div className=' flex flex-col justify-center items-center active:scale-90 transition-all duration-200 h-14 w-14 bg-[#ffffff16] rounded-xl cursor-pointer'>
                                        🎮
                                    </div>

                                    <div className=' w-full text-[10px]  text-center text-[#ffffff85]  '>
                                        2048
                                    </div>
                                </div>
                            </Link> */}
                            <Link href='/tasks' className=' w-full'>
                                <div className='  w-full flex flex-col justify-center items-center   text-2xl '>
                                    <div className=' w-full gap-3 flex justify-between items-center px-2 overflow-hidden py-2  h-14  border border-[#ffffff16] rounded-2xl ' >
                                        <div className='  pl-4 flex overflow-hidden justify-center items-center gap-3'>

                                            <div className='  text-base whitespace-nowrap overflow-hidden text-[#ffffff66]'>
                                                {todos ? (<><p>🟡 {todos}</p></>)
                                                    : (<>🟡 No new tasks to do</>)}
                                            </div>
                                        </div>
                                        <Link href='/tasks' >
                                            <div className='font-bold h-full flex justify-center items-center active:scale-90 transition-all duration-200 cursor-pointer text-base   text-bgs rounded-xl  py-2 px-2  bg-primary'>
                                                <p>Tasks</p>
                                                <IoIosArrowForward  className=' text-xl font-bold'/>
                                            </div>
                                        </Link>
                                    </div>


                                </div>
                            </Link>
                            {/* <Link href='/whatsNew'>
                                <div className='  flex flex-col justify-center items-center  text-2xl '>

                                    <div className='border  flex flex-col justify-center items-center active:scale-90 transition-all duration-200 h-14 w-20 bg-[#ffffff16] rounded-xl cursor-pointer'>

                                        <p className=' text-base font-bold text-center text-[#ffffffe1]  '>
                                            New🌟
                                            <p className=' text-xs text-[#ffffffb6]  '>

                                                updates
                                            </p>
                                        </p>
                                    </div>


                                </div>
                            </Link> */}
                        </div>
                        <div className=' mb-5 '>
                            <p className=' text-[#ffffff6d]  font-normal text-base text-center md:text-2xl  mb-5 '>Posts</p>

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
                </div>
            </div>
        </div>
    )
}


