"use client";

import { motion } from "framer-motion";

export default function RefundPage() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="bg-[var(--foreground)] text-white pt-32 lg:pt-40 pb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold">
              מדיניות ביטולים והחזרים
            </h1>
            <p className="text-white/70 mt-4">עודכן לאחרונה: אפריל 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose-rtl">
            <div className="space-y-8 text-[var(--text-primary)] leading-relaxed">

              <div className="bg-[var(--accent)]/10 border-r-4 border-[var(--accent)] p-5 rounded-lg">
                <p className="text-[var(--text-primary)] font-semibold mb-2">
                  שים לב: כל הרכישות באתר הינן סופיות.
                </p>
                <p className="text-[var(--text-secondary)] text-sm">
                  לפני השלמת הרכישה אנו מזמינים אותך לקרוא בעיון את תיאור הקורס, לצפות בשיעור הצפייה המקדימה (ככל שקיים), ולוודא שהקורס מתאים לך. השלמת הרכישה מהווה הסכמה למדיניות זו.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">1. כללי</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  1.1 מדיניות זו מסדירה את התנאים לביטול עסקאות והחזרים בגין רכישת קורסים דיגיטליים באתר floor-dana.com (להלן: &quot;האתר&quot;), המופעל על ידי דנה שמרוני – FLOOR D.a.N.A (להלן: &quot;העסק&quot;).
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  1.2 מדיניות זו מהווה חלק בלתי נפרד מ<a href="/terms" className="text-[var(--accent)] hover:underline">תקנון האתר</a>.
                </p>
                <p className="text-[var(--text-secondary)]">
                  1.3 מדיניות זו מנוסחת בלשון זכר מטעמי נוחות בלבד, אך מתייחסת לכל המגדרים.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">
                  2. אופי המוצר וזכות הביטול על פי דין
                </h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  2.1 הקורסים הדיגיטליים הנמכרים באתר הם &quot;מוצר מידע&quot;, כהגדרתו בחוק המחשבים, התשנ&quot;ה-1995 – קרי, מידע ותוכן בפורמט אלקטרוני המועבר לצרכן באמצעות האינטרנט.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  2.2 בהתאם לסעיף 14ג(ד)(2) לחוק הגנת הצרכן, התשמ&quot;א-1981, <strong>זכות הביטול במכר מרחוק אינה חלה על מוצרי מידע</strong>. משמעות הדבר היא שאין למשתמש זכות חוקית מובנית לביטול עסקה והשבת התמורה לאחר רכישת קורס דיגיטלי.
                </p>
                <p className="text-[var(--text-secondary)]">
                  2.3 לפיכך, ובכפוף לחריגים המפורטים בסעיף 3 להלן, <strong>כל הרכישות סופיות ולא ניתן לבטלן או לקבל החזר</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. חריגים – מקרים בהם יינתן החזר</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  על אף האמור בסעיף 2, נחזיר לך את הסכום ששולם במקרים הבאים בלבד:
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.1 חיוב כפול בטעות</strong> – אם בוצע על אותה רכישה חיוב כפול בשל תקלה טכנית או שיבוש בסליקה, ההפרש יוחזר במלואו לאחר אימות.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.2 חיוב בלתי מורשה</strong> – אם בוצע חיוב באמצעות כרטיס האשראי שלך ללא הסכמתך, יש לפנות אלינו בהקדם האפשרי. נבחן את הפנייה ונפעל בהתאם לחוקי הגנת הצרכן ולכללי חברות האשראי.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.3 אי-יכולת לאספק את הקורס</strong> – אם בשל תקלה טכנית מתמשכת מצידנו לא הצלחנו לתת לך גישה לקורס, ובמסגרת מאמצים סבירים לא הצלחנו לפתור את הבעיה תוך זמן סביר, יוחזר לך הסכום ששילמת בגין הקורס שלא ניתן לגשת אליו.
                </p>
                <p className="text-[var(--text-secondary)]">
                  <strong>3.4 הצגה מטעה משמעותית</strong> – אם תוכן הקורס שונה באופן מהותי וברור מהתיאור הפומבי שעל פיו רכשת אותו, נשקול בקשת החזר לגופה. בקשה כזו תוגש בכתב, תכלול פירוט של הפער בין התיאור לקורס בפועל, ותתקבל בכפוף לבדיקה.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. מקרים בהם לא יינתן החזר</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  למען הסר ספק, החזר <strong>לא יינתן</strong> במקרים הבאים, ולא רק בהם:
                </p>
                <ul className="text-[var(--text-secondary)] list-none space-y-2 pr-4">
                  <li>(א) שינוי דעת או חוסר עניין בקורס לאחר הרכישה;</li>
                  <li>(ב) חוסר זמן פנוי ללמוד את הקורס;</li>
                  <li>(ג) ציפייה שונה מהתוכן, כאשר התיאור הפומבי תאם את הקורס בפועל;</li>
                  <li>(ד) קושי טכני אצל המשתמש (מהירות אינטרנט, מכשיר לא תואם, חסימת קוקיז וכד&apos;) – על המשתמש לוודא תאימות לפני הרכישה;</li>
                  <li>(ה) צפייה חלקית או מלאה בתכני הקורס;</li>
                  <li>(ו) הסרת זמינות הקורס מהאתר לאחר תקופת הגישה המינימלית של 12 חודש כאמור בתקנון;</li>
                  <li>(ז) השעיה או סגירת חשבון בשל הפרת תקנון האתר.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. אופן הגשת בקשה לבדיקת החזר</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  5.1 בקשה לבדיקת החזר במקרים המנויים בסעיף 3 תוגש בכתב באמצעות דואר אלקטרוני לכתובת <a href="mailto:dana@floor-dana.com" className="text-[var(--accent)] hover:underline">dana@floor-dana.com</a>, ותכלול:
                </p>
                <ul className="text-[var(--text-secondary)] list-none space-y-2 pr-4">
                  <li>(א) שם מלא ופרטי חשבון המשתמש;</li>
                  <li>(ב) שם הקורס שנרכש ומועד הרכישה;</li>
                  <li>(ג) מזהה העסקה (transaction ID), ככל שזמין;</li>
                  <li>(ד) פירוט מלא של הסיבה לבקשה ותיעוד תומך (לדוגמה: צילומי מסך של תקלה טכנית).</li>
                </ul>
                <p className="text-[var(--text-secondary)] mt-3">
                  5.2 נשיב לפנייתך תוך עד ארבעה-עשר (14) ימי עסקים. אם הפנייה תאושר, ההחזר יבוצע לאמצעי התשלום המקורי תוך עד ארבעה-עשר (14) ימי עסקים נוספים, בכפוף ללוחות הזמנים של חברת הסליקה וחברת האשראי.
                </p>
                <p className="text-[var(--text-secondary)]">
                  5.3 בכל מקרה של החזר מאושר, רישיון השימוש בקורס מתבטל מיידית והגישה אליו תיחסם.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. שיעור הביטול</h2>
                <p className="text-[var(--text-secondary)]">
                  במקרים בהם החזר מאושר על פי סעיף 3, ובכפוף להוראות תקנות הגנת הצרכן (ביטול עסקה), התשע&quot;א-2010, רשאי העסק לנכות מהסכום המוחזר דמי ביטול בשיעור של עד 5% ממחיר הקורס או 100 ש&quot;ח – הנמוך מביניהם, אלא אם הביטול נובע מפגם או אי-יכולת מצד העסק לאספק את השירות, ובמקרה זה לא יינכו דמי ביטול.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. ויתור על שיתוף תוכן לאחר החזר</h2>
                <p className="text-[var(--text-secondary)]">
                  משתמש שקיבל החזר מתחייב להפסיק לאלתר כל שימוש בתכני הקורס, ולמחוק כל עותק שירד או שנשמר במכשירו, ככל שקיים. הפרת התחייבות זו תהווה הפרה של תקנון האתר ושל זכויות יוצרים.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. שינויים במדיניות</h2>
                <p className="text-[var(--text-secondary)]">
                  העסק שומר לעצמו את הזכות לעדכן מדיניות זו מעת לעת. עדכונים יחולו על רכישות שיבוצעו לאחר מועד פרסום העדכון. רכישות שבוצעו לפני העדכון יוסיפו להיות כפופות למדיניות שהיתה בתוקף במועד הרכישה.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. יצירת קשר</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  לכל שאלה בנוגע למדיניות הביטולים או להגשת בקשה, ניתן לפנות אלינו:
                </p>
                <p className="text-[var(--text-secondary)]">
                  דנה שמרוני – FLOOR D.a.N.A<br />
                  דואר אלקטרוני: <a href="mailto:dana@floor-dana.com" className="text-[var(--accent)] hover:underline">dana@floor-dana.com</a><br />
                  טלפון: 052-658-9291
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
