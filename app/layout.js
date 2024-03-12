" use client";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "./Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import MnavBar from "@/components/MnavBar";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DayEcho",
  description: "DayEcho developed by savin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
     
        <AuthProvider>
          <MnavBar/>
          <NavBar/>
        
          {children}
          
          </AuthProvider>
      </body>
    </html>
  );
}
