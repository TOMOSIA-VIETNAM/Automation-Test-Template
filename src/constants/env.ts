// Simple environment configuration for Playwright tests
export const ENV = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:8081',
  LOGIN_PATH: '/login',
  DASHBOARD_PATH: '/home',
};

export const TIMEOUTS = {
  NAVIGATION: 30000,
  ACTION: 10000,
  ASSERTION: 5000,
};
