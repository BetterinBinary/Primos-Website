import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import { expect, test, describe } from 'vitest';
import Button from './Button.svelte';

describe('Button Component', () => {
  test('renders with default props', () => {
    render(Button, {
      props: {
        children: () => 'Click me'
      }
    });
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primos-blue-500');
  });

  test('renders as link when href is provided', () => {
    render(Button, {
      props: {
        href: '/menu',
        children: () => 'View Menu'
      }
    });
    
    const link = screen.getByRole('button', { name: /view menu/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/menu');
  });

  test('handles click events', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    render(Button, {
      props: {
        onclick: handleClick,
        children: () => 'Click me'
      }
    });
    
    const button = screen.getByRole('button', { name: /click me/i });
    await fireEvent.click(button);
    
    expect(clicked).toBe(true);
  });

  test('applies variant styles correctly', () => {
    render(Button, {
      props: {
        variant: 'secondary',
        children: () => 'Secondary Button'
      }
    });
    
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('bg-primos-gold-500');
  });

  test('shows loading state', () => {
    render(Button, {
      props: {
        loading: true,
        children: () => 'Loading'
      }
    });
    
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  test('respects disabled state', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    render(Button, {
      props: {
        disabled: true,
        onclick: handleClick,
        children: () => 'Disabled'
      }
    });
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    
    await fireEvent.click(button);
    expect(clicked).toBe(false);
  });
});