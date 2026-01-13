# Code Style

Coding standards and formatting rules for the AutomationTest framework.

---

## General Style Rules

### Must Always Enforce

**Use **ESM imports** (`import ... from`)
**Use **const** for constants, **let** for variables
**Always include blank line between logical blocks
**Use **arrow functions** for callbacks
**Follow Playwright's async/await patterns
**Use descriptive variable names

**Never use **var\*\*
**Avoid deeply nested logic (max 3 layers)
**Don't use generic names (`a`, `b`, `x1`)

---

## Formatting Rules

### Required Format Standards

| Rule            | Standard                       |
| --------------- | ------------------------------ |
| Indentation     | 2 spaces                       |
| Line length     | Max 100 characters             |
| Quotes          | Single quotes `'text'`         |
| Semicolons      | Always required                |
| Trailing commas | Required in objects and arrays |
| EOF newline     | Required                       |

### Examples

**Good:**

```ts
const user = {
  name: 'John',
  email: 'john@example.com',
};

const items = ['item1', 'item2', 'item3'];
```

**Bad:**

```ts
const user = {
  name: 'John',
  email: 'john@example.com',
}; // Missing trailing comma, using double quotes

const items = ['item1', 'item2', 'item3']; // Missing semicolon
```

---

## Import Style

### Required Import Organization

Imports MUST be grouped and sorted:

1. **Playwright imports**
2. **POM classes**
3. **Utilities**
4. **Config or constants**
5. **Test data**

### Example

```ts
// 1. Playwright imports
import { test, expect } from '@playwright/test';

// 2. POM classes
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

// 3. Utilities
import { excelResultWriter } from '@utils/excel-result-writer';
import { formatDate } from '@utils/date-helpers';

// 4. Constants
import { API_TIMEOUT } from '@constants/timeouts';

// 5. Test data
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
```

---

## Test File Style

### Required Test Format

```ts
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('Scenario name', async ({ page }) => {
    // Given (Arrange)
    // Setup steps
    // When (Act)
    // User actions
    // Then (Assert)
    // Validations
  });
});
```

### Test File Conventions

**Do:**

- Use `test.describe()` to group related tests
- Structure tests with Given/When/Then comments
- Keep tests focused and single-purpose
- Make tests deterministic (no random behavior)

**Don't:**

- Mix multiple scenarios in one test
- Use random waits (`setTimeout`)
- Duplicate test logic
- Write complex logic in tests

---

## Naming Conventions

### Variable Naming

| Type      | Convention       | Example                         |
| --------- | ---------------- | ------------------------------- |
| Variables | camelCase        | `userName`, `isLoggedIn`        |
| Constants | UPPER_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRIES`    |
| Classes   | PascalCase       | `LoginPage`, `UserService`      |
| Functions | camelCase        | `getUserData()`, `formatDate()` |

### File Naming

| Type          | Convention     | Example                  |
| ------------- | -------------- | ------------------------ |
| Test files    | `test.spec.ts` | `test.spec.ts`           |
| POM files     | PascalCase     | `LoginPage.ts`           |
| Utility files | kebab-case     | `excel-result-writer.ts` |
| Constants     | kebab-case     | `test-data.ts`           |

---

## Commenting Rules

### When to Comment

**Add comments for:**

- Complex business logic
- Non-obvious algorithms
- Workarounds or hacks
- Public API documentation

**Avoid comments for:**

- Obvious code (redundant)
- Commented-out dead code
- Explaining what code does (use better naming instead)

### Good vs Bad Comments

**Good:**

```ts
// Navigate to login page
await page.goto('/login');

// Wait for dynamic content to load (API takes 2-3 seconds)
await page.waitForSelector('.user-list');
```

**Bad:**

```ts
// click button
await page.click('#btn'); // Redundant

// await page.goto('/login');  // Dead code - remove it!
```

---

## Error Handling

### Test Files

**Do NOT use try/catch** in test files:

```ts
// **WRONG
test('should login', async ({ page }) => {
  try {
    await page.click('#login');
  } catch (error) {
    console.log('Failed');
  }
});
```

**Let Playwright handle errors:**

```ts
// **CORRECT
test('should login', async ({ page }) => {
  await page.click('#login'); // Playwright handles failures
});
```

### Utility Functions

**Use try/catch in utilities** when appropriate:

```ts
async function readJsonFile(filePath: string): Promise<any> {
  try {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${filePath}`);
  }
}
```

---

## Async/Await Patterns

### Required Patterns

**Always use async/await:**

```ts
async function login(page: Page, username: string, password: string) {
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#login');
}
```

**Never use promises directly:**

```ts
// **WRONG
function login(page: Page, username: string, password: string) {
  return page
    .fill('#username', username)
    .then(() => page.fill('#password', password))
    .then(() => page.click('#login'));
}
```

---

## Stability Rules

### Avoid Arbitrary Waits

**NEVER use:**

```ts
await page.waitForTimeout(3000); // Arbitrary wait - BAD!
```

**ALWAYS use:**

```ts
// Wait for element
await page.waitForSelector('.user-list');

// Wait for condition
await expect(page.locator('.loading')).toBeHidden();

// Wait for navigation
await page.waitForURL(/dashboard/);
```

---

## TypeScript Best Practices

### Always Add Types

**Good:**

```ts
async function login(page: Page, username: string, password: string): Promise<void> {
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#login');
}
```

**Bad:**

```ts
async function login(page, username, password) {
  // Missing types
}
```

### Use Interfaces

```ts
interface User {
  username: string;
  password: string;
  email?: string;
}

async function createUser(userData: User): Promise<void> {
  // ...
}
```

---

## Code Organization

### File Structure

```ts
// 1. Imports (grouped and sorted)
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

// 2. Constants
const TIMEOUT = 5000;

// 3. Helper functions
function formatUsername(name: string): string {
  return name.toLowerCase().trim();
}

// 4. Test setup (if needed)
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// 5. Test cases
test.describe('Login Feature', () => {
  test('should login successfully', async ({ page }) => {
    // Test steps...
  });
});

// 6. Test cleanup
test.afterEach(async ({}, testInfo) => {
  // Cleanup...
});
```

---

## Linting and Formatting

### Auto-Formatting

After generating code, ALWAYS:

1. Run `npm run lint`
2. Fix all errors
3. Re-run until zero errors

### ESLint Rules

Key rules enforced:

- No unused variables
- Consistent spacing
- Proper imports
- No console.log in production code
- Proper TypeScript types

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

---

## Checklist

Before committing code, ensure:

- [ ] Uses ESM imports (not CommonJS)
- [ ] Proper indentation (2 spaces)
- [ ] Single quotes for strings
- [ ] Semicolons at end of statements
- [ ] Trailing commas in objects/arrays
- [ ] Imports grouped and sorted
- [ ] Descriptive variable names
- [ ] No arbitrary waits
- [ ] Proper TypeScript types
- [ ] `npm run lint` passes with zero errors
