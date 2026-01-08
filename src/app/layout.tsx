import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "D.A.N.A FLOOR | ייעוץ והדרכות אירוח למסעדות",
  description:
    "ייעוץ והדרכות שירות ומכירות למצוינות באירוח והגדלת הכנסות במסעדות, בתי קפה, ברים ומלונות. דנה שימרוני - מהשטח לתוצאות.",
  keywords: [
    "ייעוץ למסעדות",
    "הדרכות שירות",
    "הדרכות מכירה",
    "אירוח",
    "מסעדות",
    "בתי קפה",
    "דנה שימרוני",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
