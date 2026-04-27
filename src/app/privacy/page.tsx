"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            <h1 className="text-4xl lg:text-5xl font-bold">מדיניות פרטיות</h1>
            <p className="text-white/70 mt-4">עודכן לאחרונה: אפריל 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose-rtl">
            <div className="space-y-8 text-[var(--text-primary)] leading-relaxed">

              <div>
                <h2 className="text-2xl font-bold mb-4">1. כללי</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  1.1 מדיניות פרטיות זו מתארת את האופן שבו דנה שמרוני – ייעוץ והדרכה בתחום האירוח וההסעדה (להלן: &quot;העסק&quot;, &quot;אנחנו&quot; או &quot;FLOOR D.a.N.A&quot;) אוספת, משתמשת, מעבירה ומגינה על מידע אישי הנמסר על ידי המשתמשים באתר floor-dana.com (להלן: &quot;האתר&quot;), לרבות במסגרת רכישת קורסים דיגיטליים והשתתפות בהם.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  1.2 מדיניות זו נכתבה בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981 ותקנותיו, לרבות תיקון מס&apos; 13 משנת 2025, וכן בהתאם לחוק הגנת הצרכן, התשמ&quot;א-1981 ולהוראות נוספות החלות על מסחר אלקטרוני בישראל.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  1.3 השימוש באתר, יצירת חשבון משתמש, רכישת קורסים ומסירת מידע אישי באמצעות האתר מהווים הסכמה לתנאי מדיניות פרטיות זו. אם אינך מסכים/ה למדיניות זו, אנא הימנע/י משימוש באתר.
                </p>
                <p className="text-[var(--text-secondary)]">
                  1.4 מדיניות זו מנוסחת בלשון זכר מטעמי נוחות בלבד, אך מתייחסת לכל המגדרים.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. המידע שאנו אוספים</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  אנו אוספים את סוגי המידע הבאים, כולם או חלקם, בהתאם לאופן השימוש שלך באתר:
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>2.1 פרטי התקשרות מטפסים</strong> – שם מלא, מספר טלפון, כתובת דואר אלקטרוני, סוג העסק, תחום עניין, והודעה חופשית, הנמסרים בטופס יצירת קשר או בטופס הורדת מדריכים.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>2.2 פרטי חשבון משתמש</strong> – לצורך רכישת קורס והשתתפות בו, אנו יוצרים חשבון משתמש הכולל: כתובת דואר אלקטרוני, סיסמה (מאוחסנת מוצפנת בלבד באמצעות אלגוריתם חד-כיווני), שם מלא ומספר טלפון. הסיסמה אינה גלויה לנו ואיננו יכולים לשחזרה.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>2.3 פרטי תשלום</strong> – פרטי כרטיס אשראי וכל מידע פיננסי אחר נמסרים ישירות לסולק התשלומים שלנו (PayPlus). אנחנו <strong>איננו</strong> אוספים, רואים או שומרים פרטי כרטיס אשראי. אצלנו נשמר רק מזהה עסקה (transaction ID), סכום, סטטוס ומועד התשלום.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>2.4 מידע על השימוש בקורסים</strong> – שיעורים שנצפו, התקדמות בקורס, תאריכי גישה, תגובות שכתבת בעמודי השיעורים.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>2.5 מידע טכני ולוג</strong> – כתובת IP, סוג דפדפן, מערכת הפעלה, רזולוציית מסך, תאריך וזמן גישה, דפים שביקרת בהם. מידע זה משמש לאבטחת מידע, מניעת ניצול לרעה, ואיתור תקלות.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>2.6 סימון ויזואלי בסרטונים (Watermark)</strong> – בעת צפייה בקורסים, כתובת הדואר האלקטרוני שלך מוצגת על גבי הסרטון. מטרת השימוש: למנוע הפצה לא חוקית של תוכן הקורס. אנו ממליצים שלא לשתף צילומי מסך או הקלטות עם צדדים שלישיים.
                </p>

                <p className="text-[var(--text-secondary)]">
                  <strong>2.7 העדפות נגישות</strong> – האתר שומר העדפות נגישות באחסון המקומי של הדפדפן (localStorage). מידע זה נשמר במכשירך בלבד ואינו נשלח אלינו.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. מטרות השימוש במידע</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  המידע האישי שנאסף ישמש אותנו למטרות הבאות בלבד:
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.1 מתן השירות</strong> – יצירת חשבון, אימות זהות, מתן גישה לקורסים שרכשת, מעקב אחר התקדמותך, אספקת תכנים מקצועיים שביקשת.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.2 ביצוע עסקאות</strong> – עיבוד תשלומים, הנפקת חשבוניות, ניהול ביטולים והחזרים, התכתבות הקשורה לרכישתך.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.3 יצירת קשר ומענה לפניות</strong> – טיפול בבקשות, שאלות או הודעות שנשלחו אלינו.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.4 שיווק ודיוור</strong> – שליחת עדכונים, מידע מקצועי והצעות בנוגע לשירותי העסק, בכפוף להסכמתך המפורשת ובהתאם להוראות סעיף 30א לחוק התקשורת (בזק ושידורים), התשמ&quot;ב-1982. ניתן להסיר את עצמך מרשימת הדיוור בכל עת.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>3.5 אבטחת מידע ומניעת הונאה</strong> – ניטור פעילות חשודה, אכיפת הגבלת תדירות (rate limiting), אימות זהות, חקירת הפרות של תנאי השימוש.
                </p>
                <p className="text-[var(--text-secondary)]">
                  <strong>3.6 שיפור השירות</strong> – ניתוח מצרפי (אגרגטיבי) של דפוסי שימוש, ללא זיהוי משתמש ספציפי, לצורך שיפור הקורסים והאתר.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. ספקי שירות וצדדים שלישיים</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  לצורך הפעלת האתר ומתן השירותים, אנו עושים שימוש בספקי שירות חיצוניים. כל ספק כפוף לתנאי שימוש המגבילים את השימוש במידע למתן השירות בלבד:
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.1 Supabase</strong> – אחסון בסיס הנתונים, ניהול חשבונות משתמשים ואחסון קבצים. הנתונים מאוחסנים בשרתים בענן AWS, באזור גאוגרפי שייתכן שאינו ישראל.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.2 PayPlus</strong> – סליקת תשלומים. PayPlus הינה חברה ישראלית מורשית בעלת תקני אבטחה PCI-DSS. פרטי תשלום מועברים ישירות אליה ואינם נשמרים אצלנו.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.3 Mux</strong> – אחסון, קידוד וזרימה של סרטוני וידאו של הקורסים. Mux רשאית לאסוף נתוני שימוש (כגון משך צפייה, איכות וידאו) למטרות שיפור השירות.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.4 Resend</strong> – שליחת דואר אלקטרוני (אימותי חשבון, אישורי רכישה, דיוור).
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.5 Vercel</strong> – אחסון ואירוח האתר. Vercel רשאית לשמור לוגים טכניים לצורך תפעול ואבטחה.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.6 Upstash (במידת הצורך)</strong> – שירות הגבלת תדירות בקשות לטובת אבטחת מידע.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.7 העברת מידע אל מחוץ לישראל</strong> – חלק מהספקים האמורים פועלים בשרתים שמחוץ לישראל. ההעברה נעשית בהתאם להוראות תקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה), התשס&quot;א-2001, ולמדינות שיש להן הסדרי הגנת פרטיות מקבילים, או באמצעות התחייבויות חוזיות מתאימות מול הספקים.
                </p>

                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>4.8 חובה חוקית</strong> – אנו עשויים לחשוף מידע אישי אם נידרש לכך על פי חוק, צו בית משפט או דרישת רשות מוסמכת.
                </p>

                <p className="text-[var(--text-secondary)]">
                  <strong>4.9 הגנה על זכויות</strong> – אם הדבר נדרש להגנה על זכויותינו, רכושנו או בטיחותנו או של צדדים שלישיים, לרבות במקרה של חשד להפרת זכויות יוצרים בתכני הקורסים.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. עוגיות (Cookies) וטכנולוגיות דומות</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  5.1 לצורך תפעול תקין של מערכת ההזדהות (login) באתר, אנו עושים שימוש בעוגיות חיוניות (essential cookies). עוגיות אלו נדרשות לזכור את מצב ההתחברות שלך ולמנוע התחברות חוזרת בכל דף.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  5.2 איננו עושים שימוש בעוגיות פרסומיות, עוגיות מעקב צד שלישי או כלי ניתוח אנליטי כדוגמת Google Analytics או Facebook Pixel.
                </p>
                <p className="text-[var(--text-secondary)]">
                  5.3 ניתן לחסום עוגיות באמצעות הגדרות הדפדפן, אך הדבר עשוי לפגוע בתפקוד מערכת ההזדהות והגישה לקורסים.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. אבטחת מידע</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  6.1 אנו נוקטים באמצעי אבטחה סבירים ומקובלים בתעשייה כדי להגן על המידע האישי, לרבות: הצפנת תעבורה (HTTPS/TLS), הצפנת סיסמאות באמצעות אלגוריתם חד-כיווני, בקרת גישה מבוססת תפקידים (RLS), חתימת קבצי וידאו באמצעות אסימוני גישה זמניים, רישום וניטור פעילות.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  6.2 על אף האמור, אין באפשרותנו להבטיח הגנה מוחלטת על המידע. מסירת מידע באמצעות האינטרנט כרוכה בסיכונים מטבעה.
                </p>
                <p className="text-[var(--text-secondary)]">
                  6.3 בהתאם לתיקון 13 לחוק הגנת הפרטיות, במקרה של אירוע אבטחת מידע מהותי הנוגע למידע אישי שלך, נודיע לך על כך בהקדם האפשרי ובהתאם להוראות הדין.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. שמירת המידע</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  7.1 פרטי חשבון ומידע על רכישות יישמרו כל עוד החשבון פעיל ולמשך שבע (7) שנים נוספות לאחר ביטולו או מחיקתו, וזאת לצורך עמידה בחובות חשבונאיות, מס ודיווח לרשויות (לרבות בהתאם לחוק מס ערך מוסף ולחוק הגנת הצרכן).
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  7.2 פרטי טופס יצירת קשר וטופס הורדת מדריך יישמרו לתקופה של עד שלוש (3) שנים, אלא אם ביקשת מחיקה מוקדמת.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  7.3 לוגים טכניים ופרטי IP יישמרו לתקופה של עד שנים-עשר (12) חודשים.
                </p>
                <p className="text-[var(--text-secondary)]">
                  7.4 לאחר תום תקופות השמירה, המידע יימחק או יומר לפורמט שלא ניתן לזהות באמצעותו את המשתמש.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. זכויותיך</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981 ולתיקון 13 משנת 2025, עומדות לך הזכויות הבאות:
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>8.1 זכות עיון</strong> – לקבל מידע אם מוחזק עליך מידע ומה תוכנו.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>8.2 זכות תיקון ועדכון</strong> – לבקש לתקן מידע שגוי, לא מעודכן או חסר.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>8.3 זכות מחיקה</strong> – לבקש מחיקת מידע, בכפוף לחובות שמירה כאמור בסעיף 7.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>8.4 זכות הסרה מדיוור</strong> – להסיר את עצמך מרשימת הדיוור בכל עת, באמצעות הקישור בתחתית כל הודעת דואר אלקטרוני, או באמצעות פנייה ישירה.
                </p>
                <p className="text-[var(--text-secondary)] mb-3">
                  <strong>8.5 זכות התנגדות</strong> – להתנגד לעיבוד מידע למטרות שיווק ישיר.
                </p>
                <p className="text-[var(--text-secondary)]">
                  למימוש זכויותיך, ניתן לפנות אלינו בכתובת dana@floor-dana.com. נשיב לבקשתך תוך שלושים (30) יום, בהתאם לדין.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. קטינים</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  9.1 השימוש באתר ורכישת קורסים מותרים למשתמשים שגילם 18 ומעלה בלבד. משתמשים בני 14–18 יוכלו ליצור חשבון ולרכוש קורסים אך ורק בהסכמה ובאישור של הורה או אפוטרופוס חוקי.
                </p>
                <p className="text-[var(--text-secondary)]">
                  9.2 אם נודע לנו כי נאסף מידע אישי על קטין מתחת לגיל 14 ללא הסכמה כאמור, נמחק את המידע מיידית.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. שינויים במדיניות</h2>
                <p className="text-[var(--text-secondary)]">
                  אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר עם תאריך עדכון ויישלחו לרשומים בדואר אלקטרוני, לפחות שבעה (7) ימים לפני כניסתם לתוקף. המשך השימוש באתר לאחר עדכון המדיניות מהווה הסכמה לגרסה המעודכנת.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. יצירת קשר</h2>
                <p className="text-[var(--text-secondary)] mb-3">
                  לכל שאלה, בירור או בקשה בנוגע למדיניות הפרטיות, ניתן לפנות אלינו:
                </p>
                <p className="text-[var(--text-secondary)]">
                  דנה שמרוני – FLOOR D.a.N.A<br />
                  דואר אלקטרוני: dana@floor-dana.com<br />
                  טלפון: 052-658-9291
                </p>
                <p className="text-[var(--text-secondary)] mt-3">
                  במידה ואינך מרוצה מהטיפול בפנייתך, באפשרותך לפנות לרשם מאגרי המידע ברשות להגנת הפרטיות, משרד המשפטים.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
