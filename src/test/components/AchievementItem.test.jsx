import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AchievementItem from '../../components/AchievementItem';
import { ACHIEVEMENT_DEFS } from '../../utils/gameLogic';

describe('AchievementItem', () => {
  const def = ACHIEVEMENT_DEFS[0]; // firstClick

  it('renders achievement name and description', () => {
    render(<AchievementItem def={def} unlocked={false} />);
    expect(screen.getByText('Primeiro Clique')).toBeDefined();
    expect(screen.getByText('Clique uma vez')).toBeDefined();
  });

  it('shows lock icon when locked', () => {
    const { container } = render(<AchievementItem def={def} unlocked={false} />);
    expect(container.querySelector('.lock-icon')).toBeDefined();
    expect(container.querySelector('.unlocked')).toBeNull();
  });

  it('shows checkmark when unlocked', () => {
    const { container } = render(<AchievementItem def={def} unlocked={true} />);
    expect(container.querySelector('.lock-icon')).toBeNull();
    expect(container.querySelector('.unlocked')).toBeDefined();
  });

  it('displays correct badge for locked vs unlocked', () => {
    const { container: lockedContainer } = render(<AchievementItem def={def} unlocked={false} />);
    expect(lockedContainer.querySelector('.ach-badge').textContent).toBe('🔲');

    const { container: unlockedContainer } = render(<AchievementItem def={def} unlocked={true} />);
    expect(unlockedContainer.querySelector('.ach-badge').textContent).toBe('✅');
  });
});
