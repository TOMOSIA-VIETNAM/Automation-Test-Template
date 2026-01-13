# Automation Testing with Playwright

A comprehensive, scalable automation testing framework built with Playwright for E2E, API, performance, regression, and security testing.

## Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Running Tests](#running-tests)
- [Excel Integration](#excel-integration)
- [CI/CD with Jenkins](#cicd-with-jenkins)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## Overview

This automation testing framework follows industry best practices and implements:

- **Page Object Model (POM)** - Maintainable and reusable page classes
- **Fixtures** - Dependency injection for test isolation
- **Excel Integration** - Automated test result tracking
- **Allure Reporting** - Comprehensive test reports with screenshots and traces
- **CI/CD Ready** - Jenkins pipeline integration
- **Type Safety** - Full TypeScript support
- **BDD-Style Testing** - Given/When/Then structure

### Key Features

- Multi-browser testing (Chromium, Firefox, WebKit)
- API testing support
- Performance testing capabilities
- Security testing integration
- Automatic retry on failure
- Screenshot and video recording on failures
- Trace collection for debugging
- Excel-based test case management

---

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Operating System**: Windows, macOS, or Linux
- **Git**: Latest version
- **Browsers**: Installed automatically by Playwright

---

## Quick Start

### 1. Clone the Repository

```bash
git clone git@github-minh:tms-minhnguyen/Automation-Test.git
cd AutomationTest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:e2e
npm run test:api
npm run test:smoke
```

### 5. View Reports

```bash
# Playwright HTML report
npx playwright show-report

# Allure report (if generated)
npm run allure:open
```

---

## Project Structure

```
AutomationTest/
├── .cursor/                    # AI assistant configuration
│   └── rules/                  # Code generation rules
├── .github/
│   ├── instructions/           # Development guidelines
│   └── workflows/              # CI/CD pipelines
├── .husky/                     # Git hooks
├── .playwright-test-tracker/   # Test execution tracking
├── allure-results/             # Test results for Allure
├── docs/                       # Project documentation
├── excel/                      # Test case templates
│   └── testcase-template.xlsm
├── reports/                    # Generated reports
├── src/
│   ├── api/                    # API client utilities
│   ├── constants/              # Configuration constants
│   ├── fixtures/               # Playwright fixtures
│   ├── pages/                  # Page Object Model classes
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Helper utilities
│       └── excel-result-writer.ts
├── tests/
│   ├── api/                    # API tests
│   ├── e2e/                    # End-to-end tests
│   ├── performance/            # Performance tests
│   ├── regression/             # Regression tests
│   ├── security/               # Security tests
│   └── smoke/                  # Smoke tests
├── playwright.config.ts        # Playwright configuration
├── Jenkinsfile                 # CI/CD pipeline
└── package.json
```

### Test Organization

Each test type follows this structure:

```
tests/<test-type>/<feature>/
├── cases/
│   └── <case-folder>/
│       ├── test.spec.ts        # Test file
│       ├── test-data.json      # Test data
│       ├── scenario.md         # Scenario description
│       └── results/            # Test results
└── shared-data.json            # Shared test data
```

---

## Core Concepts

### 1. Page Object Model (POM)

POM separates page interactions from test logic for better maintainability.

**Structure:**

```typescript
// src/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators as getters
  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  // Actions
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

**Key Rules:**

- One class per page
- Locators defined as getters
- Methods represent user actions
- NO assertions in POM classes
- Use role-based selectors when possible

### 2. Test Structure

All tests follow the Given/When/Then pattern with mandatory tags.

**Template:**

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

test(
  'should login successfully when using valid credentials',
  {
    tag: ['@login', '@smoke', '@TC_001'],
  },
  async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Given - Setup initial state
    await loginPage.goto();

    // When - Perform actions
    await loginPage.login('user@example.com', 'password123');

    // Then - Verify results
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome')).toBeVisible();
  },
);
```

**Naming Convention:**

- Format: `"should <expected behavior> when <condition>"`
- Examples:
  - `"should login successfully when using valid credentials"`
  - `"should show error message when password is invalid"`
  - `"should redirect to login when session expires"`

**Tag Requirements:**

- `@<feature>` - Feature identifier (e.g., `@login`, `@checkout`)
- `@<test-type>` - Test type (`@smoke`, `@regression`, `@e2e`)
- `@TC_XXX` - Test case ID (mandatory for Excel integration)

### 3. Fixtures

Fixtures provide dependency injection and test isolation.

**Available Fixtures:**

- `page` - Playwright page instance (built-in)
- `loginPage` - Pre-initialized LoginPage instance
- `dashboardPage` - Pre-initialized DashboardPage instance
- `authenticatedPage` - Page with user already logged in
- Custom fixtures defined in `src/fixtures/`

**Usage:**

```typescript
import { test, expect } from '@fixtures';

test('should view profile', async ({ loginPage, page }) => {
  // loginPage is already initialized
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL(/dashboard/);
});
```

### 4. Test Data Management

**Using JSON Files:**

```typescript
// CORRECT - ESM compatible
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testData = JSON.parse(readFileSync(join(__dirname, 'test-data.json'), 'utf-8'));

test('test with data', async ({ page }) => {
  await page.fill('#email', testData.email);
});
```

**NEVER use direct import:**

```typescript
// WRONG - Will cause errors
import testData from './test-data.json';
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test
npx playwright test

# Run specific test type
npm run test:e2e          # E2E tests only
npm run test:api          # API tests only
npm run test:smoke        # Smoke tests only
npm run test:regression   # Regression tests only

# Run tests with specific tags
npx playwright test --grep "@smoke"
npx playwright test --grep "@login"
npx playwright test --grep "@TC_001"

# Run specific test file
npx playwright test tests/e2e/login/cases/case-001/test.spec.ts
```

### Browser Selection

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on all browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Development & Debugging

```bash
# Run in UI mode (interactive)
npx playwright test --ui

# Run in headed mode (visible browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with trace enabled
npx playwright test --trace on
```

### Performance Options

```bash
# Run with multiple workers
npx playwright test --workers=4

# Run tests in parallel
npx playwright test --workers=50%

# Run tests sequentially
npx playwright test --workers=1
```

### Filter Tests

```bash
# Run tests matching pattern
npx playwright test --grep "login"

# Exclude tests
npx playwright test --grep-invert "slow"

# Run only failed tests from last run
npx playwright test --last-failed

# Run tests by line number
npx playwright test tests/example.spec.ts:42
```

---

## Excel Integration

### Overview

The framework automatically writes test results to Excel templates for test case management and reporting.

### Setup

**1. Test Case Template:**

- Location: `excel/testcase-template.xlsm`
- Each test case must have a unique ID (e.g., TC_001, TC_002)

**2. Test Configuration:**

Add Excel writer in test files:

```typescript
import { excelResultWriter } from '@utils/excel-result-writer';

test.beforeAll(async () => {
  excelResultWriter.incrementRunCount();
});

test.afterEach(async ({}, testInfo) => {
  await excelResultWriter.writeResult(testInfo);
});
```

**3. Test Case ID Tag:**

Every test MUST include a TestCaseID tag:

```typescript
test(
  'should login successfully when using valid credentials',
  {
    tag: ['@login', '@smoke', '@TC_001'], // @TC_001 is mandatory
  },
  async ({ page }) => {
    // Test steps
  },
);
```

### Tag Requirements

**Correct Format:**

```typescript
// Good - TestCaseID in tag array
tag: ['@login', '@smoke', '@TC_001'];

// Also good - Multiple tags
tag: ['@feature', '@regression', '@TC_042', '@priority-high'];
```

**Incorrect Format:**

```typescript
// Wrong - TestCaseID in test name
test('TC_001 should login successfully', { ... })

// Wrong - Missing TestCaseID tag
tag: ['@login', '@smoke']

// Wrong - Invalid format
tag: ['@login', 'TC_001']  // Missing @ prefix
```

### How It Works

1. Test runs and generates `testInfo`
2. Excel writer extracts TestCaseID from tags
3. Results written to Excel template in proper row
4. Run count increments for result columns
5. Status, duration, and error messages recorded

### Excel Template Structure

```
| Test Case ID | Description | Result 1 | Result 2 | Result 3 | ... |
|--------------|-------------|----------|----------|----------|-----|
| TC_001       | Login test  | PASS     | PASS     | FAIL     | ... |
| TC_002       | Logout test | PASS     | PASS     | PASS     | ... |
```

---

---

## CI/CD with Jenkins

### Overview

The project includes a `Jenkinsfile` for continuous integration and automated testing.

### Pipeline Stages

1. **Checkout** - Clone repository
2. **Install Dependencies** - `npm ci`
3. **Install Playwright** - `npx playwright install --with-deps`
4. **Run Tests** - Execute test suite
5. **Archive Reports** - Save test artifacts

### Setup

**Prerequisites:**

- Jenkins server with Pipeline plugin
- Node.js plugin (optional)
- Git plugin

**Jenkins Configuration:**

1. Create new Pipeline job
2. Configure SCM: Git repository URL
3. Set Script Path: `Jenkinsfile`
4. Configure build triggers (webhook or polling)

**Environment Variables:**

```groovy
CI=true                 # Enables CI mode in playwright.config.ts
```

**CI Mode Settings:**

- Retries: 2 attempts on failure
- Workers: 1 (sequential execution)
- Forbid only: Enabled

### Webhook Integration

Configure GitHub webhook to trigger builds automatically:

1. Go to repository **Settings** → **Webhooks**
2. Add webhook: `http://your-jenkins:8080/github-webhook/`
3. Select events: Push, Pull Request
4. Save webhook

---

## Development Guidelines

### Code Style

The project follows strict code style guidelines enforced by ESLint and Prettier.

**Run Linting:**

```bash
# Check for errors
npm run lint

# Auto-fix errors
npm run lint:fix

# Format code
npm run format
```

**Key Rules:**

- Use TypeScript for all new code
- Follow ESM module syntax
- Use `const` for constants, `let` for variables
- Never use `var`
- Use async/await (no callbacks or raw promises)
- Use arrow functions for callbacks
- Maximum line length: 100 characters
- Use single quotes for strings
- Trailing commas in multi-line structures

### Naming Conventions

**Files:**

- Test files: `test.spec.ts`
- Page objects: `LoginPage.ts` (PascalCase)
- Utilities: `excel-result-writer.ts` (kebab-case)
- Constants: `env.ts`, `selectors.ts`
- Types: `api-types.ts`, `user-types.ts`

**Folders:**

- Feature folders: `login`, `checkout` (lowercase)
- Case folders: `case-001-login`, `case-002-logout` (kebab-case)

**Classes:**

- PascalCase: `LoginPage`, `APIClient`

**Variables & Functions:**

- camelCase: `userName`, `getUserData()`

**Constants:**

- UPPER_SNAKE_CASE: `API_BASE_URL`, `DEFAULT_TIMEOUT`

### Commit Standards

Follow Conventional Commits specification:

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**

```bash
feat(login): add remember me functionality

fix(api): correct endpoint URL for user registration

docs(readme): update installation instructions

test(checkout): add tests for payment flow

refactor(pages): simplify LoginPage locators
```

**Rules:**

- Subject: imperative mood, lowercase, no period
- Body: optional, explain what and why
- Footer: reference issues (e.g., "Closes #123")
- Maximum subject length: 72 characters

### Assertions

**Best Practices:**

- Every test MUST have at least one assertion
- Use Playwright's built-in assertions
- Assertions only in test files (NEVER in POM)
- Use specific assertions

**Good Examples:**

```typescript
// Specific assertions
await expect(page).toHaveURL(/dashboard/);
await expect(loginPage.errorMessage).toBeVisible();
await expect(page.locator('h1')).toHaveText('Welcome');
await expect(page.locator('.items')).toHaveCount(3);

// Behavior-driven
await expect(page).toHaveTitle(/Dashboard/);
await expect(response.status()).toBe(200);
```

**Bad Examples:**

```typescript
// Generic, weak assertions
await expect(page.locator('.error')).toBeTruthy();

// Assertions in POM (FORBIDDEN)
export class LoginPage {
  async login() {
    await this.loginButton.click();
    await expect(this.page).toHaveURL('/dashboard'); // NO!
  }
}
```

### Best Practices

**General:**

1. Follow Given/When/Then structure
2. One test, one purpose
3. Use descriptive test names
4. Keep tests independent
5. Clean up test data
6. Use fixtures for reusable setup
7. Avoid hardcoded waits
8. Use role-based selectors
9. Enable trace on failure
10. Document complex test scenarios

**Page Objects:**

1. One class per page
2. Locators as getters
3. Methods for actions only
4. No assertions in POM
5. Descriptive method names
6. Use role-based selectors
7. Keep methods simple and focused

**Test Data:**

1. Separate data from tests
2. Use JSON files for test data
3. ESM-compatible imports
4. Environment-specific configurations
5. Avoid hardcoded values

**Error Handling:**

1. Let Playwright handle errors (no try/catch in tests)
2. Use meaningful error messages
3. Collect traces on failure
4. Screenshot failed states

---

## Troubleshooting

### Common Issues

**Browser Not Installed:**

```bash
# Error: Executable doesn't exist
npx playwright install
```

**Test Timeout:**

```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
});
```

```typescript
// Or in playwright.config.ts
timeout: 60000, // 1 minute default
```

**Port Already in Use:**

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Element Not Found:**

- Verify selector is correct
- Check element is visible: `await expect(element).toBeVisible()`
- Use auto-waiting: `await element.click()` (not `waitForTimeout`)
- Check for dynamic content loading

**Import Errors (ESM):**

```typescript
// Don't use CommonJS
const config = require('./config'); // WRONG

// Use ESM
import config from './config'; // CORRECT
```

**JSON Import Issues:**

```typescript
// Don't import directly
import data from './data.json'; // WRONG

// Use readFileSync
import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('./data.json', 'utf-8')); // CORRECT
```

### Debugging

**Playwright Inspector:**

```bash
npx playwright test --debug
```

**Trace Viewer:**

```bash
# Record trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

**Headed Mode:**

```bash
# See browser while testing
npx playwright test --headed
```

**Console Logs:**

```typescript
test('debug test', async ({ page }) => {
  page.on('console', (msg) => console.log(msg.text()));
  await page.goto('/');
});
```

**Step-by-Step Debugging:**

```bash
# Run in debug mode
PWDEBUG=1 npx playwright test

# Or use --debug flag
npx playwright test --debug
```

---

## Reports

### Playwright HTML Report

Automatic after test run:

```bash
# View last report
npx playwright show-report

# Generate from results
npx playwright show-report playwright-report
```

### Allure Report

More detailed reporting with screenshots and traces:

```bash
# Generate report
npm run allure:generate

# Open report
npm run allure:open

# Or manually
npx allure generate allure-results --clean
npx allure open allure-report
```

### Excel Reports

Test results automatically written to Excel template:

- Location: `excel/testcase-template.xlsm`
- Auto-updated on test completion
- Run count tracked automatically
- Status, duration, errors recorded

---

## Resources

### Official Documentation

- [Playwright Docs](https://playwright.dev)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project Documentation

- `.github/instructions/` - Detailed development guidelines
- `.cursor/rules/` - Code generation rules
- `docs/` - Additional documentation

### Community

- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Discord](https://aka.ms/playwright/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

---

## License

ISC

---

## Contributing

1. Create feature branch
2. Follow code style guidelines
3. Write tests for new features
4. Run linting: `npm run lint:fix`
5. Commit with conventional format
6. Create pull request
7. Ensure CI passes

---

## Support

For issues and questions:

- Open GitHub issue
- Contact team lead
- Check documentation in `.github/instructions/`

---

**Last Updated:** January 2026

