import { createAction } from '@reduxjs/toolkit';

export const apiCall = createAction('api/apiCall', function prepare(payload) {
  return { payload };
});

export const apiCallSuccess = createAction('api/apiCallSuccess');
export const apiCallError = createAction('api/apiCallError');
