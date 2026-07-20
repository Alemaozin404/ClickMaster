import { useState, useCallback, useEffect } from 'react';

const SHOP_KEY = 'clickmaster_shop';

export const SHOP_ITEMS = [
  // -- Particle Colors --
  {
    id: 'particle_gold',
    icon: '✨',
    name: 'Partículas Douradas',
    desc: 'Efeito de clique em ouro reluzente',
    price: 5000,
    category: 'particle',
    effect: { color: 'gold' },
    tier: 'common',
  },
  {
    id: 'particle_fire',
    icon: '🔥',
    name: 'Partículas de Fogo',
    desc: 'Efeito de clique em chamas',
    price: 15000,
    category: 'particle',
    effect: { color: 'fire' },
    tier: 'rare',
  },
  {
    id: 'particle_ice',
    icon: '❄️',
    name: 'Partículas de Gelo',
    desc: 'Efeito de clique em gelo cintilante',
    price: 25000,
    category: 'particle',
    effect: { color: 'ice' },
    tier: 'rare',
  },
  {
    id: 'particle_neon',
    icon: '💜',
    name: 'Partículas Neon',
    desc: 'Efeito de clique neon psicodélico',
    price: 50000,
    category: 'particle',
    effect: { color: 'neon' },
    tier: 'epic',
  },
  {
    id: 'particle_rainbow',
    icon: '🌈',
    name: 'Partículas Arco-Íris',
    desc: 'Efeito de clique em arco-íris',
    price: 100000,
    category: 'particle',
    effect: { color: 'rainbow' },
    tier: 'legendary',
  },

  // -- Badges --
  {
    id: 'badge_star',
    icon: '⭐',
    name: 'Badge Estrela',
    desc: 'Estrela dourada no seu perfil',
    price: 8000,
    category: 'badge',
    effect: { badge: '⭐' },
    tier: 'common',
  },
  {
    id: 'badge_crown',
    icon: '👑',
    name: 'Badge Coroa',
    desc: 'Coroa real no seu perfil',
    price: 30000,
    category: 'badge',
    effect: { badge: '👑' },
    tier: 'rare',
  },
  {
    id: 'badge_skull',
    icon: '💀',
    name: 'Badge Caveira',
    desc: 'Caveira radical no seu perfil',
    price: 75000,
    category: 'badge',
    effect: { badge: '💀' },
    tier: 'epic',
  },
  {
    id: 'badge_diamond',
    icon: '💎',
    name: 'Badge Diamante',
    desc: 'Diamante raro no seu perfil',
    price: 200000,
    category: 'badge',
    effect: { badge: '💎' },
    tier: 'legendary',
  },

  // -- Special Effects --
  {
    id: 'effect_trail',
    icon: '🌊',
    name: 'Rastro Brilhante',
    desc: 'Partículas deixam rastro luminoso',
    price: 20000,
    category: 'effect',
    effect: { trail: true },
    tier: 'rare',
  },
  {
    id: 'effect_rainbow_mode',
    icon: '🎨',
    name: 'Modo Arco-Íris',
    desc: 'Toda a interface fica colorida',
    price: 150000,
    category: 'effect',
    effect: { rainbowMode: true },
    tier: 'legendary',
  },

  // -- Click Powerups --
  {
    id: 'power_crit_boost',
    icon: '🎯',
    name: 'Amplificador Crítico',
    desc: '+5% chance de crítico permanente',
    price: 40000,
    category: 'power',
    effect: { critBonus: 5 },
    tier: 'epic',
    permanent: true,
  },
  {
    id: 'power_click_bonus',
    icon: '⚡',
    name: 'Clique Energizado',
    desc: '+1 moeda base por clique permanente',
    price: 100000,
    category: 'power',
    effect: { clickBonus: 1 },
    tier: 'legendary',
    permanent: true,
  },
];

const TIER_COLORS = {
  common: '#4fc3f7',
  rare: '#7c4dff',
  epic: '#e040fb',
  legendary: '#ffd86f',
};

export function useShop() {
  const [purchasedItems, setPurchasedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(SHOP_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [equippedItems, setEquippedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(SHOP_KEY + '_equipped');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Current active effects
  const [activeEffects, setActiveEffects] = useState({});

  // Save purchased items
  useEffect(() => {
    try { localStorage.setItem(SHOP_KEY, JSON.stringify(purchasedItems)); }
    catch (e) { /* ignore */ }
  }, [purchasedItems]);

  // Save equipped items
  useEffect(() => {
    try { localStorage.setItem(SHOP_KEY + '_equipped', JSON.stringify(equippedItems)); }
    catch (e) { /* ignore */ }
  }, [equippedItems]);

  // Update active effects when equipped items change
  useEffect(() => {
    const effects = {};
    for (const itemId of equippedItems) {
      const def = SHOP_ITEMS.find(i => i.id === itemId);
      if (def && def.effect) {
        Object.assign(effects, def.effect);
      }
    }
    setActiveEffects(effects);
  }, [equippedItems]);

  const isPurchased = useCallback((id) => purchasedItems.includes(id), [purchasedItems]);
  const isEquipped = useCallback((id) => equippedItems.includes(id), [equippedItems]);

  const buyItem = useCallback((id, score) => {
    const def = SHOP_ITEMS.find(i => i.id === id);
    if (!def) return false;
    if (purchasedItems.includes(id)) return false;
    if (score < def.price) return false;

    setPurchasedItems(prev => [...prev, id]);
    // Auto-equip cosmetic items
    if (def.category !== 'power') {
      setEquippedItems(prev => [...prev, id]);
    }
    return true;
  }, [purchasedItems]);

  const toggleEquip = useCallback((id) => {
    const def = SHOP_ITEMS.find(i => i.id === id);
    if (!def || def.category === 'power') return; // Power-ups can't be toggled

    setEquippedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      // Unequip other items in same category
      return [...prev.filter(i => {
        const d = SHOP_ITEMS.find(si => si.id === i);
        return d?.category !== def.category;
      }), id];
    });
  }, []);

  const getItemTierColor = useCallback((tier) => TIER_COLORS[tier] || '#4fc3f7', []);

  // Get equipped badge
  const equippedBadge = SHOP_ITEMS.find(
    i => equippedItems.includes(i.id) && i.category === 'badge'
  );

  return {
    shopItems: SHOP_ITEMS,
    purchasedItems,
    equippedItems,
    activeEffects,
    isPurchased,
    isEquipped,
    buyItem,
    toggleEquip,
    getItemTierColor,
    equippedBadge,
  };
}
