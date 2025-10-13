import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Défaut',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827'
  },
  {
    id: 'blackwhite',
    name: 'Noir & Blanc',
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#ffffff',
    background: '#000000',
    surface: '#0a0a0a',
    text: '#ffffff'
  },
  {
    id: 'dark',
    name: 'Sombre',
    primary: '#60a5fa',
    secondary: '#a78bfa',
    accent: '#fbbf24',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb'
  },
  {
    id: 'ocean',
    name: 'Océan',
    primary: '#06b6d4',
    secondary: '#0891b2',
    accent: '#14b8a6',
    background: '#ecfeff',
    surface: '#cffafe',
    text: '#164e63'
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    background: '#fff7ed',
    surface: '#ffedd5',
    text: '#7c2d12'
  },
  {
    id: 'forest',
    name: 'Forêt',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#f0fdf4',
    surface: '#dcfce7',
    text: '#064e3b'
  },
  {
    id: 'purple',
    name: 'Violet',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#c084fc',
    background: '#faf5ff',
    surface: '#f3e8ff',
    text: '#581c87'
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fb7185',
    background: '#fff1f2',
    surface: '#ffe4e6',
    text: '#881337'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  currentTheme = signal<Theme>(THEMES[0]);
  customColors = signal<Partial<Theme>>({});

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      this.loadTheme();
      
      effect(() => {
        this.applyTheme(this.currentTheme());
      });
    }
  }

  setTheme(themeId: string) {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
      if (this.isBrowser) {
        localStorage.setItem('theme', themeId);
      }
    }
  }

  setCustomColors(colors: Partial<Theme>) {
    const customTheme: Theme = {
      ...this.currentTheme(),
      ...colors,
      id: 'custom',
      name: 'Personnalisé'
    };
    this.currentTheme.set(customTheme);
    this.customColors.set(colors);
    
    if (this.isBrowser) {
      localStorage.setItem('theme', 'custom');
      localStorage.setItem('customColors', JSON.stringify(colors));
    }
  }

  private loadTheme() {
    if (!this.isBrowser) return;

    const savedThemeId = localStorage.getItem('theme');
    
    if (savedThemeId === 'custom') {
      const savedColors = localStorage.getItem('customColors');
      if (savedColors) {
        try {
          const colors = JSON.parse(savedColors);
          this.setCustomColors(colors);
        } catch (e) {
          console.error('Erreur lors du chargement des couleurs personnalisées', e);
        }
      }
    } else if (savedThemeId) {
      this.setTheme(savedThemeId);
    }
  }

  private applyTheme(theme: Theme) {
    if (!this.isBrowser) return;

    const root = document.documentElement;

    // Appliquer les couleurs principales du thème
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);

    // Appliquer les couleurs grises adaptatives
    const isDark = this.isColorDark(theme.background);

    if (isDark) {
      // Thème sombre
      root.style.setProperty('--gray-50', '#1f2937');
      root.style.setProperty('--gray-100', '#374151');
      root.style.setProperty('--gray-200', '#4b5563');
      root.style.setProperty('--gray-300', '#6b7280');
      root.style.setProperty('--gray-400', '#9ca3af');
      root.style.setProperty('--gray-500', '#d1d5db');
      root.style.setProperty('--gray-600', '#e5e7eb');
      root.style.setProperty('--gray-700', '#f3f4f6');
      root.style.setProperty('--gray-800', '#f9fafb');
      root.style.setProperty('--gray-900', '#ffffff');
      root.style.setProperty('--gray-150', '#2d3748');
    } else {
      // Thème clair
      root.style.setProperty('--gray-50', '#f9fafb');
      root.style.setProperty('--gray-100', '#f3f4f6');
      root.style.setProperty('--gray-150', '#f0f1f3');
      root.style.setProperty('--gray-200', '#e5e7eb');
      root.style.setProperty('--gray-300', '#d1d5db');
      root.style.setProperty('--gray-400', '#9ca3af');
      root.style.setProperty('--gray-500', '#6b7280');
      root.style.setProperty('--gray-600', '#4b5563');
      root.style.setProperty('--gray-700', '#374151');
      root.style.setProperty('--gray-800', '#1f2937');
      root.style.setProperty('--gray-900', '#111827');
    }

    // Forcer la couleur du texte sur le body pour les thèmes sombres
    // Mais utiliser la couleur de texte définie par le thème plutôt que de forcer une couleur
    if (isDark) {
      // Pour les thèmes sombres, utiliser la couleur de texte définie par le thème
      root.style.setProperty('--body-text-color', theme.text);
    } else {
      root.style.setProperty('--body-text-color', theme.text);
    }
  }

  private isColorDark(color: string): boolean {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }

  getAvailableThemes(): Theme[] {
    return THEMES;
  }
}
