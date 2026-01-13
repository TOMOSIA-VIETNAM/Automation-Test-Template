/**
 * Borrow/Return API Tests
 * Test cases for borrow and return functionality
 *
 * TC_016: Borrow book successfully
 * TC_017: Borrow book when user does not exist
 * TC_018: Borrow book when credit is insufficient
 * TC_019: Return book successfully
 */

import { test } from '@playwright/test';
import { APIClient, APIAssertions } from '@utils/api-client';
import { BorrowSaveRequest, ReturnSaveRequest } from '@/types/api-types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9090';

test.describe('Borrow/Return API Tests', () => {
  let apiClient: APIClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new APIClient(request, API_BASE_URL);
  });

  /**
   * TC_016: Borrow book successfully
   * Pre-condition: User "user1@test.com" exists, Book "1234567890" exists with number>0, User has enough credit
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_016: Borrow book successfully',
    {
      tag: ['@api', '@borrow', '@create', '@positive', '@TC_016'],
    },
    async () => {
      // Given - Valid borrow data
      const borrowData: BorrowSaveRequest = {
        email: 'user1@test.com',
        isbn: '1234567890',
        duration: 7,
      };

      // When - Send borrow request
      const response = await apiClient.post('/borrow/save', borrowData);

      // Then - Verify successful borrow
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_017: Borrow book when user does not exist
   * Pre-condition: None
   * Expected: 400, {"code":"400","msg":"ユーザーが存在しません"}
   */
  test(
    'TC_017: Borrow book when user does not exist',
    {
      tag: ['@api', '@borrow', '@create', '@negative', '@TC_017'],
    },
    async () => {
      // Given - Non-existent user
      const borrowData: BorrowSaveRequest = {
        email: 'notexist@test.com',
        isbn: '1234567890',
        duration: 7,
      };

      // When - Send borrow request
      const response = await apiClient.post('/borrow/save', borrowData);

      // Then - Verify error for non-existent user
      APIAssertions.assertError(response, 400, 'ユーザーが存在しません');
    },
  );

  /**
   * TC_018: Borrow book when credit is insufficient
   * Pre-condition: User exists but credit < book credit
   * Expected: 400, {"code":"400","msg":"アカウントのクレジットが不足しています"}
   */
  test(
    'TC_018: Borrow book when credit is insufficient',
    {
      tag: ['@api', '@borrow', '@create', '@negative', '@TC_018'],
    },
    async () => {
      // Given - User with insufficient credit
      const borrowData: BorrowSaveRequest = {
        email: 'user1@test.com',
        isbn: '1234567890',
        duration: 7,
      };

      // When - Send borrow request
      const response = await apiClient.post('/borrow/save', borrowData);

      // Then - Verify error for insufficient credit
      APIAssertions.assertError(response, 400, 'アカウントのクレジットが不足しています');
    },
  );

  /**
   * TC_019: Return book successfully
   * Pre-condition: Borrow record exists for user1@test.com and ISBN 1234567890
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_019: Return book successfully',
    {
      tag: ['@api', '@return', '@create', '@positive', '@TC_019'],
    },
    async () => {
      // Given - Valid return data
      const returnData: ReturnSaveRequest = {
        email: 'user1@test.com',
        isbn: '1234567890',
        id: 1,
      };

      // When - Send return request (note: endpoint is /retern/save as per Excel)
      const response = await apiClient.post('/retern/save', returnData);

      // Then - Verify successful return
      APIAssertions.assertSuccess(response);
    },
  );
});
