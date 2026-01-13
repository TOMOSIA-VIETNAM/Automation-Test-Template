# Test Structure

Standards and templates for Playwright test files.

---

## Required Test Template

Every Playwright test MUST follow this structure:

```ts
import { test, expect } from '@playwright/test';

test(
  'should <expected behavior> when <condition>',
  {
    tag: ['@feature', '@smoke', '<Test Case ID>'],
  },
  async ({ page }) => {
    // Given (Arrange)
    // Initial setup steps
    // When (Act)
    // User actions
    // Then (Assert)
    // Validation and assertions
  },
);
```

---

## Test Naming Convention

### Format

**REQUIRED**: `"should <expected behavior> when <condition>"`

### Examples

**Good:**

```ts
test('should login successfully when using valid credentials', ...)
test('should show error message when password is invalid', ...)
test('should display cart items when user has added products', ...)
test('should redirect to login when session expires', ...)
```

**Bad:**

```ts
test('valid login', ...)
test('TC_001 - Login test', ...)
test('check login functionality', ...)
test('Login with valid user', ...)
```

---

## Tag Requirements

### Mandatory Tags

1. **Feature tag**: Identifies the feature being tested
   - Examples: `@login`, `@checkout`, `@profile`

2. **Test type tag**: Classification of test
   - `@smoke` - Critical functionality
   - `@regression` - Full test suite
   - `@e2e` - End-to-end scenario

3. **TestCaseID tag**: REQUIRED for Excel integration
   - Format: `@TC_XXX` (e.g., `@TC_001`, `@TC_042`)
   - Must match ID in Excel template

### Tag Examples

```ts
test(
  'should login successfully when using valid credentials',
  {
    tag: ['@login', '@smoke', '@TC_001'],
  },
  async ({ page }) => {
    // Test steps...
  },
);
```

### Rules

- TestCaseID MUST be in `tag` array
- TestCaseID MUST NOT appear in test name
- Tags are extracted automatically by Excel result writer
- Without TestCaseID tag, results will NOT be written to Excel

---

## Given/When/Then Structure

### Required Structure

Every test MUST be organized with clear sections:

```ts
test('should complete checkout when cart has items', async ({ page }) => {
  // Given - Set up initial state
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(2);

  // When - Perform actions
  await page.locator('#checkout-button').click();
  await page.locator('#payment-method').selectOption('credit-card');
  await page.locator('#confirm-order').click();

  // Then - Verify outcomes
  await expect(page).toHaveURL(/order-confirmation/);
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### Guidelines

- Use comments to clearly mark each section
- Keep each section focused and concise
- Given: Setup and preconditions
- When: User actions and interactions
- Then: Assertions and validations

---

## JSON Import (ESM Modules)

### FORBIDDEN Pattern

**DO NOT USE:**

```ts
import testData from './test-data.json';
```

This will cause errors in ESM modules.

### REQUIRED Pattern

**USE THIS:**

```ts
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testData = JSON.parse(readFileSync(join(__dirname, 'test-data.json'), 'utf-8'));
```

### For CommonJS (if applicable)

```ts
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-data.json'), 'utf-8'));
```

---

## Assertion Requirements

### Mandatory Rule

Every test MUST contain **at least one assertion**.

### Valid Assertion Patterns

```ts
// URL validation
await expect(page).toHaveURL(/expected-url/);

// Element visibility
await expect(locator).toBeVisible();

// Text content
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('Partial text');

// Element count
await expect(page.locator('.item')).toHaveCount(5);

// Attributes
await expect(locator).toHaveAttribute('href', '/path');
```

### Invalid Patterns

**Forbidden:**

```ts
// No assertions
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.click('#login');
  // Missing assertion!
});

// Assertions in POM
class LoginPage {
  async login() {
    await this.loginButton.click();
    await expect(this.page).toHaveURL('/dashboard'); // **NO!
  }
}
```

---

## Clean Code Rules

### Do's

**Use async/await for all asynchronous operations
**Use `page.locator()` instead of `page.$()`
**Extract common logic to helpers/fixtures
**Keep test files under 40 lines maximum
**Use descriptive variable names
**Keep imports organized and clean

### Don'ts

**Do NOT use `try/catch` inside tests (Playwright handles errors)
**Do NOT use `waitForTimeout()` for arbitrary waits
**Do NOT duplicate logic across tests
**Do NOT write complex logic in test files
\*\*Do NOT nest tests deeply (max 3 levels)

---

## Auto-Linting Workflow

After generating any test file:

1. **Run lint**: `npm run lint`
2. **Fix errors**: Address all linting issues
3. **Re-run**: Continue until zero errors
4. **Commit**: Follow conventional commit standards

This ensures formatting, imports, and code quality are consistent.

---

## Complete Test Example

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { excelResultWriter } from '@utils/excel-result-writer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testData = JSON.parse(readFileSync(join(__dirname, 'test-data.json'), 'utf-8'));

test.describe('Login Feature', () => {
  test(
    'should login successfully when using valid credentials',
    {
      tag: ['@login', '@smoke', '@TC_001'],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Given
      await loginPage.goto();
      await expect(page).toHaveURL(/login/);

      // When
      await loginPage.login(testData.validUser.username, testData.validUser.password);

      // Then
      await expect(page).toHaveURL(/dashboard/);
      await expect(page.locator('.welcome-message')).toBeVisible();
      await expect(page.locator('.user-name')).toHaveText(testData.validUser.name);
    },
  );

  test(
    'should show error message when using invalid credentials',
    {
      tag: ['@login', '@regression', '@TC_002'],
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Given
      await loginPage.goto();

      // When
      await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

      // Then
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toHaveText('Invalid credentials');
    },
  );
});

test.afterEach(async ({}, testInfo) => {
  await excelResultWriter.writeResult(testInfo);
});
```

---

## Banned Anti-Patterns

NEVER generate:

- Direct JSON imports
- Missing assertions
- TestCaseID in test name
- `waitForTimeout` for waits
- Long unstructured tests
- Wrong import paths
- Missing Given/When/Then
- Repeated logic in tests
- Missing tag array
