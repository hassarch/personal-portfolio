# 🚀 Quick Start Guide - Enhanced Portfolio

## What's New? ✨

Your portfolio now features:
- 🎭 **Smooth animations** throughout the site
- ⌨️ **Typing effects** in hero section
- 💻 **Fully functional terminal** with multiple commands
- 🎨 **Enhanced brutalist design** with dynamic shadows
- 🃏 **Better project cards** with hover effects
- 🌓 **Smooth theme transitions**

## Getting Started

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The site will be available at `http://localhost:8080`

### 3. Try the New Terminal Features! 🎉

Click the **Terminal** button in the navbar or at the bottom of the page to open the interactive terminal.

#### Try These Commands:
```bash
# Get help
$ help

# See user info
$ whoami

# List sections
$ ls

# Navigate to projects
$ cd projects

# Switch theme
$ theme dark
$ theme light

# View command history
$ history

# Echo something
$ echo Hello, World!

# Clear terminal
$ clear
```

## 🎨 New Animations You'll See

### Hero Section
- Name types out character by character
- Bio appears with typing effect after name
- Smooth fade-in for all elements

### Skills Section
- Tree structure appears line by line
- Each skill animates in sequentially

### Project Cards
- Hover to see cards lift up
- Shadow grows dynamically
- GitHub icon rotates on hover
- Tech tags scale on hover

### Navigation
- Nav items slide in from left/right
- Theme icon rotates when toggled
- Terminal icon bounces on hover

### Contact Form
- Fields animate in one by one
- Icons lift on hover
- Social links bounce on hover

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint

# Testing (if needed)
npm run test            # Run tests
```

## 🎯 Key Features to Show Off

### 1. Terminal Commands
The terminal is fully functional with command history, navigation, and theme control!

### 2. Typing Effects
Watch the hero section text type out like a real terminal.

### 3. Hover Animations
Every interactive element responds with smooth, physics-based animations.

### 4. Theme Toggle
Switch between dark/light modes - even from the terminal!

### 5. Project Cards
Hover over project cards to see the enhanced brutalist shadow effects.

## 📱 Responsive Design

All animations work perfectly on:
- 💻 Desktop
- 📱 Mobile
- 🖥️ Tablet

## ♿ Accessibility

- All animations respect `prefers-reduced-motion`
- Keyboard navigation works perfectly
- Screen reader friendly
- ARIA labels on all interactive elements

## 🎨 Customization

### Change Animation Speed
Edit `src/index.css` for animation timings:
```css
@keyframes typing {
  /* Adjust duration here */
}
```

### Modify Typing Speed
Edit components using `useTypingEffect`:
```typescript
const typed = useTypingEffect({ 
  text: 'Your text',
  speed: 50,    // Lower = faster
  delay: 1000   // Delay before starting
});
```

### Adjust Shadow Sizes
Use these CSS classes:
- `shadow-brutal-sm` - Small (2px)
- `shadow-brutal-md` - Medium (4px)
- `shadow-brutal-lg` - Large (6px)
- `shadow-brutal-xl` - Extra Large (8px)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

### Deploy to Vercel (Recommended)
```bash
vercel
```

### Deploy to Netlify
1. Run `npm run build`
2. Drag the `dist` folder to Netlify

### Deploy with Docker
```bash
docker-compose up -d
```

## 📚 Documentation

- Full enhancements: See `ENHANCEMENTS.md`
- Project README: See `README.md`
- Terminal commands: Type `help` in the terminal

## 🐛 Troubleshooting

### Animations not working?
- Clear browser cache
- Check console for errors
- Ensure all dependencies are installed

### Terminal not opening?
- Check that Terminal button is visible in navbar
- Try clicking the bottom toggle bar

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🎉 Have Fun!

Explore all the new animations and terminal features. Your portfolio is now more interactive and engaging than ever!

---

**Questions?** Check the terminal help with `$ help`
