import Link from "next/link";
import { Phone, Mail, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  services: [
    { href: "/services/consulting", label: "ייעוץ למסעדות" },
    { href: "/services/training", label: "הדרכות לצוותים" },
    { href: "/services/establishment", label: "הקמה" },
  ],
  company: [
    { href: "/about", label: "אודות" },
    { href: "/contact", label: "צור קשר" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--foreground)] text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight">
                D.A.N.A <span className="text-[var(--accent)]">FLOOR</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              ייעוץ והדרכות שירות ומכירות למצוינות באירוח והגדלת הכנסות במסעדות,
              בתי קפה, ברים ומלונות.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-lg">שירותים</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[var(--accent)] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-lg">קישורים</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[var(--accent)] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-lg">יצירת קשר</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+972500000000"
                  className="flex items-center gap-2 text-white/70 hover:text-[var(--accent)] transition-colors text-sm"
                >
                  <Phone size={16} />
                  <span>050-000-0000</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:dana@danafloor.co.il"
                  className="flex items-center gap-2 text-white/70 hover:text-[var(--accent)] transition-colors text-sm"
                >
                  <Mail size={16} />
                  <span>dana@danafloor.co.il</span>
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-white/70 hover:text-[var(--accent)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-[var(--accent)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} D.A.N.A FLOOR. כל הזכויות שמורות.
          </p>
          <p className="text-white/50 text-sm">דנה שימרוני - ייעוץ והדרכות אירוח</p>
        </div>
      </div>
    </footer>
  );
}
