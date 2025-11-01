import apiClient from '../../config/api';
import { apiCallSuccess, apiCallError } from '../api';

/**
 * Redux Middleware for API calls
 * Uses centralized API config from /config/api.js
 */
const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== 'api/apiCall') return next(action);

    const { url, method, data, onSuccess, onError } = action.payload;

    try {
      // Use centralized apiClient which already has base URL and auth
      const response = await apiClient({
        method,
        url, // No need to add base URL, apiClient has it
        ...(data && { data }),
      });

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
