import React from "react";
import { BookOpen, Lock } from "lucide-react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";

const SiteFooter = () => {
  return (
    <footer className="w-full bg-[#070707] border-t border-white/5 relative z-20">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 py-12 lg:px-10">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1.1fr,1fr,1fr] items-start">
          <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="relative flex items-center justify-center size-9 overflow-hidden mr-3 rounded-lg bg-white/5">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/7a9e3967-e3f4-423b-b273-7c0d91c5ac32/photo_2026-01-05_16-20-34-Photoroom-1767612131816.png?width=8000&height=8000&resize=contain"
                  alt="Logo"
                  className="w-full h-full object-contain invert"
                />
              </div>
              <span className="font-bold text-white tracking-wider">VELOCY CLOUD</span>
            </div>
            <p className="text-blue-500 font-[Onest] font-bold text-lg mt-2 tracking-wide uppercase">
              VELOCY CLOUD LLC
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-white font-[Onest] text-sm font-semibold">© 2026 VELOCY CLOUD LLC</p>
              <p className="text-white/30 font-[Onest] text-[12px] leading-relaxed">
                RESONANCE LLC 5830 E 2ND ST, STE 7000 #20751 CASPER, WY 82609 USA
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href="#"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:translate-y-0.5 transition-all duration-200 group"
            >
              <FaDiscord className="size-5 text-white/70 group-hover:text-[#5865F2] transition-colors" />
              <span className="text-white/70 font-[Onest] text-sm group-hover:text-white transition-colors">Discord сервер</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:translate-y-0.5 transition-all duration-200 group"
            >
              <FaTelegramPlane className="size-5 text-white/70 group-hover:text-[#24A1DE] transition-colors" />
              <span className="text-white/70 font-[Onest] text-sm group-hover:text-white transition-colors">Telegram канал</span>
            </a>
          </div>

          <div className="flex flex-col gap-3 items-center lg:items-start">
            <a
              href="#"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:translate-y-0.5 transition-all duration-200 group"
            >
              <BookOpen className="size-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white/70 font-[Onest] text-sm group-hover:text-white transition-colors">Условия использования</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] hover:translate-y-0.5 transition-all duration-200 group"
            >
              <Lock className="size-4 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-white/70 font-[Onest] text-sm group-hover:text-white transition-colors">Политика конфиденциальности</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
