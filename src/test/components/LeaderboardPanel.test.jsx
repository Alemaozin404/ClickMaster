import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LeaderboardPanel from '../../components/LeaderboardPanel';

describe('LeaderboardPanel', () => {
  const entries = [
    { id: '1', name: 'Player1', totalEarned: 100000, cps: 50, totalClicks: 5000, date: Date.now() - 86400000 },
    { id: '2', name: 'Player2', totalEarned: 50000, cps: 25, totalClicks: 2500, date: Date.now() },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    entries,
    onRemoveEntry: vi.fn(),
    onClearAll: vi.fn(),
    playerName: 'TestPlayer',
    onSavePlayerName: vi.fn(),
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<LeaderboardPanel {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders header and name section when open', () => {
    render(<LeaderboardPanel {...defaultProps} />);
    expect(screen.getByText(/Leaderboard/)).toBeDefined();
    expect(screen.getByLabelText('Nome do jogador')).toBeDefined();
  });

  it('shows player name in input', () => {
    render(<LeaderboardPanel {...defaultProps} playerName="TestPlayer" />);
    const input = screen.getByLabelText('Nome do jogador');
    expect(input.value).toBe('TestPlayer');
  });

  it('shows empty input placeholder when no playerName', () => {
    render(<LeaderboardPanel {...defaultProps} playerName="" />);
    const input = screen.getByLabelText('Nome do jogador');
    expect(input.placeholder).toBe('Digite seu nome...');
  });

  it('renders podium for top entries', () => {
    render(<LeaderboardPanel {...defaultProps} entries={entries} />);
    expect(screen.getAllByText('Player1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Player2').length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty state when no entries', () => {
    render(<LeaderboardPanel {...defaultProps} entries={[]} />);
    expect(screen.getByText('Nenhuma pontuação registrada ainda!')).toBeDefined();
  });

  it('hides clear all button when no entries', () => {
    render(<LeaderboardPanel {...defaultProps} entries={[]} />);
    expect(screen.queryByText(/Limpar/)).toBeNull();
  });

  it('calls onClose when close button clicked', () => {
    render(<LeaderboardPanel {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay background clicked', () => {
    const { container } = render(<LeaderboardPanel {...defaultProps} />);
    const overlay = container.querySelector('.leaderboard-overlay');
    // Simulate clicking the overlay background (not bubbling from child)
    fireEvent.click(overlay, { target: overlay });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onSavePlayerName when save button clicked', () => {
    render(<LeaderboardPanel {...defaultProps} playerName="" />);
    const input = screen.getByLabelText('Nome do jogador');
    fireEvent.change(input, { target: { value: 'NewName' } });
    fireEvent.click(screen.getByText('Salvar'));
    expect(defaultProps.onSavePlayerName).toHaveBeenCalledWith('NewName');
  });

  it('trims and limits player name to 20 chars on save', () => {
    render(<LeaderboardPanel {...defaultProps} playerName="" />);
    const input = screen.getByLabelText('Nome do jogador');
    fireEvent.change(input, { target: { value: '  VeryLongNameThatExceedsLimit__  ' } });
    fireEvent.click(screen.getByText('Salvar'));
    // .trim() -> 'VeryLongNameThatExceedsLimit__' then .slice(0,20) -> 'VeryLongNameThatExceed'
    expect(defaultProps.onSavePlayerName).toHaveBeenCalledWith('VeryLongNameThatExce');
  });

  it('saves default name if input is empty', () => {
    render(<LeaderboardPanel {...defaultProps} playerName="" />);
    fireEvent.click(screen.getByText('Salvar'));
    expect(defaultProps.onSavePlayerName).toHaveBeenCalledWith('Jogador');
  });

  it('saves on Enter key press', () => {
    render(<LeaderboardPanel {...defaultProps} playerName="" />);
    const input = screen.getByLabelText('Nome do jogador');
    fireEvent.change(input, { target: { value: 'EnterName' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(defaultProps.onSavePlayerName).toHaveBeenCalledWith('EnterName');
  });

  it('renders clear all button when entries exist', () => {
    render(<LeaderboardPanel {...defaultProps} />);
    expect(screen.getByText(/Limpar/)).toBeDefined();
  });

  it('calls onClearAll when clear button clicked', () => {
    render(<LeaderboardPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Limpar/));
    expect(defaultProps.onClearAll).toHaveBeenCalled();
  });

  it('shows delete buttons for each entry', () => {
    render(<LeaderboardPanel {...defaultProps} />);
    const deleteButtons = screen.getAllByTitle('Remover');
    expect(deleteButtons.length).toBe(2);
  });

  it('shows delete confirmation when delete button clicked', () => {
    render(<LeaderboardPanel {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Remover Player1'));
    expect(screen.getByText('Remover?')).toBeDefined();
    expect(screen.getByText('Sim')).toBeDefined();
    expect(screen.getByText('Não')).toBeDefined();
  });

  it('calls onRemoveEntry when delete confirmed', () => {
    const removeSpy = vi.fn();
    render(<LeaderboardPanel {...defaultProps} onRemoveEntry={removeSpy} />);
    fireEvent.click(screen.getByLabelText('Remover Player1'));
    fireEvent.click(screen.getByText('Sim'));
    expect(removeSpy).toHaveBeenCalledWith('1');
  });

  it('cancels delete when clicking Não', () => {
    const removeSpy = vi.fn();
    render(<LeaderboardPanel {...defaultProps} onRemoveEntry={removeSpy} />);
    fireEvent.click(screen.getByLabelText('Remover Player1'));
    expect(screen.getByText('Remover?')).toBeDefined();
    fireEvent.click(screen.getByText('Não'));
    expect(screen.queryByText('Remover?')).toBeNull();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('renders podium medals for top 3 entries', () => {
    const manyEntries = [
      { id: '1', name: 'First', totalEarned: 300000, cps: 100, totalClicks: 10000, date: Date.now() },
      { id: '2', name: 'Second', totalEarned: 200000, cps: 80, totalClicks: 8000, date: Date.now() },
      { id: '3', name: 'Third', totalEarned: 100000, cps: 50, totalClicks: 5000, date: Date.now() },
    ];
    render(<LeaderboardPanel {...defaultProps} entries={manyEntries} />);
    expect(screen.getAllByText('🥇').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🥈').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🥉').length).toBeGreaterThanOrEqual(1);
  });

  it('shows rank numbers for entries beyond top 3', () => {
    const manyEntries = [
      { id: '1', name: 'A', totalEarned: 100, cps: 1, totalClicks: 10, date: Date.now() },
      { id: '2', name: 'B', totalEarned: 90, cps: 1, totalClicks: 9, date: Date.now() },
      { id: '3', name: 'C', totalEarned: 80, cps: 1, totalClicks: 8, date: Date.now() },
      { id: '4', name: 'D', totalEarned: 70, cps: 1, totalClicks: 7, date: Date.now() },
    ];
    render(<LeaderboardPanel {...defaultProps} entries={manyEntries} />);
    expect(screen.getByText('#4')).toBeDefined();
  });
});
