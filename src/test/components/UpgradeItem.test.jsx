import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UpgradeItem from '../../components/UpgradeItem';
import { UPGRADE_DEFS } from '../../utils/gameLogic';

describe('UpgradeItem', () => {
  const def = UPGRADE_DEFS[0]; // autoClicker

  it('renders upgrade name and level', () => {
    render(<UpgradeItem def={def} upg={{ level: 2 }} score={100} onBuy={vi.fn()} />);
    expect(screen.getByText('Auto Clicker')).toBeDefined();
    expect(screen.getByText('Nível 2')).toBeDefined();
  });

  it('renders as disabled when cannot afford', () => {
    const { container } = render(<UpgradeItem def={def} upg={{ level: 0 }} score={1} onBuy={vi.fn()} />);
    expect(container.querySelector('.disabled')).toBeDefined();
  });

  it('renders as enabled when can afford', () => {
    const { container } = render(<UpgradeItem def={def} upg={{ level: 0 }} score={100} onBuy={vi.fn()} />);
    expect(container.querySelector('.disabled')).toBeNull();
  });

  it('calls onBuy when clicked and affordable', () => {
    const onBuy = vi.fn();
    render(<UpgradeItem def={def} upg={{ level: 0 }} score={100} onBuy={onBuy} />);
    fireEvent.click(screen.getByText('Auto Clicker').closest('.upgrade-item'));
    expect(onBuy).toHaveBeenCalledWith('autoClicker');
  });

  it('does not call onBuy when clicked and not affordable', () => {
    const onBuy = vi.fn();
    render(<UpgradeItem def={def} upg={{ level: 0 }} score={1} onBuy={onBuy} />);
    const item = screen.getByText('Auto Clicker').closest('.upgrade-item');
    expect(item.classList.contains('disabled')).toBe(true);
    fireEvent.click(item);
    expect(onBuy).not.toHaveBeenCalled();
  });
});
