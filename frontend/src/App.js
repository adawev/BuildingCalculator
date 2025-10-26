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

  // Create theme with green/white color scheme
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
      background: {
        default: '#f5f7f6',
        paper: '#ffffff',
      },
      success: {
        main: '#576861',
      },
      warning: {
        main: '#f59e0b',
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
