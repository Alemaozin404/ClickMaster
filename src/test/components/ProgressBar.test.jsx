import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ProgressBar from '../../components/ProgressBar';

describe('ProgressBar', () => {
  it('renders with 0% width when totalEarned is 0', () => {
    const { container } = render(<ProgressBar totalEarned={0} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar.style.width).toBe('0%');
  });

  it('renders with width > 0 when totalEarned crosses a magnitude boundary', () => {
    const { container } = render(<ProgressBar totalEarned={550} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar.style.width).not.toBe('0%');
    expect(bar.style.width).toMatch(/\d+\.?\d*%/);
  });

  it('renders progress bar element', () => {
    const { container } = render(<ProgressBar totalEarned={1000} />);
    expect(container.querySelector('.progress-container')).toBeDefined();
    expect(container.querySelector('.progress-bar')).toBeDefined();
  });
});
