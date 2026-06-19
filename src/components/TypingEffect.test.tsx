import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import TypingEffect from './TypingEffect';

describe('TypingEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with blinking cursor by default', () => {
    const { container } = render(<TypingEffect text="Hello" />);
    
    const cursor = container.querySelector('.terminal-cursor');
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass('animate-blink');
    expect(cursor).toHaveTextContent('_');
  });

  it('hides cursor when showCursor is false', () => {
    const { container } = render(<TypingEffect text="Hello" showCursor={false} />);
    
    const cursor = container.querySelector('.terminal-cursor');
    expect(cursor).not.toBeInTheDocument();
  });

  it('displays text character by character', () => {
    const { container } = render(<TypingEffect text="Hello" speed={10} />);
    
    // Initially should be empty
    expect(container.querySelector('.typing-text')?.textContent).toBe('_');
    
    // After first interval
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('H');
    
    // After second interval
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('He');
    
    // After third interval
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('Hel');
    
    // After fourth interval
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('Hell');
    
    // After fifth interval - complete
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('Hello');
  });

  it('uses default speed of 30ms when not specified', () => {
    const { container } = render(<TypingEffect text="Hi" />);
    
    // Should not have typed yet at 29ms
    act(() => {
      vi.advanceTimersByTime(29);
    });
    expect(container.querySelector('.typing-text')?.textContent).toBe('_');
    
    // Should have typed first character at 30ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(container.textContent).toContain('H');
  });

  it('respects custom speed parameter', () => {
    const { container } = render(<TypingEffect text="Hi" speed={50} />);
    
    // Should not have typed yet at 49ms
    act(() => {
      vi.advanceTimersByTime(49);
    });
    expect(container.querySelector('.typing-text')?.textContent).toBe('_');
    
    // Should have typed first character at 50ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(container.textContent).toContain('H');
  });

  it('calls onComplete callback when typing finishes', () => {
    const onComplete = vi.fn();
    render(<TypingEffect text="Hi" speed={10} onComplete={onComplete} />);
    
    // Complete should not be called yet
    expect(onComplete).not.toHaveBeenCalled();
    
    // Type first character
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(onComplete).not.toHaveBeenCalled();
    
    // Type second character
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(onComplete).not.toHaveBeenCalled();
    
    // One more tick to trigger completion
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not call onComplete if callback is not provided', () => {
    const { container } = render(<TypingEffect text="Hi" speed={10} />);
    
    // Type all characters
    act(() => {
      vi.advanceTimersByTime(20);
    });
    
    // Should complete without errors
    expect(container.textContent).toContain('Hi');
  });

  it('resets and restarts typing when text prop changes', () => {
    const { container, rerender } = render(<TypingEffect text="Hello" speed={10} />);
    
    // Type part of first text
    act(() => {
      vi.advanceTimersByTime(30);
    });
    expect(container.textContent).toContain('Hel');
    
    // Change text
    rerender(<TypingEffect text="World" speed={10} />);
    
    // Should reset and start typing new text
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('W');
    expect(container.textContent).not.toContain('Hel');
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<TypingEffect text="Hello" speed={10} />);
    
    // Start typing
    act(() => {
      vi.advanceTimersByTime(20);
    });
    
    // Unmount
    unmount();
    
    // Advance time - should not cause errors
    act(() => {
      vi.advanceTimersByTime(100);
    });
  });

  it('handles empty string', () => {
    const onComplete = vi.fn();
    const { container } = render(<TypingEffect text="" speed={10} onComplete={onComplete} />);
    
    // With empty string, should complete immediately
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.typing-text')?.textContent).toBe('_');
  });

  it('handles single character', () => {
    const { container } = render(<TypingEffect text="A" speed={10} />);
    
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(container.textContent).toContain('A');
  });

  it('handles long text', () => {
    const longText = 'This is a very long text to test the typing effect with multiple words and sentences.';
    const { container } = render(<TypingEffect text={longText} speed={10} />);
    
    // Type first few characters
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(container.textContent).toContain('This ');
    
    // Type all characters
    act(() => {
      vi.advanceTimersByTime(longText.length * 10);
    });
    expect(container.textContent).toContain(longText);
  });

  it('applies typing-text class to container', () => {
    const { container } = render(<TypingEffect text="Test" />);
    
    const typingElement = container.querySelector('.typing-text');
    expect(typingElement).toBeInTheDocument();
  });

  it('maintains cursor animation class throughout typing', () => {
    const { container } = render(<TypingEffect text="Hello" speed={10} />);
    
    // Check cursor at start
    let cursor = container.querySelector('.terminal-cursor');
    expect(cursor).toHaveClass('animate-blink');
    
    // Check cursor during typing
    act(() => {
      vi.advanceTimersByTime(30);
    });
    cursor = container.querySelector('.terminal-cursor');
    expect(cursor).toHaveClass('animate-blink');
    
    // Check cursor at end
    act(() => {
      vi.advanceTimersByTime(20);
    });
    cursor = container.querySelector('.terminal-cursor');
    expect(cursor).toHaveClass('animate-blink');
  });
});
