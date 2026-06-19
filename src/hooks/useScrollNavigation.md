# Scroll Navigation Utilities

This module provides utilities for smooth scrolling navigation and section tracking in the terminal portfolio redesign.

## Overview

The scroll navigation utilities enable:
- **Centered scrolling**: Automatically centers target sections in the viewport
- **Section tracking**: Uses IntersectionObserver to detect the currently visible section
- **Smooth animations**: Provides smooth scroll behavior for better UX

## API Reference

### `navigateToSection(sectionId: string): void`

Smoothly scrolls to a target section with centered positioning.

**Parameters:**
- `sectionId` - The ID of the target section element (without the `#` prefix)

**Example:**
```typescript
import { navigateToSection } from '@/hooks/useScrollNavigation';

// Navigate to the about section
navigateToSection('about');

// In event handlers
const handleClick = () => {
  navigateToSection('projects');
};
```

**Behavior:**
- Centers the target section in the viewport
- Uses smooth scroll behavior
- Logs a warning if the section is not found
- Does nothing if the section doesn't exist

### `useCurrentSection(sectionIds?: string[], threshold?: number): string`

Hook to track the current visible section using IntersectionObserver.

**Parameters:**
- `sectionIds` (optional) - Array of section IDs to observe. If not provided, observes all sections with IDs
- `threshold` (optional) - Intersection threshold (default: 0.5 = 50% visibility)

**Returns:**
- The ID of the currently visible section (empty string initially)

**Example:**
```typescript
import { useCurrentSection } from '@/hooks/useScrollNavigation';

function CommandTerminal() {
  const currentSection = useCurrentSection(['home', 'about', 'projects']);
  
  return (
    <div>
      <p>Current section: {currentSection}</p>
    </div>
  );
}
```

**Behavior:**
- Returns empty string before any section is detected
- Updates when a section crosses the threshold
- Uses a rootMargin of `-50px 0px -50px 0px` for centered detection
- Automatically cleans up observer on unmount

### `useScrollNavigation(sectionIds?: string[], threshold?: number)`

Combined hook that provides both navigation function and current section tracking.

**Parameters:**
- `sectionIds` (optional) - Array of section IDs to observe
- `threshold` (optional) - Intersection threshold for visibility detection

**Returns:**
- Object with:
  - `currentSection: string` - The ID of the currently visible section
  - `navigate: (sectionId: string) => void` - Navigation function
  - `navigateToSection: (sectionId: string) => void` - Alias for navigate

**Example:**
```typescript
import { useScrollNavigation } from '@/hooks/useScrollNavigation';

function CommandTerminal() {
  const { currentSection, navigate } = useScrollNavigation(['home', 'about', 'projects']);
  
  const handleCommand = (cmd: string) => {
    if (cmd === 'about') {
      navigate('about');
    }
  };
  
  return (
    <div>
      <p>Current: {currentSection}</p>
      <button onClick={() => navigate('projects')}>Go to Projects</button>
    </div>
  );
}
```

**Behavior:**
- Combines functionality of `useCurrentSection` and `navigateToSection`
- Navigate function reference is stable (memoized)
- Ideal for components that need both navigation and tracking

## Implementation Details

### Centered Scrolling Algorithm

The `navigateToSection` function uses the following algorithm to center sections:

```typescript
const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.clientHeight / 2);

window.scrollTo({
  top: offsetPosition,
  behavior: 'smooth'
});
```

This ensures:
1. Get the element's position relative to the viewport
2. Calculate the offset to center the element vertically
3. Apply smooth scroll to the calculated position

### IntersectionObserver Configuration

The `useCurrentSection` hook uses:
- **Threshold**: 0.5 (default) - Section must be 50% visible
- **Root margin**: `-50px 0px -50px 0px` - Adjusts detection area for centered positioning
- **Observer**: Automatically disconnects on unmount to prevent memory leaks

## Usage in Terminal Portfolio

### Navbar Integration

```typescript
import { navigateToSection } from '@/hooks/useScrollNavigation';

const handleNavClick = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  const sectionId = href.substring(1); // Remove '#' prefix
  navigateToSection(sectionId);
};
```

### CommandTerminal Integration

```typescript
import { useScrollNavigation } from '@/hooks/useScrollNavigation';

function CommandTerminal() {
  const { currentSection, navigate } = useScrollNavigation();
  
  const handleCommand = (cmd: string) => {
    const sectionMap: Record<string, string> = {
      'home': 'home',
      'about': 'about',
      'projects': 'projects',
      'skills': 'skills',
      'contact': 'contact',
    };
    
    if (sectionMap[cmd]) {
      navigate(sectionMap[cmd]);
    }
  };
  
  return (
    <div>
      <p>user@portfolio:~/{currentSection}$</p>
      {/* Command input */}
    </div>
  );
}
```

## Testing

The utilities are fully tested with 19 test cases covering:
- Centered scrolling calculations
- Non-existent section handling
- IntersectionObserver setup and cleanup
- Section transitions
- Custom threshold values
- Multiple section observations

Run tests with:
```bash
npm test useScrollNavigation
```

## Requirements Validation

This implementation validates:
- **Requirement 4.6**: Smooth scroll to target Portfolio_Section with centered positioning
- **Design Section**: Navigation System - Scroll Navigation utilities
- **Task 3.5**: Create navigateToSection function with smooth scrolling, Add IntersectionObserver hook to track current section, Ensure centered scrolling for target sections

## Browser Compatibility

- ✅ Chrome/Edge 58+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Modern mobile browsers

Requires support for:
- IntersectionObserver API
- window.scrollTo with smooth behavior
- ES6+ features
