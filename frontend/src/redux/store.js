import { configureStore } from '@reduxjs/toolkit';
import calculationReducer from './calculationSlice';
import projectReducer from './projectSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    calculation: calculationReducer,
    project: projectReducer,
    theme: themeReducer,
  },
});

export default store;
