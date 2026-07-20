import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreDisplay from '../../components/ScoreDisplay';

describe('ScoreDisplay', () => {
  it('renders score and CPS', () => {
    render(<ScoreDisplay score={1500} cps={25} />);
    expect(screen.getByText('1.5K')).toBeDefined();
    expect(screen.getByText('25')).toBeDefined();
    expect(screen.getByText('Moedas')).toBeDefined();
  });

  it('renders zero score', () => {
    render(<ScoreDisplay score={0} cps={0} />);
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });

  it('renders large numbers with formatting', () => {
    render(<ScoreDisplay score={1_500_000} cps={100} />);
    expect(screen.getByText('1.50M')).toBeDefined();
  });
});
