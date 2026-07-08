import basicAuth from 'express-basic-auth';

export const adminAuth = basicAuth({
  users: { 'admin': 'Rusree3009' },
  challenge: true,
  realm: 'The Egg Story Admin',
});
