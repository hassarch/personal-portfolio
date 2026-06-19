/**
 * Command Interpreter Module
 * 
 * Processes user commands and returns results for the terminal interface.
 * Implements standard Unix-like commands and custom navigation commands.
 * 
 * @module commandInterpreter
 */

/**
 * Result of a command execution
 */
export interface CommandResult {
  /** The output text or React node to display */
  output: string | React.ReactNode;
  /** Optional section to navigate to */
  navigate?: string;
}

/**
 * Function signature for command handlers
 */
export type CommandHandler = (args: string[], currentSection: string) => CommandResult;

/**
 * Map of available sections in the portfolio
 */
const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'] as const;
export type Section = typeof SECTIONS[number];

/**
 * File mappings for cat command
 */
const FILE_MAP: Record<string, Section> = {
  'about.txt': 'about',
  'contact.txt': 'contact',
  'readme.txt': 'home',
  'readme': 'home',
};

/**
 * Error message generators
 */
const errors = {
  unknownCommand: (cmd: string) => 
    `bash: ${cmd}: command not found. Type 'help' for available commands.`,
  noSuchSection: (section: string) => 
    `cd: ${section}: No such file or directory`,
  noSuchFile: (file: string) => 
    `cat: ${file}: No such file or directory`,
  missingOperand: (cmd: string) => 
    `${cmd}: missing operand\nTry '${cmd} --help' for more information.`,
};

/**
 * Command handler: help
 * Displays available commands and their descriptions
 */
const helpHandler: CommandHandler = () => ({
  output: `Available commands:

  help              - Display this help message
  ls [section]      - List available sections or section contents
  cd <section>      - Navigate to a section
  cat <file>        - Display section content
  pwd               - Print current section
  clear             - Clear terminal output
  
  about             - Navigate to About section
  projects          - Navigate to Projects section
  skills            - Navigate to Skills section
  contact           - Navigate to Contact section
  home              - Navigate to Home section

Examples:
  ls                - List all sections
  cd projects       - Go to projects section
  cat about.txt     - Show about section content
  pwd               - Show current location`,
});

/**
 * Command handler: ls
 * Lists available sections or section contents
 */
const lsHandler: CommandHandler = (args) => {
  if (args.length === 0) {
    return {
      output: `Available sections:

  home/
  about.txt
  projects/
  skills/
  contact.txt
  spotify/
  
Use 'cd <section>' to navigate or 'cat <file>' to view content.`,
    };
  }

  const section = args[0].toLowerCase();
  
  // Handle specific section listings
  switch (section) {
    case 'home':
      return {
        output: `home/:
  about.txt
  projects/
  skills/
  contact.txt`,
      };
    case 'projects':
      return {
        output: `projects/:
  project_1/
  project_2/
  project_3/
  README.md`,
      };
    case 'skills':
      return {
        output: `skills/:
  frontend/
  backend/
  tools/
  learning/`,
      };
    default:
      return {
        output: `ls: cannot access '${section}': No such file or directory`,
      };
  }
};

/**
 * Command handler: cd
 * Navigates to a specified section
 */
const cdHandler: CommandHandler = (args) => {
  if (args.length === 0) {
    return {
      output: 'Navigating to home...',
      navigate: 'home',
    };
  }

  const section = args[0].toLowerCase();
  
  // Handle special cases
  if (section === '~' || section === '/home' || section === '..') {
    return {
      output: 'Navigating to home...',
      navigate: 'home',
    };
  }

  // Check if section exists
  if (!SECTIONS.includes(section as Section)) {
    return {
      output: errors.noSuchSection(section),
    };
  }

  return {
    output: `Navigating to ${section}...`,
    navigate: section,
  };
};

/**
 * Command handler: cat
 * Displays content of a file (navigates to section)
 */
const catHandler: CommandHandler = (args) => {
  if (args.length === 0) {
    return {
      output: errors.missingOperand('cat'),
    };
  }

  const file = args[0].toLowerCase();
  const section = FILE_MAP[file];

  if (!section) {
    return {
      output: errors.noSuchFile(file),
    };
  }

  return {
    output: `Opening ${file}...`,
    navigate: section,
  };
};

/**
 * Command handler: pwd
 * Prints the current working directory (section)
 */
const pwdHandler: CommandHandler = (_, currentSection) => ({
  output: `/home/portfolio/${currentSection}`,
});

/**
 * Command handler: clear
 * Clears the terminal output
 */
const clearHandler: CommandHandler = () => ({
  output: '__CLEAR__', // Special marker for clearing history
});

/**
 * Navigation command handler factory
 * Creates handlers for direct navigation commands
 */
const createNavigationHandler = (section: Section): CommandHandler => () => ({
  output: `Navigating to ${section}...`,
  navigate: section,
});

/**
 * Command registry
 * Maps command names to their handlers
 */
const commands: Record<string, CommandHandler> = {
  // Standard Unix-like commands
  help: helpHandler,
  ls: lsHandler,
  cd: cdHandler,
  cat: catHandler,
  pwd: pwdHandler,
  clear: clearHandler,
  
  // Direct navigation commands
  home: createNavigationHandler('home'),
  about: createNavigationHandler('about'),
  projects: createNavigationHandler('projects'),
  skills: createNavigationHandler('skills'),
  contact: createNavigationHandler('contact'),
};

/**
 * Interprets and executes a command string
 * 
 * @param input - The raw command input string
 * @param currentSection - The current section/directory
 * @returns CommandResult with output and optional navigation
 * 
 * @example
 * ```typescript
 * const result = interpretCommand('ls', 'home');
 * console.log(result.output); // Lists available sections
 * ```
 */
export const interpretCommand = (
  input: string,
  currentSection: string = 'home'
): CommandResult => {
  const trimmed = input.trim();
  
  // Empty input
  if (!trimmed) {
    return { output: '' };
  }

  // Parse command and arguments
  const [cmd, ...args] = trimmed.split(/\s+/);
  const command = cmd.toLowerCase();
  
  // Get command handler
  const handler = commands[command];

  if (!handler) {
    return {
      output: errors.unknownCommand(cmd),
    };
  }

  // Execute command
  return handler(args, currentSection);
};

/**
 * Get list of all available command names
 * @returns Array of command names
 */
export const getAvailableCommands = (): string[] => {
  return Object.keys(commands);
};

/**
 * Check if a command exists
 * @param cmd - Command name to check
 * @returns true if command exists
 */
export const isValidCommand = (cmd: string): boolean => {
  return cmd.toLowerCase() in commands;
};
