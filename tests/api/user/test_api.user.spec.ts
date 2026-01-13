/**
 * User API Tests
 * Test cases for user management functionality
 *
 * TC_004: Add user successfully
 * TC_005: Add user with invalid email
 * TC_006: Add user with age not a number
 * TC_007: Charge user credit successfully
 * TC_008: Delete user successfully
 * TC_009: Get paginated user list
 */

import { test, expect } from '@playwright/test';
import { APIClient, APIAssertions } from '@utils/api-client';
import { UserSaveRequest, UserChargeRequest, UserPageResponse } from '@/types/api-types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9090';

test.describe('User API Tests', () => {
  let apiClient: APIClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new APIClient(request, API_BASE_URL);
  });

  /**
   * TC_004: Add user successfully
   * Pre-condition: None
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_004: Add user successfully',
    {
      tag: ['@api', '@user', '@create', '@positive', '@TC_004'],
    },
    async () => {
      // Given - Valid user data
      const userData: UserSaveRequest = {
        email: 'user1@test.com',
        username: 'User1',
        fname: 'First',
        lname: 'Last',
        phone: '1234567890',
        age: 25,
        gender: 'Male',
        uid: 'U001',
      };

      // When - Send create user request
      const response = await apiClient.post('/user/save', userData);

      // Then - Verify successful creation
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_005: Add user with invalid email
   * Pre-condition: None
   * Expected: 400, {"code":"400","msg":"不正なメールアドレス"}
   */
  test(
    'TC_005: Add user with invalid email',
    {
      tag: ['@api', '@user', '@create', '@negative', '@TC_005'],
    },
    async () => {
      // Given - Invalid email format
      const userData: UserSaveRequest = {
        email: 'invalid-email',
        username: 'User1',
        fname: 'First',
        lname: 'Last',
        phone: '1234567890',
      };

      // When - Send create user request
      const response = await apiClient.post('/user/save', userData);

      // Then - Verify validation error
      APIAssertions.assertError(response, 400, '不正なメールアドレス');
    },
  );

  /**
   * TC_006: Add user with age not a number
   * Pre-condition: None
   * Expected: 400, {"code":"400","msg":"数値を入力してください"}
   */
  test(
    'TC_006: Add user with age not a number',
    {
      tag: ['@api', '@user', '@create', '@negative', '@TC_006'],
    },
    async () => {
      // Given - Invalid age (not a number)
      const userData = {
        email: 'user2@test.com',
        username: 'User2',
        age: 'abc', // Invalid: not a number
      };

      // When - Send create user request
      const response = await apiClient.post('/user/save', userData);

      // Then - Verify validation error
      APIAssertions.assertError(response, 400, '数値を入力してください');
    },
  );

  /**
   * TC_007: Charge user credit successfully
   * Pre-condition: User exists with email "user1@test.com"
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_007: Charge user credit successfully',
    {
      tag: ['@api', '@user', '@charge', '@positive', '@TC_007'],
    },
    async () => {
      // Given - Valid charge data
      const chargeData: UserChargeRequest = {
        email: 'user1@test.com',
        charge: 100,
      };

      // When - Send charge request
      const response = await apiClient.post('/user/charge', chargeData);

      // Then - Verify successful charge
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_008: Delete user successfully
   * Pre-condition: User exists with email "user1@test.com"
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_008: Delete user successfully',
    {
      tag: ['@api', '@user', '@delete', '@positive', '@TC_008'],
    },
    async () => {
      // Given - User email to delete
      const email = 'user1@test.com';

      // When - Send delete request
      const response = await apiClient.delete(`/user/delete/${email}`);

      // Then - Verify successful deletion
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_009: Get paginated user list
   * Pre-condition: Multiple users exist
   * Expected: 200, {"code":"200","data":{"list":[...],"total":10}}
   */
  test(
    'TC_009: Get paginated user list',
    {
      tag: ['@api', '@user', '@list', '@positive', '@TC_009'],
    },
    async () => {
      // Given - Pagination parameters
      const params = {
        pageNum: 1,
        pageSize: 10,
      };

      // When - Send list request
      const response = await apiClient.get<UserPageResponse>('/user/page', params);

      // Then - Verify successful response with pagination data
      APIAssertions.assertSuccess(response);
      expect(response.body.data).toBeDefined();
      expect(response.body.data?.list).toBeDefined();
      expect(Array.isArray(response.body.data?.list)).toBe(true);
    },
  );
});
