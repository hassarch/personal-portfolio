# Constants Directory

This directory contains reusable constants and configuration values used throughout the terminal portfolio application.

## Files

### `asciiArt.ts`

**Purpose:** Centralized ASCII art assets for terminal-themed portfolio

**Contents:**
- Portfolio logos (full and compact)
- Section headers (About, Projects, Skills, Contact)
- Section dividers (heavy, light, dashed, double)
- Boot sequence elements
- Terminal decorations and icons
- Utility functions for formatting

**Key Features:**
- ✅ Comprehensive ASCII art collection
- ✅ Responsive logo selection helper
- ✅ File listing formatter (`formatFileListingLine`)
- ✅ Directory tree formatter (`formatTreeItem`)
- ✅ Box creation utility (`createBox`)
- ✅ Full TypeScript type safety
- ✅ 36 passing unit tests

**Usage Example:**
```typescript
import { 
  PORTFOLIO_LOGO, 
  SECTION_DIVIDER_HEAVY,
  getResponsiveLogo,
  formatTreeItem 
} from '@/constants/asciiArt';

// Display logo
<pre>{PORTFOLIO_LOGO}</pre>

// Responsive logo
const logo = getResponsiveLogo(window.innerWidth < 768);

// Format directory tree
const item = formatTreeItem(false, 0, 'frontend/');
```

**Testing:**
```bash
npm test src/constants/asciiArt.test.ts
```

**Documentation:**
- See `ASCII_ART_GUIDE.md` for complete usage guide
- See `asciiArt.test.ts` for test examples

**Related Requirements:**
- Requirement 1.5: ASCII Art decorative elements

---

## Adding New Constants

When adding new constant files to this directory:

1. **Create the constant file** (e.g., `myConstants.ts`)
2. **Export constants properly** with TypeScript types
3. **Create test file** (e.g., `myConstants.test.ts`)
4. **Document usage** in this README
5. **Link to requirements** that the constants support

## Best Practices

- Use TypeScript for type safety
- Export individual constants and grouped objects
- Provide JSDoc comments for complex constants
- Write unit tests for utility functions
- Keep constants immutable (use `const` and `readonly`)
- Group related constants logically

## Directory Structure

```
src/constants/
├── README.md                 # This file
├── asciiArt.ts              # ASCII art assets
├── asciiArt.test.ts         # ASCII art tests
└── ASCII_ART_GUIDE.md       # Detailed ASCII art guide
```
