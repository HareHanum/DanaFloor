import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "צור קשר",
  description:
    "צרו קשר עם דנה שימרוני לייעוץ והדרכות אירוח. תיאום שיחת היכרות חינם לבעלי מסעדות, בתי קפה ומלונות. תגובה תוך 24 שעות.",
  openGraph: {
    title: "צור קשר | FLOOR D.a.N.A",
    description:
      "צרו קשר לייעוץ והדרכות אירוח. תיאום שיחת היכרות חינם לבעלי מסעדות, בתי קפה ומלונות.",
  },
};

export default function ContactLayout({
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
