# TerminalFrame Component

## Overview
The `TerminalFrame` component is a reusable wrapper that provides terminal window aesthetics to portfolio sections.

## Features
- **Terminal window frame** with title bar and control buttons (close, minimize, maximize)
- **Green accent border** with shadow effects for authentic terminal look
- **Fully responsive** with optimized sizing for mobile and desktop viewports
- **Accessibility compliant** with proper ARIA labels and semantic structure

## Usage
```tsx
import TerminalFrame from './components/TerminalFrame';

<TerminalFrame title="~/section-name">
  {/* Your content here */}
</TerminalFrame>
```

## Props
- `title` (string, required): The title displayed in the terminal title bar
- `children` (ReactNode, required): The content to be wrapped
- `className` (string, optional): Additional CSS classes to apply

## Responsive Behavior

### Mobile (< 640px)
- Title bar padding: 12px (px-3)
- Control buttons: 10px × 10px (w-2.5 h-2.5)
- Button gap: 6px (gap-1.5)
- Title font size: 12px (text-xs)
- Content padding: 16px (p-4)

### Tablet (≥ 640px)
- Title bar padding: 16px (px-4)
- Control buttons: 12px × 12px (w-3 h-3)
- Button gap: 8px (gap-2)
- Title font size: 14px (text-sm)
- Content padding: 24px (p-6)

### Desktop (≥ 768px)
- Content padding: 32px (p-8)
- All other sizes remain at tablet breakpoint

## Visual Specifications
- Border: 2px solid foreground color
- Shadow: 
  - Light mode: `0 0 20px rgba(0, 255, 0, 0.1)`
  - Dark mode: `0 0 20px rgba(0, 255, 0, 0.15)`
- Title bar background:
  - Light mode: `rgba(0, 255, 0, 0.03)`
  - Dark mode: `rgba(0, 255, 0, 0.05)`
- Control buttons: circular with foreground color
- Font: Space Mono (monospace)

## Accessibility
- `role="region"` for semantic sectioning
- `aria-label="{title} - terminal window"` for screen readers
- Control buttons marked with `aria-hidden="true"` as decorative elements
- Maintains keyboard navigation through content

## Requirements Coverage
- **1.1**: Terminal frame borders around sections ✓
- **9.1**: Terminal frame component ✓
- **9.2**: Window title bar with control buttons ✓
- **9.3**: Green accent border ✓
- **9.4**: Section name in title bar ✓
- **9.5**: Responsive sizing for mobile and desktop ✓
- **9.6**: Subtle shadow effect ✓
