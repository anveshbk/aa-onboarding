
export const themeColors = {
  primary: {
    50: 'hsl(215, 100%, 97%)',
    100: 'hsl(215, 100%, 92%)',
    200: 'hsl(215, 100%, 86%)',
    300: 'hsl(215, 96%, 78%)',
    400: 'hsl(215, 94%, 68%)',
    500: 'hsl(215, 90%, 60%)',
    600: 'hsl(216, 98%, 52%)',
    700: 'hsl(217, 92%, 45%)',
    800: 'hsl(217, 78%, 38%)',
    900: 'hsl(218, 67%, 32%)',
    950: 'hsl(221, 60%, 22%)'
  },
  neutral: {
    50: 'hsl(210, 20%, 98%)',
    100: 'hsl(220, 14%, 96%)',
    200: 'hsl(220, 13%, 91%)',
    300: 'hsl(216, 12%, 84%)',
    400: 'hsl(218, 11%, 65%)',
    500: 'hsl(220, 9%, 46%)',
    600: 'hsl(215, 14%, 34%)',
    700: 'hsl(217, 19%, 27%)',
    800: 'hsl(215, 28%, 17%)',
    900: 'hsl(221, 39%, 11%)',
    950: 'hsl(224, 71%, 4%)'
  },
  error: {
    50: 'hsl(0, 86%, 97%)',
    500: 'hsl(0, 84%, 60%)',
    900: 'hsl(0, 73%, 41%)'
  },
  success: {
    50: 'hsl(143, 85%, 96%)',
    500: 'hsl(142, 69%, 58%)',
    900: 'hsl(142, 72%, 29%)'
  },
  warning: {
    50: 'hsl(48, 100%, 96%)',
    500: 'hsl(38, 92%, 50%)',
    900: 'hsl(32, 81%, 29%)'
  },
  info: {
    50: 'hsl(214, 100%, 97%)',
    500: 'hsl(214, 100%, 60%)',
    900: 'hsl(215, 96%, 32%)'
  }
};

export const themeConfig = {
  colors: themeColors,
  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
    none: 'none'
  },
  transitions: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    instant: 'all 0s',
    fast: 'all 150ms',
    normal: 'all 300ms',
    slow: 'all 450ms',
    slower: 'all 600ms'
  },
  inputs: {
    borderColor: themeColors.neutral[300],
    focusBorderColor: themeColors.primary[500],
    errorBorderColor: themeColors.error[500],
    borderRadius: '0.375rem',
    height: '2.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    type: 'text'
  },
  buttons: {
    primary: {
      bg: themeColors.primary[600],
      hoverBg: themeColors.primary[700],
      activeBg: themeColors.primary[800],
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
      height: '2.5rem',
      paddingX: '1rem',
      borderRadius: '0.375rem'
    },
    secondary: {
      bg: themeColors.neutral[200],
      hoverBg: themeColors.neutral[300],
      activeBg: themeColors.neutral[400],
      color: themeColors.neutral[700],
      fontSize: '0.875rem',
      fontWeight: '500',
      height: '2.5rem',
      paddingX: '1rem',
      borderRadius: '0.375rem'
    }
  }
};

export default themeConfig;
