"use client";

import React from 'react';
import { Mail, BookOpen, MessageSquare, Send, ShieldCheck, Lock } from 'lucide-react';
import { FaDiscord, FaTelegramPlane } from 'react-icons/fa';

const CTAFooter = () => {
  return (
    <footer className="relative w-full bg-black overflow-hidden flex flex-col items-center">
      <div className="relative w-full pt-32 pb-64 lg:pb-80 flex flex-col items-center text-center px-4">
        <h2 className="font-[Onest] text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
          Присоединяйтесь к нам!
        </h2>
        <p className="font-[Onest] text-base md:text-lg text-white/50 max-w-2xl leading-relaxed">
          Наша поддержка всегда поможет вам в решении любых вопросов с вашими услугами.
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] pointer-events-none">
          <img
            src="/15.png"
            alt="Decorative abstract art"
            className="w-full h-auto opacity-70 transform translate-y-1/4 scale-110 md:scale-100 rotate-180"
            style={{
              filter: 'drop-shadow(0 0 50px rgba(59, 130, 246, 0.3))'
            }}
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      </div>

      <div className="w-full bg-[#070707] border-t border-white/5 relative z-20">
        <div className="max-w-[100rem] mx-auto px-6 py-12 lg:px-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">

          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center size-8 overflow-hidden mr-3">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7a9e3967-e3f4-423b-b273-7c0d91c5ac32/photo_2026-01-05_16-20-34-Photoroom-1767612131816.png?width=8000&height=8000&resize=contain"
                  alt="Logo"
                  className="w-full h-full object-contain invert"
                />
              </div>
              <span className="font-bold text-white tracking-wider">VE HOSTING</span>
            </div>
            <p className="text-blue-500 font-[Onest] font-bold text-lg mt-2 tracking-wide uppercase">
              VE HOSTING LLC
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-white font-[Onest] text-sm font-semibold">
                © 2026 VE HOSTING LLC
              </p>
              <p className="text-white/30 font-[Onest] text-[12px] leading-relaxed">
                RESONANCE LLC 5830 E 2ND ST, STE 7000 #20751 CASPER, WY 82609 USA
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:scale-[0.98] transition-all duration-200 group"
            >
              <FaDiscord className="size-5 text-white/50 group-hover:text-[#5865F2] transition-colors" />
              <span className="text-white/50 font-[Onest] text-sm group-hover:text-white transition-colors">Discord сервер</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:scale-[0.98] transition-all duration-200 group"
            >
              <FaTelegramPlane className="size-5 text-white/50 group-hover:text-[#24A1DE] transition-colors" />
              <span className="text-white/50 font-[Onest] text-sm group-hover:text-white transition-colors">Telegram канал</span>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:scale-[0.98] transition-all duration-200 group"
            >
              <BookOpen className="size-4 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-white/50 font-[Onest] text-sm group-hover:text-white transition-colors">Условия использования</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:scale-[0.98] transition-all duration-200 group"
            >
              <Lock className="size-4 text-white/50 group-hover:text-white transition-colors" />
              <span className="text-white/50 font-[Onest] text-sm group-hover:text-white transition-colors">Политика конфиденциальности</span>
            </a>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .general-text {
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </footer>
  );
};

export default CTAFooter;