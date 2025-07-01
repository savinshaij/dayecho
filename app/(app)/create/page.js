"use client";

import Link from "next/link";
import { FiAlertCircle, FiUpload } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { compressImage } from "@/utils/compressImage"; // ✅ Import it

export default function Page() {
  const { data: session, status: sessionStatus } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name;

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [modal, setModal] = useState(false);
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false);

  if (sessionStatus === "loading") return <div className="h-screen w-full flex justify-center items-center"><div className="inputloader" /></div>;
  if (sessionStatus === "unauthenticated") redirect("/");

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !tag.trim()) return;

    setIsInputSpinnerOn(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("tag", tag);
      formData.append("date", getTodayDate());

      if (image) {
        const compressed = await compressImage(image); // ✅ Compress client-side
        formData.append("image", compressed);
      }

      const res = await fetch("/api/postPost", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("");
        setSubject("");
        setTag("");
        setImage(null);
        setPreview(null);
        setModal(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }

    setIsInputSpinnerOn(false);
  };

  return (
    <div className="flex h-screen w-full bg-bgp relative">
      {isInputSpinnerOn && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="inputloader" />
        </div>
      )}
      <SpringModal isOpen={modal} setIsOpen={setModal} />

      <div className="w-full mb-28 h-full flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-2xl bg-[#323a43] rounded-xl overflow-hidden border border-bgs">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Subject"
                className="w-full px-4 py-3 bg-bgp text-white rounded-lg outline-none focus:ring-2 focus:ring-primary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <textarea
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 bg-bgp text-white rounded-lg outline-none h-48 resize-none focus:ring-2 focus:ring-primary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <input
                placeholder="Tags (e.g., #food #tech)"
                className="w-full px-4 py-3 bg-bgp text-white rounded-lg outline-none focus:ring-2 focus:ring-primary"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                required
              />
              <div className="space-y-2">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-bgp text-gray-400 rounded-lg border border-dashed border-gray-600 cursor-pointer hover:border-primary transition-colors">
                  <FiUpload />
                  {image ? image.name : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {preview && (
                  <div className="relative group">
                    <img src={preview} alt="Preview" className="w-full h-auto max-h-32 object-contain rounded-lg border border-bgs" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isInputSpinnerOn}
                className="w-full py-3 px-6 bg-primary text-gray-900 font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {isInputSpinnerOn ? "Posting..." : "Publish Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const SpringModal = ({ isOpen, setIsOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="bg-black/50 backdrop-blur p-4 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-bgp text-white p-6 rounded-lg w-full max-w-md shadow-xl cursor-default relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <FiAlertCircle className="text-primary text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-center text-primary">Post Successful!</h3>
            <p className="text-center text-gray-300">Your post has been shared with the community.</p>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-2 bg-bgs text-white rounded-lg hover:bg-bgs/80 transition-colors">Create Another</button>
              <Link href="/home" className="flex-1">
                <button className="w-full py-2 bg-primary text-gray-900 font-medium rounded-lg hover:bg-primary/90 transition-colors">Go to Home</button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
