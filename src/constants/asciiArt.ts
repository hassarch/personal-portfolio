/**
 * ASCII Art Assets for Terminal Portfolio
 * 
 * This file contains all ASCII art elements used throughout the terminal-themed portfolio.
 * These include the main logo, section dividers, and decorative elements.
 */

/**
 * Main portfolio logo for boot sequence and hero section
 */
export const PORTFOLIO_LOGO = `
 _   _    _    ____  ____    _    _   _ 
| | | |  / \\  / ___|/ ___|  / \\  | \\ | |
| |_| | / _ \\ \\___ \\\\___ \\ / _ \\ |  \\| |
|  _  |/ ___ \\ ___) |___) / ___ \\| |\\  |
|_| |_/_/   \\_\\____/|____/_/   \\_\\_| \\_|
`;

/**
 * Alternative compact logo for smaller screens
 */
export const PORTFOLIO_LOGO_COMPACT = `
 _  _   _   ___ ___  _   _  _ 
| || | / _ \\/ __/ __|| _ | || |
| __ |/ ___ \\__ \\__ \\| _|| || |
|_||_/_/   \\_\\__/|__/|_| |_||_|
`;

/**
 * Terminal window header decoration
 */
export const TERMINAL_HEADER = `
┌────────────────────────────────────────────────────────┐
│ ● ● ●  TERMINAL                                        │
└────────────────────────────────────────────────────────┘
`;

/**
 * Section divider - Heavy line
 */
export const SECTION_DIVIDER_HEAVY = `
═══════════════════════════════════════════════════════════════════════════════
`;

/**
 * Section divider - Light line
 */
export const SECTION_DIVIDER_LIGHT = `
───────────────────────────────────────────────────────────────────────────────
`;

/**
 * Section divider - Dashed line
 */
export const SECTION_DIVIDER_DASHED = `
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
`;

/**
 * Section divider - Double line
 */
export const SECTION_DIVIDER_DOUBLE = `
╔═══════════════════════════════════════════════════════════════════════════╗
╚═══════════════════════════════════════════════════════════════════════════╝
`;

/**
 * Boot sequence system box
 */
export const BOOT_BOX = `
┌─────────────────────────────────────────────────────────┐
│                  SYSTEM INITIALIZING                    │
└─────────────────────────────────────────────────────────┘
`;

/**
 * Success indicator
 */
export const SUCCESS_ICON = `[✓]`;

/**
 * Error indicator
 */
export const ERROR_ICON = `[✗]`;

/**
 * Loading indicator
 */
export const LOADING_ICON = `[...]`;

/**
 * File icon for directory listings
 */
export const FILE_ICON = `📄`;

/**
 * Folder icon for directory listings
 */
export const FOLDER_ICON = `📁`;

/**
 * Command prompt arrow
 */
export const PROMPT_ARROW = `>`;

/**
 * Welcome banner for hero section
 */
export const WELCOME_BANNER = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              W E L C O M E   T O   M Y                     ║
║           P O R T F O L I O   T E R M I N A L             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`;

/**
 * Code brackets decoration
 */
export const CODE_BRACKETS = `< / >`;

/**
 * Terminal cursor
 */
export const CURSOR = `█`;

/**
 * Alternative cursor (blinking style)
 */
export const CURSOR_BLINK = `_`;

/**
 * Directory tree branch characters
 */
export const TREE_BRANCH = `├──`;
export const TREE_BRANCH_LAST = `└──`;
export const TREE_VERTICAL = `│`;
export const TREE_SPACE = `    `;

/**
 * Project listing decoration
 */
export const PROJECT_PREFIX = `drwxr-xr-x`;

/**
 * Comment prefix for file listings
 */
export const COMMENT_PREFIX = `#`;

/**
 * Command history prefix
 */
export const HISTORY_PREFIX = `$`;

/**
 * System message box
 */
export const SYSTEM_MESSAGE_BOX = (message: string) => `
┌─────────────────────────────────────────────────────────┐
│ ${message.padEnd(55)} │
└─────────────────────────────────────────────────────────┘
`;

/**
 * Error box for terminal errors
 */
export const ERROR_BOX = (error: string) => `
╔═════════════════════════════════════════════════════════╗
║ ERROR: ${error.padEnd(49)} ║
╚═════════════════════════════════════════════════════════╝
`;

/**
 * Boot sequence messages
 */
export const BOOT_MESSAGES = [
  'Initializing portfolio system...',
  'Loading user modules...',
  'Establishing connections...',
  'Mounting components...',
  'System ready.',
  'Welcome.'
];

/**
 * Help command ASCII decoration
 */
export const HELP_HEADER = `
╔═══════════════════════════════════════════════════════════════╗
║                     AVAILABLE COMMANDS                        ║
╚═══════════════════════════════════════════════════════════════╝
`;

/**
 * About section decoration
 */
export const ABOUT_HEADER = `
    _    ____   ___  _   _ _____ 
   / \\  | __ ) / _ \\| | | |_   _|
  / _ \\ |  _ \\| | | | | | | | |  
 / ___ \\| |_) | |_| | |_| | | |  
/_/   \\_\\____/ \\___/ \\___/  |_|  
`;

/**
 * Projects section decoration
 */
export const PROJECTS_HEADER = `
 ____  ____   ___       _ _____ ____ _____ ____  
|  _ \\|  _ \\ / _ \\     | | ____/ ___|_   _/ ___| 
| |_) | |_) | | | |_   | |  _|| |     | | \\___ \\ 
|  __/|  _ <| |_| | |__| | |__| |___  | |  ___) |
|_|   |_| \\_\\\\___/ \\____/|_____\\____| |_| |____/ 
`;

/**
 * Skills section decoration
 */
export const SKILLS_HEADER = `
 ____  _  _____ _     _     ____  
/ ___|| |/ /_ _| |   | |   / ___| 
\\___ \\| ' / | || |   | |   \\___ \\ 
 ___) | . \\ | || |___| |___ ___) |
|____/|_|\\_\\___|_____|_____|____/ 
`;

/**
 * Contact section decoration
 */
export const CONTACT_HEADER = `
  ____ ___  _   _ _____  _    ____ _____ 
 / ___/ _ \\| \\ | |_   _|/ \\  / ___|_   _|
| |  | | | |  \\| | | | / _ \\| |     | |  
| |__| |_| | |\\  | | |/ ___ \\ |___  | |  
 \\____\\___/|_| \\_| |_/_/   \\_\\____| |_|  
`;

/**
 * Responsive ASCII art helper - returns appropriate logo based on screen size
 */
export const getResponsiveLogo = (isSmallScreen: boolean): string => {
  return isSmallScreen ? PORTFOLIO_LOGO_COMPACT : PORTFOLIO_LOGO;
};

/**
 * Format file listing line for projects
 */
export const formatFileListingLine = (
  permissions: string,
  owner: string,
  date: string,
  name: string
): string => {
  return `${permissions}  ${owner}  ${date}  ${name}`;
};

/**
 * Format directory tree item
 */
export const formatTreeItem = (
  isLast: boolean,
  depth: number,
  name: string
): string => {
  const indent = TREE_SPACE.repeat(depth);
  const branch = isLast ? TREE_BRANCH_LAST : TREE_BRANCH;
  return `${indent}${branch} ${name}`;
};

/**
 * Create a bordered box around text
 */
export const createBox = (
  content: string,
  width: number = 60,
  style: 'single' | 'double' = 'single'
): string => {
  const lines = content.split('\n');
  const maxLineLength = Math.max(...lines.map((line) => line.length), width);

  const topLeft = style === 'double' ? '╔' : '┌';
  const topRight = style === 'double' ? '╗' : '┐';
  const bottomLeft = style === 'double' ? '╚' : '└';
  const bottomRight = style === 'double' ? '╝' : '┘';
  const horizontal = style === 'double' ? '═' : '─';
  const vertical = style === 'double' ? '║' : '│';

  const top = topLeft + horizontal.repeat(maxLineLength + 2) + topRight;
  const bottom = bottomLeft + horizontal.repeat(maxLineLength + 2) + bottomRight;

  const paddedLines = lines.map(
    (line) => `${vertical} ${line.padEnd(maxLineLength)} ${vertical}`
  );

  return [top, ...paddedLines, bottom].join('\n');
};

/**
 * Export all ASCII art as a single object for easy importing
 */
export const ASCII_ART = {
  PORTFOLIO_LOGO,
  PORTFOLIO_LOGO_COMPACT,
  TERMINAL_HEADER,
  SECTION_DIVIDER_HEAVY,
  SECTION_DIVIDER_LIGHT,
  SECTION_DIVIDER_DASHED,
  SECTION_DIVIDER_DOUBLE,
  BOOT_BOX,
  SUCCESS_ICON,
  ERROR_ICON,
  LOADING_ICON,
  FILE_ICON,
  FOLDER_ICON,
  PROMPT_ARROW,
  WELCOME_BANNER,
  CODE_BRACKETS,
  CURSOR,
  CURSOR_BLINK,
  TREE_BRANCH,
  TREE_BRANCH_LAST,
  TREE_VERTICAL,
  TREE_SPACE,
  PROJECT_PREFIX,
  COMMENT_PREFIX,
  HISTORY_PREFIX,
  BOOT_MESSAGES,
  HELP_HEADER,
  ABOUT_HEADER,
  PROJECTS_HEADER,
  SKILLS_HEADER,
  CONTACT_HEADER,
  getResponsiveLogo,
  formatFileListingLine,
  formatTreeItem,
  createBox,
  SYSTEM_MESSAGE_BOX,
  ERROR_BOX,
};

export default ASCII_ART;
