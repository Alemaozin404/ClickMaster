import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AchievementNotification from '../../components/AchievementNotification';

describe('AchievementNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when achievement is null', () => {
    const { container } = render(<AchievementNotification achievement={null} onClear={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders achievement name when provided', () => {
    render(<AchievementNotification achievement={{ icon: '🏆', name: 'Test Achievement' }} onClear={vi.fn()} />);
    expect(screen.getByText('Test Achievement')).toBeDefined();
    expect(screen.getByText('🏆 Conquista desbloqueada!')).toBeDefined();
  });

  it('calls onClear after timeout', () => {
    const onClear = vi.fn();
    render(<AchievementNotification achievement={{ icon: '🏆', name: 'Test' }} onClear={onClear} />);

    // Advance past the initial show (50ms) + display (3500ms) + hide animation (500ms)
    act(() => { vi.advanceTimersByTime(4100); });

    expect(onClear).toHaveBeenCalled();
  });
});
