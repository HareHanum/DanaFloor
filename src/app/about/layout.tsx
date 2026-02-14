import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "אודות דנה שמרוני",
  description:
    "דנה שמרוני - 15+ שנות ניסיון בניהול והדרכת צוותים במסעדות ובתי קפה. מהפלור אל הליווי - הסיפור של יועצת האירוח המובילה בישראל.",
  openGraph: {
    title: "אודות דנה שמרוני | FLOOR D.a.N.A",
    description:
      "15+ שנות ניסיון בניהול והדרכת צוותים במסעדות ובתי קפה. גדלתי בפלור, עבדתי בכל תפקיד – ואני יודעת בדיוק מה גורם למקום לעבוד טוב באמת.",
  },
};

export default function AboutLayout({
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
