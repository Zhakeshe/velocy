"use client";

import React from "react";
import {
  Desktop,
  GameController,
  HardDrive,
  ShieldCheck,
  Cpu,
  ChartLineUp,
  Database,
  Tag,
  CurrencyCircleDollar,
  Wallet
} from '@phosphor-icons/react';

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ElementType;
}

const CATEGORIES: FilterOption[] = [
  { id: "virtual", label: "Виртуальные серверы", icon: Desktop },
  { id: "game", label: "Игровые серверы", icon: GameController },
  { id: "dedicated", label: "Выделенные серверы", icon: HardDrive },
  { id: "ddos", label: "DDoS защита", icon: ShieldCheck },
];

const LOCATIONS: FilterOption[] = [
  { id: "germany", label: "🇩🇪" },
  { id: "finland", label: "🇫🇮" },
  { id: "sweden", label: "🇸🇪" },
  { id: "netherlands", label: "🇳🇱" },
];

const HARDWARE: FilterOption[] = [
  { id: "amd", label: "AMD RYZEN", icon: Cpu },
  { id: "hi-load", label: "HI-LOAD", icon: ChartLineUp },
  { id: "storage", label: "STORAGE", icon: Database },
  { id: "promo", label: "PROMO", icon: Tag },
  { id: "low-cost", label: "LOW-COST", icon: CurrencyCircleDollar },
];

const CURRENCIES: FilterOption[] = [
  { id: "tenge", label: "₸ Тенге" },
  { id: "ruble", label: "₽ Рубли" },
];

interface ServicesFilterProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export default function ServicesFilter({ activeCategory, setActiveCategory }: ServicesFilterProps) {
  const [activeLocation, setActiveLocation] = React.useState("germany");
  const [activeHardware, setActiveHardware] = React.useState("amd");
  const [activeCurrency, setActiveCurrency] = React.useState("tenge");

  return (
    <section id="services" className="flex flex-col items-center px-4 lg:px-16 pt-20 pb-8 bg-black">
      <div className="mx-auto flex size-full max-w-[100rem] flex-col items-center justify-center">

        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white relative">
            Наши услуги
            <div className="absolute -inset-x-6 -inset-y-2 bg-blue-500/10 blur-xl rounded-full -z-10"></div>
          </h2>
          <p className="text-white/40 text-sm md:text-base text-center max-w-md">
            Выберите тот тариф, который подходит именно вам.
          </p>
        </div>
        <div className="flex justify-center w-full mb-8">
          <div className="flex items-center gap-1 rounded-2xl bg-[#0d0d0d] border border-white/[0.05] p-1.5 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${isActive
                    ? "bg-[#1a1a1a] text-white shadow-inner border border-white/[0.08]"
                    : "border border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
                    }`}
                >
                  {Icon && (
                    <div className={`p-1 rounded-md ${isActive ? 'bg-blue-500/10' : ''}`}>
                      <Icon weight={isActive ? "fill" : "regular"} className={`size-4 ${isActive ? 'text-blue-400' : 'text-white/30'}`} />
                    </div>
                  )}
                  <span className="font-sans text-[13px] font-bold tracking-wide">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 w-full mb-10">
          <div className="flex gap-1 rounded-2xl bg-[#0d0d0d] border border-white/[0.05] p-1.5 shadow-xl">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc.id)}
                className={`flex items-center justify-center size-10 rounded-xl transition-all duration-300 ${activeLocation === loc.id
                  ? "bg-[#1a1a1a] border border-white/[0.08] shadow-inner"
                  : "border border-transparent grayscale-[0.8] opacity-30 hover:opacity-100 hover:grayscale-0"
                  }`}
              >
                <span className="text-xl">{loc.label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-1 rounded-2xl bg-[#0d0d0d] border border-white/[0.05] p-1.5 shadow-xl">
            {HARDWARE.map((hw) => {
              const Icon = hw.icon;
              const isActive = activeHardware === hw.id;
              return (
                <button
                  key={hw.id}
                  onClick={() => setActiveHardware(hw.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${isActive
                    ? "bg-[#1a1a1a] border border-white/[0.08] text-white shadow-inner"
                    : "border border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
                    }`}
                >
                  {Icon && <Icon weight={isActive ? "bold" : "regular"} className={`size-4 ${isActive ? 'text-blue-400' : 'text-white/30'}`} />}
                  <span className="font-sans text-[11px] font-black tracking-widest uppercase">{hw.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex rounded-2xl bg-[#0d0d0d] border border-white/[0.05] p-1.5 shadow-xl">
            {CURRENCIES.map((curr) => {
              const isActive = activeCurrency === curr.id;
              return (
                <button
                  key={curr.id}
                  onClick={() => setActiveCurrency(curr.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${isActive
                    ? "bg-[#1a1a1a] border border-white/[0.08] text-white shadow-inner"
                    : "border border-transparent text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
                    }`}
                >
                  <Wallet className={`size-4 ${isActive ? 'text-blue-400' : 'text-white/30'}`} />
                  <span className="font-sans text-[11px] font-black tracking-widest uppercase">{curr.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}