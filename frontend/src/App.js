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

  // Create theme with better font
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
        main: '#667eea',
      },
      secondary: {
        main: '#764ba2',
      },
      success: {
        main: '#10b981',
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
