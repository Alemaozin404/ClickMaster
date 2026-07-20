import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import MilestoneNotification from '../../components/MilestoneNotification';

describe('MilestoneNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when value is null', () => {
    const { container } = render(<MilestoneNotification value={null} onClear={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders milestone text with formatted value', () => {
    render(<MilestoneNotification value={1000} onClear={vi.fn()} />);
    expect(screen.getByText(/1\.0K moedas conquistadas/)).toBeDefined();
  });

  it('shows emoji', () => {
    render(<MilestoneNotification value={100} onClear={vi.fn()} />);
    expect(screen.getByText('🎉')).toBeDefined();
  });

  it('calls onClear after timeout', () => {
    const onClear = vi.fn();
    render(<MilestoneNotification value={1000} onClear={onClear} />);

    act(() => { vi.advanceTimersByTime(3100); });
    expect(onClear).toHaveBeenCalled();
  });
});
