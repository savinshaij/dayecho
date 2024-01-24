// NavBar.js
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AnchorLink from "react-anchor-link-smooth-scroll";
const NavBar = () => {
    const path = usePathname();
    const { data: session } = useSession()
    const status = session?.status;
    const isAdmin = false;
    const userName = session?.user.name;
    const userEmail = session?.user.email;
    let user = userName || userEmail;

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    if(path !== "/" && path !== "/login" && path !== "/register"){
        return (

        
            <div className='fixed w-full z-50'>
    
                <nav className="relative  w-full">
                    <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
                        <div className="flex items-center justify-between">
                           
    
    
                            <div className='flex gap-3'>
                                <div className='  flex justify-center items-center md:hidden'>
    
                                
                                </div>
    
                                {/* Mobile menu button */}
                                <div className="flex lg:hidden">
                                   
                                </div>
    
                            </div>
    
                        </div>
    
                        {/* Mobile Menu open: "block", Menu closed: "hidden" */}
                        <div
                            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white  md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
                                }`}
                        >
                            <div className="navs flex flex-col md:flex-row md:mx-6 font-medium">
           
                               
                               
                               
                                
                               
                              
    
                            </div>
    
                            <div className="flex justify-center  gap-3  ">
                                {!session ? (
                                    <>
    
    
                                        
                                          
                                    </>
                                ) : (
                                    <>
    
                                        <div className=' ml-5 flex gap-4 justify-center items-center'>
                                            <p className=' text-gray-400 '>Hello, {user}</p>
                                            <button className="  rounded-3xl  bg-primary text-gray-900 font-medium py-2 px-6  transition-all hover:bg-[#dbde48] active:scale-95" onClick={() => { signOut() }}>
                                                Log out
                                            </button>
    
                                           
                                        </div>
    
                                    </>
                                )}
                            </div>
    
    
                        </div>
                    </div>
                </nav>
            </div>
    
        );
    }
   
};

export default NavBar;
