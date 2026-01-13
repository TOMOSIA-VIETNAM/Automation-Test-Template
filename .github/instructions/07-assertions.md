# Assertions

Assertion patterns and validation rules for Playwright tests.

---

## General Assertion Rules

### Requirements

**Use **expect()** from Playwright for all validations
**Assert **meaningful behaviors**, not implementation details
**Every test MUST have **at least one assertion\*\*
**Prefer **behavior-driven assertions\*\*
**Keep assertions in **test files only\*\* (never in POM)

---

## Standard Assertion Patterns

### Visibility Assertions

```ts
// Element is visible
await expect(locator).toBeVisible();

// Element is hidden
await expect(locator).toBeHidden();

// Element is attached to DOM
await expect(locator).toBeAttached();

// Element is detached from DOM
await expect(locator).not.toBeAttached();
```

### Text Content Assertions

```ts
// Exact text match
await expect(locator).toHaveText('Expected text');

// Partial text match
await expect(locator).toContainText('Partial text');

// Text with regex
await expect(locator).toHaveText(/pattern/);

// Multiple elements text
await expect(page.locator('.item')).toHaveText(['Item 1', 'Item 2', 'Item 3']);
```

### URL Assertions

```ts
// Exact URL
await expect(page).toHaveURL('https://example.com/dashboard');

// URL with regex
await expect(page).toHaveURL(/dashboard/);

// URL contains
await expect(page).toHaveURL(/.*dashboard.*/);
```

### Attribute Assertions

```ts
// Has attribute with value
await expect(locator).toHaveAttribute('href', '/dashboard');

// Has class
await expect(locator).toHaveClass('active');

// Contains class
await expect(locator).toHaveClass(/active/);

// Has ID
await expect(locator).toHaveId('submit-button');
```

### Count Assertions

```ts
// Exact count
await expect(page.locator('.item')).toHaveCount(5);

// At least one
await expect(page.locator('.item')).toHaveCount({ min: 1 });

// No elements
await expect(page.locator('.item')).toHaveCount(0);
```

### State Assertions

```ts
// Element enabled/disabled
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Checkbox checked/unchecked
await expect(checkbox).toBeChecked();
await expect(checkbox).not.toBeChecked();

// Input editable
await expect(input).toBeEditable();

// Element focused
await expect(input).toBeFocused();
```

### Value Assertions

```ts
// Input value
await expect(input).toHaveValue('Expected value');

// Input value with regex
await expect(input).toHaveValue(/pattern/);

// Empty value
await expect(input).toHaveValue('');
```

---

## Advanced Patterns

### Soft Assertions

Use when you want to continue test execution even if assertion fails:

```ts
test('should validate all fields', async ({ page }) => {
  // Regular assertion - stops on failure
  await expect(page.locator('#username')).toBeVisible();

  // Soft assertions - continues on failure
  await expect.soft(page.locator('#email')).toBeVisible();
  await expect.soft(page.locator('#phone')).toBeVisible();

  // Test continues even if soft assertions fail
});
```

### Custom Timeouts

```ts
// Wait up to 10 seconds for assertion
await expect(locator).toBeVisible({ timeout: 10000 });

// Reduce timeout to 2 seconds
await expect(locator).toBeVisible({ timeout: 2000 });
```

### Negated Assertions

```ts
// Element not visible
await expect(locator).not.toBeVisible();

// Does not contain text
await expect(locator).not.toContainText('Error');

// URL does not match
await expect(page).not.toHaveURL(/login/);
```

### Multiple Conditions

```ts
// Check multiple properties
await expect(locator).toBeVisible();
await expect(locator).toBeEnabled();
await expect(locator).toHaveText('Submit');

// Or use Promise.all for parallel checks
await Promise.all([
  expect(locator).toBeVisible(),
  expect(locator).toBeEnabled(),
  expect(locator).toHaveText('Submit'),
]);
```

---

## Best Practices

### Do's

**Assert behavior, not structure:**

```ts
// **Good - asserts behavior
await expect(page.locator('.success-message')).toBeVisible();

// **Bad - asserts structure
await expect(page.locator('div.container > div.row > span')).toHaveCount(1);
```

**Use specific assertions:**

```ts
// **Good - specific
await expect(page.locator('.error')).toHaveText('Invalid email format');

// **Bad - too generic
await expect(page.locator('.error')).toBeVisible();
```

**Assert expected outcomes:**

```ts
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Given
  await loginPage.goto();

  // When
  await loginPage.login('user', 'pass');

  // Then - assert the expected outcome
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('.welcome-message')).toBeVisible();
});
```

### Don'ts

**Never assert in POM:**

```ts
// **WRONG - assertion in POM
class LoginPage {
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // **NO! Assertions belong in tests
    await expect(this.page).toHaveURL('/dashboard');
  }
}

// **CORRECT - assertions in test
test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user', 'pass');

  // **YES! Assertions in test file
  await expect(page).toHaveURL('/dashboard');
});
```

**Don't use weak assertions:**

```ts
// **Weak - only checks visibility
await expect(errorMessage).toBeVisible();

// **Strong - checks both visibility and content
await expect(errorMessage).toBeVisible();
await expect(errorMessage).toHaveText('Invalid email format');
```

**Don't skip assertions:**

```ts
// **WRONG - no assertion
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.click('#login');
  // Missing assertion!
});

// **CORRECT - has assertion
test('should login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.click('#login');
  await expect(page).toHaveURL(/dashboard/);
});
```

---

## Common Scenarios

### Form Validation

```ts
test('should validate required fields', async ({ page }) => {
  await page.goto('/register');
  await page.click('#submit');

  // Assert error messages appear
  await expect(page.locator('#username-error')).toBeVisible();
  await expect(page.locator('#username-error')).toHaveText('Username is required');

  await expect(page.locator('#email-error')).toBeVisible();
  await expect(page.locator('#email-error')).toHaveText('Email is required');
});
```

### Navigation

```ts
test('should navigate to dashboard after login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('user', 'pass');

  // Assert navigation occurred
  await expect(page).toHaveURL(/dashboard/);
  await expect(page).toHaveTitle(/Dashboard/);
});
```

### Dynamic Content

```ts
test('should load product list', async ({ page }) => {
  await page.goto('/products');

  // Wait for and assert dynamic content
  await expect(page.locator('.product-card')).toHaveCount(10);
  await expect(page.locator('.product-card').first()).toBeVisible();
});
```

### API Response Reflected in UI

```ts
test('should display user data from API', async ({ page }) => {
  await page.goto('/profile');

  // Assert API data is displayed
  await expect(page.locator('.user-name')).toHaveText('John Doe');
  await expect(page.locator('.user-email')).toHaveText('john@example.com');
  await expect(page.locator('.user-role')).toHaveText('Admin');
});
```

---

## Assertion Checklist

Before finalizing a test:

- [ ] Test has at least one assertion
- [ ] Assertions are in test file (not POM)
- [ ] Assertions check meaningful behavior
- [ ] Assertions are specific and clear
- [ ] Used appropriate assertion type
- [ ] No redundant assertions
- [ ] Assertions verify expected outcomes
