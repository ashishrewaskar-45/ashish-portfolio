# Ashish Rewaskar — Graphic Designer Portfolio Website

A modern, high-converting, premium personal portfolio website designed for **Ashish Rewaskar** (Graphic Designer & Visual Artist).

---

## 🌟 Key Features

1. **Modern Dark Theme Aesthetic**:
   - Deep charcoal background (`#090a0f`), crisp typography (`Outfit` & `Plus Jakarta Sans`), and vibrant electric violet/gold accents.
   - Glassmorphism UI cards with dynamic border glows, ambient cursor spotlight, and smooth micro-animations.

2. **Hero Showcase**:
   - Features your actual portrait with floating accomplishment badges ("Visual Specialist", "100% Custom").
   - Impactful headline, tagline (*"Creative Designs. Strong Visuals. Powerful Impact."*), and dual CTA buttons.

3. **Filterable Portfolio Gallery**:
   - Categories: **Social Media Designs**, **Banners**, **Posters**, **Branding**, **Advertisements**, **Presentation Designs**.
   - Masonry layout with interactive hover effects and a **Full-Screen Lightbox Modal** displaying full-res artwork, project briefs, client details, and deliverables.

4. **Skills & Services**:
   - Visual tool and competency indicators for **Canva Pro, Social Media Design, Banner Design, Poster Design, Branding, Presentation / PPT Design, and Creative Thinking**.
   - 6 tailored service cards with one-click direct inquiry linking to the contact form.

5. **Contact & Lead Generation**:
   - Direct click-to-call (`+91 9130321429`), click-to-email (`ashishrewaskar45@gmail.com`), and one-click WhatsApp chat.
   - One-click clipboard copy utility for email & phone.
   - Interactive project inquiry form with validation and toast notifications.

---

## 📁 File Structure

```
ashish-portfolio/
├── index.html           # Main HTML structure & semantic SEO markup
├── css/
│   ├── style.css        # Main stylesheet, color tokens, layout, responsiveness
│   └── animations.css   # Keyframe animations, glow pulses, reveal transitions
├── js/
│   ├── data.js          # Portfolio projects list & designer contact details (EASY TO EDIT)
│   ├── effects.js       # Cursor glow, card spotlight, scroll progress bar
│   └── main.js          # Project rendering, filter tabs, modal preview, form handling
├── assets/
│   ├── images/          # Image assets & graphic mockups
│   └── icons/           # Custom SVG icons
└── README.md            # Documentation & instructions
```

---

## 🛠️ How to Add / Update Your Portfolio Projects

All portfolio items are defined in a clean, easy-to-edit file: **`js/data.js`**.

To add a new project, simply open `js/data.js` and add an entry to the `PORTFOLIO_PROJECTS` array:

```javascript
{
  id: "my-new-project",
  title: "Your Project Title",
  category: "social-media", // Options: "social-media", "banners", "posters", "branding", "ads", "presentations"
  categoryLabel: "Social Media Designs",
  tools: ["Canva", "Graphic Design"],
  shortDesc: "Short 1-sentence summary of the design.",
  fullDesc: "Detailed description of the client brief, design goals, and results.",
  image: "path/to/your/image.png", // e.g. "assets/images/my-image.png"
  client: "Client Name",
  year: "2024",
  deliverables: ["Instagram Post", "Story Banner"]
}
```

---

## 🚀 How to Run & Deploy

### Local Preview
- Simply double-click `index.html` in your file explorer to open it in any web browser (Chrome, Edge, Firefox, Safari).

### Free 1-Click Online Hosting Options
- **Vercel / Netlify**: Drag-and-drop the `ashish-portfolio` folder to publish in 30 seconds.
- **GitHub Pages**: Push this repository to GitHub and enable GitHub Pages in repository settings.

---

© 2024 Ashish Rewaskar. All rights reserved.
