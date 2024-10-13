import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { NextUIProvider } from "@nextui-org/react";
import NavbarComponent from "./Components/Layout/NavbarComponent";
import Footer from "./Components/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Anonyl",
  description: "Message Anonymously",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <NextTopLoader />
          <NavbarComponent />
          {children}
          <Footer />
          <ToastContainer bodyClassName={"Inter"} position="top-center" />
        </NextUIProvider>
      </body>
    </html>
  );
}
