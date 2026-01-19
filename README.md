# ✨ Starlight Portfolio

**Live Demo:** [https://hassann.in/](https://hassann.in/)

A stunning, modern portfolio website featuring smooth animations, dynamic effects, and an immersive space-themed design. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Visual Effects
- 🌠 **Enhanced Meteor Shower** - Beautiful shooting stars with varied colors, trails, and directions
- ⭐ **Animated Star Field** - Twinkling stars with ambient glow effects
- ✨ **Typing Animation** - Dynamic hero subtitle that cycles through multiple roles
- 🎨 **Glass Morphism** - Modern frosted glass effects throughout
- 🌈 **Gradient Animations** - Smooth color transitions and glows
- 🎯 **Scroll Animations** - Elements fade in and slide up as you scroll
- 🔝 **Back to Top Button** - Smooth scroll navigation

### Design & UX
- 📱 **Fully Responsive** - Optimized for all screen sizes
- 🎭 **Smooth Transitions** - Polished micro-interactions everywhere
- 🖱️ **Hover Effects** - Interactive cards with scale and glow effects
- 🎪 **Parallax Scrolling** - Hero section with depth effect
- 📊 **Skills Marquee** - Infinite scrolling tech stack showcase
- 💼 **Project Showcase** - Staggered card animations with tech tags

### Functionality
- 📧 **Contact Form** - Integrated with Formspree for email submissions
- 🔗 **Social Links** - GitHub, LinkedIn, LeetCode, and Email
- 📄 **Resume Link** - Direct access to downloadable resume
- 🎵 **Easter Egg** - Hidden UFO music feature

## 🛠️ Technologies

### Core
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### UI Components
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible primitives
- **Lucide React** - Clean, consistent icons

### Form & Validation
- **React Hook Form** - Performant form state management
- **Zod** - TypeScript-first schema validation
- **Formspree** - Backend form handling

### Additional
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Vercel Analytics** - Performance monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/hassarch/starlight-portfolio.git
cd starlight-portfolio
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

4. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## 📧 Contact Form Setup

The contact form uses Formspree for handling submissions:

1. **Sign up for Formspree:**
   - Visit [https://formspree.io/](https://formspree.io/)
   - Create a free account

2. **Create a new form:**
   - Click "New Form" in your dashboard
   - Name it (e.g., "Portfolio Contact")
   - Copy the endpoint URL: `https://formspree.io/f/YOUR_FORM_ID`

3. **Configure environment:**
   - Add to `.env`:
     ```
     VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
     ```

4. **Test it:**
   - Submit the contact form
   - Check your Formspree dashboard for the submission

**Fallback:** If not configured, the form will open your default email client.

## 🏗️ Build for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

Built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
bun run preview
```

## 🌐 Deployment

Deploy to any static hosting platform:

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Push 'dist' folder to gh-pages branch
```

### Cloudflare Pages
- Connect your GitHub repository
- Build command: `npm run build`
- Output directory: `dist`

## 📁 Project Structure

```
starlight-portfolio/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── StarBackground.tsx
│   │   ├── BackToTop.tsx
│   │   └── Footer.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useScrollAnimation.ts
│   │   ├── useTypingEffect.ts
│   │   └── use-toast.ts
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## 🎨 Customization

### Colors
Edit `src/index.css` to change the color scheme:
```css
:root {
  --primary: 271 91% 65%;    /* Purple */
  --accent: 330 86% 70%;     /* Pink */
  --background: 0 0% 0%;     /* Black */
}
```

### Content
- **Personal Info:** Edit `src/components/HeroSection.tsx`
- **About Text:** Edit `src/components/AboutSection.tsx`
- **Skills:** Edit `src/components/SkillsSection.tsx`
- **Projects:** Edit `src/components/ProjectsSection.tsx`
- **Contact:** Edit `src/components/ContactSection.tsx`

### Animations
- **Typing Text:** Modify the array in `HeroSection.tsx`
- **Meteor Settings:** Adjust values in `StarBackground.tsx`
- **Scroll Delays:** Change `transitionDelay` in component files

## 🎯 Performance

- ⚡ Lighthouse Score: 95+
- 🚀 First Contentful Paint: < 1s
- 📦 Bundle Size: ~130KB gzipped
- ♿ Accessibility: WCAG 2.1 AA compliant

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Mohammed Hassan**
- Website: [hassann.in](https://hassann.in/)
- GitHub: [@hassarch](https://github.com/hassarch)
- LinkedIn: [hassan0777](https://www.linkedin.com/in/hassan0777/)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio trends
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Animations inspired by space and astronomy

---

⭐ Star this repo if you found it helpful!
