/**
 * Test data for automation tests
 * Centralized test data management
 */

// Login Test Data
export const LOGIN_DATA = {
  // Valid login credentials
  valid: {
    admin01: {
      email: 'admin01@libman.com',
      password: '000000',
      expectedUser: 'Admin User 01',
    },
    admin02: {
      email: 'admin02@libman.com',
      password: '000000',
      expectedUser: 'Admin User 02',
    },
    user01: {
      email: 'user01@libman.com',
      password: '000000',
      expectedUser: 'Test User 01',
    },
  },

  // Invalid login credentials
  invalid: {
    wrongEmail: {
      email: 'invalid@example.com',
      password: 'password123',
    },
    wrongPassword: {
      email: 'admin01@libman.com',
      password: 'wrongpassword',
    },
    emptyEmail: {
      email: '',
      password: 'password123',
    },
    emptyPassword: {
      email: 'admin01@libman.com',
      password: '',
    },
    invalidEmailFormat: {
      email: 'invalid-email',
      password: 'password123',
    },
  },
};

// Book Test Data
export const BOOK_DATA = {
  valid: {
    name: 'Test Book Name',
    isbn: '978-4-12-345678-9',
    author: 'Test Author',
    publisher: 'Test Publisher',
    category: 'Programming',
    credit: 10,
  },
};
