"use client";
import Menu from '@/components/menu/Menu '
import Quote from 'inspirational-quotes'
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BottomMenu from '@/components/menu/BottomMenu';
export default function Page() {
    const [allPost, setAllPost] = useState([]);
    const { data: session, status: sessionStatus } = useSession();
    const userName = session?.user.name;
    const { text: quotes, author: Author } = Quote.getQuote();
    const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)

    useEffect(() => {
        setIsInputSpinnerOn(true);
        fetch('/api/getPost').then(res => {
            res.json().then(msgs => {
                setIsInputSpinnerOn(false);
                setAllPost(msgs.Fetchedmessage);

                console.log(msgs.Fetchedmessage)

            })
        })

    }, [])

    const getData = () => {
        fetch('/api/getPost').then(res => {
            res.json().then(msgs => {
                setAllPost(msgs.Fetchedmessage);

                console.log(msgs.Fetchedmessage)

            })
        })
    }

    if (sessionStatus === "loading") {
        return <div className=' h-screen w-full flex justify-center items-center'><div class="inputloader "></div></div> ;
    }
    if (sessionStatus === "unauthenticated") {
        redirect("/")
    }



    return (
        <div className='flex justify-between h-screen w-full  '>
            <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full '>
                <div className='hidden  md:grid w-[50%] h-screen     '>
                    <Menu />
                </div>
                <div className='md:hidden  grid'>
                    <BottomMenu />
                </div>
                <div className='      w-full my-16 md:px-20 flex justify-center items-center  rounded-2xl  '>
                    <div className=" w-full h-full  md:px-32 px-5   md:pt-16 md:bg-[#323a43] rounded-3xl overflow-y-scroll  ">
                        <div className=' my-5'>
                            <h1 className='  text-4xl md:text-5xl font-bold text-textc  my-4'>Hey, {userName}</h1>
                        </div>
                        <div className=' my-5 py-3 px-3 text-center  bg-primary rounded-2xl md:py-7 md:my-12'>
                            <h2 className=' text-gray-900  font-bold text-lg text-center md:text-2xl '> Today&apos;s Quote</h2>
                            <p className=' text-gray-800 mt-3  font-medium text-sm md:text-lg '>{quotes}</p>
                            <div className=' w-full px-14'>
                                <p className=' text-gray-800  mt-3  font-medium text-xs md:text-sm  text-end'>-{Author}</p>
                            </div>

                        </div>
                        <div className=' my-5 '>

                            <p className=' text-[#ffffff6d]  font-normal text-base text-center md:text-2xl  my-9 '>Posts</p>

                            <div className='w-full h-full  flex flex-col-reverse'>
                                {isInputSpinnerOn && <div className=' flex w-full justify-center items-center'><div className="inputloader  "></div></div>}
                                {allPost.map((msgs) => (
                                    <div className=' mb-5 ' key={msgs.subject} >
                                        <div className=' mx-5'>
                                            <h2 className=' text-primary font-bold text-lg md:text-xl'>{msgs.name}</h2>
                                            <p className=' text-gray-300  my-1  font-medium text-base md:text-lg'>{msgs.subject}:</p>
                                            <p className=' text-gray-400 font-normal text-sm md:text-base'>{msgs.message}</p>
                                            <div>
                                                <p className='pt-3  text-primary text-xs md:text-sm my-1'>{msgs.tag}</p>
                                            </div>
                                            <p className=' text-end  text-gray-400 font-normal text-xs md:text-base my-1'>{msgs.date}</p>
                                        </div>
                                        <hr className='h-px  my-1 bg-[#ffffff21] border-0 ' />
                                    </div>
                                ))}
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


