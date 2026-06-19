/**
 * Unit tests for CommandInterpreter module
 */

import { describe, it, expect } from 'vitest';
import {
  interpretCommand,
  getAvailableCommands,
  isValidCommand,
  type CommandResult,
} from './commandInterpreter';

describe('commandInterpreter', () => {
  describe('interpretCommand', () => {
    describe('help command', () => {
      it('should display help information', () => {
        const result = interpretCommand('help', 'home');
        expect(result.output).toContain('Available commands:');
        expect(result.output).toContain('help');
        expect(result.output).toContain('ls');
        expect(result.output).toContain('cd');
        expect(result.output).toContain('cat');
        expect(result.output).toContain('pwd');
        expect(result.output).toContain('clear');
        expect(result.navigate).toBeUndefined();
      });

      it('should be case-insensitive', () => {
        const result = interpretCommand('HELP', 'home');
        expect(result.output).toContain('Available commands:');
      });
    });

    describe('ls command', () => {
      it('should list all sections when no args provided', () => {
        const result = interpretCommand('ls', 'home');
        expect(result.output).toContain('home/');
        expect(result.output).toContain('about.txt');
        expect(result.output).toContain('projects/');
        expect(result.output).toContain('skills/');
        expect(result.output).toContain('contact.txt');
        expect(result.navigate).toBeUndefined();
      });

      it('should list home directory contents', () => {
        const result = interpretCommand('ls home', 'home');
        expect(result.output).toContain('about.txt');
        expect(result.output).toContain('projects/');
      });

      it('should list projects directory contents', () => {
        const result = interpretCommand('ls projects', 'home');
        expect(result.output).toContain('project_1/');
        expect(result.output).toContain('project_2/');
      });

      it('should list skills directory contents', () => {
        const result = interpretCommand('ls skills', 'home');
        expect(result.output).toContain('frontend/');
        expect(result.output).toContain('backend/');
        expect(result.output).toContain('tools/');
      });

      it('should return error for non-existent directory', () => {
        const result = interpretCommand('ls invalid', 'home');
        expect(result.output).toContain('cannot access');
        expect(result.output).toContain('invalid');
      });
    });

    describe('cd command', () => {
      it('should navigate to home when no args provided', () => {
        const result = interpretCommand('cd', 'projects');
        expect(result.output).toContain('Navigating to home');
        expect(result.navigate).toBe('home');
      });

      it('should navigate to valid section', () => {
        const result = interpretCommand('cd projects', 'home');
        expect(result.output).toContain('Navigating to projects');
        expect(result.navigate).toBe('projects');
      });

      it('should navigate to about section', () => {
        const result = interpretCommand('cd about', 'home');
        expect(result.navigate).toBe('about');
      });

      it('should navigate to skills section', () => {
        const result = interpretCommand('cd skills', 'home');
        expect(result.navigate).toBe('skills');
      });

      it('should navigate to contact section', () => {
        const result = interpretCommand('cd contact', 'home');
        expect(result.navigate).toBe('contact');
      });

      it('should handle ~ as home', () => {
        const result = interpretCommand('cd ~', 'projects');
        expect(result.navigate).toBe('home');
      });

      it('should handle .. as home', () => {
        const result = interpretCommand('cd ..', 'projects');
        expect(result.navigate).toBe('home');
      });

      it('should handle /home as home', () => {
        const result = interpretCommand('cd /home', 'projects');
        expect(result.navigate).toBe('home');
      });

      it('should return error for invalid section', () => {
        const result = interpretCommand('cd invalid', 'home');
        expect(result.output).toContain('No such file or directory');
        expect(result.navigate).toBeUndefined();
      });

      it('should be case-insensitive', () => {
        const result = interpretCommand('cd PROJECTS', 'home');
        expect(result.navigate).toBe('projects');
      });
    });

    describe('cat command', () => {
      it('should open about.txt and navigate to about', () => {
        const result = interpretCommand('cat about.txt', 'home');
        expect(result.output).toContain('Opening about.txt');
        expect(result.navigate).toBe('about');
      });

      it('should open contact.txt and navigate to contact', () => {
        const result = interpretCommand('cat contact.txt', 'home');
        expect(result.output).toContain('Opening contact.txt');
        expect(result.navigate).toBe('contact');
      });

      it('should open readme.txt and navigate to home', () => {
        const result = interpretCommand('cat readme.txt', 'home');
        expect(result.navigate).toBe('home');
      });

      it('should open readme and navigate to home', () => {
        const result = interpretCommand('cat readme', 'home');
        expect(result.navigate).toBe('home');
      });

      it('should return error for non-existent file', () => {
        const result = interpretCommand('cat invalid.txt', 'home');
        expect(result.output).toContain('No such file');
        expect(result.navigate).toBeUndefined();
      });

      it('should return error when no args provided', () => {
        const result = interpretCommand('cat', 'home');
        expect(result.output).toContain('missing operand');
      });

      it('should be case-insensitive for file names', () => {
        const result = interpretCommand('cat ABOUT.TXT', 'home');
        expect(result.navigate).toBe('about');
      });
    });

    describe('pwd command', () => {
      it('should display current section path', () => {
        const result = interpretCommand('pwd', 'home');
        expect(result.output).toBe('/home/portfolio/home');
        expect(result.navigate).toBeUndefined();
      });

      it('should display path for projects section', () => {
        const result = interpretCommand('pwd', 'projects');
        expect(result.output).toBe('/home/portfolio/projects');
      });

      it('should display path for about section', () => {
        const result = interpretCommand('pwd', 'about');
        expect(result.output).toBe('/home/portfolio/about');
      });
    });

    describe('clear command', () => {
      it('should return clear marker', () => {
        const result = interpretCommand('clear', 'home');
        expect(result.output).toBe('__CLEAR__');
        expect(result.navigate).toBeUndefined();
      });
    });

    describe('direct navigation commands', () => {
      it('should navigate to home', () => {
        const result = interpretCommand('home', 'projects');
        expect(result.output).toContain('Navigating to home');
        expect(result.navigate).toBe('home');
      });

      it('should navigate to about', () => {
        const result = interpretCommand('about', 'home');
        expect(result.output).toContain('Navigating to about');
        expect(result.navigate).toBe('about');
      });

      it('should navigate to projects', () => {
        const result = interpretCommand('projects', 'home');
        expect(result.output).toContain('Navigating to projects');
        expect(result.navigate).toBe('projects');
      });

      it('should navigate to skills', () => {
        const result = interpretCommand('skills', 'home');
        expect(result.output).toContain('Navigating to skills');
        expect(result.navigate).toBe('skills');
      });

      it('should navigate to contact', () => {
        const result = interpretCommand('contact', 'home');
        expect(result.output).toContain('Navigating to contact');
        expect(result.navigate).toBe('contact');
      });
    });

    describe('error handling', () => {
      it('should return error for unknown command', () => {
        const result = interpretCommand('invalid', 'home');
        expect(result.output).toContain('command not found');
        expect(result.output).toContain("Type 'help'");
        expect(result.navigate).toBeUndefined();
      });

      it('should handle empty input', () => {
        const result = interpretCommand('', 'home');
        expect(result.output).toBe('');
        expect(result.navigate).toBeUndefined();
      });

      it('should handle whitespace-only input', () => {
        const result = interpretCommand('   ', 'home');
        expect(result.output).toBe('');
        expect(result.navigate).toBeUndefined();
      });

      it('should preserve command case in error messages', () => {
        const result = interpretCommand('InvalidCommand', 'home');
        expect(result.output).toContain('InvalidCommand');
      });
    });

    describe('command parsing', () => {
      it('should handle multiple spaces between command and args', () => {
        const result = interpretCommand('cd     projects', 'home');
        expect(result.navigate).toBe('projects');
      });

      it('should handle tabs and mixed whitespace', () => {
        const result = interpretCommand('cd\t\tprojects', 'home');
        expect(result.navigate).toBe('projects');
      });

      it('should handle multiple arguments', () => {
        const result = interpretCommand('ls projects extra', 'home');
        // Should still process first arg
        expect(result.output).toContain('project_');
      });
    });
  });

  describe('getAvailableCommands', () => {
    it('should return array of command names', () => {
      const commands = getAvailableCommands();
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
    });

    it('should include all standard commands', () => {
      const commands = getAvailableCommands();
      expect(commands).toContain('help');
      expect(commands).toContain('ls');
      expect(commands).toContain('cd');
      expect(commands).toContain('cat');
      expect(commands).toContain('pwd');
      expect(commands).toContain('clear');
    });

    it('should include all navigation commands', () => {
      const commands = getAvailableCommands();
      expect(commands).toContain('home');
      expect(commands).toContain('about');
      expect(commands).toContain('projects');
      expect(commands).toContain('skills');
      expect(commands).toContain('contact');
    });
  });

  describe('isValidCommand', () => {
    it('should return true for valid commands', () => {
      expect(isValidCommand('help')).toBe(true);
      expect(isValidCommand('ls')).toBe(true);
      expect(isValidCommand('cd')).toBe(true);
      expect(isValidCommand('cat')).toBe(true);
      expect(isValidCommand('pwd')).toBe(true);
      expect(isValidCommand('clear')).toBe(true);
    });

    it('should return true for navigation commands', () => {
      expect(isValidCommand('home')).toBe(true);
      expect(isValidCommand('about')).toBe(true);
      expect(isValidCommand('projects')).toBe(true);
      expect(isValidCommand('skills')).toBe(true);
      expect(isValidCommand('contact')).toBe(true);
    });

    it('should return false for invalid commands', () => {
      expect(isValidCommand('invalid')).toBe(false);
      expect(isValidCommand('notacommand')).toBe(false);
      expect(isValidCommand('')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isValidCommand('HELP')).toBe(true);
      expect(isValidCommand('Help')).toBe(true);
      expect(isValidCommand('HeLp')).toBe(true);
    });
  });

  describe('command result structure', () => {
    it('should always return an object with output property', () => {
      const result = interpretCommand('help', 'home');
      expect(result).toHaveProperty('output');
      expect(typeof result.output === 'string' || result.output === undefined).toBe(true);
    });

    it('should include navigate property when navigation occurs', () => {
      const result = interpretCommand('cd projects', 'home');
      expect(result).toHaveProperty('navigate');
      expect(result.navigate).toBe('projects');
    });

    it('should not include navigate property when no navigation occurs', () => {
      const result = interpretCommand('help', 'home');
      expect(result.navigate).toBeUndefined();
    });
  });
});
