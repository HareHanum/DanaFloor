import { Header, Footer } from "@/components/layout";
import { Hero, Introduction, Services, CTA } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Introduction />
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
