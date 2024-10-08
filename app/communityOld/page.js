"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from "react-icons/io5";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { IoArrowBackSharp } from "react-icons/io5";
import Link from 'next/link';
import { throttle } from 'lodash';

function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const showDate = date + '/' + month + "/" + year;
    return (showDate);
}
// Create your Next.js component
const Chat = () => {

    const [time, setTime] = useState(".");
    const [date, setDate] = useState(getDate());
    const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)
    const [isMsgFetchLoadingOn, setIsMsgFetchLoadingOn] = useState(false)
    const bottomRef = useRef(null);
    const { status: sessionStatus } = useSession();
    const [message, setMessage] = useState('');
    const [allMessage, setAllMessage] = useState([]);
    const { data: session } = useSession()
    const name = session?.user.name;
    const email = session?.user.email;
    const [s, sets] = useState(1);
    // let user = userName || userEmail;
    const containerRef = useRef(null);

    const getScrollPercentage = () => {
        const container = containerRef.current;
        if (!container) return 0;

        const scrollPosition = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        if (scrollHeight === 0) {
            return 0;
        }

        const scrollPercentage = (scrollPosition / (scrollHeight - clientHeight)) * 100;
        return scrollPercentage;
    };

    function getTime() {
        const today = new Date();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        return (strTime);
    }




    useEffect(() => {

        const interval = setInterval(() => {
            // Call your function here
            if (getScrollPercentage() != 0) {

                fetchmessages();

            }
            else {

                if (s) {
                    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                }

            }
            if (getScrollPercentage() < 3) {

                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

            }
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    const handleInputFocus = () => {
        sets(false);
        if (getScrollPercentage() < 88) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }


    };

    useEffect(() => {
        if (getScrollPercentage() > 88) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessage]);




    function fetchmessages() {

        setIsMsgFetchLoadingOn(true);


        fetch('/api/communityMsgGet').then(res => {
            res.json().then(msgs => {
                setAllMessage(msgs.Fetchedmessage);
                setIsMsgFetchLoadingOn(false);
            })
        })

    }
    const handleSubmit = async (e) => {
        const trimmedValue = message.trim();
        if (message === "" || trimmedValue === "") {
            return null;
        }
        setMessage(trimmedValue);
        setIsInputSpinnerOn(true);
        try {
            const res = await fetch("api/communityMsgPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    date,
                    time
                }),
            });

            if (res.ok) {
                setMessage(' ');
                setIsInputSpinnerOn(false);
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log("Error sending message: ", error);
        }
    };


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

            <div className='flex justify-between h-screen w-full   '>

                <div className='  flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full '>
                    <div className='hidden  md:grid w-[50%] h-screen     '>
                        <Menu />
                    </div>
                    <div className=' fixed md:hidden mt-16  w-full '>

                        <div className='flex w-full h-full justify-between items-center px-5'>
                            <Link href='/home'>
                                <div className=' flex justify-center items-center h-8 w-8
                                      bg-white rounded-3xl my-2'>
                                    <IoArrowBackSharp className='h-5 w-5 text-black ' />
                                </div>
                            </Link>
                            {/* <button className=' text-xs rounded-lg px-2 font-light py-2 active:scale-75 duration-300 bg-[#ffffff1c] text-gray-300' onClick={fetchmessages}>view recent messages</button> */}
                        </div>
                    </div>

                    <div className='      w-full my-20 md:px-20 flex justify-center items-center  rounded-2xl  '>

                        <div className=" w-full h-full flex flex-col  justify-between   rounded-3xl ">
                            <div ref={containerRef} className=' px-2 h-full w-full   rounded-3xl overflow-y-scroll  md:bg-[#3e4b55]  '>

                                {/* <div className=' hidden md:flex w-full justify-end items-center'>
                                        <button className=' fixed text-xs font-normal rounded-2xl active:scale-75 duration-300 px-3 mt-16 py-2 bg-[#ffffff1c] text-white' onClick={fetchmessages}>view resent messages</button>
                                    </div> */}

                                {isMsgFetchLoadingOn && <div className=' h-full w-full flex justify-center items-center'><div class="inputloader "></div></div>}
                                <div className=' flex justify-center items-center mt-28'>
                                    <p className=' text-xs font-light text-[#ffffff4d]'> scroll up to go to bottom</p>
                                </div>
                                {allMessage.map((msgs, index) => (

                                    <div key={index} className='max-w-xs bg-bgs rounded-tl-none pb-3 px-3 pt-1 mx-2 my-3  rounded-3xl'>
                                        <div className='flex w-full justify-between h-full items-center'>
                                            <h3 className=' my-2 md:text-lg text-base font-bold text-primary'> {msgs.name}</h3>
                                            <p className=' text-gray-500 text-xs text-end'>{msgs.date}</p>
                                        </div>
                                        <p className='   md:text-base text-sm text-textc   '> {msgs.message} </p>
                                        {/* <p className=' text-gray-500 text-xs text-end'>{msgs.time}</p> */}
                                    </div>


                                ))}

                                <div ref={bottomRef} />
                            </div>
                            <div className=' w-full   fixed md:relative     bottom-1  md:py-0 py-4    justify-center md:pt-4 items-end    '>


                                <div className='  md:pl-6 pl-4 pr-2  self-end   w-full md:h-14 h-12 border-[0.5px]    flex justify-center items-center gap-3   rounded-full bottom-1  bg-[#2c3338] border-gray-600' >
                                    <input onFocus={handleInputFocus} placeholder='messages...' className='   pl-6 bg-transparent outline-none md:text-lg text-sm text-white w-full h-full' type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={(event) => { event.key === "Enter" && handleSubmit(); }} />
                                    {isInputSpinnerOn && <div className="inputloader"></div>}
                                    <button className=' bg-primary py-3 px-4 rounded-full active:scale-75 duration-300' onClick={handleSubmit}>
                                        <IoSend className=' md:h-6 md:w-6 w-3 h-3 text-gray-800' />
                                    </button>
                                </div>





                            </div>





                        </div>
                    </div>
                </div>

            </div>


        );
    }
};

export default Chat;