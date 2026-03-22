import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "הסרה מרשימת הדיוור",
  description: "הסרה מרשימת הדיוור של FLOOR D.a.N.A",
  robots: { index: false, follow: false },
};

export default function UnsubscribeLayout({
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
