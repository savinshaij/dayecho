"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import GoogleError from "./modal/GoogleError";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const { status: sessionStatus } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isInputSpinnerOn, setIsInputSpinnerOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsInputSpinnerOn(true);
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      setIsInputSpinnerOn(false);
      return;
    }

    try {
      // Check if user exists
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists");
        setIsInputSpinnerOn(false);
        return;
      }

      // Register user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Registration error:", error);
    } finally {
      setIsInputSpinnerOn(false);
    }
  };

  const googleError = () => {
    setModal(true);
  };

  if (sessionStatus === "authenticated") {
    router.replace("/home");
    return null;
  }

  return (
    <>
      {isInputSpinnerOn && (
        <div className="inputloader absolute top-[50%] left-[46%]"></div>
      )}

      <GoogleError
        isOpen={modal}
        setIsOpen={setModal}
        heading="Maintenance"
        text='Continue with "Register or login using Email". Google signup feature is not available at this moment.'
      />

      <div className="flex h-screen w-full items-center justify-center bg-bgp">
        <div className="w-full max-w-md rounded-lg bg-bgs p-8 border border-gray-700">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-semibold text-primary">Create Account</h3>
            <p className="mt-2 text-textc">Join our community today</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center rounded-lg border bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-bgp hover:text-textc"
            onClick={() => signIn("google", { callbackUrl: "/home" })}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 40 40">
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#FFC107"
              />
              <path
                d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                fill="#FF3D00"
              />
              <path
                d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                fill="#4CAF50"
              />
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#1976D2"
              />
            </svg>
            Continue with Google
          </motion.button>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-textc">or</span>
            <div className="flex-grow border-t border-white"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-textc" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  className="block w-full rounded-lg border border-gray-700 bg-bgp p-2.5 pl-10 text-sm text-textc placeholder-gray-400 focus:border-primary focus:ring-primary"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-textc" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  className="block w-full rounded-lg border border-gray-700 bg-bgp p-2.5 pl-10 text-sm text-textc placeholder-gray-400 focus:border-primary focus:ring-primary"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-textc" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  className="block w-full rounded-lg border border-bgs bg-bgp p-2.5 pl-10 pr-10 text-sm text-textc placeholder-gray-400 focus:border-primary focus:ring-primary"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-red-900 p-3 text-sm text-red-100"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isInputSpinnerOn}
              className="w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-medium text-black hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-70"
            >
              {isInputSpinnerOn ? "Creating account..." : "Register"}
            </motion.button>

            <div className="mt-6 text-center text-sm text-textc">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}