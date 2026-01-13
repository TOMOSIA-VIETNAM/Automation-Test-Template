# Playwright Fixtures - Usage Guide

## Main Purpose of Fixtures

Fixtures in Playwright are a powerful mechanism to:

### 1. **Code Reusability**

- Avoid having to initialize page objects in each test
- Automatic setup and teardown
- Reduce boilerplate code

### 2. **Dependency Injection**

- Playwright automatically injects dependencies into tests
- Automatic lifecycle management
- Ensure each test has its own instance

### 3. **Automatic Setup/Teardown**

- Setup before test runs
- Cleanup after test completes
- Ensure clean test environment

---

## When to Use Fixtures?

### Should Use When:

1. **Need Page Objects in multiple tests**
   - Instead of initializing `new LoginPage(page)` in each test
   - Use fixture: `({ loginPage })` - automatically available

2. **Need Authentication State**
   - Test requires user to be logged in
   - Use `authenticatedPage` fixture

3. **Need Test Data prepared**
   - Load data from file/database
   - Use `dataTest` fixture

4. **Need Mock/Stub API**
   - Setup mock responses
   - Fixture automatically cleans up after test

### Don't Need Fixtures When:

1. Simple test, used only once
2. Logic too specific for 1 test case
3. Setup too simple (1-2 lines of code)

---

## Available Fixture Types

### 1. **Page Fixtures** (`page.fixture.ts`)

Automatically initialize Page Objects.

```typescript
import { test, expect } from '@fixtures';

test('My test', async ({ loginPage, dashboardPage }) => {
  // loginPage and dashboardPage are ready to use
  await loginPage.navigate();
  await loginPage.fillEmail('test@example.com');
});
```

**Benefits:**

- No need for `new LoginPage(page)` each time
- Automatic cleanup
- More concise code

---

### 2. **Auth Fixtures** (`auth.fixture.ts`)

Automatically login before test runs.

#### Fixture: `authenticatedPage`

Login with admin01 credentials.

```typescript
import { test as authTest, expect } from '@fixtures';

authTest('Test with authenticated user', async ({ authenticatedPage, page }) => {
  // User is already logged in, at Dashboard
  // Can test features requiring authentication immediately
  await page.goto('/settings');
  // ...
});
```

#### Fixture: `authenticatedAsAdmin`

Login with admin02 credentials.

```typescript
authTest('Admin only feature', async ({ authenticatedAsAdmin, page }) => {
  // Logged in with Admin privileges
  await page.goto('/admin-panel');
});
```

#### Fixture: `authenticatedAsUser`

Login with user01 credentials (regular user).

```typescript
authTest('User feature', async ({ authenticatedAsUser, page }) => {
  // Logged in with regular User privileges
  await page.goto('/user-dashboard');
});
```

---

### 3. **Data Fixtures** (`data.fixture.ts`)

Automatically load test data.

```typescript
import { test as dataTest, expect } from '@fixtures';

dataTest('Test with data', async ({ testData, loginPage }) => {
  // testData is already loaded
  await loginPage.login(testData.email, testData.password);
});
```

---

## Comparison: With and Without Fixtures

### WITHOUT Fixtures (Old way)

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';

test('Valid login', async ({ page }) => {
  // Must initialize manually
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigate();
  await loginPage.fillEmail('admin02@libman.com');
  await loginPage.fillPassword('000000');
  await loginPage.clickLogin();

  await dashboardPage.verifySuccessDialog('ログインに成功しました');
});
```

**Disadvantages:**

- Each test must re-initialize page objects
- Repetitive code
- Hard to maintain with many page objects

---

### WITH Fixtures (Better way)

```typescript
import { test, expect } from '@fixtures';

test('Valid login', async ({ loginPage, dashboardPage }) => {
  // loginPage and dashboardPage are ready
  await loginPage.navigate();
  await loginPage.fillEmail('admin02@libman.com');
  await loginPage.fillPassword('000000');
  await loginPage.clickLogin();

  await dashboardPage.verifySuccessDialog('ログインに成功しました');
});
```

**Advantages:**

- Concise, easy to read code
- No need to initialize page objects
- Automatic cleanup
- Easy to extend with more fixtures

---

### WITH Auth Fixtures (Best for tests requiring login)

```typescript
import { test as authTest, expect } from '@fixtures';

authTest('Test feature after login', async ({ authenticatedPage, page }) => {
  // User is already logged in, at Dashboard
  // No need to login again

  await page.goto('/profile');
  // Test features requiring authentication
});
```

**Advantages:**

- No need to test login again in each test
- Test focuses on business logic
- Increased test speed (skip login steps)
- Reuse authentication state

---

## How to Use Fixtures

### Step 1: Import fixtures

```typescript
// Import from @fixtures (alias already configured)
import { test, expect } from '@fixtures';

// Or import specific fixture
import { test as authTest } from '@fixtures';
import { test as dataTest } from '@fixtures';
```

### Step 2: Use in test

```typescript
test('Test name', async ({ loginPage, dashboardPage, page }) => {
  //                        ↑ Fixtures automatically injected here

  // Use fixtures like regular variables
  await loginPage.navigate();
});
```

### Step 3: Combine multiple fixtures

```typescript
authTest(
  'Complex test',
  async ({
    authenticatedPage, // Auth fixture
    loginPage, // Page fixture
    dashboardPage, // Page fixture
    page, // Built-in Playwright fixture
  }) => {
    // All fixtures are ready to use
  },
);
```

---

## Real Examples

### Test Case 1: Login Test (No auth fixture needed)

```typescript
import { test, expect } from '@fixtures';

test.describe('Login Tests', () => {
  test('Valid login', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login('admin@example.com', '123456');
    await dashboardPage.verifyOnDashboard();
  });
});
```

### Test Case 2: Dashboard Test (Auth fixture needed)

```typescript
import { test as authTest, expect } from '@fixtures';

authTest.describe('Dashboard Tests', () => {
  authTest('View profile', async ({ authenticatedPage, page }) => {
    // Already logged in, test feature immediately
    await page.click('[data-testid="profile-link"]');
    await expect(page.locator('h1')).toHaveText('User Profile');
  });
});
```

### Test Case 3: Admin Test (Admin auth needed)

```typescript
import { test as authTest, expect } from '@fixtures';

authTest.describe('Admin Panel Tests', () => {
  authTest('Manage users', async ({ authenticatedAsAdmin, page }) => {
    await page.goto('/admin/users');
    // Test admin features
  });
});
```

---

## Create Custom Fixtures

If you need new fixtures, add them to the fixtures file:

```typescript
// src/fixtures/custom.fixture.ts
import { test as base } from './page.fixture';

export type CustomFixtures = {
  customData: { name: string; value: number };
};

export const test = base.extend<CustomFixtures>({
  customData: async ({}, use) => {
    // Setup
    const data = { name: 'test', value: 123 };

    // Provide fixture to test
    await use(data);

    // Teardown (optional)
    // Cleanup code here
  },
});
```

Usage:

```typescript
import { test } from '@fixtures/custom.fixture';

test('My test', async ({ customData }) => {
  console.log(customData.name); // 'test'
});
```

---

## Best Practices

### DO:

1. Use fixtures for code that is reused multiple times
2. Use auth fixtures for tests requiring authentication
3. Create new fixtures when patterns repeat
4. Name fixtures clearly and understandably

### DON'T:

1. Don't create too many unnecessary fixtures
2. Don't make fixtures too complex
3. Don't share state between tests via fixtures
4. Don't forget cleanup in fixtures

---

## Summary

| Situation                    | Use Fixture                            | Reason                    |
| ---------------------------- | -------------------------------------- | ------------------------- |
| Login test                   | `test` from `@fixtures`                | Need page objects         |
| Dashboard test (after login) | `authTest` with `authenticatedPage`    | Need login ready          |
| Admin test                   | `authTest` with `authenticatedAsAdmin` | Need admin privileges     |
| Test with data               | `dataTest`                             | Need prepared test data   |
| Simple test                  | `test` from `@playwright/test`         | No custom fixtures needed |

**Golden rule:** If you find yourself copy-pasting setup code in many tests → That's when you need fixtures!
