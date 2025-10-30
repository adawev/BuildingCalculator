import axios from 'axios';
import { apiCallSuccess, apiCallError } from '../api';

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== 'api/apiCall') return next(action);

    const { url, method, data, onSuccess, onError } = action.payload;

    const API_BASE_URL = 'https://api.ustabek.uz/api';

    try {
      const token = localStorage.getItem('token');

      const config = {
        method,
        url: API_BASE_URL + url,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(data && { data }),
      };

      const response = await axios(config);

      if (onSuccess) {
        const successAction = onSuccess(response.data);
        if (typeof successAction === 'function') {
          dispatch(successAction);
        } else {
          dispatch(successAction);
        }
      }

      dispatch(apiCallSuccess(response.data));
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'API call failed';

      if (onError) {
        const errorAction = onError(errorMessage);
        if (typeof errorAction === 'function') {
          dispatch(errorAction);
        } else {
          dispatch(errorAction);
        }
      }

      dispatch(apiCallError(errorMessage));
    }
  };

export default api;
