/**
 * Book API Tests
 * Test cases for book management functionality
 *
 * TC_010: Add book successfully
 * TC_011: Add book with empty ISBN
 * TC_012: Add book with invalid ISBN
 * TC_013: Update book successfully
 * TC_014: Delete book successfully
 * TC_015: Get book information by ISBN
 */

import { test, expect } from '@playwright/test';
import { APIClient, APIAssertions } from '@utils/api-client';
import { BookSaveRequest, BookUpdateRequest, BookData } from '@/types/api-types';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9090';

test.describe('Book API Tests', () => {
  let apiClient: APIClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new APIClient(request, API_BASE_URL);
  });

  /**
   * TC_010: Add book successfully
   * Pre-condition: None
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_010: Add book successfully',
    {
      tag: ['@api', '@book', '@create', '@positive', '@TC_010'],
    },
    async () => {
      // Given - Valid book data
      const bookData: BookSaveRequest = {
        isbn: '1234567890',
        name: 'Test Book',
        description: 'Description',
        category: 'Fiction',
        publish_date: '2024-01-01',
        author: 'Author Name',
        publisher: 'Publisher',
        credit: 10,
        number: 5,
      };

      // When - Send create book request
      const response = await apiClient.post('/book/save', bookData);

      // Then - Verify successful creation
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_011: Add book with empty ISBN
   * Pre-condition: None
   * Expected: 400, {"code":"400","msg":"書籍のISBNを入力してください"}
   */
  test(
    'TC_011: Add book with empty ISBN',
    {
      tag: ['@api', '@book', '@create', '@negative', '@TC_011'],
    },
    async () => {
      // Given - Empty ISBN
      const bookData = {
        isbn: '',
        name: 'Test Book',
        author: 'Author',
      };

      // When - Send create book request
      const response = await apiClient.post('/book/save', bookData);

      // Then - Verify validation error
      APIAssertions.assertError(response, 400, '書籍のISBNを入力してください');
    },
  );

  /**
   * TC_012: Add book with invalid ISBN
   * Pre-condition: None
   * Expected: 400, {"code":"400","msg":"不正なISBN"}
   */
  test(
    'TC_012: Add book with invalid ISBN',
    {
      tag: ['@api', '@book', '@create', '@negative', '@TC_012'],
    },
    async () => {
      // Given - Invalid ISBN format (too short)
      const bookData = {
        isbn: '123',
        name: 'Test Book',
      };

      // When - Send create book request
      const response = await apiClient.post('/book/save', bookData);

      // Then - Verify validation error
      APIAssertions.assertError(response, 400, '不正なISBN');
    },
  );

  /**
   * TC_013: Update book successfully
   * Pre-condition: Book exists with ISBN "1234567890"
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_013: Update book successfully',
    {
      tag: ['@api', '@book', '@update', '@positive', '@TC_013'],
    },
    async () => {
      // Given - Updated book data
      const bookData: BookUpdateRequest = {
        isbn: '1234567890',
        name: 'Updated Book',
        author: 'New Author',
        publisher: 'New Publisher',
        credit: 15,
        number: 10,
      };

      // When - Send update book request
      const response = await apiClient.put('/book/update', bookData);

      // Then - Verify successful update
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_014: Delete book successfully
   * Pre-condition: Book exists with ISBN "1234567890"
   * Expected: 200, {"code":"200","msg":""}
   */
  test(
    'TC_014: Delete book successfully',
    {
      tag: ['@api', '@book', '@delete', '@positive', '@TC_014'],
    },
    async () => {
      // Given - ISBN to delete
      const isbn = '1234567890';

      // When - Send delete book request
      const response = await apiClient.delete(`/book/delete/${isbn}`);

      // Then - Verify successful deletion
      APIAssertions.assertSuccess(response);
    },
  );

  /**
   * TC_015: Get book information by ISBN
   * Pre-condition: Book exists with ISBN "1234567890"
   * Expected: 200, {"code":"200","data":{book_object}}
   */
  test(
    'TC_015: Get book information by ISBN',
    {
      tag: ['@api', '@book', '@get', '@positive', '@TC_015'],
    },
    async () => {
      // Given - ISBN to get
      const isbn = '1234567890';

      // When - Send get book request
      const response = await apiClient.get<BookData>(`/book/${isbn}`);

      // Then - Verify successful response with book data
      APIAssertions.assertSuccess(response);
      expect(response.body.data).toBeDefined();
    },
  );
});
