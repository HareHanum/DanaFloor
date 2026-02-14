import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "תקנון אתר",
  description:
    "תנאי השימוש באתר FLOOR D.a.N.A – תקנון האתר, זכויות קניין רוחני, הגבלת אחריות ותנאים כלליים.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
