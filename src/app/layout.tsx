import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

const siteUrl = "https://danafloor.co.il";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d4a574",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FLOOR D.a.N.A | ייעוץ והדרכות אירוח למסעדות",
    template: "%s | FLOOR D.a.N.A",
  },
  description:
    "ייעוץ והדרכות שירות ומכירות למצוינות באירוח והגדלת הכנסות במסעדות, בתי קפה, ברים ומלונות. דנה שימרוני - מהשטח לתוצאות. 15+ שנות ניסיון, 50+ עסקים.",
  keywords: [
    "ייעוץ למסעדות",
    "הדרכות שירות",
    "הדרכות מכירה",
    "אירוח",
    "מסעדות",
    "בתי קפה",
    "מלונות",
    "ברים",
    "דנה שימרוני",
    "ייעוץ עסקי למסעדות",
    "הדרכת צוותים",
    "שיפור שירות",
    "הגדלת מכירות במסעדות",
  ],
  authors: [{ name: "דנה שימרוני", url: siteUrl }],
  creator: "FLOOR D.a.N.A",
  publisher: "FLOOR D.a.N.A",
  formatDetection: {
    email: false,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: "FLOOR D.a.N.A",
    title: "FLOOR D.a.N.A | ייעוץ והדרכות אירוח למסעדות",
    description:
      "ייעוץ והדרכות שירות ומכירות למצוינות באירוח והגדלת הכנסות במסעדות, בתי קפה, ברים ומלונות. דנה שימרוני - מהשטח לתוצאות.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FLOOR D.a.N.A | ייעוץ והדרכות אירוח למסעדות",
    description:
      "ייעוץ והדרכות שירות ומכירות למצוינות באירוח והגדלת הכנסות במסעדות, בתי קפה, ברים ומלונות.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
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
