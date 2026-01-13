# How to Verify Generated Automation Test Code

## Post-Generation Test Verification Checklist

### 1. Linting Check (Code Quality)

```bash
# Run lint to check for syntax errors and code style issues
npm run lint

# Automatically fix issues that can be fixed
npm run lint:fix
```

**Check:**

- No TypeScript/ESLint errors
- Imports use the correct paths
- No unused variables
- Code complies with coding standards

---

### 2. Formatting Check

```bash
# Check formatting
npm run format:check

# Automatically format the code
npm run format
```

**Check:**

- Code is properly formatted (2 spaces, single quotes, semicolons)
- Consistent indentation
- Trailing commas are placed correctly

---

### 3. File Structure Check

**Check folder structureCheck folder structure:**

```
tests/e2e/features/{feature-name}/cases/case-XX-{name}/
├── test.spec.ts      Must be present
├── scenario.md       Must be present
├── test-data.json    Must be present
└── results/          Automatically created when running tests
```

**Check file contents:**

**test.spec.ts:**

- Correct imports: `import { test, expect } from '@playwright/test'`
- Import test data from JSON (no hardcoding)
- Has a test.describe() block
- Test name theo format: `"should <behavior> when <condition>"`
- Has a tag array with the TestCaseID: `tag: ['@B001-FC-001', ...]`
- Has a structure: `// Given`, `// When`, `// Then`
- Has at least one assertion
- Does not have `waitForTimeout()` (use `waitForLoadState` instead)
- Timeouts are taken from `TIMEOUTS` in `@constants/env`

**test-data.json:**

- Has `testCaseId`
- Has `testData` object with email, password (if it is a login test)
- Has `expectedResult`
- Valid JSON format

**scenario.md:**

- Has description
- Has preconditions
- Has test steps
- Has expected results

---

### 4. Import and Path Checks

**Check imports:**

```typescript
// Correct
import { LoginPage } from '@pages/login-page';
import { ENV, TIMEOUTS } from '@constants/env';

// Incorrect
import { LoginPage } from '../../../src/pages/login-page';
```

**Check test data import:**

```typescript
// Correct - ESM pattern
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testData = JSON.parse(readFileSync(join(__dirname, 'test-data.json'), 'utf-8'));

// Incorrect - Direct JSON import (does not work with ESM)
import testData from './test-data.json';
```

---

### 5. Page Object Model (POM) Check

**Check POM usage:**

```typescript
// Correct
const { LoginPage } = await import('@pages/login-page');
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.fillEmail(testData.testData.email);

// Incorrect - Hardcode selectors in test
await page.locator('#email').fill('test@example.com');
```

---

### 6. Test Execution Check

**Run tests to verify:**

```bash
# Run a specific test
npx playwright test tests/e2e/features/{feature}/cases/{case-name}/test.spec.ts

# Run with UI mode for debugging
npx playwright test --ui tests/e2e/features/{feature}/cases/{case-name}/test.spec.ts

# Run with a headed browser to observe the test execution
npx playwright test --headed tests/e2e/features/{feature}/cases/{case-name}/test.spec.ts

# Run in debug mode
npx playwright test --debug tests/e2e/features/{feature}/cases/{case-name}/test.spec.ts
```

**Check:**

- The test runs successfully (no compilation errors)
- Test passes or fails with a clear reason
- Screenshots/videos are captured when the test fails.
- Trace files are generated.

---

### 7. Test Data Check

**Check test-data.json:**

```json
{
  "testCaseId": "B001-FC-001", // Must match tag in test
  "testData": {
    "email": "tonny@tomosia.com", // No hardcoding in tests
    "password": "1234@abcd"
  },
  "expectedResult": "Login successful" // Clear
}
```

**Check Test Data Usage:**

```typescript
// Correct - Read from JSON
await loginPage.fillEmail(testData.testData.email);
await loginPage.fillPassword(testData.testData.password);

// Incorrect - Hardcode
await loginPage.fillEmail('tonny@tomosia.com');
```

---

### 8. Check Assertions

**Check assertions:**

```typescript
// Correct - Use expect from Playwright
await expect(loginPage.errorMessage).toBeVisible();
await expect(page).toHaveURL(/dashboard/);

// Incorrect - Use assertion in POM
// Assertions should only be in test files, not in POM
```

**Verify:**

- At least 1 assertion exists
- Assertions are clear and understandable
- No assertions in POM

---

### 9. Check Timeouts

**Check timeout:**

```typescript
// Correct - Use from env.ts
import { TIMEOUTS } from '@constants/env';
await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.NETWORK_RESPONSE });

// Incorrect - Hardcoded timeout
await page.waitForLoadState('networkidle', { timeout: 15000 });
```

---

### 10. Check Tags and Metadata

**Check tags:**

```typescript
test(
  'should login successfully with valid admin credentials',
  {
    tag: [
      '@B001-FC-001', // TestCaseID from Excel
      '@smoke', // Priority tag
      '@admin-login', // Feature tag
      '@severity-critical', // Severity tag
    ],
  },
  async ({ page }) => {
    // ...
  },
);
```

**Checks:**

- TestCaseID matches Excel
- Tags are complete and correctly formatted
- No `severity` or `description` in test options (not Playwright properties)

---

## Automated Testing Script

Automated Verification Script:

```bash
#!/bin/bash
# verify-test.sh

echo "Verifying generated test..."

# 1. Lint check
echo "Running lint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "Lint failed"
  exit 1
fi

# 2. Format check
echo "Checking format..."
npm run format:check
if [ $? -ne 0 ]; then
  echo "Format check failed"
  exit 1
fi

# 3. Type check (if using TypeScript)
echo "Type checking..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "Type check failed"
  exit 1
fi

echo "All checks passed!"
```

---

## Quick Verification Commands

```bash
# 1. Lint + Format
npm run lint:fix && npm run format

# 2. Run a specific test case
npx playwright test tests/e2e/features/admin-login/cases/case-001-admin-login-valid/test.spec.ts

# 3. Run all tests in the feature
npx playwright test tests/e2e/features/admin-login/

# 4. Run in UI mode for detailed view
npx playwright test --ui tests/e2e/features/admin-login/

# 5. Check if test can be discovered
npx playwright test --list tests/e2e/features/admin-login/
```

---

## Common Issues and How to Fix

### Issue 1: Import Error

```
Cannot find module '@pages/login-page'
```

**Fix:** Check that path aliases in tsconfig.json are correct

### Issue 2: JSON Import Error

```
Cannot import JSON module
```

**Fix:** Use `readFileSync` pattern instead of direct import

### Issue 3: Timeout Hardcode

```
Timeout should come from TIMEOUTS constant
```

**Fix:** Import `TIMEOUTS` from `@constants/env` and use instead of hardcoding

### Issue 4: Test Data Hardcode

```
Test data should be read from test-data.json
```

**Fix:** Read from JSON file instead of hardcode in testing.

---

## Best Practices

1. **Always run lint after generation**
2. **Verify tests can run (compile without errors, pass not required)**
3. **Check that test data is read from JSON**
4. **Check timeouts are not hardcoded**
5. **Verify imports use correct path aliases**
6. **Check tags include TestCaseID**
