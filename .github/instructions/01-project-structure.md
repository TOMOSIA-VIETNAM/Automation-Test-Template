# Project Structure

Complete folder structure and organization rules for the AutomationTest framework.

---

## Root Structure

```
AutomationTest/
├── .cursor/                    # Cursor AI configuration
│   └── rules/                  # Cursor AI rules
│       ├── code-style.mdc
│       ├── commit-rule.mdc
│       ├── excel-integration-rule.mdc
│       ├── folder-structure.mdc
│       ├── playwright-assertion-rule.mdc
│       ├── playwright-fixtures-and-hooks-rule.mdc
│       ├── playwright-naming-convention.mdc
│       ├── playwright-pom-structure.mdc
│       ├── playwright-test-structure.mdc
│       ├── read-excel.mdc
│       ├── reporting-rule.mdc
│       └── scenario-template.mdc
├── .github/
│   ├── instructions/           # GitHub Copilot instructions
│   │   ├── 01-project-structure.md
│   │   ├── 02-test-structure.md
│   │   ├── 03-page-object-model.md
│   │   ├── 04-excel-integration.md
│   │   ├── 05-reporting.md
│   │   ├── 06-code-style.md
│   │   ├── 07-assertions.md
│   │   ├── 08-commit-standards.md
│   │   └── 09-naming-conventions.md
│   └── workflows/              # GitHub Actions CI/CD
│       └── playwright.yml
├── .husky/                     # Git hooks (commit-msg, pre-commit)
├── .playwright-test-tracker/   # Test execution tracking (JSON files)
├── allure-results/             # Allure test results (auto-generated)
├── docs/                       # Documentation
├── excel/                      # Excel templates & test data
│   └── testcase-template.xlsm
├── reports/                    # Generated test reports
│   └── allure/                 # Allure reports
├── src/
│   ├── api/                    # API client classes
│   ├── constants/              # Environment, selectors, test data
│   ├── css/                    # CSS files for reports
│   ├── fixtures/               # Playwright fixtures
│   ├── html/                   # HTML templates
│   ├── mocks/                  # Mock server & stub responses
│   ├── pages/                  # Page Object Model classes
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Helper utilities
│   │   └── excel-result-writer.ts
│   └── TestAutomationScenarioDesignDocumentV2.2.xlsm
├── tests/
│   ├── api/                    # API tests
│   │   └── <feature-name>/
│   │           ├── cases/
│   │           │   └── <case-folder-name>/
│   │           │       ├── test.spec.ts
│   │           │       ├── test-data.json
│   │           │       ├── scenario.md
│   │           │       └── results/
│   │           └── shared-data.json
│   ├── e2e/
│   │   └── <feature-name>/           # Feature-based organization
│   │           ├── cases/
│   │           │   └──<case-folder-name>/
│   │           │       ├── test.spec.ts
│   │           │       ├── test-data.json
│   │           │       ├── scenario.md
│   │           │       └── results/
│   │           └── shared-data.json
│   ├── performance/            # Performance tests
│   │   └── <feature-name>/
│   │           ├── cases/
│   │           │   └── <case-folder-name>/
│   │           │       ├── test.spec.ts
│   │           │       ├── test-data.json
│   │           │       ├── scenario.md
│   │           │       └── results/
│   │           └── shared-data.json
│   ├── regression/             # Regression tests
│   │   └──<feature-name>/
│   │           ├── cases/
│   │           │   └── <case-folder-name>/
│   │           │       ├── test.spec.ts
│   │           │       ├── test-data.json
│   │           │       ├── scenario.md
│   │           │       └── results/
│   │           └── shared-data.json
│   ├── security/               # Security tests
│   │   └── <feature-name>/
│   │           ├── cases/
│   │           │   └── <case-folder-name>/
│   │           │       ├── test.spec.ts
│   │           │       ├── test-data.json
│   │           │       ├── scenario.md
│   │           │       └── results/
│   │           └── shared-data.json
│   ├── ui/                     # UI tests (visual regression)
│   │   └── <feature-name>/
│   │           ├── cases/
│   │           │   └── <case-folder-name>/
│   │           │       ├── test.spec.ts
│   │           │       ├── test-data.json
│   │           │       ├── scenario.md
│   │           │       └── results/
│   │           └── shared-data.json
│   ├── global-setup.ts
│   └── global-teardown.ts
├── types/                      # Global TypeScript types
├── .env                        # Environment variables (not committed)
├── .gitignore
├── .prettierrc                 # Prettier configuration
├── commitlint.config.ts        # Commitlint configuration
├── eslint.config.mjs           # ESLint configuration
├── Jenkinsfile                 # Jenkins CI/CD configuration
├── package.json                # NPM dependencies
├── playwright.config.ts        # Playwright configuration
├── README.md                   # Project documentation
└── tsconfig.json               # TypeScript configuration
```

---

## Folder Organization Rules

### 1. Feature-Based Organization

- Every feature MUST have its own folder under `tests/e2e/features/`
- Feature folder MUST include:
  - `cases/` folder for test cases
  - `shared-data.json` for feature-level data

### 2. Test Case Organization

- Each test case in its own folder under `cases/`
- Case folder naming: `<descriptive-case-name>/`
  - \*\*Good: `login-successful/`, `add-product-to-cart/`
  - \*\*Bad: `case-01/`, `test1/`

### 3. Required Files Per Case

```
<case-name>/
├── test.spec.ts      # Main test script (REQUIRED)
├── test-data.json    # Test data (REQUIRED)
├── scenario.md       # Test scenario documentation (REQUIRED)
└── results/          # Auto-created on test execution
```

Optional files:

- `assertions.ts` - Complex assertion functions
- `constants.ts` - Case-specific constants

### 4. Test Script Location

All test scripts MUST be named `test.spec.ts`:

```
tests/e2e/features/<feature>/cases/<case-name>/test.spec.ts
```

### 5. Page Object Model

All POM classes MUST be in:

```
src/pages/
```

Example:

- `src/pages/LoginPage.ts`
- `src/pages/DashboardPage.ts`

### 6. Utilities & Helpers

All reusable utilities MUST be in:

```
src/utils/
```

Example:

- `src/utils/excel-result-writer.ts`
- `src/utils/string-helpers.ts`

### 7. Fixtures

All Playwright fixtures MUST be in:

```
src/fixtures/
```

### 8. Constants & Configuration

- Environment: `src/constants/env.ts`
- Selectors: `src/constants/selectors.ts`
- Test data: `src/constants/test-data.ts`

### 9. API Clients

All API client classes MUST be in:

```
src/api/
```

### 10. Test Data Files

**Case-level data:**

```
tests/e2e/features/<feature>/cases/<case-name>/test-data.json
```

**Feature-level shared data:**

```
tests/e2e/features/<feature>/shared-data.json
```

---

## File Naming Conventions

| Type          | Convention     | Example                  |
| ------------- | -------------- | ------------------------ |
| Test files    | `test.spec.ts` | `test.spec.ts`           |
| POM files     | PascalCase     | `LoginPage.ts`           |
| Utility files | kebab-case     | `excel-result-writer.ts` |
| Constants     | kebab-case     | `test-data.ts`           |
| Fixtures      | kebab-case     | `auth-fixture.ts`        |

---

## Path Examples

### Correct Paths

```
**tests/e2e/features/authentication/cases/login-successful/test.spec.ts
**tests/e2e/features/shopping-cart/cases/add-product/test-data.json
**src/pages/LoginPage.ts
**src/utils/excel-result-writer.ts
**src/constants/env.ts
```

### Incorrect Paths

```
**tests/login-test.spec.ts
**pages/login.ts
**utils/excelWriter.ts
**test-data.json (at root)
```

---

## Special Directories

### .playwright-test-tracker/

Contains JSON files for tracking multi-project test execution:

- `PERFORMANCE.json`
- `SECURITY.json`
- Individual test trackers per TestCaseID

**Do NOT modify manually** - managed by excel-result-writer

### allure-results/

Auto-generated Allure test results at root level.

**Do NOT commit to git** - added to `.gitignore`

### test-results/

Global test output for CI/CD:

- `results.json`
- `junit.xml`

**Do NOT commit to git** - added to `.gitignore`

---

## Project Context Awareness

Before generating any code, ALWAYS analyze:

- `tests/e2e/**` - Existing test structure
- `src/pages/**` - Available POM classes
- `src/utils/**` - Available helpers
- `src/fixtures/**` - Available fixtures
- `src/constants/**` - Available constants

**Rule**: Never recreate what already exists - import and use existing resources.
