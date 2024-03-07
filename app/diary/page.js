"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { redirect } from "next/navigation";
import Menu from '@/components/menu/Menu ';
import BottomMenu from '@/components/menu/BottomMenu';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Datepicker from "tailwind-datepicker-react"
import { GrFormPrevious ,GrFormNext} from "react-icons/gr";
import CryptoJS from 'crypto-js';
const getCurrentDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month indexes are zero-based
  const year = currentDate.getFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
  return formattedDate;
};

const Diary = () => {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const currentdate = getCurrentDate();
  const { status: sessionStatus } = useSession();
  const [show, setShow] = useState(false);

  const [date, setDate] = useState("");
  const [diary, setDiary] = useState([]);
  const { data: session } = useSession();
  const name = session?.user.name;
  const email = session?.user.email;
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false)
  const encryptionKey = "codered";
// Decrypt function
const decryptText = (ciphertext, key) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

  const options = {
    title: "Select a date",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Clear",
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
      background: "bg-bgs ",
      todayBtn: "bg-transparent",
      clearBtn: " bg-bgp text-white hover:text-black",
      icons: " bg-bgp hover:bg-primary text-white",
      text: "text-white hover:text-black",
      disabledText: "bg-transparent",
      input: "bg-bgs text-white outline-none",
      inputIcon: " ",
      selected: " bg-primary  ",
    },
    icons: {
      // () => ReactElement | JSX.Element
      prev: () => <span><GrFormPrevious /></span>,
      next: () => <span><GrFormNext /></span>,
    },
    datepickerClassNames: "top-12",
    defaultDate: new Date("2022-01-01"),
    language: "en",
    disabledDates: [],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  }
  const getData = () => {
    
    setIsInputSpinnerOn(true);
    fetch("/api/getDiary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        date
      }),
    }).then(res => {
      res.json().then(msgs => {
        setIsInputSpinnerOn(false);
        setDiary(msgs.Fetchedmessage);
      })
    })

  }
 const handleChange = (selectedDate) => {
  const date = selectedDate;
  const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if needed
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (+1 because months are zero-based) and pad with leading zero if needed
  const year = date.getFullYear(); // Get year
  const dateString = `${day}-${month}-${year}`;
  setDate(dateString);
  console.log(dateString);
	}
	const handleClose = (state) => {
		setShow(state)
	}
  const checkDiary = () => {
    setIsInputSpinnerOn(true);
    fetch("/api/checkDiary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        currentdate
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
      .then(data => {
        setIsInputSpinnerOn(false);
        const objectExists = data.objectExists;
        console.log(objectExists);
        if (objectExists === false) { router.push("/newDiary"); }
        else {
          setModal(true);
        }
      })
  }
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
      <>

        <div className='flex  justify-between h-screen w-full  overflow-hidden '>
          <SpringModal isOpen={modal} setIsOpen={setModal} />
          <div className='   flex MainGrid md:grid grid-cols-2 grid-rows-1 h-screen w-full'>
            <div className='hidden  md:grid w-[50%] h-screen     '>
              <Menu />
            </div>
            <div className='md:hidden  grid' >
              <BottomMenu />
            </div>

            <div className='md:my-20 mb-20 md:mb-0 md:px-24 px-5 w-full rounded-2xl overflow-y-scroll '>
              <div className='   w-full  pt-20 md:pt-0  '>
                <label className=' text-6xl font-medium text-textc '>My,</label><br />
                <label className=' text-6xl font-bold text-primary my-2 '>Diary</label>
              </div>
              <div className=' my-14 w-full flex   '>
<Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} classNames='text-white' />
              {/* <Datepicker  theme={newtheme}
            onChange={ange}  /> */}

                <button className=' bg-white text-black text-md font-semibold py-2 px-4  rounded-xl mx-3' onClick={getData}> search</button>

              </div>
              <div className=' h-full w-full  bg-[#ffffff08] rounded-3xl'>
                {isInputSpinnerOn && <div className=' w-full  h-full flex justify-center pt-20'><div className="inputloader   "></div> </div>}
                {diary.map((msgs) => (
                  <div className=' mb-5 ' key={msgs.date} >
                    <div className=' mx-5'>
                      <p className='md:pt-10 md:px-8 pt-4 px-2 text-end  text-gray-400 text-sm md:text-base '>{msgs.date}</p>
                      <h2 className='  md:pt-10 md:px-8 pt-4 px-2 text-primary font-bold text-lg md:text-5xl'>{msgs.title}</h2>
                      <p className='md:px-8 md:py-5 pt-4 px-2 text-gray-300  my-1  font-semibold text-sm md:text-lg'>mood at that day was {msgs.mood}</p>
                      <p className='md:px-8 px-2 text-gray-400  font-light text-xs md:text-base'>{decryptText(msgs.content, encryptionKey)}</p>

                    </div>

                  </div>
                ))}
              </div>

              <div className=' fixed  bottom-28 rounded-3xl  right-0  mx-8 h-14  w-14  md:h-24  md:w-24 bg-white cursor-pointer' onClick={checkDiary}>
                <div className=' flex justify-center items-center h-full w-full text-gray-700 text-4xl font-bold ' >
                  +
                </div>
              </div>



            </div>
          </div>

        </div>

      </>
    );
  }
};

export default Diary;



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

const SpringModal = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className=" bg-bgp text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >

            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-primary grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center text-primary mb-2">
                Oopps..!
              </h3>
              <p className="text-center mb-6">
                You have already submitted your diary entry for today.You are not allowed to write more than one entry on the same day, See you tomorrow.
              </p>
              <div className="flex gap-2">
                <Link href="/diary" className='w-full' >
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white hover:opacity-90 transition-opacity text-bgs font-semibold w-full py-2 rounded"
                  >
                    understood
                  </button>
                </Link>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};