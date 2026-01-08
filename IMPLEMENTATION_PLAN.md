# D.A.N.A FLOOR - Website Implementation Plan

## Design Direction (Inspired by USHG)

### Visual Language
- **Clean, minimal aesthetic** with generous whitespace
- **High contrast** - white/cream backgrounds with dark typography
- **Asymmetrical layouts** - offset text and imagery for visual dynamism
- **Grid-based system** - 12-column responsive grid
- **Photography-forward** - large, high-quality images of restaurants/floor work

### Typography
- Modern sans-serif typeface (consider: Inter, Outfit, or Heebo for Hebrew)
- Bold headings with generous letter-spacing
- Clear hierarchy between H1, H2, body text

### Animations
- Subtle fade-in on scroll
- Smooth page transitions
- Hover states on interactive elements
- ~0.5s duration for micro-interactions

### Color Palette
```
Primary:      #1A1A1A (near-black)
Background:   #FAFAFA (off-white)
Accent:       #D4A574 (warm gold/bronze - hospitality warmth)
Text:         #333333
Light Gray:   #E5E5E5 (borders, dividers)
```

---

## Phase 1: Foundation & Homepage
**Goal**: Establish technical foundation and create impactful first impression

### Technical Setup
- [ ] Initialize Next.js 14 project (App Router)
- [ ] Configure Tailwind CSS with RTL support
- [ ] Set up Hebrew fonts (Heebo or Assistant)
- [ ] Configure ESLint + Prettier
- [ ] Create base layout components
- [ ] Set up responsive breakpoints

### Homepage Sections
1. **Hero Section**
   - Full-viewport video/image background
   - Main headline: "שירות, מכירה ואירוח שעובדים באמת בשטח"
   - Subtle scroll indicator

2. **Introduction Block**
   - Dana's brief intro paragraph
   - Asymmetrical layout with portrait image

3. **Services Overview**
   - 3-4 service cards with icons
   - Hover animations
   - Links to detailed service pages

4. **CTA Section**
   - "מרגישים שהפלור יכול לעבוד טוב יותר?"
   - Contact button

5. **Footer**
   - Contact info
   - Social links
   - Navigation links

---

## Phase 2: Service Pages
**Goal**: Showcase all services with clear value propositions

### Page Structure (Template)
- Hero with service title
- Problem/Solution narrative
- What's included (bullet points)
- Process explanation
- CTA to contact

### Pages to Build
- [ ] ייעוץ למסעדות (Restaurant Consulting)
- [ ] הדרכות לצוותים (Team Training)
- [ ] הקמה (Establishment Support)
- [ ] שיפור תוצאות (Results Improvement)

### Training Sub-pages
- [ ] הדרכת שירות (Service Training)
- [ ] הדרכת מכירה (Sales Training)
- [ ] הדרכת מנהלים (Management Training)
- [ ] הדרכות תפקיד (Role-specific Training)

---

## Phase 3: About & Trust Building
**Goal**: Establish credibility and personal connection

### About Page
- Dana's full story (from the spec document)
- Professional journey timeline
- Philosophy section
- Professional photo gallery

### Testimonials Section
- Quote cards with client attribution
- Rotating/carousel display
- Integration into homepage and service pages

### "For Whom" Section
- Business type cards (large restaurants, cafes, hotels, etc.)
- Visual icons for each category

---

## Phase 4: Contact & Lead Generation
**Goal**: Convert visitors into leads

### Contact Page
- Contact form with fields:
  - Name
  - Phone
  - Business type (dropdown)
  - Service interest (dropdown)
  - Message
- Direct contact info (phone, email)
- WhatsApp integration button

### Form Features
- Client-side validation
- Success/error states
- Email notification (via API route)
- Optional: CRM integration prep

---

## Phase 5: Polish & Launch Prep
**Goal**: Refine UX and prepare for production

### Enhancements
- [ ] Scroll animations (Framer Motion)
- [ ] Page transitions
- [ ] Loading states
- [ ] 404 page
- [ ] Mobile menu refinement
- [ ] Image optimization
- [ ] SEO meta tags (Hebrew)
- [ ] Open Graph images

### Testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] RTL layout verification
- [ ] Form functionality
- [ ] Performance audit (Lighthouse)

### Deployment
- [ ] Vercel deployment setup
- [ ] Domain configuration
- [ ] Analytics integration (Google Analytics)
- [ ] Final content review

---

## Phase 6: Future Enhancements (Post-Launch)
**Goal**: Expand functionality based on business needs

### Potential Additions
- Blog/Articles section (SEO content)
- Digital courses platform integration
- Client portal
- Booking/scheduling system
- Multi-language support (English)

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Email | Resend or SendGrid |
| Hosting | Vercel |
| Analytics | Google Analytics 4 |

---

## File Structure Preview

```
src/
├── app/
│   ├── layout.tsx          # Root layout with RTL
│   ├── page.tsx            # Homepage
│   ├── about/
│   ├── contact/
│   └── services/
│       ├── consulting/
│       ├── training/
│       └── establishment/
├── components/
│   ├── ui/                 # Buttons, cards, inputs
│   ├── layout/             # Header, footer, nav
│   └── sections/           # Homepage sections
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css
```

---

## Timeline Estimate

| Phase | Scope |
|-------|-------|
| Phase 1 | Foundation & Homepage |
| Phase 2 | Service Pages |
| Phase 3 | About & Testimonials |
| Phase 4 | Contact & Forms |
| Phase 5 | Polish & Launch |
