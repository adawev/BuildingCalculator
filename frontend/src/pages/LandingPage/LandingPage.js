import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import logo from '../../features/images/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  // Redirect to multi-room calculator immediately
  React.useEffect(() => {
    navigate('/multi-room');
  }, [navigate]);

  return null; // Redirect happens in useEffect
};

export default LandingPage;
