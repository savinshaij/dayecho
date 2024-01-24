"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("/");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    sessionStatus !== "authenticated" && (
    <div className='flex h-screen w-full justify-center items-center  '>

      <div className="flex w-full  justify-center items-center max-w-sm mx-auto overflow-hidden  rounded-lg   lg:max-w-4xl">
      

        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <div className="flex justify-center mx-auto py-3">
            <h3 className=' text-3xl font-poppins font-semibold text-primary'> Login</h3>
          </div>


          <form onSubmit={handleSubmit}>

            <a className="flex items-center justify-center mt-4 text-white transition-colors duration-300 transform border rounded-lg  hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
              onClick={() => {
                signIn("google");
              }}
            >
              <div className="px-4 py-2">
                <svg className="w-6 h-6" viewBox="0 0 40 40">
                  <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                  <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                  <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                  <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                </svg>
              </div>

              <span className="w-5/6 px-4 py-3 font-bold text-center">Sign in with Google</span>
            </a>



            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b lg:w-1/4"></span>

              <a href="#" className="text-xs text-center text-textc uppercase  hover:underline">or login
                with email</a>

              <span className="w-1/5 border-b  lg:w-1/4"></span>
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-textc " htmlFor="LoggingEmailAddress">Email Address</label>
              <input id="LoggingEmailAddress" className="block w-full px-4 py-2 text-white bg-[#38414b] border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email" />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block mb-2 text-sm font-medium text-textc " htmlFor="loggingPassword">Password</label>
                {/* <a href="#" className="text-xs text-gray-500  hover:underline">Forget Password?</a>*/}
              </div>

              <input id="loggingPassword" className="block w-full px-4 py-2 text-white bg-[#38414b] border rounded-lg    focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password" />
            </div>


            {error && (
              <div className="text-red-500 text-[16px] mb-4">
                {error}
              </div>
            )}
            <div className="mt-6">
              <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-black capitalize transition-colors duration-300 transform bg-primary rounded-lg hover:violet-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50" type='submit'>
                Login
              </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b  md:w-1/4"></span>

              <Link href={"/register"} className="text-xs text-textc uppercase  hover:underline">or Register</Link>

              <span className="w-1/5 border-b  md:w-1/4"></span>
            </div>
          </form>

        </div>
      </div>
    </div>
    )
  );
}
