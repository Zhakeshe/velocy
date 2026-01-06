"use client";

import React from 'react';
import {
  ShieldCheck,
  Rocket,
  ClockCounterClockwise,
  Cpu,
  Layout,
  Headset,
  ArrowRight
} from '@phosphor-icons/react';

const Advantages = () => {
  const advantageCards = [
    {
      title: "Защита от DDoS",
      description: "Мы обеспечиваем надежную защиту на уровнях L3-L7, способную отражать атаки мощностью до 17 Тбит/с.",
      icon: ShieldCheck,
      colSpan: "lg:col-span-3 xl:col-span-4",
      hasBackground: false
    },
    {
      title: "Производительность",
      description: "Мы используем только качественное и современное оборудование, обеспечивающее высокую скорость сети.",
      icon: Rocket,
      colSpan: "lg:col-span-3 xl:col-span-3",
      hasBackground: true
    },
    {
      title: "Работа 24/7",
      description: "Мы гарантируем круглосуточную работу вашего сервера.",
      icon: ClockCounterClockwise,
      colSpan: "lg:col-span-3 xl:col-span-2",
      hasBackground: false
    },
    {
      title: "Гибкие тарифы",
      description: "Мы предлагаем разнообразные тарифные планы, подходящие как для небольших серверов, так и для крупных проектов.",
      icon: Cpu,
      colSpan: "lg:col-span-3 xl:col-span-4",
      hasBackground: true
    },
    {
      title: "Удобная панель",
      description: "Мы предоставляем удобную панель управления для быстрого администрирования всех ваших серверов.",
      icon: Layout,
      colSpan: "lg:col-span-3 xl:col-span-3",
      hasBackground: false
    },
    {
      title: "Поддержка",
      description: "Наша техническая поддержка доступна всем клиентам по любым вопросам.",
      icon: Headset,
      colSpan: "lg:col-span-3 xl:col-span-2",
      hasBackground: true
    }
  ];

  return (
    <section id="why-us" className="w-full px-4 lg:px-16 py-10 bg-black">
      <div className="mx-auto flex size-full max-w-[100rem] flex-col justify-center">
        <div className="grid gap-4 lg:grid-cols-6 xl:grid-cols-9">
          {advantageCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`${card.colSpan} rounded-[12px] flex flex-col gap-4 justify-between p-8 outline outline-1 outline-offset-[-1px] outline-white/5 transition-all duration-300 ${card.hasBackground
                  ? 'bg-gradient-to-br from-white/[0.02] to-transparent'
                  : 'bg-transparent'
                  } hover:outline-blue-500/30 group`}
                style={card.hasBackground ? { backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(59, 130, 246, 0.05) 100%)' } : {}}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex gap-6 items-center">
                    <Icon weight="duotone" className="size-7 lg:size-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <h3 className="font-bold text-white text-xl lg:text-[28px] leading-tight group-hover:text-blue-100 transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="font-normal text-white/50 text-base lg:text-lg leading-relaxed max-w-lg">
                    {card.description}
                  </p>
                </div>

                <div className="flex justify-start">
                  <button className="flex items-center pt-4 gap-3 transition-all duration-200 hover:scale-[0.97] hover:opacity-90">
                    <ArrowRight weight="bold" className="size-4 text-white/60 group-hover:text-blue-400" />
                    <span className="text-white/60 group-hover:text-white text-base">узнать больше</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Advantages;