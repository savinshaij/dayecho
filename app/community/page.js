// pages/chat.js
"use client";

import { ref, onValue } from 'firebase/database';
import database from '../../lib/firebase';
import { sendMessage } from '../../lib/chat';
import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from "react-icons/io5";
import { useSession } from "next-auth/react";
import Menu from '@/components/menu/Menu ';
import Link from 'next/link';
import { IoArrowBackSharp } from "react-icons/io5";

const Chat = () => {
    const { data: session } = useSession();
    const name = session?.user.name;
    const email = session?.user.email;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state

    // Create a ref for the messages container
    const messagesEndRef = useRef(null);

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messageList = data ? Object.values(data) : [];
            setMessages(messageList);
            setLoading(false); // Set loading to false when data is fetched
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom whenever messages change
    }, [messages]);

    const handleSubmit = async (e) => {
        //e.preventDefault();
        try {
            await sendMessage(name, email, newMessage);
            setNewMessage(""); // Clear input after sending message
            scrollToBottom(); // Scroll to bottom after sending a message
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className='flex justify-between h-screen w-full'>
            <div className='flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
                <div className='hidden md:grid w-[50%] h-screen'>
                    <Menu />
                </div>
                <div className='fixed md:hidden mt-16 w-full'>
                    <div className='flex w-full h-full justify-between items-center px-5'>
                        <Link href='/home'>
                            <div className='flex justify-center items-center h-8 w-8 bg-white rounded-3xl my-2'>
                                <IoArrowBackSharp className='h-5 w-5 text-black' />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className='w-full my-20 md:px-20 flex justify-center items-center rounded-2xl'>
                    <div className="w-full h-full flex flex-col justify-between rounded-3xl">
                        <div className='px-2 h-full w-full rounded-3xl overflow-y-scroll md:bg-[#3e4b55]'>
                            {loading ? (
                                <div className='h-full w-full flex justify-center items-center'>
                                    <div className="inputloader"></div>
                                    <span className='text-gray-500 ml-2'>Loading...</span>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div key={index} className='max-w-xs bg-bgs rounded-tl-none pb-3 px-3 pt-1 mx-2 my-3 rounded-3xl'>
                                        <div className='flex w-full justify-between h-full items-center'>
                                            <h3 className='my-2 md:text-lg text-base font-bold text-primary'>{message.userName}</h3>
                                            <p className='text-gray-500 text-xs text-end'>{new Date(message.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                        <p className='md:text-base text-sm text-textc'>{message.messageText}</p>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className='w-full fixed md:relative bottom-1 md:py-0 py-4 justify-center md:pt-4 items-end'>
                            <div className='md:pl-6 pl-4 pr-2 self-end w-full md:h-14 h-12 border-[0.5px] flex justify-center items-center gap-3 rounded-full bg-[#2c3338] border-gray-600'>
                                <input
                                    placeholder='messages...'
                                    className='pl-6 bg-transparent outline-none md:text-lg text-sm text-white w-full h-full'
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                />
                                <button className='bg-primary py-3 px-4 rounded-full active:scale-75 duration-300' onClick={handleSubmit}>
                                    <IoSend className='md:h-6 md:w-6 w-3 h-3 text-gray-800' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;

// return (
//     <div className="max-w-lg mx-auto p-4">
//       <div className="bg-gray-100 p-4 rounded-lg shadow">
//         {messages.map((message, index) => (
//           <div key={index} className="mb-2">
//             <p className="text-sm text-gray-500">
//               {message.userName} at {new Date(message.timestamp).toLocaleTimeString()}
//             </p>
//             <p className="text-lg">{message.messageText}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit} className="mt-4">
//         <input
//           type="text"
//           className="w-full p-2 border rounded-lg"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           required
//         />
//         <button
//           type="submit"
//           className="mt-2 bg-blue-500 text-white p-2 rounded-lg w-full"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
