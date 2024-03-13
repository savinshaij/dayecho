'use client';
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Nav from './nav/Nav';


const menu = {
    open: {
        width: "100%",
        height: "200px",
        top: "-25px",
        right: "0px",
        left:"0px",
        transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] }
    },
    closed: {
        width: "40px",
        height: "40px",
        top: "0px",
        right: "0px",
        left:"0px",
        transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] }
    }
}

export default function MenuNav() {
    const [isActive, setIsActive] = useState(false);

    return (

        <div className=' w-full z-50'>
            <nav className="relative    w-full">
                
                    <div className="fixed right-[20px] top-[8px] ">
                        <motion.div
                            className=" w-10 h-10    bg-white  rounded-[25px]"
                            variants={menu}
                            animate={isActive ? "open" : "closed"}
                            initial="closed"
                        >
                            <AnimatePresence>
                                {isActive && <Nav />}
                            </AnimatePresence>
                        </motion.div>
                        <button
                            className='absolute flex justify-center  items-center w-10 h-10 cursor-pointer bg-bgp  overflow-hidden rounded-[25px] right-0 top-0'
                            onClick={() => { setIsActive(!isActive) }}
                        >
                            {isActive ? <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" onClick={() => { setIsActive(!isActive) }}>
                                <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24" onClick={() => { setIsActive(!isActive) }}>
                                <path d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z"></path>
                            </svg>}
                        </button>
                    </div>
                
            </nav>
        </div>






    )
}