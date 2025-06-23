export type ThemeMode = 'architect' | 'alchemist' | 'default';

export const themes = {
  architect: {
    primary: 'hsl(220, 91%, 60%)',
    primaryForeground: 'hsl(220, 91%, 15%)',
    secondary: 'hsl(220, 20%, 95%)',
    accent: 'hsl(220, 91%, 60%)',
    description: 'Systematic, structured, data-driven approach'
  },
  alchemist: {
    primary: 'hsl(43, 96%, 56%)',
    primaryForeground: 'hsl(43, 96%, 15%)',
    secondary: 'hsl(43, 20%, 95%)',
    accent: 'hsl(43, 96%, 56%)',
    description: 'Intuitive, creative, relationship-focused approach'
  },
  default: {
    primary: 'hsl(221.2, 83.2%, 53.3%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(210, 40%, 96%)',
    accent: 'hsl(210, 40%, 96%)',
    description: 'Balanced approach for exploration'
  }
};

export function applyTheme(mode: ThemeMode) {
  const theme = themes[mode];
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', theme.primaryForeground);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  
  // Update body class for theme-specific styling
  document.body.className = document.body.className.replace(/\b(architect|alchemist|default)-theme\b/g, '');
  document.body.classList.add(`${mode}-theme`);
}