"use client";

import React, { useState } from 'react';
import Navbar from '@/components/sections/navbar';
import HeroSection from '@/components/sections/hero';
import Advantages from '@/components/sections/advantages';
import ServicesFilter from '@/components/sections/services-filter';
import PricingGrid from '@/components/sections/pricing-grid';
import CTAFooter from '@/components/sections/cta-footer';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("virtual");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <Advantages />
        <ServicesFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <PricingGrid activeCategory={activeCategory} />
      </main>
      <CTAFooter />
    </div>
  );
}