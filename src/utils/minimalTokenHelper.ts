// token-utils.js
export const TOKEN_KEY = 'app_token';

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// decode payload (not verifying signature) to get claims like exp, roles, email
export function parseJwt(token: string) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  const payload = parseJwt(token);
  if (!payload) return true;
  // exp is in seconds since epoch
  const now = Math.floor(Date.now() / 1000);
  return payload.exp && payload.exp < now;
}
