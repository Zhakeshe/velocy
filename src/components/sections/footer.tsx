import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-white/[0.05] py-16 px-4 lg:px-16 mt-24">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8">

          {}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-2">
              <Image 
                src="https://play2go.cloud/logo/light.svg" 
                alt="PLAY2GO Logo" 
                width={48} 
                height={48} 
                className="w-12 h-auto"
              />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[#FF65A6] font-[Neue-Bold] text-lg font-bold tracking-tight">
                PLAY2GO LLC
              </h3>
              <p className="text-white font-[Onest] text-sm font-medium mt-1">
                © 2026 PLAY2GO LLC
              </p>
              <p className="text-white/50 font-[Onest] text-[13px] leading-relaxed uppercase tracking-wider mt-2">
                PLAY2GO LLC 5830 E 2ND ST, STE 7000 #20751 CASPER, WY 82609 USA
              </p>
            </div>
          </div>

          {}
          <div className="flex flex-wrap gap-4 items-center justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <a 
              href="https://discord.gg/play2go" 
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <svg 
                className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              <span className="text-white/50 group-hover:text-white font-[Onest] text-[15px] font-medium transition-colors">Discord server</span>
            </a>
            <a 
              href="https://t.me/play2go" 
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <svg 
                className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              <span className="text-white/50 group-hover:text-white font-[Onest] text-[15px] font-medium transition-colors">Telegram channel</span>
            </a>
          </div>

          {}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <a 
              href="/legal/tos" 
              className="flex items-center justify-between gap-4 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                </svg>
                <span className="text-white/50 group-hover:text-white font-[Onest] text-sm font-medium transition-colors">Terms of Service</span>
              </div>
            </a>
            <a 
              href="/legal/privacy" 
              className="flex items-center justify-between gap-4 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
                </svg>
                <span className="text-white/50 group-hover:text-white font-[Onest] text-sm font-medium transition-colors">Privacy Policy</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;