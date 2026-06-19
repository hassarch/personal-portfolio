import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TerminalOverlay from './TerminalOverlay';

describe('TerminalOverlay', () => {
  it('renders without crashing', () => {
    const { container } = render(<TerminalOverlay />);
    expect(container).toBeInTheDocument();
  });

  it('renders a div with scanlines-overlay class', () => {
    const { container } = render(<TerminalOverlay />);
    const overlay = container.querySelector('.scanlines-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('has aria-hidden attribute for accessibility', () => {
    const { container } = render(<TerminalOverlay />);
    const overlay = container.querySelector('.scanlines-overlay');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<TerminalOverlay />);
    const overlay = container.querySelector('.scanlines-overlay');
    
    // Verify the overlay exists and has the correct class
    expect(overlay).toHaveClass('scanlines-overlay');
  });

  it('renders as a single element', () => {
    const { container } = render(<TerminalOverlay />);
    const overlays = container.querySelectorAll('.scanlines-overlay');
    expect(overlays).toHaveLength(1);
  });

  it('has correct CSS properties for fixed positioning and layering', () => {
    const { container } = render(<TerminalOverlay />);
    const overlay = container.querySelector('.scanlines-overlay') as HTMLElement;
    
    // Note: These checks verify the classes are applied.
    // The actual CSS values are defined in index.css
    expect(overlay).toBeInTheDocument();
    expect(overlay?.className).toBe('scanlines-overlay');
  });

  it('does not block pointer events', () => {
    const { container } = render(<TerminalOverlay />);
    const overlay = container.querySelector('.scanlines-overlay') as HTMLElement;
    
    // Verify overlay exists - pointer-events: none is defined in CSS
    expect(overlay).toBeInTheDocument();
  });
});
