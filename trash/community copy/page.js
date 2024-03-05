"use client"
// import io from "socket.io-client";
import { useState, useEffect,useRef } from "react";
// import CommunityChat from "@/components/communityChat/CommunityChat";
import { useSession } from "next-auth/react";
import Menu from "@/components/menu/Menu ";
import Link from 'next/link';

import { IoArrowBackSharp } from "react-icons/io5";
// const socket = io.connect("https://dayecho-backend-1.vercel.app/");

function App() {
    
    const room = "1";
    const bottomRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const { data: session } = useSession()
    const userName = session?.user.name;
    const userEmail = session?.user.email;
    let user = userName || userEmail;

    // useEffect(() => {
    //     socket.emit("join_room", room)
    // }, [])




    return (
        <div >
        
                {/* <CommunityChat socket={socket} username={user} room={room} />
           */}

            </div>


      




    );
}

export default App;
