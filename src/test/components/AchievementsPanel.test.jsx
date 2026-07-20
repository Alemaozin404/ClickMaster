import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementsPanel from '../../components/AchievementsPanel';

describe('AchievementsPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    unlockedAchievements: ['firstClick', 'earn100'],
    total: 31,
    unlockedCount: 2,
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<AchievementsPanel {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders header and progress when open', () => {
    render(<AchievementsPanel {...defaultProps} />);
    expect(screen.getByText(/Conquistas/)).toBeDefined();
  });

  it('shows progress count', () => {
    render(<AchievementsPanel {...defaultProps} />);
    expect(screen.getByText('2 / 31')).toBeDefined();
  });

  it('renders all achievements', () => {
    const { container } = render(<AchievementsPanel {...defaultProps} />);
    const items = container.querySelectorAll('.achievement-item');
    expect(items.length).toBe(31);
  });

  it('marks unlocked achievements', () => {
    const { container } = render(<AchievementsPanel {...defaultProps} />);
    const unlockedItems = container.querySelectorAll('.achievement-item.unlocked');
    expect(unlockedItems.length).toBe(2);
  });

  it('marks locked achievements', () => {
    const { container } = render(<AchievementsPanel {...defaultProps} />);
    const lockedItems = container.querySelectorAll('.achievement-item.locked');
    expect(lockedItems.length).toBe(29);
  });

  it('calls onClose when close button clicked', () => {
    render(<AchievementsPanel {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows progress bar fill with correct width', () => {
    const { container } = render(<AchievementsPanel {...defaultProps} unlockedCount={10} total={31} />);
    const fill = container.querySelector('.progress-fill');
    expect(fill.style.width).toBe('32.25806451612903%');
  });
});
