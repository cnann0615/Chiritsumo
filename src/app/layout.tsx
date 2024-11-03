import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Chiritsumo",
  description: "無駄な消費を我慢して欲しい物を手に入れよう！",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.ico",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-icon.ico",
    },
  },
  appleWebApp: true,
};
<meta name="apple-mobile-web-app-capable" content="yes"></meta>;

interface LayoutProps {
  children: React.ReactNode;
  types: string;
}

export default function RootLayout({ children, types }: LayoutProps) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Header />
        <div className="mt-[64px] px-[5%]">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
