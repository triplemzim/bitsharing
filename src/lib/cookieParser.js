/* eslint-disable */


import Cookies from 'universal-cookie';

export const cookies = new Cookies();

// const defaultCookieOptions = {
//   path: '/',
//   sameSite: 'none',
//   secure: true,
// };
export const setCookie = (name, values) => {
  cookies.set(name, value);
};

// options = {}, includeDefaultOptions = true
export const getCookie = (names) => {
  return cookies.get(name);
};
export const removeCookie = (
  name
) => {
  cookies.remove(name);
};
