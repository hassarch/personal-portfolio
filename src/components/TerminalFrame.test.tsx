import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TerminalFrame from './TerminalFrame';

describe('TerminalFrame', () => {
  it('renders with title and children', () => {
    render(
      <TerminalFrame title="~/test">
        <p>Test content</p>
      </TerminalFrame>
    );

    expect(screen.getByText('~/test')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TerminalFrame title="~/test" className="custom-class">
        <p>Test content</p>
      </TerminalFrame>
    );

    const frame = container.querySelector('.terminal-frame');
    expect(frame).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <TerminalFrame title="~/projects">
        <p>Test content</p>
      </TerminalFrame>
    );

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-label', '~/projects - terminal window');
  });

  it('renders three control buttons', () => {
    const { container } = render(
      <TerminalFrame title="~/test">
        <p>Test content</p>
      </TerminalFrame>
    );

    const buttons = container.querySelectorAll('.terminal-btn');
    expect(buttons).toHaveLength(3);
  });

  it('renders title bar with proper structure', () => {
    const { container } = render(
      <TerminalFrame title="~/test">
        <p>Test content</p>
      </TerminalFrame>
    );

    const titleBar = container.querySelector('.terminal-title-bar');
    expect(titleBar).toBeInTheDocument();
    
    const controls = container.querySelector('.terminal-controls');
    expect(controls).toBeInTheDocument();
    
    const title = container.querySelector('.terminal-title');
    expect(title).toBeInTheDocument();
  });

  it('renders content within terminal-content wrapper', () => {
    const { container } = render(
      <TerminalFrame title="~/test">
        <div data-testid="content">Test content</div>
      </TerminalFrame>
    );

    const content = container.querySelector('.terminal-content');
    expect(content).toBeInTheDocument();
    expect(content).toContainElement(screen.getByTestId('content'));
  });
});
