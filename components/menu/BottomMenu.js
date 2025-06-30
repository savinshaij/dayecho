"use client";

import { IoSend } from "react-icons/io5";
import { FaHome, FaRegUserCircle, FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function BottomMenu() {
  const { data: session } = useSession();
  const path = usePathname();

  const menuItems = [
    {
      path: "/home",
      icon: <FaHome className="w-5 h-5 text-white" />,
      label: "Home",
      activeIcon: <FaHome className="w-5 h-5 text-primary" />
    },
    {
      path: "/community",
      icon: <HiUserGroup className="w-6 h-6 text-white" />,
      label: "Community",
      activeIcon: <HiUserGroup className="w-6 h-6 text-primary" />
    },
    {
      path: "/create",
      icon: (
        <svg
          className="w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 1v16M1 9h16"
          />
        </svg>
      ),
      label: "Create",
      isCenter: true
    },
    {
      path: "/friends",
      icon: <FaUserFriends className="w-5 h-5 text-white" />,
      label: "Friends",
      activeIcon: <FaUserFriends className="w-5 h-5 text-primary" />
    },
    {
      path: "/profile",
      icon: <FaRegUserCircle className="w-5 h-5 text-white" />,
      label: "Profile",
      activeIcon: <FaRegUserCircle className="w-5 h-5 text-primary" />
    }
  ];

  return (
    <motion.div
      className="fixed bottom-4 w-full z-50 px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative">
        {/* Floating blurred background */}
        <div className="absolute inset-0 bg-bgp/90 backdrop-blur-md border border-bgs rounded-2xl shadow-md" />

        <nav className="relative grid grid-cols-5 h-16 items-center z-10">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center relative"
            >
              {item.isCenter ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-7 w-14 h-14 flex items-center justify-center bg-primary rounded-full shadow-lg border-4 border-bgp z-20"
                >
                  {item.icon}
                </motion.div>
              ) : (
                <>
                  <div className="relative">
                    {path === item.path ? item.activeIcon : item.icon}
                    {path === item.path && (
                      <motion.div
                        className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                        layoutId="bottomMenuActive"
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      path === item.path ? "text-primary font-medium" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </p>
                </>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}