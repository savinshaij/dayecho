'use client';

import { FaInstagram,FaLinkedin } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

export default function Card() {

    return (

        <div className=" py-5  md:mx-48 md:items-center  flex flex-col  px-4 rounded-2xl bg-bgp border-[1px] border-[#fff2] text-gray-100">
            <div className="flex space-y-0 space-x-6 flex-row md:gap-2 ">
                <Image width={80} height={80} src="/profile.jpg" alt="" className=" md:hidden self-center flex-shrink-0 border rounded-full justify-self-start  border-gray-700" />
                <Image width={150} height={150} src="/profile.jpg" alt="" className=" hidden md:flex  self-center flex-shrink-0 border rounded-full justify-self-start  border-gray-700" />
                <div className="flex flex-col md:justify-center ">
                    <h4 className=" font-semibold text-left md:text-xl">Savin</h4>
                    <p className="text-gray-400 md:text-lg">ui/ux designer </p>
                    <p className="text-gray-400">Full stack developer </p>
                    <div className="flex justify-center gap-2  align-center pt-1">
                <a rel="noopener noreferrer" href="" aria-label="GitHub" className="p-2 rounded-mdtext-gray-100 hover:text-violet-400">
                    <svg viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current">
                        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                    </svg>
                </a>
                <Link rel="noopener noreferrer" href="" aria-label="Instagram" className="p-2 rounded-md dark:text-gray-100 hover:dark:text-violet-400">
                    <FaInstagram/>
                </Link>
                <Link rel="noopener noreferrer" href="" aria-label="Linkedin" className="p-2 rounded-md dark:text-gray-100 hover:dark:text-violet-400">
                   <FaLinkedin/>
                </Link>
                <Link rel="noopener noreferrer" href="" aria-label="Email" className="p-2 rounded-md dark:text-gray-100 hover:dark:text-violet-400">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current">
                        <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
                    </svg>
                </Link>
            </div>
                </div>
            </div>
           
        </div>






    )
}