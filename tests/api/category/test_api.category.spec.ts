/**
 * Category API Tests
 * Test cases for category management functionality
 *
 * TC_020: Add category successfully
 */

import { test } from '@playwright/test';
import { APIClient, APIAssertions } from '@utils/api-client';
import { CategorySaveRequest } from '@/types/api-types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9090';

test.describe('Category API Tests', () => {
  let apiClient: APIClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new APIClient(request, API_BASE_URL);
  });

  /**
   * TC_020: Add category successfully
   * Pre-condition: None
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_020: Add category successfully',
    {
      tag: ['@api', '@category', '@create', '@positive', '@TC_020'],
    },
    async () => {
      // Given - Valid category data
      const categoryData: CategorySaveRequest = {
        name: 'Fiction',
        remark: 'Fiction books category',
      };

      // When - Send create category request
      const response = await apiClient.post('/category/save', categoryData);

      // Then - Verify successful creation
      APIAssertions.assertSuccess(response);
    },
  );
});
