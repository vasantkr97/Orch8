/**
 * Design System
 * Central design tokens for the orch8 Workflow application
 */

export const colors = {
  // Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Accent Colors
  accent: {
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#06b6d4',
    teal: '#14b8a6',
  },

  // Status Colors
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#059669',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },

  // Neutral Colors (Dark Theme)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    850: '#1a1f2e',
    900: '#111827',
    950: '#0a0e1a',
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const borderRadius = {
  sm: '0.375rem',   // 6px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: {
    blue: '0 0 20px rgba(59, 130, 246, 0.5)',
    purple: '0 0 20px rgba(139, 92, 246, 0.5)',
    green: '0 0 20px rgba(16, 185, 129, 0.5)',
  },
};

export const transitions = {
  fast: '150ms ease-in-out',
  DEFAULT: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
};

export const typography = {
  fonts: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const animations = {
  fadeIn: 'fadeIn 0.3s ease-in-out',
  slideUp: 'slideUp 0.3s ease-out',
  slideDown: 'slideDown 0.3s ease-out',
  slideLeft: 'slideLeft 0.3s ease-out',
  slideRight: 'slideRight 0.3s ease-out',
  scaleIn: 'scaleIn 0.2s ease-out',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  spin: 'spin 1s linear infinite',
  bounce: 'bounce 1s infinite',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};


