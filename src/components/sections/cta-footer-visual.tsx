import React from 'react';
import Image from 'next/image';

const JoinUsCTA = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black pt-24 lg:pt-32">
      {}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center top, rgba(182, 0, 76, 0.15), transparent 70%)'
        }}
      />

      <div className="container relative z-10 px-4 lg:px-16 mx-auto">
        <div className="flex flex-col items-center text-center">
          {}
          <h2 className="font-bold tracking-tight text-white text-4xl lg:text-5xl mb-6 font-sans">
            Join us now!
          </h2>

          {}
          <p className="max-w-2xl text-lg lg:text-xl font-normal text-white/50 font-sans mb-16">
            Our support will always help you in solving any issues with your services.
          </p>
        </div>
      </div>

      {}
      <div className="relative w-full flex justify-center mt-[-40px] lg:mt-[-80px]">
        {}
        <div className="relative w-full max-w-[1400px]">
          <Image
            src="https://play2go.cloud/land/general.png"
            alt="Join us now visual"
            width={1400}
            height={800}
            className="w-full h-auto object-contain select-none"
            priority
          />

          {}
          <div 
            className="absolute bottom-0 left-0 w-full h-[30%] z-20"
            style={{
              background: 'linear-gradient(to bottom, transparent, #000000)'
            }}
          />
        </div>
      </div>

      {}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(255, 101, 166, 0.2), transparent 70%)',
          zIndex: 1
        }}
      />

      <style jsx global>{`

        .font-sans {
          font-family: "Onest", ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>
    </section>
  );
};

export default JoinUsCTA;