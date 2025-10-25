import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Logos from "@/components/home/Logos";
import HowItWorks from "@/components/home/HowItWorks";
import FAQ from "@/components/home/FAQ";
import Industries from "@/components/home/Industries";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Logos />
      <Services />
      <HowItWorks />
      <FAQ />
      <Industries />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
