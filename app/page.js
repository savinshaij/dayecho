
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Menu from "@/components/menu/Menu ";
import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/footer/Footer";

export default async function Home() {
  const session = await getServerSession(authOptions);



  return (
    <main className="h-screen w-full  px-9    border border-[#1d1d1d08] bg-bgp">
      <div className='flex justify-center items-center  text-center  h-[97%] w-full  overflow-hidden '>
        <div className=" w-full ">
          <h1 className="  text-4xl md:text-7xl font-bold  text-primary md:my-6 my-4  whitespace-pre-line "> Welcome to DayEcho!</h1>
          <h2 className=" text-base md:text-2xl font-semibold  text-textc  "> Connect, Share, and Chronicle Your Daily Moments.</h2>
          <div className=" flex justify-center items-center ">
            <p className="  text-sm font-normal md:text-xl text-[#65707b] md:w-[70%]  w-full md:my-4 my-3 whitespace-pre-line"> Unlock the power of self-expression and community with DayEcho, where every day is a new chapter waiting to be written.<span className=" hidden md:inline">Dive into a platform designed for sharing your experiences, thoughts, and memories with a vibrant community.</span></p>
          </div>

          <div className="flex justify-center gap-4 w-auto my-2">
            <Link href={"/login"}>
              <button className="  rounded-xl  bg-primary text-gray-900 font-medium md:py-2 md:px-9  py-1 px-7 transition-all hover:bg-[#dbde48] active:scale-95" >
                Login
              </button></Link>
            <Link href={"/register"}>   <button className="  rounded-xl border  text-textc  font-medium md:py-2 md:px-9  px-7  py-1 transition-all hover:bg-[#3f4853] active:scale-95" >
              Register
            </button></Link>

          </div>

        </div>
       
      </div>
      <Footer/>
    </main>
  );
}
