import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדריך חינם: איפה המסעדה שלך מפסידה כסף בסרוויס?",
  description:
    "מדריך חינמי של דנה שמרוני: 7 סימנים קטנים בסרוויס שמסגירים צוות שעובד קשה מדי ולא נכון - ומה הם אומרים על התפעול, השירות והמכירות שלכם. ממלאים פרטים והמדריך נשלח למייל.",
  openGraph: {
    title: "מדריך חינם: איפה המסעדה שלך מפסידה כסף בסרוויס?",
    description:
      "7 סימנים קטנים בסרוויס שמסגירים צוות שמזיע מדי ומפסיד לכם כסף. מדריך חינמי מ-FLOOR D.a.N.A, נשלח ישירות למייל.",
  },
};

export default function FloorGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
