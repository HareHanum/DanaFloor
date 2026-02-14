"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
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
                תקנון אתר
              </h1>
              <p className="text-white/70 mt-4">עודכן לאחרונה: פברואר 2026</p>
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
                    1.1 ברוכים הבאים לאתר floor-dana.com (להלן: &quot;האתר&quot;), המופעל על ידי דנה שמרוני – ייעוץ והדרכה בתחום האירוח וההסעדה, המוכר גם בשם המותג FLOOR D.a.N.A (להלן: &quot;העסק&quot; או &quot;אנחנו&quot;).
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    1.2 תקנון זה מהווה הסכם מחייב בינך, המשתמש/ת באתר (להלן: &quot;המשתמש&quot;), לבין העסק. עצם הגלישה באתר ו/או השימוש בשירותים המוצעים בו מהווים הסכמה מלאה לתנאי תקנון זה. אם אינך מסכים/ה לתנאים אלה, אנא הפסק/י את השימוש באתר.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    1.3 תקנון זה מנוסח בלשון זכר מטעמי נוחות בלבד, אך מתייחס לכל המגדרים.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    1.4 העסק רשאי לשנות את תנאי התקנון מעת לעת, לפי שיקול דעתו הבלעדי וללא הודעה מוקדמת. הנוסח המחייב הוא הנוסח המפורסם באתר בכל עת.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. תיאור האתר והשירותים</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    2.1 האתר משמש כפלטפורמה להצגת שירותי ייעוץ, הדרכה וליווי מקצועי בתחום האירוח וההסעדה, הניתנים על ידי דנה שמרוני.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    2.2 האתר מציע מידע אודות השירותים, תכנים מקצועיים, וכן אפשרות ליצירת קשר ולקבלת חומרים מקצועיים באמצעות טפסים מקוונים.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    2.3 למען הסר ספק, התכנים המוצגים באתר הם בגדר מידע כללי בלבד ואינם מהווים ייעוץ מקצועי פרטני. קבלת שירותי ייעוץ או הדרכה מותנית בהתקשרות ישירה עם העסק ובהסכמה על תנאי ההתקשרות.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. קניין רוחני</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    3.1 כל הזכויות באתר ובתכניו, לרבות אך לא רק: טקסטים, תמונות, סרטונים, עיצוב גרפי, לוגו, סימני מסחר, שם המותג FLOOR D.a.N.A, חומרים מקצועיים, מדריכים ותכנים אחרים – הם רכושו הבלעדי של העסק ומוגנים על פי חוק זכות יוצרים, התשס&quot;ח-2007 ו/או כל דין אחר.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    3.2 אין להעתיק, לשכפל, להפיץ, לפרסם, להעביר, למכור, לשנות או לעשות כל שימוש מסחרי או אחר בתכני האתר, כולם או חלקם, ללא אישור מפורש בכתב מאת העסק.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    3.3 מדריכים וחומרים מקצועיים הנשלחים למשתמש באמצעות האתר מיועדים לשימושו האישי בלבד, ואין להפיצם או לעשות בהם שימוש מסחרי ללא אישור מראש.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. שימוש מותר ואסור</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    4.1 השימוש באתר מותר למטרות חוקיות בלבד ובהתאם לתנאי תקנון זה.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    4.2 המשתמש מתחייב שלא לעשות באתר שימוש שעלול:
                  </p>
                  <ul className="text-[var(--text-secondary)] list-none space-y-2 pr-4">
                    <li>(א) לפגוע בפעילות התקינה של האתר, בשרתיו או ברשתות המחוברות אליו;</li>
                    <li>(ב) להפר זכויות קניין רוחני של העסק או של צד שלישי;</li>
                    <li>(ג) להטריד, לפגוע, להשמיץ או לאיים על משתמשים אחרים או על העסק;</li>
                    <li>(ד) להעביר תוכן מזיק, לרבות וירוסים, תוכנות זדוניות או קוד מזיק;</li>
                    <li>(ה) לאסוף מידע על משתמשים אחרים ללא הסכמתם;</li>
                    <li>(ו) לעשות שימוש באתר למטרות הונאה, התחזות או כל פעילות בלתי חוקית אחרת.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. מסירת מידע באמצעות טפסים</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    5.1 האתר מאפשר מסירת מידע באמצעות טפסי יצירת קשר ובקשה לקבלת חומרים מקצועיים.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    5.2 המשתמש מצהיר כי כל מידע שנמסר על ידו באמצעות הטפסים הוא נכון, מדויק ועדכני, וכי הוא מוסר אותו מרצונו החופשי.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    5.3 המשתמש מסכים כי מסירת פרטי התקשרות באמצעות הטפסים מהווה הסכמה ליצירת קשר מצד העסק בנוגע לשירותים ולתכנים מקצועיים רלוונטיים.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    5.4 לפרטים נוספים על אופן השימוש במידע האישי, ראה את <a href="/privacy" className="text-[var(--accent)] hover:underline">מדיניות הפרטיות</a> של האתר.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. תכנים מקצועיים ומדריכים</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    6.1 תכנים מקצועיים, מדריכים, טיפים ועצות המפורסמים באתר או נשלחים למשתמשים מוצגים כמידע כללי בלבד. הם מבוססים על ניסיון מקצועי אך אינם מותאמים לנסיבות הספציפיות של כל משתמש.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    6.2 העסק אינו אחראי לתוצאות יישום התכנים המקצועיים ללא ליווי מקצועי מתאים. למען הסר ספק, שימוש בתכני האתר אינו מהווה תחליף להתקשרות עם העסק לקבלת שירות מותאם אישית.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. הגבלת אחריות</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    7.1 האתר ותכניו מסופקים &quot;כמות שהם&quot; (AS IS). העסק עושה מאמצים סבירים לוודא שהמידע באתר מדויק ומעודכן, אך אינו מתחייב לדיוק, שלמות או עדכניות של התכנים.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    7.2 העסק לא יישא באחריות לכל נזק, ישיר או עקיף, שייגרם למשתמש כתוצאה מ:
                  </p>
                  <ul className="text-[var(--text-secondary)] list-none space-y-2 pr-4">
                    <li>(א) שימוש באתר או הסתמכות על תכניו;</li>
                    <li>(ב) חוסר יכולת לגשת לאתר או תקלה בפעולתו;</li>
                    <li>(ג) פעולות של צדדים שלישיים, לרבות גישה בלתי מורשית למידע;</li>
                    <li>(ד) וירוסים, תוכנות זדוניות או כל גורם טכנולוגי מזיק.</li>
                  </ul>
                  <p className="text-[var(--text-secondary)] mt-3">
                    7.3 בכל מקרה, אחריות העסק כלפי המשתמש לא תעלה על הסכום ששילם המשתמש, אם שילם, בגין השירות הספציפי שבמסגרתו נגרם הנזק.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">8. זמינות האתר</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    8.1 העסק אינו מתחייב שהאתר יפעל ללא הפרעות, תקלות או שגיאות.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    8.2 העסק רשאי לשנות, להשהות או להפסיק את פעילות האתר, כולו או חלקו, בכל עת וללא הודעה מוקדמת, ולא תהיה למשתמש כל טענה בעניין זה.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">9. קישורים לאתרים חיצוניים</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    9.1 ככל שהאתר מכיל קישורים לאתרי אינטרנט של צדדים שלישיים (לרבות רשתות חברתיות), קישורים אלו מסופקים לנוחות המשתמש בלבד.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    9.2 העסק אינו אחראי לתכנים, למדיניות הפרטיות או לפעילות של אתרים חיצוניים, והגלישה בהם היא על אחריות המשתמש בלבד.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">10. נגישות</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    10.1 העסק פועל להנגיש את האתר לאנשים עם מוגבלויות בהתאם להוראות חוק שוויון זכויות לאנשים עם מוגבלויות, התשנ&quot;ח-1998, ותקן SI 5568.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    10.2 אם נתקלת בבעיית נגישות באתר, נשמח לשמוע ממך ולפעול לתיקונה. ניתן לפנות אלינו באמצעות פרטי ההתקשרות המפורטים בסעיף 13.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">11. הדין החל וסמכות שיפוט</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    11.1 תקנון זה, וכל עניין הנובע ממנו או מהשימוש באתר, יפורשו ויוכרעו בהתאם לדיני מדינת ישראל בלבד.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    11.2 סמכות השיפוט הבלעדית בכל סכסוך הנובע מתקנון זה או מהשימוש באתר תהיה נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">12. תניית הפרדה</h2>
                  <p className="text-[var(--text-secondary)]">
                    אם ייקבע כי הוראה כלשהי בתקנון זה אינה חוקית, בטלה או בלתי ניתנת לאכיפה, הוראה זו תופרד מיתר הוראות התקנון, אשר ימשיכו לעמוד בתוקפן המלא.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">13. יצירת קשר</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    לכל שאלה, הערה או בירור בנוגע לתקנון זה או לאתר, ניתן לפנות אלינו:
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    דנה שמרוני – FLOOR D.a.N.A<br />
                    דואר אלקטרוני: dana@floor-dana.com<br />
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
