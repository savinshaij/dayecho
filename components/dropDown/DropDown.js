
import { FaSignOutAlt,FaUserFriends,FaHandsHelping  } from "react-icons/fa";
import { FaBarsStaggered,FaX,FaCircleExclamation} from "react-icons/fa6";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {  useState } from "react";
import Link from "next/link";

const DropDown = () => {
    const [open, setOpen] = useState(false);

    return (
        
            <motion.div animate={open ? "open" : "closed"} className="relative">
                <button
                    onClick={() => setOpen((pv) => !pv)}
                    className="flex items-center gap-2 active:scale-90  duration-300 px-3 py-2 h-full rounded-md text-indigo-50  hover:bg-bgs transition-colors"
                >
                    
                   {open ? <FaX/>:<FaBarsStaggered />}
                        
                  
                </button>

                <motion.ul
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{ originY: "top", translateX: "-50%" }}
                    className="flex flex-col gap-2 p-2 rounded-lg bg-bgp shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden"
                >
                  {/* <Link href='/friends' className="  text-textc"> <Option setOpen={setOpen} Icon={FaUserFriends} text="Friends" /></Link>   */}
                  <Link href='/help' className="  text-textc" >  <Option setOpen={setOpen} Icon={FaHandsHelping } text="Help" /></Link>
                    <Link href='/about' className="  text-textc" >   <Option setOpen={setOpen} Icon={FaCircleExclamation} text="About" /></Link> 
                 <button onClick={() => { signOut() }} className=" bg-textc text-gray-900  rounded-lg "><Option setOpen={setOpen} Icon={FaSignOutAlt} text="Logout" /></button>   
                </motion.ul>
            </motion.div>
        
    );
};

const Option = ({ text, Icon, setOpen }) => {
    return (
        <motion.li
            variants={itemVariants}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-primary  hover:text-gray-900 transition-colors cursor-pointer"
        >
            <motion.span variants={actionIconVariants}>
                <Icon />
            </motion.span>
            <span>{text}</span>
        </motion.li>
    );
};

export default DropDown;

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
        },
    },
};



const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: "afterChildren",
        },
    },
};

const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
};