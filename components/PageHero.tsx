import Image from "next/image";

type PageHeroProps = {
  title: string;
  description: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="hero-gradient py-16 text-white">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-6 px-4">
        <div>
        <h1 className="font-heading text-3xl font-extrabold md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base text-slate-100 md:text-lg">{description}</p>
        </div>
        <Image
          src="/logo-haitech.jpg"
          alt="Logo HAITECH GROUP"
          width={72}
          height={72}
          className="hidden rounded-full border border-white/40 md:block"
        />
      </div>
    </section>
  );
}
