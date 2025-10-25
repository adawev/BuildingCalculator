import { createSlice } from '@reduxjs/toolkit';
import { apiCall } from '../api';

const slice = createSlice({
  name: 'project',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    getFromResponse: (state, action) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    projectSaved: (state, action) => {
      state.projects.push(action.payload);
      state.currentProject = action.payload;
      state.loading = false;
    },
    projectUpdated: (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      state.loading = false;
    },
    projectDeleted: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
      state.loading = false;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    projectStarted: (state) => {
      state.loading = true;
      state.error = null;
    },
    resError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getFromResponse,
  projectSaved,
  projectUpdated,
  projectDeleted,
  setCurrentProject,
  projectStarted,
  resError,
} = slice.actions;
export default slice.reducer;

// Action creators following EduDash pattern
export const fetchProjects = () =>
  apiCall({
    url: '/projects',
    method: 'get',
    onSuccess: (responseData) => (dispatch) => {
      dispatch(getFromResponse(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });

export const fetchProject = (id) =>
  apiCall({
    url: `/projects/${id}`,
    method: 'get',
    onSuccess: (responseData) => (dispatch) => {
      dispatch(setCurrentProject(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });

export const createProject = (data) =>
  apiCall({
    url: '/projects',
    method: 'post',
    data,
    onSuccess: (responseData) => (dispatch) => {
      dispatch(projectSaved(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });

export const updateProject = (id, data) =>
  apiCall({
    url: `/projects/${id}`,
    method: 'put',
    data,
    onSuccess: (responseData) => (dispatch) => {
      dispatch(projectUpdated(responseData));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });

export const deleteProject = (id) =>
  apiCall({
    url: `/projects/${id}`,
    method: 'delete',
    onSuccess: () => (dispatch) => {
      dispatch(projectDeleted(id));
    },
    onError: (error) => (dispatch) => {
      dispatch(resError(error));
    },
  });
