import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות דנה שימרוני",
  description:
    "דנה שימרוני - 15+ שנות ניסיון בניהול והדרכת צוותים במסעדות ובתי קפה. מהפלור אל הליווי - הסיפור של יועצת האירוח המובילה בישראל.",
  openGraph: {
    title: "אודות דנה שימרוני | D.A.N.A FLOOR",
    description:
      "15+ שנות ניסיון בניהול והדרכת צוותים במסעדות ובתי קפה. גדלתי בפלור, עבדתי בכל תפקיד – ואני יודעת בדיוק מה גורם למקום לעבוד טוב באמת.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
