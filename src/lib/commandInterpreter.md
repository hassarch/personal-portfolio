# CommandInterpreter Module

## Overview

The `commandInterpreter` module provides Unix-like command parsing and execution functionality for the terminal portfolio interface. It processes user commands and returns results that include output text and optional navigation instructions.

## Architecture

### Core Types

#### `CommandResult`
```typescript
interface CommandResult {
  output: string | React.ReactNode;
  navigate?: string;
}
```
Result object returned by command execution. Contains output to display and optionally a section to navigate to.

#### `CommandHandler`
```typescript
type CommandHandler = (args: string[], currentSection: string) => CommandResult;
```
Function signature for all command handlers. Receives parsed arguments and current section, returns a CommandResult.

#### `Section`
```typescript
type Section = 'home' | 'about' | 'projects' | 'skills' | 'contact';
```
Valid portfolio sections that users can navigate to.

## Implemented Commands

### Standard Unix-like Commands

#### `help`
Displays a formatted list of all available commands with descriptions and examples.

**Usage:**
```bash
help
```

**Example Output:**
```
Available commands:

  help              - Display this help message
  ls [section]      - List available sections or section contents
  cd <section>      - Navigate to a section
  ...
```

#### `ls [section]`
Lists available sections or the contents of a specific section.

**Usage:**
```bash
ls                # List all sections
ls home           # List home directory contents
ls projects       # List projects directory contents
ls skills         # List skills directory contents
```

**Example Output:**
```
Available sections:

  home/
  about.txt
  projects/
  skills/
  contact.txt
  spotify/
```

#### `cd <section>`
Changes to a different section (navigates to that portfolio section).

**Usage:**
```bash
cd projects       # Navigate to projects section
cd about          # Navigate to about section
cd ~              # Navigate to home
cd ..             # Navigate to home
cd                # Navigate to home (no args)
```

**Special Paths:**
- `~` - Home directory
- `..` - Parent directory (home)
- `/home` - Absolute home path

#### `cat <file>`
Displays the contents of a file (navigates to corresponding section).

**Usage:**
```bash
cat about.txt     # Navigate to about section
cat contact.txt   # Navigate to contact section
cat readme.txt    # Navigate to home section
```

**File Mappings:**
- `about.txt` → about section
- `contact.txt` → contact section
- `readme.txt` / `readme` → home section

#### `pwd`
Prints the current working directory (section path).

**Usage:**
```bash
pwd
```

**Example Output:**
```
/home/portfolio/projects
```

#### `clear`
Clears the terminal output history.

**Usage:**
```bash
clear
```

**Returns:** Special marker `__CLEAR__` that the terminal component recognizes.

### Direct Navigation Commands

#### `home`
Directly navigates to the home section.

**Usage:**
```bash
home
```

#### `about`
Directly navigates to the about section.

**Usage:**
```bash
about
```

#### `projects`
Directly navigates to the projects section.

**Usage:**
```bash
projects
```

#### `skills`
Directly navigates to the skills section.

**Usage:**
```bash
skills
```

#### `contact`
Directly navigates to the contact section.

**Usage:**
```bash
contact
```

## API Reference

### `interpretCommand(input: string, currentSection?: string): CommandResult`

Main function that parses and executes commands.

**Parameters:**
- `input` - Raw command string from user input
- `currentSection` - Current section/directory (default: 'home')

**Returns:** `CommandResult` with output and optional navigation

**Example:**
```typescript
const result = interpretCommand('cd projects', 'home');
console.log(result.output);   // "Navigating to projects..."
console.log(result.navigate); // "projects"
```

### `getAvailableCommands(): string[]`

Returns an array of all available command names.

**Returns:** Array of command name strings

**Example:**
```typescript
const commands = getAvailableCommands();
// ['help', 'ls', 'cd', 'cat', 'pwd', 'clear', 'home', 'about', ...]
```

### `isValidCommand(cmd: string): boolean`

Checks if a command exists in the command registry.

**Parameters:**
- `cmd` - Command name to check

**Returns:** `true` if command exists, `false` otherwise

**Example:**
```typescript
isValidCommand('help');    // true
isValidCommand('invalid'); // false
```

## Error Handling

The module provides consistent error messages for various error conditions:

### Unknown Command
```bash
$ invalidcmd
bash: invalidcmd: command not found. Type 'help' for available commands.
```

### Invalid Section
```bash
$ cd invalid
cd: invalid: No such file or directory
```

### Invalid File
```bash
$ cat invalid.txt
cat: invalid.txt: No such file or directory
```

### Missing Operand
```bash
$ cat
cat: missing operand
Try 'cat --help' for more information.
```

## Command Parsing

### Case Insensitivity
All commands and arguments are converted to lowercase for comparison:
```bash
HELP      # Works
HeLp      # Works
cd HOME   # Navigates to home
CD HOME   # Also navigates to home
```

### Whitespace Handling
Multiple spaces, tabs, and mixed whitespace are handled correctly:
```bash
cd     projects    # Works
cd\t\tprojects    # Works
```

### Argument Parsing
Commands are split by whitespace using regex `/\s+/`:
```bash
ls projects extra  # 'ls' receives ['projects', 'extra']
```

## Integration with Terminal Components

### CommandTerminal Component
The CommandTerminal component uses `interpretCommand` to process user input:

```typescript
const handleCommand = (cmd: string) => {
  const result = interpretCommand(cmd, currentSection);
  
  // Handle clear command
  if (result.output === '__CLEAR__') {
    setHistory([]);
    return;
  }
  
  // Add to history
  setHistory([...history, {
    input: cmd,
    output: result.output,
    timestamp: new Date()
  }]);
  
  // Navigate if needed
  if (result.navigate) {
    onNavigate(result.navigate);
  }
};
```

### Navigation Handler
Navigation results trigger smooth scrolling to sections:

```typescript
const handleNavigate = (section: string) => {
  const element = document.getElementById(section);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
```

## Testing

The module includes comprehensive unit tests covering:

- ✅ All command functionality
- ✅ Error handling
- ✅ Case insensitivity
- ✅ Whitespace parsing
- ✅ Special path handling (`~`, `..`, `/home`)
- ✅ Valid and invalid inputs
- ✅ Command result structure
- ✅ Utility functions (`getAvailableCommands`, `isValidCommand`)

**Test Coverage:** 50 test cases, 100% pass rate

## Requirements Validation

This implementation validates the following requirements:

### Requirement 3: Functional Command Terminal
- ✅ 3.3 - help command displays available commands
- ✅ 3.4 - ls projects navigates to Projects section
- ✅ 3.5 - cat about.txt navigates to About section
- ✅ 3.6 - clear command clears terminal output
- ✅ 3.7 - Invalid commands display error messages

### Requirement 4: Command Navigation System
- ✅ 4.1 - ls command lists available sections
- ✅ 4.2 - cd <section> navigates to sections
- ✅ 4.3 - cat <file> displays section content
- ✅ 4.4 - pwd displays current section
- ✅ 4.5 - Direct navigation commands (home, about, projects, skills, contact)

## Design Patterns

### Command Pattern
Each command is implemented as a handler function with consistent signature:
```typescript
const commandHandler: CommandHandler = (args, currentSection) => {
  // Process command
  return { output, navigate };
};
```

### Factory Pattern
Navigation commands use a factory function:
```typescript
const createNavigationHandler = (section: Section): CommandHandler => 
  () => ({
    output: `Navigating to ${section}...`,
    navigate: section,
  });
```

### Registry Pattern
Commands are stored in a registry object for easy lookup:
```typescript
const commands: Record<string, CommandHandler> = {
  help: helpHandler,
  ls: lsHandler,
  // ...
};
```

## Future Enhancements

Potential additions for future versions:

1. **Command History**
   - Up/down arrow navigation
   - Persistent storage
   - History search

2. **Command Aliases**
   - `ll` for `ls -la`
   - `..` for `cd ..`
   - Custom user-defined aliases

3. **Tab Completion**
   - Auto-complete command names
   - Auto-complete section names
   - File name completion

4. **Command Flags**
   - `ls -l` for detailed listing
   - `cd --help` for command help
   - `cat --raw` for raw content

5. **Advanced Navigation**
   - `cd projects/project1` for nested navigation
   - `find` command for searching
   - `grep` command for content search

6. **Command Piping**
   - `ls | grep project`
   - Output redirection

## Performance Considerations

- **Command Parsing:** O(1) lookup in command registry
- **String Operations:** Minimal string manipulation
- **Memory:** Stateless design, no persistent storage in module
- **Navigation:** Deferred to consuming component

## Accessibility

The command interpreter supports keyboard-driven interaction, which is inherently accessible. Integration with the terminal component should ensure:

- ✅ Keyboard focus management
- ✅ Screen reader support for output
- ✅ Clear error messages
- ✅ Help command for discoverability

## License

Part of the Hassan Portfolio project. See project LICENSE for details.
