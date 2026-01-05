"use client";

import React from "react";
import Image from "next/image";
import { House, BookOpen, Snowflake, LogIn, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full px-4 lg:px-16 py-3 fixed top-0 z-50 bg-black/85 border-neutral-900/50 backdrop-blur-md border-b transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mx-auto max-w-[100rem]">
        {}
        <div className="flex gap-32 items-center">
          <button className="flex xl:hidden p-2.5 rounded-full transition-all duration-300 ease-in-out hover:scale-[98%] active:scale-[95%] hover:opacity-90 active:opacity-80">
            <Menu className="text-neutral-100 size-5" />
          </button>

          <a 
            href="/" 
            className="hidden xl:flex active:scale-90 text-white hover:text-neutral-300 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <img 
              className="w-[48px] h-auto" 
              src="https://play2go.cloud/logo/light.svg" 
              alt="Play2Go Logo" 
            />
          </a>
        </div>

        {}
        <div className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:flex gap-12 items-center">
          <a 
            href="/" 
            className="flex gap-4 text-neutral-50/50 hover:text-neutral-50 items-center hover:scale-[98%] active:scale-[95%] hover:opacity-90 active:opacity-80 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <House className="size-5" />
            <p className="text-base font-medium font-sans">Home</p>
          </a>
          <a 
            href="https://wiki.play2go.cloud/" 
            className="flex gap-4 text-neutral-50/50 hover:text-neutral-50 items-center hover:scale-[98%] active:scale-[95%] hover:opacity-90 active:opacity-80 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <BookOpen className="size-5" />
            <p className="text-base font-medium font-sans">Wiki</p>
          </a>
        </div>

        {}
        <a 
          href="/" 
          className="flex xl:hidden active:scale-90 text-white hover:text-neutral-300 cursor-pointer transition-all duration-300 ease-in-out"
        >
          <img 
            className="w-[48px] h-auto" 
            src="https://play2go.cloud/logo/light.svg" 
            alt="Play2Go Logo" 
          />
        </a>

        {}
        <div className="hidden xl:flex items-center gap-6">
          <button className="flex gap-4 p-4 bg-neutral-950 rounded-full items-center hover:scale-[98%] active:scale-[96%] hover:opacity-90 active:opacity-80 transition-all duration-300 ease-in-out">
            <Snowflake className="size-5 text-sky-300" />
          </button>

          <button className="flex gap-4 p-4 bg-neutral-950 rounded-full items-center hover:scale-[98%] active:scale-[96%] hover:opacity-90 active:opacity-80 transition-all duration-300 ease-in-out">
            <img 
              className="size-5 object-contain" 
              src="https://play2go.cloud/country/usa.svg" 
              alt="USA Flag" 
            />
          </button>

          <a 
            href="/auth" 
            className="flex gap-4 px-6 py-3 bg-[#FF65A60F] rounded-lg items-center hover:scale-[98%] active:scale-[96%] hover:opacity-90 active:opacity-80 cursor-pointer transition-all duration-300 ease-in-out border border-[#FF65A60F]"
          >
            <ArrowRightToSquare className="text-[#FF86AB] size-5" />
            <p className="text-[#FF86AB] font-medium font-sans">Personal area</p>
          </a>
        </div>

        {}
        <div className="flex xl:hidden items-center gap-4 mx-2">
          <button className="flex p-3 bg-neutral-950 rounded-lg items-center hover:scale-[98%] active:scale-[96%] hover:opacity-90 active:opacity-80 transition-all duration-300 ease-in-out">
            <Snowflake className="text-sky-300 size-5" />
          </button>

          <a 
            href="/auth" 
            className="flex gap-4 p-3 bg-[#FF65A60F] rounded-lg items-center hover:scale-[98%] active:scale-[96%] hover:opacity-90 active:opacity-80 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <ArrowRightToSquare className="text-[#FF86AB] size-5" />
          </a>
        </div>
      </div>
    </header>
  );
}