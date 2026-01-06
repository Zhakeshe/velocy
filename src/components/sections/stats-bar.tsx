"use client";

import React from 'react';

const StatsBar: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {}
      <div className="z-[3] h-0.5 w-full bg-white/5"></div>

      {}
      <div className="general-panel z-[3] flex w-full flex-col items-center justify-between gap-8 py-8 md:flex-row md:gap-0 md:px-16 bg-transparent">

        {}
        <div className="flex gap-6 items-center">
          <span className="icon-[gravity-ui--persons] size-7 text-white opacity-100 shrink-0"></span>
          <div className="flex flex-col justify-start">
            <p className="text-white font-[Neue-Bold] text-3xl font-bold tracking-tight">50.0k+</p>
            <p className="font-[Neue-Regular] text-white/50 text-base">active users</p>
          </div>
        </div>

        {}
        <div className="overlay h-0.5 w-56 rounded-full bg-white/15 md:w-0 xl:w-32 2xl:w-72"></div>

        {}
        <div className="flex gap-6 items-center">
          <span className="icon-[gravity-ui--server] size-7 text-white opacity-100 shrink-0"></span>
          <div className="flex flex-col justify-start">
            <p className="text-white font-[Neue-Bold] text-3xl font-bold tracking-tight">21.1k+</p>
            <p className="font-[Neue-Regular] text-white/50 text-base">active servers</p>
          </div>
        </div>

        {}
        <div className="overlay h-0.5 w-56 rounded-full bg-white/15 md:w-0 xl:w-32 2xl:w-72"></div>

        {}
        <div className="flex gap-6 items-center">
          <span className="icon-[gravity-ui--shopping-basket] size-7 text-white opacity-100 shrink-0"></span>
          <div className="flex flex-col justify-start">
            <p className="text-white font-[Neue-Bold] text-3xl font-bold tracking-tight">10.0k+</p>
            <p className="font-[Neue-Regular] text-white/50 text-base">paid servers</p>
          </div>
        </div>

      </div>

      <style jsx global>{`

        @font-face {
          font-family: 'Neue-Bold';
          src: local('sans-serif');
          font-weight: 700;
        }
        @font-face {
          font-family: 'Neue-Regular';
          src: local('sans-serif');
          font-weight: 400;
        }

        .general-panel {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .overlay {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default StatsBar;