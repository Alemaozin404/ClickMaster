import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer', () => {
  const defaultProps = {
    theme: 'dark',
    themeIcon: '🌙',
    themeLabel: 'Noturno',
    newAchievementsCount: 0,
    onOpenAchievements: vi.fn(),
    onOpenLeaderboard: vi.fn(),
    onOpenShop: vi.fn(),
    onPrestige: vi.fn(),
    onReset: vi.fn(),
    soundEnabled: true,
    musicEnabled: true,
    onToggleSound: vi.fn(),
    onToggleMusic: vi.fn(),
    onToggleTheme: vi.fn(),
    onExportSave: vi.fn(),
    onImportSave: vi.fn(),
    equippedBadge: null,
  };

  it('renders all control buttons', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByLabelText('Desativar sons')).toBeDefined();
    expect(screen.getByLabelText('Desativar música')).toBeDefined();
    expect(screen.getByLabelText(/Tema atual/)).toBeDefined();
    expect(screen.getByLabelText('Exportar save')).toBeDefined();
    expect(screen.getByLabelText('Importar save')).toBeDefined();
  });

  it('renders all footer action buttons', () => {
    render(<Footer {...defaultProps} />);
    expect(screen.getByText(/Conquistas/)).toBeDefined();
    expect(screen.getByText(/Ranking/)).toBeDefined();
    expect(screen.getByText(/Loja/)).toBeDefined();
    expect(screen.getByText(/Prestígio/)).toBeDefined();
    expect(screen.getByText(/Reiniciar/)).toBeDefined();
  });

  it('calls onOpenAchievements when clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText(/Conquistas/));
    expect(defaultProps.onOpenAchievements).toHaveBeenCalled();
  });

  it('calls onOpenLeaderboard when clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText(/Ranking/));
    expect(defaultProps.onOpenLeaderboard).toHaveBeenCalled();
  });

  it('calls onOpenShop when clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText(/Loja/));
    expect(defaultProps.onOpenShop).toHaveBeenCalled();
  });

  it('calls onPrestige when clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText(/Prestígio/));
    expect(defaultProps.onPrestige).toHaveBeenCalled();
  });

  it('calls onReset when clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByText(/Reiniciar/));
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('calls onToggleSound when sound button clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Desativar sons'));
    expect(defaultProps.onToggleSound).toHaveBeenCalled();
  });

  it('shows equipped badge indicator when equippedBadge is provided', () => {
    const { container } = render(<Footer {...defaultProps} equippedBadge={{ icon: '👑', name: 'Crown' }} />);
    const indicator = container.querySelector('.equipped-badge-indicator');
    expect(indicator).toBeDefined();
    expect(indicator.textContent).toBe('👑');
  });

  it('hides equipped badge indicator when equippedBadge is null', () => {
    const { container } = render(<Footer {...defaultProps} equippedBadge={null} />);
    expect(container.querySelector('.equipped-badge-indicator')).toBeNull();
  });

  it('shows achievement badge when newAchievementsCount > 0', () => {
    const { container } = render(<Footer {...defaultProps} newAchievementsCount={3} />);
    const badge = container.querySelector('.achievement-badge');
    expect(badge).toBeDefined();
    expect(badge.textContent).toBe('3');
  });

  it('hides achievement badge when count is 0', () => {
    const { container } = render(<Footer {...defaultProps} newAchievementsCount={0} />);
    expect(container.querySelector('.achievement-badge')).toBeNull();
  });

  it('shows correct sound button label when sound is disabled', () => {
    render(<Footer {...defaultProps} soundEnabled={false} />);
    expect(screen.getByLabelText('Ativar sons')).toBeDefined();
  });

  it('shows correct music button label when music is disabled', () => {
    render(<Footer {...defaultProps} musicEnabled={false} />);
    expect(screen.getByLabelText('Ativar música')).toBeDefined();
  });

  it('calls onToggleTheme when theme button clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/Tema atual/));
    expect(defaultProps.onToggleTheme).toHaveBeenCalled();
  });

  it('calls onExportSave when export button clicked', () => {
    render(<Footer {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Exportar save'));
    expect(defaultProps.onExportSave).toHaveBeenCalled();
  });

  it('triggers file input on import button click', () => {
    const { container } = render(<Footer {...defaultProps} />);
    const fileInput = container.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(screen.getByLabelText('Importar save'));
    expect(clickSpy).toHaveBeenCalled();
  });
});
