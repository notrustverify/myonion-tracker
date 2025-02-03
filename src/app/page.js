"use client"

import { Hero } from "../components";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Footer/>
    </div>
  );
}