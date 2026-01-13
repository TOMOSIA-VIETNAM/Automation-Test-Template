# Page Object Model (POM)

Design patterns and best practices for Page Object Model classes.

---

## Required POM Structure

### Template

Every POM class MUST follow this structure:

```ts
import { Page, Locator } from '@playwright/test';

export class PageName {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (as getters)
  get elementName(): Locator {
    return this.page.locator('selector');
  }

  // Actions (methods)
  async actionName(params?: any): Promise<void> {
    await this.elementName.click();
  }

  // Navigation
  async goto(): Promise<void> {
    await this.page.goto('/path');
  }
}
```

---

## POM Class Rules

### 1. One Class Per Page

Each page MUST have its own class file:

```
**src/pages/LoginPage.ts
**src/pages/DashboardPage.ts
**src/pages/CheckoutPage.ts
```

### 2. Constructor Requirements

```ts
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
```

- MUST accept `page` parameter
- MUST store as `readonly page: Page`
- MUST NOT include other initialization logic

### 3. Locators as Getters

**REQUIRED:**

```ts
get usernameInput(): Locator {
  return this.page.locator('#username');
}

get passwordInput(): Locator {
  return this.page.locator('#password');
}

get loginButton(): Locator {
  return this.page.locator('#login');
}
```

**FORBIDDEN:**

```ts
// Do NOT define locators inline in methods
async login(username: string, password: string) {
  await this.page.locator('#username').fill(username); // **NO!
  await this.page.locator('#password').fill(password); // **NO!
}
```

### 4. Methods for Actions Only

Methods should represent user actions:

```ts
async login(username: string, password: string): Promise<void> {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}

async fillSearchInput(text: string): Promise<void> {
  await this.searchInput.fill(text);
}

async submitForm(): Promise<void> {
  await this.submitButton.click();
}
```

### 5. NO Assertions in POM

**FORBIDDEN:**

```ts
async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();

  // **NO assertions in POM!
  await expect(this.page).toHaveURL('/dashboard');
}
```

**CORRECT:**

```ts
// POM - actions only
async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}

// Test file - assertions here
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user', 'pass');

  // **Assertions in test file
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Naming Conventions

### Class Names

- **PascalCase**: `LoginPage`, `DashboardPage`
- Must match filename: `LoginPage.ts`
- Must describe the page clearly

### Method Names

- **camelCase**: `login`, `fillSearchInput`, `submitForm`
- Must start with a verb
- Must describe the action, not UI elements

**Good:**

```ts
async login(username: string, password: string)
async fillSearchInput(text: string)
async selectCountry(country: string)
async addProductToCart(productId: string)
```

**Bad:**

```ts
async doLogin() // Don't use "do" prefix
async username_input() // Don't use underscores
async Login() // Don't use PascalCase for methods
async btn_click() // Don't reference UI elements
```

### Locator Names

Format: `elementType + Meaning`

**Good:**

```ts
get usernameInput(): Locator
get passwordInput(): Locator
get loginButton(): Locator
get errorMessage(): Locator
get welcomeText(): Locator
```

**Bad:**

```ts
get btn1(): Locator // No meaning
get div2(): Locator // UI-specific
get element(): Locator // Too generic
get user_name(): Locator // Underscores
```

---

## Complete POM Example

```ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  get usernameInput(): Locator {
    return this.page.locator('#username');
  }

  get passwordInput(): Locator {
    return this.page.locator('#password');
  }

  get loginButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  get errorMessage(): Locator {
    return this.page.locator('.error-message');
  }

  get rememberMeCheckbox(): Locator {
    return this.page.locator('#remember-me');
  }

  get forgotPasswordLink(): Locator {
    return this.page.locator('a[href="/forgot-password"]');
  }

  // Navigation
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  // Actions
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.rememberMeCheckbox.check();
    await this.loginButton.click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton.click();
  }
}
```

---

## Advanced Patterns

### Complex Locators

For complex selectors, use descriptive getter names:

```ts
get productCard(): Locator {
  return this.page.locator('.product-card').first();
}

get productCardByName(name: string): Locator {
  return this.page.locator(`.product-card:has-text("${name}")`);
}

get activeTab(): Locator {
  return this.page.locator('.tab.active');
}
```

### Dynamic Locators

Use methods for dynamic selectors:

```ts
getProductById(id: string): Locator {
  return this.page.locator(`[data-product-id="${id}"]`);
}

getListItemByIndex(index: number): Locator {
  return this.page.locator('.list-item').nth(index);
}
```

### Composite Actions

Break complex flows into smaller methods:

```ts
async fillLoginForm(username: string, password: string): Promise<void> {
  await this.fillUsername(username);
  await this.fillPassword(password);
}

async login(username: string, password: string): Promise<void> {
  await this.fillLoginForm(username, password);
  await this.submitLogin();
}
```

---

## TypeScript Best Practices

### Return Types

Always specify return types:

```ts
async login(username: string, password: string): Promise<void> {
  // ...
}

get loginButton(): Locator {
  return this.page.locator('#login');
}
```

### Parameter Types

Always type parameters:

```ts
async selectCountry(country: string): Promise<void> {
  await this.countryDropdown.selectOption(country);
}

async addProductToCart(productId: string, quantity: number = 1): Promise<void> {
  await this.getProductById(productId).click();
  await this.quantityInput.fill(quantity.toString());
}
```

---

## File Organization

```ts
// 1. Imports
import { Page, Locator } from '@playwright/test';

// 2. Class definition
export class LoginPage {

  // 3. Properties
  readonly page: Page;

  // 4. Constructor
  constructor(page: Page) {
    this.page = page;
  }

  // 5. Locators (grouped logically)
  get usernameInput(): Locator { ... }
  get passwordInput(): Locator { ... }
  get loginButton(): Locator { ... }

  // 6. Navigation methods
  async goto(): Promise<void> { ... }

  // 7. Action methods (grouped by functionality)
  async login(username: string, password: string): Promise<void> { ... }
  async fillUsername(username: string): Promise<void> { ... }
  async fillPassword(password: string): Promise<void> { ... }
}
```

---

## Checklist

When creating a POM class, ensure:

- [ ] Class name is PascalCase
- [ ] Filename matches class name
- [ ] Constructor accepts `page: Page`
- [ ] All locators are getters
- [ ] All methods are async with Promise return type
- [ ] No assertions in methods
- [ ] Methods represent user actions
- [ ] Clear and descriptive naming
- [ ] Proper TypeScript typing
- [ ] Organized and clean structure
