"use client";

import React from 'react';
import {
  Cpu,
  Memory,
  HardDrives,
  WifiHigh,
  ShieldCheck,
  Monitor,
  ShoppingCart
} from '@phosphor-icons/react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  currency: string;
  country: string;
  countryFlag: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    network: string;
    ddos: string;
  };
  isPromo?: boolean;
}

const VIRTUAL_PLANS: PricingPlan[] = [
  {
    id: 'ultra-low',
    name: 'Ultra Low',
    price: '990',
    currency: '₸',
    country: 'Германия',
    countryFlag: '🇩🇪',
    specs: {
      cpu: '1 vCPU AMD Ryzen 9 5950X',
      ram: '1 GB DDR4',
      storage: '20 GB NVMe SSD',
      network: '100 Mbit/s',
      ddos: 'Мощная защита от атак L3-L4'
    }
  },
  {
    id: 'coding',
    name: 'Coding',
    price: '1 800',
    currency: '₸',
    country: 'Германия',
    countryFlag: '🇩🇪',
    specs: {
      cpu: '1 vCPU AMD Ryzen 9 5950X',
      ram: '2 GB DDR4',
      storage: '40 GB NVMe SSD',
      network: '500 Mbit/s',
      ddos: 'Мощная защита от атак L3-L4'
    }
  },
  {
    id: 'game',
    name: 'Game',
    price: '2 500',
    currency: '₸',
    country: 'Германия',
    countryFlag: '🇩🇪',
    specs: {
      cpu: '2 vCPU AMD Ryzen 9 5950X',
      ram: '3 GB DDR4',
      storage: '50 GB NVMe SSD',
      network: '500 Mbit/s',
      ddos: 'Мощная защита от атак L3-L4'
    }
  },
  {
    id: 'business',
    name: 'Business',
    price: '3 500',
    currency: '₸',
    country: 'Германия',
    countryFlag: '🇩🇪',
    specs: {
      cpu: '2 vCPU AMD Ryzen 9 5950X',
      ram: '4 GB DDR4',
      storage: '60 GB NVMe SSD',
      network: '1 Gbit/s',
      ddos: 'Мощная защита от атак L3-L4'
    }
  },
  {
    id: 'hi-load',
    name: 'Hi-load',
    price: '5 500',
    currency: '₸',
    country: 'Германия',
    countryFlag: '🇩🇪',
    specs: {
      cpu: '4 vCPU AMD Ryzen 9 5950X',
      ram: '8 GB DDR4',
      storage: '80 GB NVMe SSD',
      network: '1 Gbit/s',
      ddos: 'Мощная защита от атак L3-L4'
    }
  }
];

const SpecRow = ({ icon: Icon, label, value, highlight = false }: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex gap-4 items-start">
    <div className="mt-1">
      <Icon weight="bold" className="size-4 text-white/20 shrink-0" />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-white/30">{label}</span>
      <span className={`text-[13px] font-semibold leading-snug ${highlight ? 'text-blue-400' : 'text-white/80'}`}>{value}</span>
    </div>
  </div>
);

const PricingCard = ({ plan }: { plan: PricingPlan }) => {
  return (
    <div className="relative flex flex-col rounded-[24px] p-7 bg-[#0a0a0a] border border-white/[0.04] group transition-all duration-500 hover:border-blue-500/20 shadow-2xl overflow-hidden min-h-[520px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Monitor weight="bold" className="size-5 text-white/40" />
          <h3 className="font-sans text-white text-[18px] font-extrabold tracking-tight uppercase italic">{plan.name}</h3>
        </div>
        <span className="text-xl" title={plan.country}>{plan.countryFlag}</span>
      </div>
      <div className="flex flex-col mb-8 pt-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans text-[26px] font-black text-white">{plan.price}{plan.currency}</span>
          <span className="font-sans text-[13px] text-white/35 font-semibold">/ мес.</span>
        </div>
      </div>
      <div className="flex flex-col gap-5 mb-8">
        <SpecRow icon={Cpu} label="Процессор" value={plan.specs.cpu} />
        <SpecRow icon={Memory} label="Оперативная память" value={plan.specs.ram} />
        <SpecRow icon={HardDrives} label="Хранилище" value={plan.specs.storage} />
        <SpecRow icon={WifiHigh} label="Скорость сети" value={plan.specs.network} highlight />
        <SpecRow icon={ShieldCheck} label="Защита от DDoS" value={plan.specs.ddos} />
      </div>
      <button className="mt-auto w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#121212] border border-white/[0.05] transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 group/btn shadow-xl">
        <ShoppingCart weight="bold" className="size-4 text-white/40 group-hover/btn:text-white transition-colors" />
        <span className="font-sans text-[13px] font-black text-white/60 group-hover/btn:text-white transition-colors tracking-widest uppercase">Перейти к покупке</span>
      </button>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

interface PricingGridProps {
  activeCategory: string;
}

export default function PricingGrid({ activeCategory }: PricingGridProps) {
  if (activeCategory !== "virtual") {
    return (
      <section id="pricing" className="w-full px-4 lg:px-16 py-24 bg-black flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="size-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Monitor weight="duotone" className="size-10 text-blue-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center">Скоро в наличии</h3>
          <p className="text-white/40 text-center max-w-md">
            Мы работаем над запуском этой категории. Следите за обновлениями в нашем Telegram канале.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="w-full px-4 lg:px-16 py-8 pb-32 bg-black">
      <div className="mx-auto max-w-[100rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {VIRTUAL_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}