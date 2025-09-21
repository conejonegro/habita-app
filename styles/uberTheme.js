// Uber-inspired Design System
export const UberColors = {
  // Base colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Primary blue
  primaryBlue: '#007AFF',
  primaryBlueLight: '#4A9EFF',
  
  // Grays
  gray900: '#1C1C1E',
  gray800: '#2C2C2E',
  gray700: '#3A3A3C',
  gray600: '#48484A',
  gray500: '#636366',
  gray400: '#8E8E93',
  gray300: '#AEAEB2',
  gray200: '#C7C7CC',
  gray100: '#D1D1D6',
  gray50: '#F2F2F7',
  
  // Accent colors
  green: '#34C759',
  orange: '#FF9500',
  red: '#FF3B30',
  yellow: '#FFCC00',
  
  // Button colors
  buttonPrimary: '#E5E5EA',
  buttonText: '#1C1C1E',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#FFFFFF',
  backgroundDark: '#000000',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textWhite: '#FFFFFF',
  
  // Border colors
  border: '#C7C7CC',
  borderLight: '#E5E5EA',
};

export const UberTypography = {
  // Font families - Using system fonts for now
  fontFamily: 'System',
  fontFamilyMedium: 'System',
  fontFamilySemiBold: 'System',
  fontFamilyBold: 'System',
  fontFamilyExtraBold: 'System',
  fontFamilyBlack: 'System',
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const UberSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const UberShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const UberBorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};
