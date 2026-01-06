"use client";

import React from 'react';

const CTAFooter = () => {
  return (
    <section className="relative w-full bg-black overflow-hidden flex flex-col items-center">
      <div className="relative w-full pt-32 pb-64 lg:pb-80 flex flex-col items-center text-center px-4">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent z-10"></div>

        <h2 className="relative z-20 font-[Onest] text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
          Присоединяйтесь к нам!
        </h2>
        <p className="relative z-20 font-[Onest] text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
          Наша поддержка всегда поможет вам в решении любых вопросов с вашими услугами.
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] pointer-events-none z-0">
          <img
            src="/15.png"
            alt="Decorative abstract art"
            className="w-full h-auto opacity-50 transform translate-y-1/4 scale-110 md:scale-100 rotate-180 blur-[2px]"
            style={{
              filter: 'drop-shadow(0 0 50px rgba(59, 130, 246, 0.3)) blur(2px)'
            }}
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default CTAFooter;
