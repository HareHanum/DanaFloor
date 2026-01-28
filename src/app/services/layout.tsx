import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "שירותים",
  description:
    "שירותי ייעוץ והדרכה לעסקי אירוח - ייעוץ למסעדות, הדרכות לצוותים, ליווי הקמה ושיפור תוצאות. פתרונות מותאמים אישית לכל עסק.",
  openGraph: {
    title: "שירותים | FLOOR D.a.N.A",
    description:
      "ייעוץ והדרכה לעסקי אירוח - מסעדות, בתי קפה, מלונות וברים. פתרונות מותאמים אישית להצלחת העסק שלך.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
