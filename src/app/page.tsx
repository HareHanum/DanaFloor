import { Header, Footer } from "@/components/layout";
import { Hero, Introduction, Services, ForWhom, Testimonials, CTA } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Introduction />
        <Services />
        <ForWhom />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
