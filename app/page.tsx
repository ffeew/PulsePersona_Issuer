"use client";

import { useState } from "react";
import ChevronDown from "./assets/svgs/ChevronDown";
import Logo from "./assets/svgs/Logo";

export default function Home() {
  const [expand, setExpand] = useState(false);

  const handleDownload = () => {
    // do something
  };

  return (
    <>
      <div className="fixed w-64 min-h-screen flex flex-col justify-start items-center px-5 py-8 space-y-20 bg-white">
        <div className="w-full flex flex-row justify-start items-center space-x-4">
          <Logo className="w-16 h-16 text-theme-black -rotate-45" />
          <p className="text-lg font-semibold text-left">Somapah University</p>
        </div>
        <div className="w-full flex flex-col justify-start items-center space-y-2">
          <button
            className="w-full flex flex-row justify-between items-center px-4 py-2 transition-all hover:bg-zinc-100 rounded-xl"
            onClick={() => setExpand((prev) => !prev)}
          >
            <p>My Grades</p>
            <ChevronDown
              className={`text-theme-black transition-all ${
                expand && "rotate-180"
              }`}
            />
          </button>
          {expand && (
            <button className="w-full flex justify-start items-center px-2 py-2 transition-all hover:bg-zinc-100 rounded-xl">
              <p className="pl-10">Academic Transcript</p>
            </button>
          )}
        </div>
      </div>

      <div className="container-screen pl-72 bg-zinc-100 py-8 pr-8">
        <div className="w-full flex flex-col justify-start items-start space-y-5">
          <div className="flex flex-col justify-center items-start space-y-1">
            <p className="text-2xl font-medium">Your Academic Transcript</p>
            <p className="">
              View your academic transcript or download Verifiable Credentials
            </p>
          </div>
          <div className="w-full h-[1px] bg-zinc-300"></div>
          <div className="w-full grid grid-cols-12 gap-5">
            <div className="col-span-8 w-full flex flex-col p-5 bg-white rounded-xl">
              <p className="uppercase">
                <span className="font-semibold">name: </span>song lin
              </p>
              <p className="uppercase">
                <span className="font-semibold">student no.: </span>a0105509l
              </p>
              <p className="uppercase">
                <span className="font-semibold">date of birth: </span>17/10/1992
              </p>
              <p className="uppercase">
                <span className="font-semibold">date issued: </span>22/06/2016
              </p>

              <div className="w-full h-[1px] my-5 bg-zinc-300"></div>
              <p className="uppercase">
                <span className="font-semibold">programme: </span>
                bachelor of environmental studies
              </p>
              <p className="uppercase">
                <span className="font-semibold">programme status: </span>
                active in programme
              </p>
              <div className="w-full h-[1px] my-5 bg-zinc-300"></div>
              <div className="w-full grid grid-cols-12">
                <div className="col-span-8 w-full">
                  <p className="font-semibold underline uppercase">module</p>
                  <p className="font-semibold uppercase py-3">
                    academic year semester 1
                  </p>
                  <div className="w-full grid grid-cols-12">
                    <div className="col-span-2 w-full">
                      <p className="uppercase">env1202</p>
                      <p className="uppercase">env2101</p>
                      <p className="uppercase">env2103</p>
                      <p className="uppercase">ge2228</p>
                      <p className="uppercase">lsm3252</p>
                      <p className="uppercase">ncc1001</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 w-full">
                  <p className="font-semibold underline uppercase">grade</p>
                  <p className="font-semibold uppercase py-3 text-white">.</p>
                  <div className="w-full grid grid-cols-12">
                    <div className="col-span-2 w-full">
                      <p className="uppercase">B+</p>
                      <p className="uppercase">A+</p>
                      <p className="uppercase">B+</p>
                      <p className="uppercase">A-</p>
                      <p className="uppercase">B</p>
                      <p className="uppercase">CS</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 w-full">
                  <p className="font-semibold underline uppercase">credits</p>
                  <p className="font-semibold uppercase py-3 text-white">.</p>
                  <div className="w-full grid grid-cols-12">
                    <div className="col-span-2 w-full">
                      <p className="uppercase">4.00</p>
                      <p className="uppercase">4.00</p>
                      <p className="uppercase">4.00</p>
                      <p className="uppercase">4.00</p>
                      <p className="uppercase">4.00</p>
                      <p className="uppercase">4.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-start items-start">
              <button
                className="py-3 px-6 rounded-xl bg-theme-black transition-all"
                onClick={handleDownload}
              >
                <p className="text-white whitespace-nowrap">Download VC</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
