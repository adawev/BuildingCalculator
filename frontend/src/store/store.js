import { configureStore } from '@reduxjs/toolkit';
import calculationReducer from './reducers/calculation';
import projectReducer from './reducers/project';
import themeReducer from '../features/theme/themeSlice';
import api from './middleware/api';

export const store = configureStore({
  reducer: {
    calculation: calculationReducer,
    project: projectReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
});

export default store;
