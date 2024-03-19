import { createTheme } from 'rsuite-theme';

const myTheme = createTheme({
  // Color Palette
  palette: {
    // Primary colors
    primary50: '#E6F7FF',
    primary100: '#BAE7FF',
    primary200: '#91D5FF',
    primary300: '#69C0FF',
    primary400: '#40A9FF',
    primary500: '#1890FF', // Primary color
    primary600: '#096DD9',
    primary700: '#0050B3',
    primary800: '#003A8C',
    primary900: '#002766',
    // Success colors
    success50: '#F6FFED',
    success100: '#D9F7BE',
    success200: '#B7EB8F',
    success300: '#95DE64',
    success400: '#73D13D',
    success500: '#52C41A', // Success color
    success600: '#389E0D',
    success700: '#237804',
    success800: '#135200',
    success900: '#092B00',
    // Error colors
    error50: '#FFF1F0',
    error100: '#FFCCC7',
    error200: '#FFA39E',
    error300: '#FF7875',
    error400: '#FF4D4F',
    error500: '#FF3333', // Error color
    error600: '#CC1F1A',
    error700: '#991B12',
    error800: '#66140D',
    error900: '#3D0D08',
    // Warning colors
    warning50: '#FFFBE6',
    warning100: '#FFF1B8',
    warning200: '#FFE58F',
    warning300: '#FFD666',
    warning400: '#FFC53D',
    warning500: '#FAAD14', // Warning color
    warning600: '#D48806',
    warning700: '#AD6800',
    warning800: '#874D00',
    warning900: '#613400',
    // Info colors
    info50: '#E6F7FF',
    info100: '#BAE7FF',
    info200: '#91D5FF',
    info300: '#69C0FF',
    info400: '#40A9FF',
    info500: '#1890FF', // Info color
    info600: '#096DD9',
    info700: '#0050B3',
    info800: '#003A8C',
    info900: '#002766',
    // Text colors
    textPrimary: '#333333',
    textSecondary: '#666666',
    textDisabled: '#999999',
    // Background colors
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundDisabled: '#E8E8E8',
    // Border colors
    borderPrimary: '#E8E8E8',
    borderSecondary: '#CCCCCC',
    borderDisabled: '#D9D9D9',
    // Button colors
    buttonPrimary: '#1890FF',
    buttonSuccess: '#52C41A',
    buttonError: '#FF3333',
    buttonWarning: '#FAAD14',
    buttonInfo: '#1890FF',
    // Input colors
    inputBorder: '#D9D9D9',
    inputFocusBorder: '#40A9FF',
    inputPlaceholder: '#A6A6A6',
  },
  // Font
  font: {
    fontFamily: 'Arial, sans-serif',
    fontSizeBase: '14px',
  },
  // Border
  border: {
    borderRadius: '4px',
  },
  // Shadow
  shadow: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  // Spacing
  spacing: {
    unit: '8px',
  },
  // Breakpoints
  breakpoints: {
    xs: '0',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  // Container
  container: {
    maxWidth: '1200px',
  },
  // Z-Index
  zIndex: {
    dropdown: '1000',
    modal: '1000',
    notification: '1040',
    overlay: '1050',
    drawer: '1060',
  },
});

export default myTheme;
