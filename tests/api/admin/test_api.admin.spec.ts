/* eslint-disable no-empty-pattern */
/**
 * Admin API Tests
 * Test cases for admin login functionality
 *
 * TC_001: Admin login successfully
 * TC_002: Admin login with empty email
 * TC_003: Admin login with wrong password
 */

import { test, expect } from '@playwright/test';
import { APIClient, APIAssertions } from '@utils/api-client';
import { AdminLoginRequest } from '@/types/api-types';
import { apiExcelResultWriter } from '@utils/api-excel-result-writer';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9090';

test.describe('Admin API Tests', () => {
  let apiClient: APIClient;

  test.beforeAll(async () => {
    // Increment run count at the start of the test suite
    apiExcelResultWriter.incrementRunCount();
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new APIClient(request, API_BASE_URL);
  });

  test.afterEach(async ({}, testInfo) => {
    // Write test result to Excel after each test
    await apiExcelResultWriter.writeResult(testInfo);
  });

  /**
   * TC_001: Admin login successfully
   * Pre-condition: Admin account exists with email "admin@test.com" and password "123456"
   * Expected: 200, {"code":"200","msg":"","data":{admin_object}}
   */
  test(
    'TC_001: Admin login successfully',
    {
      tag: ['@api', '@admin', '@login', '@positive', '@TC_001'],
    },
    async () => {
      // Given - Valid admin credentials
      const loginData: AdminLoginRequest = {
        email: 'admin02@libman.com',
        password: '000000',
      };

      // When - Send login request
      const response = await apiClient.post('/admin/login', loginData);

      // Then - Verify successful login
      APIAssertions.assertSuccess(response);
      expect(response.body.data).toBeDefined();
    },
  );

  /**
   * TC_002: Admin login with empty email
   * Pre-condition: None
   * Expected: 400, {"code":"400","msg":"メールアドレスを入力してください"}
   */
  test(
    'TC_002: Admin login with empty email',
    {
      tag: ['@api', '@admin', '@login', '@negative', '@TC_002'],
    },
    async () => {
      // Given - Empty email
      const loginData: AdminLoginRequest = {
        email: '',
        password: '000000',
      };

      // When - Send login request
      const response = await apiClient.post('/admin/login', loginData);

      // Then - Verify validation error
      APIAssertions.assertError(response, 400, 'メールアドレスを入力してください');
    },
  );

  /**
   * TC_003: Admin login with wrong password
   * Pre-condition: Admin account exists
   * Expected: 400, {"code":"400","msg":"メールアドレスまたはパスワードが間違っています"}
   */
  test(
    'TC_003: Admin login with wrong password',
    {
      tag: ['@api', '@admin', '@login', '@negative', '@TC_003'],
    },
    async () => {
      // Given - Wrong password
      const loginData: AdminLoginRequest = {
        email: 'admin02@libman.com',
        password: 'wrongpass',
      };

      // When - Send login request
      const response = await apiClient.post('/admin/login', loginData);

      // Then - Verify authentication error
      APIAssertions.assertError(response, 400, 'メールアドレスまたはパスワードが間違っています');
    },
  );
});
