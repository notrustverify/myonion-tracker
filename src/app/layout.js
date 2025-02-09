import { Inter } from "next/font/google";
import "./globals.css";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import ToastContainer from "../components/ToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AlpacaFi Home",
  description: "A lending platform for Alephium.",
};

export default function RootLayout({ children }) {
  return (
    <AlephiumWalletProvider network={"mainnet"}>
    <html lang="en">
        <body className={inter.className}>{children}</body>
        <ToastContainer />
    </html>
    </AlephiumWalletProvider>
  );
}