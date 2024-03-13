
import { motion } from 'framer-motion';
import { links, footerLinks } from './NavData';
import { perspective, slideIn } from "./Anim";

export default function index() {
    return (
        <div className="flex flex-col w-full justify-between h-full box-border py-10 px-3  ">
            <div className="flex w-full gap-2.5 flex-col">
                {
                    links.map((link, i) => {
                        const { title, href } = link;
                        return (
                            <div key={`b_${i}`} className="no-underline w-full px-7  text-[black] font-bold  text-base">
                                <motion.div
                                    href={href}
                                    custom={i}
                                    variants={perspective}
                                    initial="initial"
                                    animate="enter"
                                    exit="exit"
                                >
                                    <a className=' hover:bg-primary hover:text-white w-full rounded-xl px-1 py-2'>
                                        {title}
                                    </a>
                                </motion.div>
                            </div>
                        )
                    })
                }
            </div>
            <motion.div className="flex flex-wrap">
                {
                    footerLinks.map((link, i) => {
                        const { title, href } = link;
                        return (
                            <motion.a
                                className='w-full  px-7 py-2 font-bold text-xl'
                                variants={slideIn}
                                custom={i}
                                initial="initial"
                                animate="enter"
                                exit="exit"
                                key={`f_${i}`}
                            >
                                {title}
                            </motion.a>
                        )
                    })
                }
            </motion.div>
        </div>
    )
}