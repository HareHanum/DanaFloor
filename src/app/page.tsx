import { Header, Footer } from "@/components/layout";
import { Hero, Introduction, Services, ForWhom, Testimonials, FAQ, CTA } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Introduction />
        <Services />
        <ForWhom />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
