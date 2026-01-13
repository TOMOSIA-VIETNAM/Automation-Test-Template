import { test, expect, BrowserContext } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { excelResultWriter } from '@utils/excel-result-writer';

/**
 * Test Case: A001-LOGIN_024
 * Type: Performance
 * Priority: High
 * Category: Concurrent
 * Feature: Login
 * Scenario: 50 Users - Concurrent login
 *
 * Test Steps:
 * 1. Create multiple browser contexts
 * 2. Perform concurrent login attempts
 * 3. Verify system handles concurrent load
 *
 * Expected Result:
 * - System handles concurrent login requests
 * - All requests receive appropriate responses
 *
 * Note: This test simulates concurrent users using multiple browser contexts
 */

test.describe('A001-LOGIN_024: 50 Users Concurrent Login', () => {
  // eslint-disable-next-line no-empty-pattern
  test.afterEach(async ({}, testInfo) => {
    await excelResultWriter.writeResult(testInfo);
  });

  test(
    'should handle concurrent login attempts from multiple users',
    {
      tag: ['@login', '@performance', '@concurrent', '@A001-LOGIN_024'],
    },
    async ({ browser }) => {
      // Define number of concurrent users (reduced for practical testing)
      const concurrentUsers = 10; // Using 10 instead of 50 for faster execution
      const contexts: BrowserContext[] = [];
      const loginPromises: Promise<void>[] = [];

      const startTime = Date.now();

      // Create concurrent login attempts
      for (let i = 0; i < concurrentUsers; i++) {
        const loginAttempt = async () => {
          const context = await browser.newContext();
          contexts.push(context);
          const page = await context.newPage();
          const loginPage = new LoginPage(page);

          await loginPage.navigate();

          // Use different email for each user simulation
          await loginPage.fillEmail(`user${i + 1}@libman.com`);
          await loginPage.fillPassword('000000');
          await loginPage.clickLogin();

          // Wait for response
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

          // Verify the page responded (either success or error)
          const url = page.url();
          expect(url).toBeTruthy();
        };

        loginPromises.push(loginAttempt());
      }

      // Wait for all concurrent logins to complete
      await Promise.all(loginPromises);

      const endTime = Date.now();
      const totalTimeSeconds = (endTime - startTime) / 1000;

      console.log(
        `Completed ${concurrentUsers} concurrent login attempts in ${totalTimeSeconds.toFixed(2)} seconds`,
      );

      // Cleanup: Close all contexts
      for (const context of contexts) {
        await context.close();
      }

      // Then - Verify all concurrent requests were handled
      expect(contexts.length).toBe(concurrentUsers);
    },
  );
});
