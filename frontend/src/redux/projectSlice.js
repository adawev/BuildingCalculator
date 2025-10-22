import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectAPI } from '../services/api';

export const fetchProjects = createAsyncThunk(
  'project/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await projectAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.currentProject = action.payload;
      });
  },
});

export const { setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
