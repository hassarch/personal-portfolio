# ASCII Art Assets Guide

This guide explains all ASCII art assets available in the terminal portfolio and how to use them.

## Overview

All ASCII art elements are defined in `src/constants/asciiArt.ts` and can be imported individually or as a complete object.

## Import Options

### Individual Imports
```typescript
import { PORTFOLIO_LOGO, SECTION_DIVIDER_HEAVY, getResponsiveLogo } from '@/constants/asciiArt';
```

### Import All
```typescript
import ASCII_ART from '@/constants/asciiArt';
// or
import { ASCII_ART } from '@/constants/asciiArt';
```

## Logo Assets

### Main Portfolio Logo
**Constant:** `PORTFOLIO_LOGO`

Large ASCII art logo featuring "HASSAN" in block letters. Best suited for desktop screens and hero sections.

```typescript
import { PORTFOLIO_LOGO } from '@/constants/asciiArt';

<pre className="ascii-logo">{PORTFOLIO_LOGO}</pre>
```

### Compact Portfolio Logo
**Constant:** `PORTFOLIO_LOGO_COMPACT`

Smaller alternative logo for mobile devices and compact displays.

```typescript
import { PORTFOLIO_LOGO_COMPACT } from '@/constants/asciiArt';

<pre className="ascii-logo-compact">{PORTFOLIO_LOGO_COMPACT}</pre>
```

### Responsive Logo Helper
**Function:** `getResponsiveLogo(isSmallScreen: boolean): string`

Automatically returns the appropriate logo based on screen size.

```typescript
import { getResponsiveLogo } from '@/constants/asciiArt';

const useResponsiveLogo = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return getResponsiveLogo(isSmallScreen);
};
```

## Section Dividers

### Heavy Line Divider
**Constant:** `SECTION_DIVIDER_HEAVY`

Bold double-line divider for major section breaks.

```
═══════════════════════════════════════════════════════════════════════════════
```

### Light Line Divider
**Constant:** `SECTION_DIVIDER_LIGHT`

Single-line divider for subsection breaks.

```
───────────────────────────────────────────────────────────────────────────────
```

### Dashed Line Divider
**Constant:** `SECTION_DIVIDER_DASHED`

Dashed divider for subtle separations.

```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

### Double Line Divider
**Constant:** `SECTION_DIVIDER_DOUBLE`

Boxed double-line divider for emphasis.

```
╔═══════════════════════════════════════════════════════════════════════════╗
╚═══════════════════════════════════════════════════════════════════════════╝
```

## Boot Sequence Elements

### Boot Box
**Constant:** `BOOT_BOX`

System initialization box for boot sequence display.

```typescript
import { BOOT_BOX } from '@/constants/asciiArt';

<pre className="boot-box">{BOOT_BOX}</pre>
```

### Boot Messages
**Constant:** `BOOT_MESSAGES`

Array of sequential boot messages for system initialization animation.

```typescript
import { BOOT_MESSAGES } from '@/constants/asciiArt';

{BOOT_MESSAGES.map((message, index) => (
  <TypingEffect key={index} text={message} delay={index * 500} />
))}
```

Messages include:
- "Initializing portfolio system..."
- "Loading user modules..."
- "Establishing connections..."
- "Mounting components..."
- "System ready."
- "Welcome."

## Section Headers

### Help Command Header
**Constant:** `HELP_HEADER`

Header for the help command display.

```typescript
import { HELP_HEADER } from '@/constants/asciiArt';

<pre>{HELP_HEADER}</pre>
```

### About Section Header
**Constant:** `ABOUT_HEADER`

ASCII art "ABOUT" title for the about section.

### Projects Section Header
**Constant:** `PROJECTS_HEADER`

ASCII art "PROJECTS" title for the projects section.

### Skills Section Header
**Constant:** `SKILLS_HEADER`

ASCII art "SKILLS" title for the skills section.

### Contact Section Header
**Constant:** `CONTACT_HEADER`

ASCII art "CONTACT" title for the contact section.

## Banners and Decorations

### Welcome Banner
**Constant:** `WELCOME_BANNER`

Decorative welcome box for hero section.

```typescript
import { WELCOME_BANNER } from '@/constants/asciiArt';

<pre className="welcome-banner">{WELCOME_BANNER}</pre>
```

### Terminal Header
**Constant:** `TERMINAL_HEADER`

Terminal window header with control buttons.

## Icon Constants

### Success Icon
**Constant:** `SUCCESS_ICON` = `[✓]`

Green checkmark for successful operations.

### Error Icon
**Constant:** `ERROR_ICON` = `[✗]`

Red X for error states.

### Loading Icon
**Constant:** `LOADING_ICON` = `[...]`

Ellipsis for loading states.

### File Icon
**Constant:** `FILE_ICON` = `📄`

File emoji for file listings.

### Folder Icon
**Constant:** `FOLDER_ICON` = `📁`

Folder emoji for directory listings.

## Terminal Characters

### Prompt Arrow
**Constant:** `PROMPT_ARROW` = `>`

Command output indicator.

### Cursor
**Constant:** `CURSOR` = `█`

Solid block cursor for terminal input.

### Cursor Blink
**Constant:** `CURSOR_BLINK` = `_`

Underscore cursor for blinking animation.

### History Prefix
**Constant:** `HISTORY_PREFIX` = `$`

Dollar sign prefix for command history.

### Comment Prefix
**Constant:** `COMMENT_PREFIX` = `#`

Hash symbol for file listing comments.

## Project Listing Elements

### Project Prefix
**Constant:** `PROJECT_PREFIX` = `drwxr-xr-x`

Unix-style permission string for project directories.

### Format File Listing Line
**Function:** `formatFileListingLine(permissions: string, owner: string, date: string, name: string): string`

Creates a formatted file listing line similar to `ls -la` output.

```typescript
import { formatFileListingLine, PROJECT_PREFIX } from '@/constants/asciiArt';

const projectLine = formatFileListingLine(
  PROJECT_PREFIX,
  'hassan',
  '2024-01-15',
  'portfolio-website/'
);

// Output: "drwxr-xr-x  hassan  2024-01-15  portfolio-website/"
```

## Directory Tree Elements

### Tree Branch
**Constant:** `TREE_BRANCH` = `├──`

Branch character for directory tree items.

### Tree Branch Last
**Constant:** `TREE_BRANCH_LAST` = `└──`

Last branch character for final directory tree items.

### Tree Vertical
**Constant:** `TREE_VERTICAL` = `│`

Vertical line for directory tree structure.

### Tree Space
**Constant:** `TREE_SPACE` = `    ` (4 spaces)

Indentation unit for directory tree levels.

### Format Tree Item
**Function:** `formatTreeItem(isLast: boolean, depth: number, name: string): string`

Creates a properly formatted directory tree item with correct branching.

```typescript
import { formatTreeItem } from '@/constants/asciiArt';

const skills = [
  { name: 'frontend/', isLast: false, depth: 0 },
  { name: 'React.js', isLast: false, depth: 1 },
  { name: 'TypeScript', isLast: true, depth: 1 },
  { name: 'backend/', isLast: true, depth: 0 },
  { name: 'Node.js', isLast: true, depth: 1 }
];

<pre>
  {skills.map(skill => (
    <div key={skill.name}>
      {formatTreeItem(skill.isLast, skill.depth, skill.name)}
    </div>
  ))}
</pre>
```

Output:
```
├── frontend/
    ├── React.js
    └── TypeScript
└── backend/
    └── Node.js
```

## Utility Functions

### Create Box
**Function:** `createBox(content: string, width?: number, style?: 'single' | 'double'): string`

Creates a bordered box around text content.

**Parameters:**
- `content`: Text to wrap in a box (supports multi-line with `\n`)
- `width`: Minimum box width (default: 60)
- `style`: Border style - `'single'` or `'double'` (default: `'single'`)

**Examples:**

```typescript
import { createBox } from '@/constants/asciiArt';

// Single line box
const box1 = createBox('Hello, World!');

// Multi-line box
const box2 = createBox('Line 1\nLine 2\nLine 3', 50, 'double');

// Custom width
const box3 = createBox('Wide content here', 80, 'single');
```

### System Message Box
**Function:** `SYSTEM_MESSAGE_BOX(message: string): string`

Creates a system message box with consistent formatting.

```typescript
import { SYSTEM_MESSAGE_BOX } from '@/constants/asciiArt';

const message = SYSTEM_MESSAGE_BOX('System initialized successfully');
```

### Error Box
**Function:** `ERROR_BOX(error: string): string`

Creates an error message box with double borders.

```typescript
import { ERROR_BOX } from '@/constants/asciiArt';

const errorMsg = ERROR_BOX('Command not found');
```

## Usage Examples

### Boot Sequence Component

```typescript
import { BOOT_BOX, BOOT_MESSAGES, PORTFOLIO_LOGO } from '@/constants/asciiArt';

const BootSequence = () => {
  return (
    <div className="boot-sequence">
      <pre className="logo">{PORTFOLIO_LOGO}</pre>
      <pre className="boot-box">{BOOT_BOX}</pre>
      {BOOT_MESSAGES.map((msg, i) => (
        <TypingEffect key={i} text={msg} delay={i * 500} />
      ))}
    </div>
  );
};
```

### Projects Section

```typescript
import { 
  PROJECTS_HEADER, 
  formatFileListingLine, 
  PROJECT_PREFIX,
  COMMENT_PREFIX 
} from '@/constants/asciiArt';

const ProjectsSection = () => {
  return (
    <section>
      <pre className="section-header">{PROJECTS_HEADER}</pre>
      <div className="command-line">$ ls -la projects/</div>
      {projects.map(project => (
        <div key={project.id} className="file-entry">
          <div className="file-line">
            {formatFileListingLine(
              PROJECT_PREFIX,
              'hassan',
              project.date,
              `${project.title}/`
            )}
          </div>
          <div className="file-description">
            {COMMENT_PREFIX} {project.description}
          </div>
        </div>
      ))}
    </section>
  );
};
```

### Skills Section

```typescript
import { 
  SKILLS_HEADER, 
  formatTreeItem 
} from '@/constants/asciiArt';

const SkillsSection = () => {
  const skillTree = [
    { name: 'frontend/', isLast: false, depth: 0 },
    { name: 'React.js', isLast: false, depth: 1 },
    { name: 'TypeScript', isLast: false, depth: 1 },
    { name: 'Tailwind CSS', isLast: true, depth: 1 },
    { name: 'backend/', isLast: true, depth: 0 },
    { name: 'Node.js', isLast: false, depth: 1 },
    { name: 'Python', isLast: true, depth: 1 }
  ];

  return (
    <section>
      <pre className="section-header">{SKILLS_HEADER}</pre>
      <div className="command-line">$ tree skills/</div>
      <pre className="tree-output">
        skills/
        {skillTree.map((skill, i) => (
          <div key={i}>{formatTreeItem(skill.isLast, skill.depth, skill.name)}</div>
        ))}
      </pre>
    </section>
  );
};
```

### Hero Section

```typescript
import { getResponsiveLogo, WELCOME_BANNER } from '@/constants/asciiArt';

const HeroSection = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <section className="hero">
      <pre className="logo">{getResponsiveLogo(isSmallScreen)}</pre>
      <pre className="banner">{WELCOME_BANNER}</pre>
      <div className="content">
        {/* Hero content */}
      </div>
    </section>
  );
};
```

### Command Terminal Output

```typescript
import { 
  SUCCESS_ICON, 
  ERROR_ICON, 
  LOADING_ICON,
  createBox 
} from '@/constants/asciiArt';

const CommandOutput = ({ status, message }) => {
  const icon = status === 'success' ? SUCCESS_ICON : 
               status === 'error' ? ERROR_ICON : 
               LOADING_ICON;
  
  return (
    <div className="command-output">
      <span className={`icon ${status}`}>{icon}</span>
      <span className="message">{message}</span>
    </div>
  );
};
```

## Styling Recommendations

### CSS Classes

```css
/* Logo display */
.ascii-logo {
  font-family: 'Space Mono', monospace;
  color: var(--terminal-green);
  line-height: 1.2;
  white-space: pre;
}

/* Section headers */
.section-header {
  font-family: 'Space Mono', monospace;
  color: var(--terminal-green);
  text-align: center;
  white-space: pre;
  margin-bottom: 2rem;
}

/* File listings */
.file-entry {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.875rem;
  color: var(--terminal-text);
}

/* Tree structure */
.tree-output {
  font-family: 'IBM Plex Mono', monospace;
  line-height: 1.6;
  white-space: pre;
  color: var(--terminal-text);
}

/* Icons */
.icon.success {
  color: var(--success-green);
}

.icon.error {
  color: var(--error-red);
}

.icon.loading {
  color: var(--warning-yellow);
}
```

## Best Practices

1. **Responsive Design**: Use `getResponsiveLogo()` to automatically select appropriate logo size
2. **Monospace Fonts**: Always display ASCII art in monospace fonts (Space Mono, IBM Plex Mono)
3. **Preserve Whitespace**: Use `white-space: pre` to maintain ASCII art structure
4. **Color Scheme**: Use terminal green (#00FF00) for primary elements and white/light gray for text
5. **Line Height**: Use consistent line-height (1.2-1.6) for proper ASCII art alignment
6. **Accessibility**: Provide `aria-hidden="true"` on decorative ASCII art and actual text alternatives

## Testing

All ASCII art constants include comprehensive unit tests. Run tests with:

```bash
npm test src/constants/asciiArt.test.ts
```

Tests verify:
- All constants are properly exported
- Utility functions work correctly
- Box creation handles various inputs
- Tree formatting produces correct structure
- File listing formatting includes all elements

## Contributing

When adding new ASCII art elements:

1. Add the constant to `asciiArt.ts`
2. Export it in the `ASCII_ART` object
3. Add corresponding test in `asciiArt.test.ts`
4. Document usage in this guide
5. Ensure monospace font compatibility
6. Test on both light and dark terminal themes

## References

- **Requirements**: 1.5 (Terminal Visual Aesthetic - ASCII Art)
- **Design**: ASCII Art Elements section in design.md
- **File**: `src/constants/asciiArt.ts`
- **Tests**: `src/constants/asciiArt.test.ts`
