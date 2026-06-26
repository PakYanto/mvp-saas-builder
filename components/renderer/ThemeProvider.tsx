'use client';

import { useEffect } from 'react';

interface ThemeProviderProps {
  themeColor: string;
  children: React.ReactNode;
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Lighten or darken a color
function adjustColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number) => {
    const adjusted = Math.round(value + (255 - value) * (percent / 100));
    return Math.min(255, Math.max(0, adjusted));
  };

  const r = percent > 0 ? adjust(rgb.r) : Math.round(rgb.r * (1 + percent / 100));
  const g = percent > 0 ? adjust(rgb.g) : Math.round(rgb.g * (1 + percent / 100));
  const b = percent > 0 ? adjust(rgb.b) : Math.round(rgb.b * (1 + percent / 100));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function ThemeProvider({ themeColor, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    const rgb = hexToRgb(themeColor);

    if (rgb) {
      // Set primary color
      root.style.setProperty('--color-primary', themeColor);
      root.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);

      // Set color variations
      root.style.setProperty('--color-primary-light', adjustColor(themeColor, 30));
      root.style.setProperty('--color-primary-dark', adjustColor(themeColor, -20));

      // Set hover state
      root.style.setProperty('--color-primary-hover', adjustColor(themeColor, -10));
    }
  }, [themeColor]);

  return <>{children}</>;
}
