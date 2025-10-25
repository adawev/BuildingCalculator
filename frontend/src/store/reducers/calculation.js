import { createSlice } from '@reduxjs/toolkit';
import { apiCall } from '../api';

const slice = createSlice({
  name: 'calculation',
  initialState: {
    current: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    getFromResponse: (state, action) => {
      state.current = action.payload;
      state.history.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    calculationStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    resError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCalculation: (state) => {
      state.current = null;
      state.error = null;
    },
  },
});

export const { getFromResponse, calculationStarted, resError, clearCalculation } = slice.actions;
export default slice.reducer;

// Action creators following EduDash pattern
export const calculateHeating = (data) =>
  apiCall({
    url: '/calculations',
    method: 'post',
    data,
    onSuccess: (responseData) => (dispatch) => {
      dispatch(getFromResponse(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });

export const fetchCalculation = (id) =>
  apiCall({
    url: `/calculations/${id}`,
    method: 'get',
    onSuccess: (responseData) => (dispatch) => {
      dispatch(getFromResponse(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });

export const fetchProjectCalculations = (projectId) =>
  apiCall({
    url: `/calculations/project/${projectId}`,
    method: 'get',
    onSuccess: (responseData) => (dispatch) => {
      dispatch(getFromResponse(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });
