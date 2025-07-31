import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { AppProviders } from "@/context/LotissementContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "CadastreWeb",
  description: "Application de gestion des lotissements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${geistSans.variable} antialiased`}
      >
        <UserProvider>
          <AppProviders>
            {children}
          </AppProviders>
        </UserProvider>
      </body>
    </html>
  );
}
