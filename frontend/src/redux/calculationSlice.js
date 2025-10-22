import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { calculationAPI } from '../services/api';

// Async thunks
export const calculateHeating = createAsyncThunk(
  'calculation/calculate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await calculationAPI.calculate(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Calculation failed');
    }
  }
);

export const fetchCalculation = createAsyncThunk(
  'calculation/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await calculationAPI.getCalculation(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch calculation');
    }
  }
);

const calculationSlice = createSlice({
  name: 'calculation',
  initialState: {
    current: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCalculation: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateHeating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateHeating.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(calculateHeating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCalculation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCalculation.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchCalculation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCalculation } = calculationSlice.actions;
export default calculationSlice.reducer;
