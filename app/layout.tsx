import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import { AuthUserProvider } from "@/components/AuthUserProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";

export const metadata = defaultSiteMetadata;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-montserrat"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className={poppins.className}>
        <a
          href="#contenu-principal"
          className="sr-only z-[60] rounded-md bg-haitechBlue px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu principal
        </a>
        <AuthUserProvider>
          <Header />
          <main id="contenu-principal" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </AuthUserProvider>
      </body>
    </html>
  );
}
