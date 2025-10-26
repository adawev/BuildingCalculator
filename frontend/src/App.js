import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { createProject } from './store/reducers/project';
import LandingPage from './pages/LandingPage/LandingPage';
import CalculatorPage from './pages/CalculatorPage/CalculatorPage';
import MultiRoomCalculator from './pages/MultiRoomCalculator/MultiRoomCalculator';

function App() {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);

  // Create theme with #576861 primary, white secondary, and colorful accents
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Inter',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        'sans-serif',
      ].join(','),
    },
    palette: {
      primary: {
        main: '#576861',
        light: '#6f8179',
        dark: '#3f4f48',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ffffff',
        contrastText: '#576861',
      },
      success: {
        main: '#22c55e',
        light: '#4ade80',
        dark: '#16a34a',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
      background: {
        default: '#f8f9fa',
        paper: '#ffffff',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  // No need to create default project anymore - calculations work without a project

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/multi-room" element={<MultiRoomCalculator />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
