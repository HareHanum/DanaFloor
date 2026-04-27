import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "מדיניות ביטולים והחזרים",
  description:
    "מדיניות הביטולים וההחזרים בקורסים הדיגיטליים של FLOOR D.a.N.A.",
};

export default function RefundLayout({
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
