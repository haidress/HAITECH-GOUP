"use client";

import Image from "next/image";

const logos = [
  { label: "Logo partenaire 1", src: "/trust-1.jpg" },
  { label: "Logo partenaire 2", src: "/trust-2.jpg" },
  { label: "Logo partenaire 3", src: "/trust-3.jpg" },
  { label: "Logo partenaire 4", src: "/trust-4.jpeg" },
  { label: "Logo partenaire 5", src: "/trust-5.jpeg" },
  { label: "Logo partenaire 6", src: "/trust-6.jpeg" },
  { label: "Logo partenaire 7", src: "/trust-7.jpg" },
  { label: "Logo partenaire 8", src: "/trust-8.jpg" }
] as const;

export function TrustedLogosMarquee() {
  const repeated = [...logos, ...logos];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14">
      <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Ils nous font confiance</h2>
      <div className="mt-6 overflow-hidden">
        <div className="marquee-left-to-right flex w-max items-center gap-10 py-5 md:gap-14">
          {repeated.map((logo, index) => (
            <Image
              key={`${logo.src}-${index}`}
              src={logo.src}
              alt={logo.label}
              width={210}
              height={90}
              className="h-16 w-auto object-contain transition duration-300 md:h-20"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
