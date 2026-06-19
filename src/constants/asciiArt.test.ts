/**
 * Unit tests for ASCII Art constants
 * 
 * **Validates: Requirements 1.5**
 * 
 * These tests verify that ASCII art assets are properly defined and utility functions
 * work correctly for terminal-themed portfolio display.
 */

import { describe, it, expect } from 'vitest';
import {
  PORTFOLIO_LOGO,
  PORTFOLIO_LOGO_COMPACT,
  SECTION_DIVIDER_HEAVY,
  SECTION_DIVIDER_LIGHT,
  SECTION_DIVIDER_DASHED,
  SECTION_DIVIDER_DOUBLE,
  BOOT_BOX,
  BOOT_MESSAGES,
  HELP_HEADER,
  ABOUT_HEADER,
  PROJECTS_HEADER,
  SKILLS_HEADER,
  CONTACT_HEADER,
  WELCOME_BANNER,
  getResponsiveLogo,
  formatFileListingLine,
  formatTreeItem,
  createBox,
  TREE_BRANCH,
  TREE_BRANCH_LAST,
  PROJECT_PREFIX,
  SUCCESS_ICON,
  ERROR_ICON,
  ASCII_ART,
} from './asciiArt';

describe('ASCII Art Constants', () => {
  describe('Logo Assets', () => {
    it('should export main portfolio logo', () => {
      expect(PORTFOLIO_LOGO).toBeDefined();
      expect(typeof PORTFOLIO_LOGO).toBe('string');
      expect(PORTFOLIO_LOGO.length).toBeGreaterThan(0);
    });

    it('should export compact portfolio logo', () => {
      expect(PORTFOLIO_LOGO_COMPACT).toBeDefined();
      expect(typeof PORTFOLIO_LOGO_COMPACT).toBe('string');
      expect(PORTFOLIO_LOGO_COMPACT.length).toBeGreaterThan(0);
    });

    it('should have compact logo shorter than main logo', () => {
      expect(PORTFOLIO_LOGO_COMPACT.length).toBeLessThan(PORTFOLIO_LOGO.length);
    });
  });

  describe('Section Dividers', () => {
    it('should export heavy section divider', () => {
      expect(SECTION_DIVIDER_HEAVY).toBeDefined();
      expect(SECTION_DIVIDER_HEAVY).toContain('═');
    });

    it('should export light section divider', () => {
      expect(SECTION_DIVIDER_LIGHT).toBeDefined();
      expect(SECTION_DIVIDER_LIGHT).toContain('─');
    });

    it('should export dashed section divider', () => {
      expect(SECTION_DIVIDER_DASHED).toBeDefined();
      expect(SECTION_DIVIDER_DASHED).toContain('-');
    });

    it('should export double line section divider', () => {
      expect(SECTION_DIVIDER_DOUBLE).toBeDefined();
      expect(SECTION_DIVIDER_DOUBLE).toContain('╔');
      expect(SECTION_DIVIDER_DOUBLE).toContain('╚');
    });
  });

  describe('Boot Sequence Assets', () => {
    it('should export boot box', () => {
      expect(BOOT_BOX).toBeDefined();
      expect(BOOT_BOX).toContain('SYSTEM INITIALIZING');
    });

    it('should export boot messages array', () => {
      expect(BOOT_MESSAGES).toBeDefined();
      expect(Array.isArray(BOOT_MESSAGES)).toBe(true);
      expect(BOOT_MESSAGES.length).toBeGreaterThan(0);
    });

    it('should have sequential boot messages', () => {
      expect(BOOT_MESSAGES).toContain('Initializing portfolio system...');
      expect(BOOT_MESSAGES).toContain('System ready.');
      expect(BOOT_MESSAGES).toContain('Welcome.');
    });
  });

  describe('Section Headers', () => {
    it('should export help header', () => {
      expect(HELP_HEADER).toBeDefined();
      expect(HELP_HEADER).toContain('AVAILABLE COMMANDS');
    });

    it('should export about header', () => {
      expect(ABOUT_HEADER).toBeDefined();
      expect(typeof ABOUT_HEADER).toBe('string');
    });

    it('should export projects header', () => {
      expect(PROJECTS_HEADER).toBeDefined();
      expect(typeof PROJECTS_HEADER).toBe('string');
    });

    it('should export skills header', () => {
      expect(SKILLS_HEADER).toBeDefined();
      expect(typeof SKILLS_HEADER).toBe('string');
    });

    it('should export contact header', () => {
      expect(CONTACT_HEADER).toBeDefined();
      expect(typeof CONTACT_HEADER).toBe('string');
    });
  });

  describe('Welcome Banner', () => {
    it('should export welcome banner', () => {
      expect(WELCOME_BANNER).toBeDefined();
      expect(WELCOME_BANNER).toContain('W E L C O M E');
      expect(WELCOME_BANNER).toContain('P O R T F O L I O');
    });
  });

  describe('Icon Constants', () => {
    it('should export success icon', () => {
      expect(SUCCESS_ICON).toBeDefined();
      expect(SUCCESS_ICON).toContain('✓');
    });

    it('should export error icon', () => {
      expect(ERROR_ICON).toBeDefined();
      expect(ERROR_ICON).toContain('✗');
    });
  });

  describe('Project Listing Constants', () => {
    it('should export project prefix', () => {
      expect(PROJECT_PREFIX).toBeDefined();
      expect(PROJECT_PREFIX).toContain('drwxr-xr-x');
    });
  });

  describe('Tree Structure Constants', () => {
    it('should export tree branch', () => {
      expect(TREE_BRANCH).toBeDefined();
      expect(TREE_BRANCH).toBe('├──');
    });

    it('should export tree branch last', () => {
      expect(TREE_BRANCH_LAST).toBeDefined();
      expect(TREE_BRANCH_LAST).toBe('└──');
    });
  });

  describe('Utility Functions', () => {
    describe('getResponsiveLogo', () => {
      it('should return compact logo for small screens', () => {
        const logo = getResponsiveLogo(true);
        expect(logo).toBe(PORTFOLIO_LOGO_COMPACT);
      });

      it('should return full logo for large screens', () => {
        const logo = getResponsiveLogo(false);
        expect(logo).toBe(PORTFOLIO_LOGO);
      });
    });

    describe('formatFileListingLine', () => {
      it('should format file listing with proper spacing', () => {
        const result = formatFileListingLine(
          'drwxr-xr-x',
          'hassan',
          '2024-01-15',
          'project-name/'
        );
        
        expect(result).toContain('drwxr-xr-x');
        expect(result).toContain('hassan');
        expect(result).toContain('2024-01-15');
        expect(result).toContain('project-name/');
      });

      it('should separate elements with proper spacing', () => {
        const result = formatFileListingLine('perm', 'user', 'date', 'name');
        const parts = result.split('  ');
        expect(parts.length).toBeGreaterThanOrEqual(4);
      });
    });

    describe('formatTreeItem', () => {
      it('should format tree item with branch for non-last items', () => {
        const result = formatTreeItem(false, 0, 'item-name');
        expect(result).toContain(TREE_BRANCH);
        expect(result).toContain('item-name');
      });

      it('should format tree item with last branch for last items', () => {
        const result = formatTreeItem(true, 0, 'last-item');
        expect(result).toContain(TREE_BRANCH_LAST);
        expect(result).toContain('last-item');
      });

      it('should indent based on depth', () => {
        const depth0 = formatTreeItem(false, 0, 'item');
        const depth1 = formatTreeItem(false, 1, 'item');
        const depth2 = formatTreeItem(false, 2, 'item');
        
        expect(depth1.length).toBeGreaterThan(depth0.length);
        expect(depth2.length).toBeGreaterThan(depth1.length);
      });
    });

    describe('createBox', () => {
      it('should create a box around single line text', () => {
        const result = createBox('Hello');
        expect(result).toContain('Hello');
        expect(result).toContain('┌');
        expect(result).toContain('┐');
        expect(result).toContain('└');
        expect(result).toContain('┘');
      });

      it('should create a box around multi-line text', () => {
        const result = createBox('Line 1\nLine 2\nLine 3');
        expect(result).toContain('Line 1');
        expect(result).toContain('Line 2');
        expect(result).toContain('Line 3');
      });

      it('should use single border style by default', () => {
        const result = createBox('Test');
        expect(result).toContain('┌');
        expect(result).toContain('─');
      });

      it('should use double border style when specified', () => {
        const result = createBox('Test', 60, 'double');
        expect(result).toContain('╔');
        expect(result).toContain('═');
      });

      it('should respect custom width parameter', () => {
        const result = createBox('Test', 80, 'single');
        const lines = result.split('\n');
        // All lines should have similar length based on width
        expect(lines[0].length).toBeGreaterThanOrEqual(80);
      });
    });
  });

  describe('ASCII_ART Export Object', () => {
    it('should export all constants in a single object', () => {
      expect(ASCII_ART).toBeDefined();
      expect(typeof ASCII_ART).toBe('object');
    });

    it('should include all major constants', () => {
      expect(ASCII_ART.PORTFOLIO_LOGO).toBe(PORTFOLIO_LOGO);
      expect(ASCII_ART.PORTFOLIO_LOGO_COMPACT).toBe(PORTFOLIO_LOGO_COMPACT);
      expect(ASCII_ART.SECTION_DIVIDER_HEAVY).toBe(SECTION_DIVIDER_HEAVY);
      expect(ASCII_ART.BOOT_MESSAGES).toBe(BOOT_MESSAGES);
    });

    it('should include all utility functions', () => {
      expect(typeof ASCII_ART.getResponsiveLogo).toBe('function');
      expect(typeof ASCII_ART.formatFileListingLine).toBe('function');
      expect(typeof ASCII_ART.formatTreeItem).toBe('function');
      expect(typeof ASCII_ART.createBox).toBe('function');
    });
  });
});
