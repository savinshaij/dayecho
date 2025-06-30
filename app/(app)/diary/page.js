"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiPlus, FiSearch } from "react-icons/fi";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Datepicker from "tailwind-datepicker-react"
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import CryptoJS from 'crypto-js';
import { isEmpty } from 'lodash';

const getCurrentDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  return `${day}-${month}-${year}`;
};

const Diary = () => {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const currentdate = getCurrentDate();
  const { status: sessionStatus } = useSession();
  const [show, setShow] = useState(false);
  const [infoView, setInfoView] = useState(true);
  const [diaryFound, setDiaryFound] = useState(false);
  const [date, setDate] = useState("");
  const [diary, setDiary] = useState(null);
  const { data: session } = useSession();
  const name = session?.user.name;
  const email = session?.user.email;
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false);
  const encryptionKey = "codered";

  const decryptText = (ciphertext, key) => {
    if (!ciphertext) return "";
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const options = {
    title: "Select a date",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Clear",
    maxDate: new Date("2070-01-01"),
    minDate: new Date("2020-01-01"),
    theme: {
      background: "bg-bgs",
      todayBtn: "bg-transparent",
      clearBtn: "bg-bgp text-textc hover:text-primary",
      icons: "bg-bgp hover:bg-primary text-textc",
      text: "text-textc hover:text-primary",
      disabledText: "bg-transparent",
      input: "bg-bgs text-textc outline-none border border-bgp rounded-lg",
      inputIcon: "",
      selected: "bg-primary text-bgp",
    },
    icons: {
      prev: () => <GrFormPrevious className="text-textc" />,
      next: () => <GrFormNext className="text-textc" />,
    },
    datepickerClassNames: "top-12",
    defaultDate: new Date(),
    language: "en",
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  };

  const handleChange = (selectedDate) => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    setDate(`${day}-${month}-${year}`);
  };

  async function getData() {
    if (!date) return;
    
    setIsInputSpinnerOn(true);
    setInfoView(false);
    setDiaryFound(false);
    setDiary(null);

    try {
      const res = await fetch("/api/getDiary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, date }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.diaryEntry) {
          setDiaryFound(true);
          setDiary(data.diaryEntry);
        }
      }
    } catch (error) {
      console.error("Error fetching diary:", error);
    } finally {
      setIsInputSpinnerOn(false);
    }
  }

  const checkDiary = () => {
    setIsInputSpinnerOn(true);
    fetch("/api/checkDiary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, currentdate }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.objectExists) {
          setModal(true);
        } else {
          router.push("/newDiary");
        }
      })
      .catch(console.error)
      .finally(() => setIsInputSpinnerOn(false));
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inputloader"></div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    redirect("/");
  }

  return (
    <>
      <SpringModal isOpen={modal} setIsOpen={setModal} />
      
      <div className="flex flex-col h-screen w-full">
        <motion.main 
          className="flex-1 overflow-y-auto px-5 md:px-24 py-20 md:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-textc">
              My <span className="text-primary">Diary</span>
            </h1>
            <p className="text-textc/60 mt-2 text-sm md:text-base">
              Turn your daily moments into lasting memories
            </p>
          </header>

          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
              <div className="flex-1 w-full">
                <label className="block text-textc/80 mb-2 text-sm font-medium">
                  Select date to view entry
                </label>
                <div className="flex gap-3">
                  <Datepicker 
                    options={options} 
                    onChange={handleChange} 
                    show={show} 
                    setShow={setShow} 
                    className="w-full"
                  />
                  <button 
                    onClick={getData}
                    disabled={!date || isInputSpinnerOn}
                    className="bg-primary text-bgp px-4 py-2 rounded-lg flex items-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
                  >
                    {isInputSpinnerOn ? (
                      <div className="w-4 h-4 border-2 border-bgp border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSearch />
                    )}
                    Search
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-bgs/50 rounded-xl p-6 min-h-[400px] border border-bgp/30">
            {infoView && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-bgp/20 p-6 rounded-full mb-4">
                  <FiSearch className="text-primary text-3xl" />
                </div>
                <h3 className="text-xl font-medium text-textc mb-2">
                  Select a date to view your diary
                </h3>
                <p className="text-textc/60">
                  Choose a date from the picker above to see your past entries
                </p>
              </div>
            )}

            {isInputSpinnerOn && (
              <div className="h-full flex items-center justify-center">
                <div className="inputloader"></div>
              </div>
            )}

            {!diaryFound && !infoView && !isInputSpinnerOn && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-bgp/20 p-6 rounded-full mb-4">
                  <FiAlertCircle className="text-primary text-3xl" />
                </div>
                <h3 className="text-xl font-medium text-textc mb-2">
                  No entry found
                </h3>
                <p className="text-textc/60">
                  You didn&apos;t write anything on this day
                </p>
              </div>
            )}

            {diaryFound && diary && (
              <article className="animate-fadeIn">
                <header className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {diary.mood || "No mood set"}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2">
                      {decryptText(diary.title, encryptionKey) || "Untitled Entry"}
                    </h2>
                  </div>
                  <time className="text-textc/50 text-sm">
                    {diary.date}
                  </time>
                </header>

                <div className="prose prose-invert max-w-none">
                  <p className="text-textc whitespace-pre-wrap">
                    {decryptText(diary.content, encryptionKey)}
                  </p>
                </div>
              </article>
            )}
          </section>

          <motion.button
            onClick={checkDiary}
            className="fixed bottom-28 right-8 bg-primary text-bgp p-4 rounded-full shadow-lg
                      hover:scale-105 transition-transform duration-200 z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Add new diary entry"
          >
            <FiPlus className="text-xl" />
          </motion.button>
        </motion.main>
      </div>
    </>
  );
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
          className="fixed inset-0 bg-bgp/80 backdrop-blur-sm z-50 grid place-items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bgs border border-bgp/30 rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="text-center">
              <div className="mx-auto bg-primary/20 w-16 h-16 rounded-full grid place-items-center mb-4">
                <FiAlertCircle className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-textc mb-2">
                Daily Limit Reached
              </h3>
              <p className="text-textc/70 mb-6">
                You can only write one diary entry per day. Come back tomorrow to share more!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-bgp font-medium px-6 py-2 rounded-lg transition"
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Diary;