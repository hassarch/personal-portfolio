# macOS Styling Update

## Overview
Updated the portfolio with consistent macOS-inspired styling throughout, including the terminal window and all UI components.

## Changes Made

### 1. Terminal Window (TerminalWindow.tsx)
- **macOS Window Controls**: Authentic traffic light buttons (red, yellow, green)
  - Red: Close window with × icon on hover
  - Yellow: Minimize/restore with - icon on hover
  - Green: Maximize with expand icon on hover
- **Window Header**: Centered title with Terminal icon
- **Styling**: Uses CSS classes from index.css:
  - `.terminal-frame`: Window container with rounded corners
  - `.terminal-title-bar`: macOS-style header with gradient
  - `.macos-btn-*`: Traffic light button styles
- **Draggable**: Click and drag from header to move window
- **Backdrop**: Semi-transparent overlay with backdrop blur

### 2. Button Component (ui/button.tsx)
All button variants now use the brutalist macOS-inspired style:
- **Border**: 2px solid border with foreground color
- **Shadows**: Brutalist shadows that lift on hover
  - Default: `shadow-brutal-md` → `shadow-brutal-lg` on hover
  - Hero/Glow: `shadow-brutal-lg` → `shadow-brutal-xl` on hover
- **Animations**: 
  - Lifts up on hover (-translate-y)
  - Active state removes shadow for "pressed" effect
- **Rounded Corners**: Consistent `rounded-lg` (8px radius)

### 3. Card Component (ui/card.tsx)
- **Border**: 2px solid border
- **Shadow**: `shadow-brutal-md` → `shadow-brutal-lg` on hover
- **Animation**: Lifts up slightly on hover
- **Rounded Corners**: `rounded-lg`

### 4. Input Component (ui/input.tsx)
- **Border**: 2px solid border
- **Focus State**: Brutalist shadow on focus
- **Rounded Corners**: `rounded-lg`
- **Ring**: Uses foreground color for focus ring

### 5. Dialog Component (ui/dialog.tsx)
- **Overlay**: 50% opacity with backdrop blur (like macOS modals)
- **Content**: 
  - 2px border
  - `shadow-brutal-lg` for depth
  - `rounded-lg` corners
- **Close Button**: Rounded with smooth transitions

### 6. Existing Terminal Frame (TerminalFrame.tsx)
Already had macOS-style traffic light buttons with:
- Hover states showing icons
- Proper colors matching macOS
- Smooth animations with Framer Motion

## CSS Classes Used

### macOS Traffic Light Buttons
```css
.macos-btn                 /* Base button - 12px circle */
.macos-btn-close          /* Red #FF5F57 */
.macos-btn-minimize       /* Yellow #FFBD2E */
.macos-btn-maximize       /* Green #28C840 */
.macos-btn-icon           /* Icon overlay on hover */
```

### Terminal Styling
```css
.terminal-frame           /* Window container */
.terminal-title-bar       /* Header with gradient */
.terminal-title           /* Centered title */
.terminal-content         /* Content area */
.terminal-controls        /* Button group */
.terminal-controls-spacer /* Layout spacer */
```

### Brutalist Shadows
```css
.shadow-brutal-sm         /* 2px 2px 0 0 */
.shadow-brutal-md         /* 4px 4px 0 0 */
.shadow-brutal-lg         /* 6px 6px 0 0 */
.shadow-brutal-xl         /* 8px 8px 0 0 */
```

## Design Principles

1. **Consistency**: All windows, buttons, cards, and inputs follow the same design language
2. **macOS Aesthetic**: Traffic light buttons, subtle gradients, smooth animations
3. **Brutalist Touch**: Hard shadows that lift on hover, solid borders
4. **Accessibility**: Proper ARIA labels, focus states, hover feedback
5. **Performance**: CSS-based animations, smooth 60fps transitions

## User Experience

### Terminal Window
- Click terminal icon in navbar to open
- Drag window from header to reposition
- Click red button or outside to close
- Yellow button minimizes content
- Smooth spring animations for open/close

### Buttons
- Lift up on hover for tactile feedback
- Press down on active state
- Shadow disappears when pressed

### Cards
- Subtle lift on hover
- Maintains brutalist shadow aesthetic
- Smooth transitions

## Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback for reduced motion preferences
- CSS backdrop-filter for blur effects

## Future Enhancements
- Window resize handles
- Window maximize/fullscreen functionality
- Multiple terminal windows
- Window snapping to screen edges
- Save window position in localStorage
