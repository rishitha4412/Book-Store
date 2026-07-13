import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#0062ff', // Base hex fallback, overridden with CSS variables in styles
    },
    secondary: {
      main: '#7c3aed',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 20px',
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-inverse)',
          '&:hover': {
            backgroundColor: 'var(--color-primary-hover)',
          },
        },
        containedSecondary: {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--text-inverse)',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-hover)',
          },
        },
        outlined: {
          borderColor: 'var(--border-main)',
          color: 'var(--text-main)',
          '&:hover': {
            borderColor: 'var(--color-primary)',
            backgroundColor: 'rgba(0, 98, 255, 0.04)',
          },
        },
        text: {
          color: 'var(--text-main)',
          '&:hover': {
            backgroundColor: 'rgba(0, 98, 255, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-main)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          backgroundColor: 'var(--bg-surface)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-main)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--text-muted)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: 'var(--text-muted)',
          },
          '& label.Mui-focused': {
            color: 'var(--color-primary)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-main)',
          backgroundImage: 'none', // Remove default dark mode gray overlay
        },
      },
    },
  },
});
