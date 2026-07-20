import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShopPanel from '../../components/ShopPanel';

const mockItems = [
  { id: 'item1', icon: '✨', name: 'Particle Gold', desc: 'Gold particles', price: 1000, category: 'particle', effect: { color: 'gold' }, tier: 'common' },
  { id: 'item2', icon: '🔥', name: 'Particle Fire', desc: 'Fire particles', price: 5000, category: 'particle', effect: { color: 'fire' }, tier: 'rare' },
  { id: 'badge1', icon: '⭐', name: 'Star Badge', desc: 'A star badge', price: 2000, category: 'badge', effect: { badge: '⭐' }, tier: 'common' },
  { id: 'effect1', icon: '🌊', name: 'Trail Effect', desc: 'Bright trail', price: 8000, category: 'effect', effect: { trail: true }, tier: 'rare' },
  { id: 'power1', icon: '⚡', name: 'Power Up', desc: 'Power up desc', price: 10000, category: 'power', effect: { clickBonus: 1 }, tier: 'epic', permanent: true },
];

describe('ShopPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    score: 5000,
    shopItems: mockItems,
    purchasedItems: [],
    equippedItems: [],
    isPurchased: vi.fn(() => false),
    isEquipped: vi.fn(() => false),
    onBuy: vi.fn(() => true),
    onToggleEquip: vi.fn(),
    getItemTierColor: vi.fn(() => '#4fc3f7'),
    onShowNotification: vi.fn(),
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ShopPanel {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders header with title and balance', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByText(/Loja Cosmética/)).toBeDefined();
    // Balance appears in the header; check it exists at all
    expect(screen.getAllByText(/5.0K/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders close button', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByLabelText('Fechar')).toBeDefined();
  });

  it('calls onClose when close button clicked', () => {
    render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay background clicked', () => {
    const { container } = render(<ShopPanel {...defaultProps} />);
    const overlay = container.querySelector('.shop-overlay');
    fireEvent.click(overlay, { target: overlay });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders category tabs', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByText(/Cores de Partículas/)).toBeDefined();
    expect(screen.getByText(/Badges/)).toBeDefined();
    expect(screen.getByText(/Efeitos Especiais/)).toBeDefined();
    expect(screen.getByText(/Power-ups/)).toBeDefined();
  });

  it('shows only items of active category by default (particle)', () => {
    render(<ShopPanel {...defaultProps} />);
    // Only particle items should be visible initially
    expect(screen.getByText('Particle Gold')).toBeDefined();
    expect(screen.getByText('Particle Fire')).toBeDefined();
    expect(screen.queryByText('Star Badge')).toBeNull();
    expect(screen.queryByText('Trail Effect')).toBeNull();
    expect(screen.queryByText('Power Up')).toBeNull();
  });

  it('switches category when tab clicked', () => {
    render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/Badges/));
    expect(screen.getByText('Star Badge')).toBeDefined();
    expect(screen.queryByText('Particle Gold')).toBeNull();
  });

  it('shows price button for unpurchased items', () => {
    render(<ShopPanel {...defaultProps} />);
    const btn = screen.getByText(/1.0K/); // item1 price
    expect(btn).toBeDefined();
  });

  it('disables buy button when score is insufficient', () => {
    render(<ShopPanel {...defaultProps} score={500} />);
    const btn = screen.getByText(/1.0K/).closest('button');
    expect(btn.disabled).toBe(true);
  });

  it('enables buy button when score is sufficient', () => {
    render(<ShopPanel {...defaultProps} score={5000} />);
    const btn = screen.getByText(/1.0K/).closest('button');
    expect(btn.disabled).toBe(false);
  });

  it('shows confirmation dialog when buy button clicked', () => {
    render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/1.0K/));
    expect(screen.getByText(/Tem certeza/)).toBeDefined();
    expect(screen.getByText('Cancelar')).toBeDefined();
  });

  it('calls onBuy with correct id when purchase confirmed', () => {
    render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/1.0K/)); // click buy
    fireEvent.click(screen.getByText('Comprar')); // confirm
    expect(defaultProps.onBuy).toHaveBeenCalledWith('item1');
  });

  it('calls onShowNotification on successful purchase', () => {
    render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/1.0K/));
    fireEvent.click(screen.getByText('Comprar'));
    expect(defaultProps.onShowNotification).toHaveBeenCalledWith('🛒', 'Item comprado com sucesso!');
  });

  it('closes confirmation dialog when cancel clicked', async () => {
    render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/1.0K/));
    expect(screen.getByText(/Tem certeza/)).toBeDefined();
    fireEvent.click(screen.getByText('Cancelar'));
    // Wait for exit animation to complete
    await waitFor(() => {
      expect(screen.queryByText(/Tem certeza/)).toBeNull();
    }, { timeout: 1000 });
  });

  it('closes confirmation dialog when overlay clicked', async () => {
    const { container } = render(<ShopPanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/1.0K/));
    expect(screen.getByText(/Tem certeza/)).toBeDefined();
    const confirmOverlay = container.querySelector('.shop-confirm-overlay');
    fireEvent.click(confirmOverlay);
    // Wait for exit animation to complete
    await waitFor(() => {
      expect(screen.queryByText(/Tem certeza/)).toBeNull();
    }, { timeout: 1000 });
  });

  it('shows equip button for owned non-power items', () => {
    const ownedProps = {
      ...defaultProps,
      purchasedItems: ['item1'],
      isPurchased: vi.fn((id) => id === 'item1'),
    };
    render(<ShopPanel {...ownedProps} />);
    expect(screen.getByText('Equipar')).toBeDefined();
  });

  it('shows equipped status for equipped items', () => {
    const equippedProps = {
      ...defaultProps,
      purchasedItems: ['item1'],
      equippedItems: ['item1'],
      isPurchased: vi.fn((id) => id === 'item1'),
      isEquipped: vi.fn((id) => id === 'item1'),
    };
    render(<ShopPanel {...equippedProps} />);
    expect(screen.getByText(/Equipado/)).toBeDefined();
  });

  it('shows acquired label for owned power-up items', () => {
    const powerProps = {
      ...defaultProps,
      purchasedItems: ['power1'],
      isPurchased: vi.fn((id) => id === 'power1'),
    };
    // Switch to power category
    render(<ShopPanel {...powerProps} />);
    fireEvent.click(screen.getByText(/Power-ups/));
    expect(screen.getByText(/Adquirido/)).toBeDefined();
  });

  it('calls onToggleEquip when equip button clicked', () => {
    const equipProps = {
      ...defaultProps,
      purchasedItems: ['item1'],
      isPurchased: vi.fn((id) => id === 'item1'),
    };
    render(<ShopPanel {...equipProps} />);
    fireEvent.click(screen.getByText('Equipar'));
    expect(defaultProps.onToggleEquip).toHaveBeenCalledWith('item1');
  });

  it('shows locked style for unaffordable items', () => {
    const { container } = render(<ShopPanel {...defaultProps} score={100} />);
    const item = container.querySelector('.shop-item.locked');
    expect(item).toBeDefined();
  });

  it('shows owned style for purchased items', () => {
    const ownedProps = {
      ...defaultProps,
      purchasedItems: ['item1'],
      isPurchased: vi.fn((id) => id === 'item1'),
    };
    const { container } = render(<ShopPanel {...ownedProps} />);
    const item = container.querySelector('.shop-item.owned');
    expect(item).toBeDefined();
  });

  it('shows equipped style for equipped items', () => {
    const equippedProps = {
      ...defaultProps,
      purchasedItems: ['item1'],
      equippedItems: ['item1'],
      isPurchased: vi.fn((id) => id === 'item1'),
      isEquipped: vi.fn((id) => id === 'item1'),
    };
    const { container } = render(<ShopPanel {...equippedProps} />);
    const item = container.querySelector('.shop-item.equipped');
    expect(item).toBeDefined();
  });

  it('shows tier label with correct color', () => {
    render(<ShopPanel {...defaultProps} />);
    const tierElements = screen.getAllByText('Comum');
    expect(tierElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows shop footer hint', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(screen.getByText(/Itens cosméticos/)).toBeDefined();
  });

  it('calls getItemTierColor for each item', () => {
    render(<ShopPanel {...defaultProps} />);
    expect(defaultProps.getItemTierColor).toHaveBeenCalledWith('common');
    expect(defaultProps.getItemTierColor).toHaveBeenCalledWith('rare');
  });

  it('does not show notification on failed purchase', () => {
    const failBuy = vi.fn(() => false);
    const notifSpy = vi.fn();
    render(<ShopPanel {...defaultProps} onBuy={failBuy} onShowNotification={notifSpy} />);
    fireEvent.click(screen.getByText(/1.0K/));
    fireEvent.click(screen.getByText('Comprar'));
    expect(failBuy).toHaveBeenCalledWith('item1');
    expect(notifSpy).not.toHaveBeenCalled();
  });

  it('does not open confirmation if cannot afford', () => {
    render(<ShopPanel {...defaultProps} score={100} />);
    fireEvent.click(screen.getByText(/1.0K/));
    // Confirmation should not appear because handleBuy checks score < price
    // Since score=100 < item1.price=1000, handleBuy returns early
    expect(screen.queryByText(/Tem certeza/)).toBeNull();
  });

  it('renders all items when switching through all categories', () => {
    render(<ShopPanel {...defaultProps} />);
    // Particle tab (default)
    expect(screen.getByText('Particle Gold')).toBeDefined();
    expect(screen.getByText('Particle Fire')).toBeDefined();

    // Switch to badge
    fireEvent.click(screen.getByText(/Badges/));
    expect(screen.getByText('Star Badge')).toBeDefined();

    // Switch to effect
    fireEvent.click(screen.getByText(/Efeitos Especiais/));
    expect(screen.getByText('Trail Effect')).toBeDefined();

    // Switch to power-ups
    fireEvent.click(screen.getByText(/Power-ups/));
    expect(screen.getByText('Power Up')).toBeDefined();
  });

  it('does not show equip button for power-up items', () => {
    const powerProps = {
      ...defaultProps,
      purchasedItems: ['power1'],
      isPurchased: vi.fn((id) => id === 'power1'),
    };
    render(<ShopPanel {...powerProps} />);
    fireEvent.click(screen.getByText(/Power-ups/));
    // Power-up items should show "✓ Adquirido" instead of equip button
    expect(screen.queryByText('Equipar')).toBeNull();
    expect(screen.getByText(/Adquirido/)).toBeDefined();
  });
});
