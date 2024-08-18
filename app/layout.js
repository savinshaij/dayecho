
import NavBar from "@/components/NavBar";
import { AuthProvider } from "./Providers";
import "./globals.css";
import { Roboto } from "next/font/google";
import MnavBar from "@/components/MnavBar";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "DayEcho",
  description: "DayEcho developed by savin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          <MnavBar />
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

