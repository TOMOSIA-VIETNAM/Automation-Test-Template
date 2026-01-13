import { defineConfig, devices } from '@playwright/test';
import { ENV } from '@constants/env';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const isUIMode = process.env.PW_UI_MODE === '1' || process.env.UI_MODE === '1';
const isHeadedMode = process.env.PW_HEADED === '1' || process.env.HEADED === '1';

export default defineConfig({
  testDir: './tests',

  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ['line'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['html', { outputFolder: 'tests/reports/playwright/playwright-report' }],
        ['allure-playwright', { outputFolder: 'tests/reports/allure/allure-results' }],
      ]
    : [
        ['line'],
        ['html', { outputFolder: 'tests/reports/playwright/playwright-report' }],
        ['allure-playwright', { outputFolder: 'tests/reports/allure/allure-results' }],
      ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Capture screenshot, video and trace for all tests (success or failure) */
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    /* Enable headed mode when running in UI mode or headed mode */
    headless: !(isUIMode || isHeadedMode),
  },

  /* Configure projects for Backend and Frontend tests */
  projects: [
    /* Backend API Tests - Add device for UI mode visibility */
    {
      name: 'backend',
      testMatch: /.*test_api.*\.spec\.ts$/,
      use: {
        // API tests don't need browser, but add device for UI mode compatibility
        ...devices['Desktop Chrome'],
        // Allow non-headless in UI mode for better visibility
        headless: !isUIMode,
      },
    },
    /* Frontend E2E Tests - Browser required */
    {
      name: 'frontend-chromium',
      testMatch: /.*\.spec\.ts$/,
      testIgnore: /.*test_api.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ENV.BASE_URL,
        /* Enable headed mode when running in UI mode or headed mode */
        headless: !(isUIMode || isHeadedMode),
      },
    },

    {
      name: 'frontend-firefox',
      testMatch: /.*\.spec\.ts$/,
      testIgnore: /.*test_api.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: ENV.BASE_URL,
        /* Enable headed mode when running in UI mode or headed mode */
        headless: !(isUIMode || isHeadedMode),
      },
    },

    {
      name: 'frontend-webkit',
      testMatch: /.*\.spec\.ts$/,
      testIgnore: /.*test_api.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Safari'],
        baseURL: ENV.BASE_URL,
        /* Enable headed mode when running in UI mode or headed mode */
        headless: !(isUIMode || isHeadedMode),
      },
    },
  ],
});
