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
              <h1 className="text-4xl lg:text-5xl font-bold">
                מדיניות פרטיות
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
                    מדיניות פרטיות זו מתארת את האופן שבו דנה שמרוני – ייעוץ והדרכה בתחום האירוח וההסעדה (להלן: &quot;העסק&quot;, &quot;אנחנו&quot; או &quot;FLOOR D.a.N.A&quot;) אוספת, משתמשת ומגינה על מידע אישי הנמסר על ידי המשתמשים באתר floor-dana.com (להלן: &quot;האתר&quot;).
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    השימוש באתר ומסירת מידע אישי באמצעותו מהווים הסכמה לתנאי מדיניות פרטיות זו. אם אינך מסכים/ה למדיניות זו, אנא הימנע/י משימוש באתר וממסירת מידע אישי.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    מדיניות זו מנוסחת בלשון זכר מטעמי נוחות בלבד, אך מתייחסת לכל המגדרים.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. המידע שאנו אוספים</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    אנו אוספים מידע אישי שנמסר לנו מרצונך החופשי, באמצעות הטפסים באתר:
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>2.1 טופס יצירת קשר</strong> – שם מלא, מספר טלפון, כתובת דואר אלקטרוני, סוג העסק, תחום השירות המבוקש, והודעה חופשית.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>2.2 טופס הורדת מדריכים ותכנים מקצועיים</strong> – שם מלא, שם העסק, תפקיד, כתובת דואר אלקטרוני ומספר טלפון.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    <strong>2.3 מידע טכני</strong> – האתר שומר העדפות נגישות באחסון המקומי של הדפדפן (localStorage) לצורך שמירת הגדרות הנגישות שבחרת. מידע זה נשמר במכשירך בלבד ואינו נשלח אלינו.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. מטרות השימוש במידע</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    המידע האישי שנאסף ישמש אותנו למטרות הבאות בלבד:
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>3.1 יצירת קשר ומענה לפניות</strong> – טיפול בבקשות, שאלות או הודעות שנשלחו באמצעות טופס יצירת הקשר.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>3.2 שליחת תוכן מקצועי</strong> – משלוח מדריכים, חומרים מקצועיים וכל תוכן אחר שביקשת לקבל.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>3.3 שיווק ודיוור</strong> – שליחת עדכונים, מידע מקצועי והצעות בנוגע לשירותי העסק, בכפוף להסכמתך ובהתאם להוראות חוק התקשורת (בזק ושידורים), התשמ&quot;ב-1982 (תיקון 40).
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    <strong>3.4 שיפור השירות</strong> – ניתוח פניות לצורך שיפור האתר והשירותים המוצעים.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    אנו לא מוכרים, משכירים או מעבירים את המידע האישי שלך לצדדים שלישיים למטרות שיווקיות.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    המידע עשוי להיות משותף אך ורק במקרים הבאים:
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>4.1 ספקי שירות</strong> – אנו משתמשים בשירותי צד שלישי לשליחת דואר אלקטרוני לצורך עיבוד ומשלוח הודעות. ספקים אלו מחויבים לשמור על סודיות המידע ולהשתמש בו אך ורק לצורך מתן השירות.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>4.2 חובה חוקית</strong> – אם נידרש לכך על פי חוק, צו בית משפט או דרישת רשות מוסמכת.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    <strong>4.3 הגנה על זכויות</strong> – אם הדבר נדרש להגנה על זכויותינו, רכושנו או בטיחותנו.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. אבטחת מידע</h2>
                  <p className="text-[var(--text-secondary)]">
                    אנו נוקטים באמצעי אבטחה סבירים ומקובלים כדי להגן על המידע האישי שנמסר לנו מפני גישה בלתי מורשית, שימוש לרעה, אובדן או שינוי. עם זאת, אין באפשרותנו להבטיח הגנה מוחלטת על המידע, ומסירת מידע באמצעות האינטרנט כרוכה בסיכונים מטבעה.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. שמירת המידע</h2>
                  <p className="text-[var(--text-secondary)]">
                    המידע האישי שלך יישמר במאגרינו כל עוד הדבר נדרש למטרות שלשמן נאסף, או כל עוד קיימת חובה חוקית לשמרו. מידע שאין בו עוד צורך יימחק או יובלם באופן שלא יאפשר זיהוי.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. זכויותיך</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981, עומדות לך הזכויות הבאות:
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>7.1 זכות עיון</strong> – הנך רשאי/ת לעיין במידע אישי השמור אודותיך במאגרי המידע שלנו.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>7.2 זכות תיקון</strong> – הנך רשאי/ת לבקש תיקון מידע שגוי או לא מעודכן.
                  </p>
                  <p className="text-[var(--text-secondary)] mb-3">
                    <strong>7.3 זכות מחיקה</strong> – הנך רשאי/ת לבקש מחיקת המידע האישי שלך ממאגרינו, בכפוף לכל חובה חוקית לשמירתו.
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    <strong>7.4 הסרה מדיוור</strong> – הנך רשאי/ת לבקש הסרה מרשימת הדיוור בכל עת, באמצעות לחיצה על קישור ההסרה בתחתית כל הודעת דואר אלקטרוני שתקבל/י, או באמצעות פנייה ישירה אלינו.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">8. עוגיות (Cookies) וטכנולוגיות מעקב</h2>
                  <p className="text-[var(--text-secondary)]">
                    האתר אינו משתמש בעוגיות מעקב (tracking cookies) או בכלי ניתוח אנליטי של צד שלישי. כאמור בסעיף 2.3, האתר שומר העדפות נגישות בלבד באחסון המקומי של הדפדפן שלך.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">9. שינויים במדיניות הפרטיות</h2>
                  <p className="text-[var(--text-secondary)]">
                    אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים יפורסמו באתר עם תאריך העדכון האחרון. המשך השימוש באתר לאחר עדכון המדיניות מהווה הסכמה לשינויים.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">10. יצירת קשר</h2>
                  <p className="text-[var(--text-secondary)] mb-3">
                    לכל שאלה, בירור או בקשה בנוגע למדיניות הפרטיות או לטיפול במידע האישי שלך, ניתן לפנות אלינו:
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
