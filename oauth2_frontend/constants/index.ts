export const CLIENT_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NODE_ENV === 'production'
    ? 'https://prototype-o-auth-2-0.vercel.app'
    : 'http://localhost:3000';
