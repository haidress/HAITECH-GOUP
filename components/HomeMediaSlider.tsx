"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/slide-transformation.png", alt: "Transformation digitale HAITECH", title: "Transformation digitale" },
  { src: "/slide-sites.png", alt: "Création de sites internet", title: "Création de sites internet" },
  { src: "/slide-support.png", alt: "Support et maintenance IT", title: "Support et maintenance IT" },
  { src: "/slide-visuel.png", alt: "Création de visuels professionnels", title: "Visuels professionnels" },
  { src: "/slide-business.png", alt: "Solutions business", title: "Solutions business concrètes" }
];

export function HomeMediaSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setIndex((current) => (current + 1) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl shadow-black/25 backdrop-blur">
      <div className="relative h-[320px] w-full overflow-hidden rounded-xl md:h-[430px]">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            className={`object-cover transition-all duration-700 ${i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <div className="absolute bottom-6 left-6 max-w-xs text-white">
          <p className="text-xs uppercase tracking-widest text-white/80">HAITECH GROUP</p>
          <p className="mt-2 font-heading text-xl font-bold">{slides[index].title}</p>
        </div>
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 px-3 py-2 text-white transition hover:bg-black/50"
          aria-label="Slide précédent"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 px-3 py-2 text-white transition hover:bg-black/50"
          aria-label="Slide suivant"
        >
          ›
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-haitechGold" : "bg-white/60"}`}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
