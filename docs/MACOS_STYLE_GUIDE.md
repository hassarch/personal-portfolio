# 🍎 macOS Window Style Guide

## Overview

All sections now feature authentic macOS-style window chrome with the iconic traffic light buttons (red, yellow, green) and rounded corners throughout.

---

## 🎨 Visual Changes

### macOS Window Features

#### 1. **Traffic Light Buttons** 🚦
Each section window includes the classic macOS control buttons:

- **🔴 Red (Close)**: Left button
  - Color: `#FF5F57`
  - Shows ✕ icon on hover
  
- **🟡 Yellow (Minimize)**: Middle button
  - Color: `#FFBD2E`
  - Shows − icon on hover
  
- **🟢 Green (Maximize)**: Right button
  - Color: `#28C840`
  - Shows ⤢ icon on hover

**Features:**
- Buttons scale up 10% on hover
- Icons appear only when hovering over controls
- Authentic macOS colors (same in dark/light mode)
- Spring physics animations
- Interactive feedback on click

---

#### 2. **Window Chrome**
- **Title Bar**: Gradient background with centered title
- **Border**: 2px solid with rounded corners (10px radius)
- **Shadow**: Layered shadows for depth
  - Light mode: Subtle gray shadows
  - Dark mode: Deeper black shadows
- **Content Area**: Smooth padding and background

---

#### 3. **Rounded Corners** 🔘
Applied throughout for a cohesive macOS feel:

| Element | Border Radius |
|---------|---------------|
| Terminal frames | 10px |
| Project cards | 10px |
| Buttons | 6px |
| Nav buttons | 6px |
| Form inputs | 6px |
| Tech pills | 4px |
| Nav links | 4px |

---

## 💻 Technical Implementation

### TerminalFrame Component

```tsx
// Enhanced with traffic light buttons
<motion.button
  className="macos-btn macos-btn-close"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
>
  {hoveredButton === 'close' && <CloseIcon />}
</motion.button>
```

**Features:**
- State management for hover detection
- Conditional icon rendering
- Framer Motion animations
- Accessibility labels

---

### CSS Classes

#### macOS Buttons
```css
.macos-btn {
  /* Base button style */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.2);
}

.macos-btn-close { background: #FF5F57; }
.macos-btn-minimize { background: #FFBD2E; }
.macos-btn-maximize { background: #28C840; }
```

#### Window Styling
```css
.terminal-frame {
  border-radius: 10px;
  box-shadow: 
    0 8px 32px rgba(0,0,0,0.12),
    0 2px 8px rgba(0,0,0,0.08);
}

.terminal-title-bar {
  background: linear-gradient(180deg, 
    rgba(0,0,0,0.02) 0%, 
    rgba(0,0,0,0.04) 100%
  );
}
```

---

## 🎯 Design Philosophy

### Why macOS Style?

1. **Familiarity**: Most developers use macOS
2. **Professional**: Clean, modern aesthetic
3. **Recognition**: Instantly recognizable interface
4. **Brutalist + Modern**: Combines sharp edges with soft corners

### Hybrid Approach

**Brutalist Elements (Retained):**
- Sharp, offset box-shadows
- Bold borders (2px)
- High contrast
- Grid/scanline background

**macOS Elements (Added):**
- Rounded corners
- Traffic light buttons
- Layered shadows
- Window chrome styling

**Result:** A unique blend that's both retro-terminal and modern-macOS

---

## 🎨 Visual Comparison

### Before (Pure Brutalist)
```
┌─────────────────────┐
│ ● ● ●   ~/title     │  ← Simple dots
├─────────────────────┤
│                     │
│  Content here       │  ← Sharp corners
│                     │
└─────────────────────┘
     Sharp edges
```

### After (macOS-Inspired)
```
╭─────────────────────╮
│ 🔴 🟡 🟢  ~/title    │  ← Colored traffic lights
├─────────────────────┤
│                     │
│  Content here       │  ← Rounded corners
│                     │
╰─────────────────────╯
   Smooth corners + shadow layers
```

---

## 🎭 Interactive Features

### Button Hover States

**On Hover:**
1. Button scales to 110%
2. Icon appears inside button
3. Button brightens slightly

**Icon Types:**
- **Close**: X mark (cross lines)
- **Minimize**: Horizontal line (minus)
- **Maximize**: Arrows pointing diagonally (fullscreen)

### Animation Details

```typescript
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
transition={{ type: "spring", stiffness: 400, damping: 17 }}
```

**Physics:**
- Spring-based animation
- Natural, bouncy feel
- Fast response (400 stiffness)
- Quick settle (17 damping)

---

## 📱 Responsive Behavior

### Mobile
- Traffic lights remain visible (smaller on mobile)
- Title stays centered
- Touch-friendly button sizes
- Rounded corners maintained

### Tablet
- Full-size traffic lights
- Optimal spacing
- All animations work

### Desktop
- Maximum visual impact
- Hover effects fully visible
- Smooth animations

---

## 🎨 Color System

### Traffic Light Colors (Constant)
These stay the same in both themes:

```css
--macos-red: #FF5F57;
--macos-red-border: #E0443E;
--macos-yellow: #FFBD2E;
--macos-yellow-border: #DEA123;
--macos-green: #28C840;
--macos-green-border: #1AAB29;
```

### Window Chrome (Theme-Dependent)

**Light Mode:**
```css
background: linear-gradient(180deg, 
  rgba(0,0,0,0.02) 0%, 
  rgba(0,0,0,0.04) 100%
);
```

**Dark Mode:**
```css
background: linear-gradient(180deg, 
  rgba(255,255,255,0.03) 0%, 
  rgba(255,255,255,0.01) 100%
);
```

---

## 🔧 Customization

### Change Button Size
Edit `.macos-btn` in `index.css`:
```css
.macos-btn {
  @apply w-3 h-3;  /* Change w-3 h-3 to desired size */
}
```

### Adjust Border Radius
Search and replace in `index.css`:
```css
border-radius: 10px;  /* Terminal frames */
border-radius: 6px;   /* Buttons */
border-radius: 4px;   /* Pills */
```

### Modify Traffic Light Colors
Edit color values in `index.css`:
```css
.macos-btn-close {
  background: #FF5F57;  /* Your color here */
}
```

---

## ✨ Key Benefits

### User Experience
- ✅ Familiar interface pattern
- ✅ Clear visual hierarchy
- ✅ Interactive feedback
- ✅ Professional appearance

### Visual Design
- ✅ Cohesive rounded corner system
- ✅ Authentic macOS look
- ✅ Balanced brutalist + modern
- ✅ Smooth shadow transitions

### Technical
- ✅ Component-based architecture
- ✅ State-driven icon display
- ✅ Performance-optimized animations
- ✅ Accessible button labels

---

## 🎯 Sections with macOS Windows

All these sections use the TerminalFrame component:

1. ✅ **Hero Section** (`~/welcome`)
2. ✅ **About Section** (`~/about`)
3. ✅ **Skills Section** (`~/skills`)
4. ✅ **Projects Section** (`~/projects`)
5. ✅ **Contact Section** (`~/contact`)

---

## 📊 Visual Metrics

### Measurements
- Traffic light button diameter: 12px
- Button spacing: 8px (gap-2)
- Title bar height: ~40px
- Border radius (frames): 10px
- Border radius (buttons): 6px
- Border width: 2px throughout

### Shadows
```css
/* Terminal Frame */
box-shadow: 
  0 8px 32px rgba(0,0,0,0.12),
  0 2px 8px rgba(0,0,0,0.08);

/* Dark mode */
box-shadow: 
  0 8px 32px rgba(0,0,0,0.4),
  0 2px 8px rgba(0,0,0,0.3);

/* Project cards on hover */
box-shadow: 
  10px 10px 0px 0px currentColor,
  0 10px 40px rgba(0,0,0,0.15);
```

---

## 🎨 Design Tokens

### Spacing
- Button group gap: `gap-2` (8px)
- Title bar padding: `px-4 py-3` (16px, 12px)
- Content padding: `p-4 sm:p-6 md:p-8`

### Typography
- Title font: Monospace
- Title size: `text-xs sm:text-sm`
- Title weight: `font-semibold` (600)
- Title transform: `uppercase`

---

## 🚀 Future Enhancements (Optional)

### Possible Additions:
- [ ] Functional buttons (minimize/maximize animations)
- [ ] Window dragging
- [ ] Window resizing
- [ ] Multiple window states
- [ ] Window focus states
- [ ] Custom traffic light colors per section

---

## 📝 Usage Example

```tsx
import TerminalFrame from '@/components/TerminalFrame';

function MySection() {
  return (
    <section>
      <TerminalFrame title="~/my-section">
        <div>
          {/* Your content here */}
        </div>
      </TerminalFrame>
    </section>
  );
}
```

**Result:** Section wrapped in macOS-style window with:
- Traffic light buttons (with hover icons)
- Centered title in title bar
- Rounded corners
- Layered shadows
- Responsive layout

---

## 🎉 Summary

Your portfolio now features:

- 🍎 **Authentic macOS windows** with traffic light buttons
- 🎨 **Rounded corners** throughout for consistency
- 💫 **Interactive buttons** that respond to hover
- 🎯 **Professional look** that stands out
- ⚡ **Smooth animations** with spring physics
- 🌓 **Works in both themes** (dark/light)

**The result:** A unique portfolio that combines retro terminal aesthetics with modern macOS design language!

---

**Enjoy your macOS-styled portfolio! 🚀**
