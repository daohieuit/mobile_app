export const Theme = {
  colors: {
    primary: '#C2A68C', // Earthy Clay
    primaryDark: '#5D866C', // Green Accent
    primaryLight: '#E6D8C3', // Light Clay
    secondary: '#EFE9E3', // Beige Surface
    cta: '#5D866C', // Green
    ctaDark: '#5D866C', // Green
    background: '#F9F8F6', // Main Background
    text: '#5D866C', // Dark Green Text
    textMuted: '#C2A68C', // Clay Text
    white: '#FFFFFF',
    danger: '#EF4444',
    card: '#F5F5F0', // Off-white Card
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 12,
    m: 20,
    l: 30, // Very rounded for Clay effect
    xl: 40,
  },
  shadows: {
    clay: {
      shadowColor: '#C2A68C', // Clay Shadow
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },
    clayPressed: {
      shadowColor: '#C2A68C',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    inner: {
      // Inner shadow simulation (border, bg) handled in component
    }
  }
};

export const Colors = {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: Theme.colors.primary,
    icon: Theme.colors.textMuted,
    tabIconDefault: Theme.colors.textMuted,
    tabIconSelected: Theme.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: Theme.colors.white,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: Theme.colors.white,
  },
};
