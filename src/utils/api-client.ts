/**
 * API Client Utility
 * Provides helper methods for backend API testing with Playwright
 */

import { APIRequestContext, expect } from '@playwright/test';
import { APIResponse } from '@/types/api-types';

// Default API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9090';

/**
 * API Client for backend testing
 */
export class APIClient {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = API_BASE_URL) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<{ status: number; body: APIResponse<T> }> {
    const url = new URL(this.buildUrl(endpoint));
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await this.request.get(url.toString());
    const status = response.status();
    let body: APIResponse<T>;

    try {
      body = await response.json();
    } catch {
      body = { code: String(status), msg: await response.text() };
    }

    return { status, body };
  }

  /**
   * POST request with JSON body
   */
  async post<T = unknown>(
    endpoint: string,
    data?: object,
  ): Promise<{ status: number; body: APIResponse<T> }> {
    const response = await this.request.post(this.buildUrl(endpoint), {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const status = response.status();
    let body: APIResponse<T>;

    try {
      body = await response.json();
    } catch {
      body = { code: String(status), msg: await response.text() };
    }

    return { status, body };
  }

  /**
   * PUT request with JSON body
   */
  async put<T = unknown>(
    endpoint: string,
    data?: object,
  ): Promise<{ status: number; body: APIResponse<T> }> {
    const response = await this.request.put(this.buildUrl(endpoint), {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const status = response.status();
    let body: APIResponse<T>;

    try {
      body = await response.json();
    } catch {
      body = { code: String(status), msg: await response.text() };
    }

    return { status, body };
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string): Promise<{ status: number; body: APIResponse<T> }> {
    const response = await this.request.delete(this.buildUrl(endpoint));
    const status = response.status();
    let body: APIResponse<T>;

    try {
      body = await response.json();
    } catch {
      body = { code: String(status), msg: await response.text() };
    }

    return { status, body };
  }
}

/**
 * Response assertion helpers
 */
export const APIAssertions = {
  /**
   * Assert response status and code match expected values
   */
  assertStatus(
    response: { status: number; body: APIResponse },
    expectedStatus: number,
    expectedCode?: string,
  ) {
    expect(response.status).toBe(expectedStatus);
    if (expectedCode) {
      expect(response.body.code).toBe(expectedCode);
    }
  },

  /**
   * Assert success response (status 200, code "200")
   */
  assertSuccess(response: { status: number; body: APIResponse }) {
    expect(response.status).toBe(200);
    expect(response.body.code).toBe('200');
  },

  /**
   * Assert error response with expected message
   */
  assertError(
    response: { status: number; body: APIResponse },
    expectedStatus: number,
    expectedMessage?: string,
  ) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body.code).toBe(String(expectedStatus));
    if (expectedMessage) {
      expect(response.body.msg).toBe(expectedMessage);
    }
  },

  /**
   * Assert response body contains expected data
   */
  assertData<T extends object>(
    response: { status: number; body: APIResponse<T> },
    expectedData: Partial<T>,
  ) {
    expect(response.body.data).toBeDefined();
    expect(response.body.data as Record<string, unknown>).toMatchObject(
      expectedData as Record<string, unknown>,
    );
  },
};
