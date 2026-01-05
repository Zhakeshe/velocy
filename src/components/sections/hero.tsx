"use client";

import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] flex flex-col overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(30,40,80,0.5),rgba(0,0,0,1))]"></div>
        <div className="absolute top-[15%] left-[20%] w-[1px] h-[1px] bg-white opacity-40"></div>
        <div className="absolute top-[40%] left-[10%] w-[1px] h-[1px] bg-white opacity-20"></div>
        <div className="absolute top-[10%] right-[30%] w-[1px] h-[1px] bg-white opacity-30"></div>
        <div className="absolute top-[60%] left-[45%] w-[1px] h-[1px] bg-white opacity-25"></div>
        <div className="absolute bottom-[30%] left-[15%] w-[1px] h-[1px] bg-white opacity-15"></div>
      </div>

      <div className="relative z-10 flex-1 w-full flex items-center">
        <div className="flex flex-col items-start gap-8 px-6 lg:px-16 xl:px-24 py-32 max-w-full lg:max-w-[50%]">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-[#121212]/80 border border-white/10 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-1.5 grayscale-[0.5]">
              <span className="text-xs">🇩🇪</span>
              <span className="text-xs">🇷🇺</span>
            </div>
            <p className="text-[12px] font-medium text-white/70">
              Долгожданный запуск VDS в Германии и Москве!
            </p>
            <button className="px-3 py-0.5 bg-white/10 hover:bg-white/15 rounded-full text-[10px] font-bold text-white/90 transition-colors border border-white/5">
              Подробнее
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl md:text-5xl lg:text-[72px] font-bold text-white tracking-tight leading-[1.05]">
              Прекрасное решение
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-[72px] font-bold text-blue-500 tracking-tight leading-[1.05]">
              для вашего проекта
            </h2>
          </div>
          <a href="#why-us" className="group flex items-center gap-4 mt-6 transition-transform hover:translate-x-2">
            <div className="relative flex items-center">
              <div className="w-12 h-[1.5px] bg-white/90 group-hover:w-16 transition-all duration-300"></div>
              <div className="absolute right-0 w-[7px] h-[7px] border-t-[1.5px] border-r-[1.5px] border-white/90 rotate-45"></div>
            </div>
            <span className="text-lg font-medium text-white/90">узнать больше</span>
          </a>
        </div>
        <div className="absolute right-[-5%] bottom-0 w-[70%] lg:w-[65%] h-full pointer-events-none flex items-end justify-end">
          <div className="absolute bottom-[20%] right-[10%] w-[70%] h-[60%] bg-blue-600/30 blur-[130px] rounded-full"></div>
          <div className="relative w-full h-full flex items-end justify-end overflow-visible pr-6 pb-20">
            <img
              src="/10.png"
              alt="Hero Graphic"
              className="relative z-10 w-[95%] h-auto max-h-[85%] object-contain object-right-bottom translate-y-[5%] translate-x-[-5%] scale-[1.15] drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            />
            <div className="absolute bottom-[-5%] right-0 w-[90%] h-[40%] overflow-hidden pointer-events-none opacity-40">
              <img
                src="/10.png"
                alt=""
                className="w-full h-auto object-contain object-right-top scale-[1.15] scale-y-[-1] translate-y-[-5%]"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 90%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 90%)',
                  filter: 'blur(3px)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 w-full">
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none"></div>

        <div className="relative flex justify-center pb-12 pt-10">
          <div className="bg-blue-600 py-3 px-10 rounded-[4px] shadow-[0_0_40px_rgba(37,99,235,0.5)] z-40 transition-transform hover:scale-105 cursor-default">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
              Почему мы?
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;