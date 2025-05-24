import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import Hero from "@/components/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="z-10 fixed top-0 left-0 right-0 ">
        <Header />
      </div>
      <Hero />
      <FeatureSection />
      <Footer />
    </div>
  );
};

export default page;
