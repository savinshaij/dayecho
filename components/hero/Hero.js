"use client";

import Image from "next/image";

const Hero = () => {
    return (
        <div className="w-full  py-10  mt-20">
            <section className="w-full px-8  grid grid-cols-1 md:grid-cols-2 items-center  gap-8 max-w-6xl mx-auto">
                <div>

                    <h3 className="text-4xl md:text-6xl font-bold pr-4 text-gray-900">
                        Everything is better with a <span className=" text-orange-600">pizza</span>
                    </h3>
                    <p className="text-base md:text-lg text-slate-700 my-4 md:my-6  w-[87%]">
                        pizza is the missing piece that makes every day complete a simple yet delicious joy in life
                    </p>
                    <div className="flex gap-5">
                        <button className=" rounded-3xl bg-orange-600 text-white font-medium py-2 px-4 md:px-9 transition-all hover:bg-orange-500 active:scale-95">
                            order now
                        </button>
                        <button className=" rounded-3xl  text-gray-700 font-medium py-2 px-4 md:px-9  transition-all hover:bg-gray-200 bg-gray-100 active:scale-95">
                            Learn more
                        </button>
                    </div>

                </div>
                <div className=" flex justify-center items-center">
                    <Image src={"/pizza.png"} width={400} height={50} alt={"image"}></Image>
                </div>

            </section>
        </div>

    );
};


export default Hero;