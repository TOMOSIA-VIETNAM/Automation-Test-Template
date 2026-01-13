# Naming Conventions

Naming rules for files, classes, methods, variables, and tests.

---

## Test File Naming

### Format

Test files MUST follow:

- `test.spec.ts` (for E2E tests)
- `<feature>.test.ts` (for unit tests)

### Examples

**Good:**

```
test.spec.ts
login.test.ts
auth-service.test.ts
```

**Bad:**

```
test1.ts
loginTest.ts
testLogin.spec.ts
playwright-test.ts
```

---

## Test Name Convention

### Format

**Required:** `"should <expected behavior> when <condition>"`

### Examples

**Good:**

```ts
test('should login successfully when using valid credentials', ...)
test('should show error message when password is invalid', ...)
test('should display cart items when user has added products', ...)
test('should redirect to login when session expires', ...)
test('should enable submit button when form is valid', ...)
```

**Bad:**

```ts
test('valid login', ...)                           // Missing "should" and "when"
test('TC_001 - Login test', ...)                   // Has test case ID
test('check login functionality', ...)             // Using "check" instead of "should"
test('Login with valid user', ...)                 // Not imperative, missing "should"
test('User can login successfully', ...)           // Indirect phrasing
```

### Rules

- Always start with "should"
- Include "when" to describe condition
- No TestCaseID in name (use tags instead)
- Be specific and descriptive
- Use present tense
- Keep under 100 characters

---

## POM Class Naming

### Class Names

**Format:** PascalCase, descriptive page name

**Good:**

```ts
LoginPage;
DashboardPage;
CheckoutPage;
UserProfilePage;
ShoppingCartPage;
```

**Bad:**

```ts
loginpage; // Not PascalCase
pageLogin; // Wrong order
Login; // Too generic
mainpage; // Not descriptive
Page1; // Meaningless
```

### File Names

**Rule:** File name MUST match class name

```
**LoginPage.ts → class LoginPage
**DashboardPage.ts → class DashboardPage
**CheckoutPage.ts → class CheckoutPage

**login-page.ts → class LoginPage (mismatch)
**loginPage.ts → class LoginPage (mismatch)
```

---

## POM Method Naming

### Format

**camelCase**, starting with a **verb**, describing an **action**

### Examples

**Good:**

```ts
async login(username: string, password: string)
async fillSearchInput(text: string)
async submitForm()
async addProductToCart(productName: string)
async selectCountry(country: string)
async clickLogoutButton()
async navigateToDashboard()
```

**Bad:**

```ts
async doLogin()              // Don't use "do" prefix
async username_input()       // Underscores, not a verb
async Login()                // PascalCase (should be camelCase)
async btn_click()            // References UI element
async performLoginAction()   // Too verbose
```

### Method Naming Rules

- Start with a **verb**: `fill`, `click`, `select`, `submit`, `navigate`
- Describe **action**, not UI elements
- Use **camelCase**
- Be concise but clear
- No underscores

---

## Locator Naming

### Format

**camelCase**: `elementType + Meaning`

### Examples

**Good:**

```ts
get usernameInput(): Locator
get passwordInput(): Locator
get loginButton(): Locator
get errorMessage(): Locator
get welcomeText(): Locator
get searchField(): Locator
get submitButton(): Locator
get userDropdown(): Locator
```

**Bad:**

```ts
get btn1(): Locator              // No meaning
get div2(): Locator              // UI-specific
get element(): Locator           // Too generic
get user_name(): Locator         // Underscores
get UserName(): Locator          // PascalCase
get theUsernameInputField()      // Too verbose
```

### Locator Naming Rules

- Use **camelCase**
- Format: `elementType + purpose`
- Element types: Input, Button, Text, Message, Field, Dropdown, Link
- Be descriptive
- Avoid numbers (btn1, div2)

---

## Variable Naming

### Conventions by Type

| Type      | Convention       | Example                                  |
| --------- | ---------------- | ---------------------------------------- |
| Variables | camelCase        | `userName`, `isLoggedIn`, `pageTitle`    |
| Constants | UPPER_SNAKE_CASE | `API_TIMEOUT`, `MAX_RETRIES`, `BASE_URL` |
| Boolean   | is/has prefix    | `isVisible`, `hasError`, `canSubmit`     |
| Arrays    | plural           | `users`, `products`, `testCases`         |
| Objects   | singular         | `user`, `product`, `config`              |

### Examples

**Good:**

```ts
// Variables
const userName = 'john.doe';
const isAuthenticated = true;
let currentPage = 1;

// Constants
const API_TIMEOUT = 5000;
const MAX_LOGIN_ATTEMPTS = 3;
const DEFAULT_LOCALE = 'en-US';

// Booleans
const isVisible = await element.isVisible();
const hasErrors = errors.length > 0;
const canProceed = isValid && isComplete;

// Arrays
const users = ['user1', 'user2'];
const testCases = [tc1, tc2, tc3];

// Objects
const user = { name: 'John', email: 'john@example.com' };
const config = { timeout: 5000, retries: 3 };
```

**Bad:**

```ts
// Generic names
const a = 'value';
const temp = getData();
const x1 = true;

// Wrong convention
const USERNAME = 'john'; // Should be userName
const is_visible = true; // Should be isVisible
const Users = []; // Should be users
```

---

## File Naming Conventions

### By File Type

| Type          | Convention     | Example                                     |
| ------------- | -------------- | ------------------------------------------- |
| Test files    | `test.spec.ts` | `test.spec.ts`                              |
| POM files     | PascalCase     | `LoginPage.ts`, `Dashboard Page.ts`         |
| Utility files | kebab-case     | `excel-result-writer.ts`, `date-helpers.ts` |
| Constants     | kebab-case     | `env.ts`, `test-data.ts`, `selectors.ts`    |
| Fixtures      | kebab-case     | `auth-fixture.ts`, `user-fixture.ts`        |
| Types         | kebab-case     | `user-types.ts`, `api-types.ts`             |
| Config        | kebab-case     | `playwright.config.ts`, `tsconfig.json`     |

### Examples

```
**tests/e2e/features/login/cases/valid-login/test.spec.ts
**src/pages/LoginPage.ts
**src/utils/excel-result-writer.ts
**src/constants/test-data.ts
**src/fixtures/auth-fixture.ts
**src/types/user-types.ts

**tests/LoginTest.spec.ts
**src/pages/login-page.ts
**src/utils/ExcelWriter.ts
**src/constants/TestData.ts
```

---

## Function Naming

### Utility Functions

**Format:** camelCase, verb-first

**Good:**

```ts
function formatDate(date: Date): string;
function validateEmail(email: string): boolean;
function parseUserData(data: any): User;
function generateToken(userId: string): string;
```

**Bad:**

```ts
function date_format(); // Underscores
function EmailValidate(); // PascalCase
function userDataParser(); // Noun-first
```

### Helper Functions

```ts
// Good naming
async function waitForElement(selector: string);
async function getTextContent(element: Locator);
async function clickAndWait(button: Locator);
```

---

## Test Data Variables

### Test Data Files

```ts
// In test-data.json or testData object

{
  "validUser": {
    "username": "valid.user@example.com",
    "password": "ValidPass123!"
  },
  "invalidUser": {
    "username": "invalid@example.com",
    "password": "wrong"
  },
  "products": [
    { "id": "prod-001", "name": "Product 1" },
    { "id": "prod-002", "name": "Product 2" }
  ]
}
```

### In Test Files

```ts
const testData = {
  validCredentials: { username: 'user', password: 'pass' },
  invalidCredentials: { username: 'bad', password: 'wrong' },
};

const user = testData.validCredentials;
const product = testData.products[0];
```

---

## Constants Naming

### Format

UPPER_SNAKE_CASE

### Examples

```ts
// Timeouts
const PAGE_LOAD_TIMEOUT = 30000;
const API_RESPONSE_TIMEOUT = 5000;
const ANIMATION_DURATION = 300;

// URLs
const BASE_URL = 'https://example.com';
const API_ENDPOINT = '/api/v1';
const LOGIN_PATH = '/auth/login';

// Limits
const MAX_RETRIES = 3;
const MIN_PASSWORD_LENGTH = 8;
const DEFAULT_PAGE_SIZE = 20;

// Selectors (if constant)
const LOGIN_FORM_SELECTOR = '#login-form';
const ERROR_MESSAGE_SELECTOR = '.error-message';
```

---

## Naming Checklist

When creating new code, verify:

### Test Files

- [ ] Test file named `test.spec.ts`
- [ ] Test names use "should...when..." format
- [ ] No TestCaseID in test names
- [ ] Test names are descriptive and clear

### POM Classes

- [ ] Class names are PascalCase
- [ ] File names match class names
- [ ] Method names are camelCase
- [ ] Methods start with verbs
- [ ] Locators use camelCase
- [ ] Locators follow elementType + meaning pattern

### Variables

- [ ] Variables use camelCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Booleans have is/has prefix
- [ ] Arrays are plural
- [ ] No generic names (a, b, x1)

### Files

- [ ] POM files are PascalCase
- [ ] Utility files are kebab-case
- [ ] Constants files are kebab-case
- [ ] File names are descriptive and clear
