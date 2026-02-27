# ✨ Hassan's Portfolio

**Live Demo:** [https://hassancodes.in/](https://hassancodes.in/)

A clean, minimalist portfolio website featuring smooth animations and a professional design. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### Design & UX
- 🎨 **Minimalist Design** - Clean lines, ample whitespace, and restrained color palette
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ✨ **Subtle Animations** - Smooth scroll-triggered animations
- 🖱️ **Hover Effects** - Interactive elements with clean transitions
- 💼 **Project Showcase** - Card-based layout with tech tags
- 🎯 **Skills Display** - Clean pill-based tech stack showcase

### Functionality
- 📧 **Contact Form** - Integrated with Formspree for email submissions
- 🔗 **Social Links** - GitHub, LinkedIn, LeetCode, X (Twitter), and Email
- 📄 **Resume Link** - Direct access to downloadable resume
- 🎵 **Easter Egg** - Hidden UFO music feature
- 🔝 **Back to Top Button** - Smooth scroll navigation

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

The application will be available at `http://localhost:8080`

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

### Other scripts

| Script        | Description                    |
|---------------|--------------------------------|
| `npm run lint`| Run ESLint                     |
| `npm run build:dev` | Build in development mode |
| `npm run preview`   | Preview production build  |

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
bun run preview
```

## 🐳 Docker Deployment

The project includes production-ready Docker support for easy containerized deployment.

### Quick Start with Docker Compose

```bash
# Build and run the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000`

### Using Docker Directly

```bash
# Build the image
docker build -t portfolio-app .

# Run the container
docker run -p 3000:80 portfolio-app

# Run in detached mode with a name
docker run -d -p 3000:80 --name portfolio portfolio-app

# View logs
docker logs -f portfolio

# Stop the container
docker stop portfolio

# Remove the container
docker rm portfolio
```

### Docker Features

- **Multi-stage Build** - Optimized image size (~50MB)
- **Nginx Server** - Fast static file serving with gzip compression
- **Health Checks** - Automatic container health monitoring
- **Security** - Non-root user, minimal attack surface
- **SPA Routing** - Proper handling of client-side routes
- **Performance** - Asset caching headers and compression
- **Networking** - Isolated network for multi-container setups

### Environment Variables

To pass environment variables to the Docker container:

```bash
# Using docker-compose with .env file
docker-compose up -d --env-file .env.production

# Using docker run
docker run -p 3000:80 --env-file .env.production portfolio-app

# Or pass individual variables
docker run -p 3000:80 -e VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_ID portfolio-app
```

### Docker Compose Advanced Usage

**Scale the service:**
```bash
docker-compose up -d --scale web=3
```

**Use a custom port:**
```bash
# Edit docker-compose.yml or override via command
docker-compose -f docker-compose.yml up -d -e "PORT=8080"
```

**View container status:**
```bash
docker-compose ps
```

### Troubleshooting

**Container exits immediately:**
```bash
docker logs portfolio-app
```

**Port already in use:**
```bash
# Change port in docker-compose.yml or use:
docker run -p 8080:80 portfolio-app
```

**Rebuild without cache:**
```bash
docker-compose build --no-cache
docker-compose up -d
```

**Check container health:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
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

## 🔧 CI

GitHub Actions runs on every push and pull request to `main` / `master`:

- **Lint** – ESLint
- **Build** – `npm run build`

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## 📁 Project Structure

```
starlight-portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AboutSection.tsx
│   │   ├── AnimatedBackground.tsx
│   │   ├── BackToTop.tsx
│   │   ├── BlurText.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Galaxy.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── StarBackground.tsx
│   │   └── UfoIcon.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useScrollAnimation.ts
│   │   ├── useTypingEffect.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── ufoMusic.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/               # Static assets
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🎨 Customization

### Colors
Edit `src/index.css` to change the color scheme:
```css
:root {
  --background: 0 0% 100%;   /* White */
  --foreground: 0 0% 10%;    /* Near Black */
  --muted-foreground: 0 0% 45%; /* Gray */
}
```

### Content
- **Personal Info:** Edit `src/components/HeroSection.tsx`
- **About Text:** Edit `src/components/AboutSection.tsx`
- **Skills:** Edit `src/components/SkillsSection.tsx`
- **Projects:** Edit `src/components/ProjectsSection.tsx`
- **Contact:** Edit `src/components/ContactSection.tsx`

### Animations
- **Scroll Animations:** Change `transitionDelay` in component files
- **Hover Effects:** Adjust transition durations in Tailwind classes

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
- Website: [hassancodes.in](https://hassancodes.in/)
- GitHub: [@hassarch](https://github.com/hassarch)
- LinkedIn: [hassan0777](https://www.linkedin.com/in/hassan0777/)

## 🙏 Acknowledgments

- Design inspired by minimalist portfolio trends
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

⭐ Star this repo if you found it helpful!
