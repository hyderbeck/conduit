import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Roboto } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Conduit",
  description: "RealWorld Example App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} bg-stone-50 text-stone-950 flex flex-col min-h-screen`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
