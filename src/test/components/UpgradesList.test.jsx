import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UpgradesList from '../../components/UpgradesList';

describe('UpgradesList', () => {
  const upgrades = {
    autoClicker: { level: 1 },
    clickMultiplier: { level: 0 },
    luckyClover: { level: 0 },
    goldenCoin: { level: 0 },
    timeWarp: { level: 0 },
    cosmicTap: { level: 0 },
  };

  it('renders section title', () => {
    render(<UpgradesList upgrades={upgrades} score={100} onBuy={vi.fn()} />);
    expect(screen.getByText(/Melhorias/)).toBeDefined();
  });

  it('renders all 6 upgrades', () => {
    const { container } = render(<UpgradesList upgrades={upgrades} score={100} onBuy={vi.fn()} />);
    const items = container.querySelectorAll('.upgrade-item');
    expect(items.length).toBe(6);
  });

  it('renders upgrade names', () => {
    render(<UpgradesList upgrades={upgrades} score={100} onBuy={vi.fn()} />);
    expect(screen.getByText('Auto Clicker')).toBeDefined();
    expect(screen.getByText('Martelo de Ouro')).toBeDefined();
    expect(screen.getByText('Trevo da Sorte')).toBeDefined();
    expect(screen.getByText('Moeda Dourada')).toBeDefined();
    expect(screen.getByText('Distorção Temporal')).toBeDefined();
    expect(screen.getByText('Toque Cósmico')).toBeDefined();
  });
});
