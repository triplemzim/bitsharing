/* eslint-disable no-undef */
function getBaseBackendURL() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000/';
  }
  return 'https://restsoft.pythonanywhere.com/';
}

export const BASE_BACKEND_URL = `${getBaseBackendURL()}api`;

export const getBitsByCodeURL = (code) => `${BASE_BACKEND_URL}/get_bits?code=${encodeURIComponent(code)}`;
export const getContentByBitURL = (id) => `${BASE_BACKEND_URL}/contents?bits=${id}`;
export const patchContentURL = (id) => `${BASE_BACKEND_URL}/contents/${id}/`;
export const postContentURL = () => `${BASE_BACKEND_URL}/contents/`;
export const patchBitURL = (id) => `${BASE_BACKEND_URL}/bits/${id}/`;

export const isNullOrUndefined = (value) => {
  return value === null || value === undefined || value === '';
};

