import type { Metadata } from "next";
import {
  Anton,
  Oswald,
  Playfair_Display,
  Source_Serif_4,
  Special_Elite,
} from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const elite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-elite", display: "swap" });

export const metadata: Metadata = {
  title: "Barões do Asfalto",
  description:
    "RPG de mesa sobre o jogo do bicho e o crime organizado no Rio de Janeiro — apresentação, livro digital e painel de gameplay.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${oswald.variable} ${playfair.variable} ${serif.variable} ${elite.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
