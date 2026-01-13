# Excel Integration

Complete guide for Excel result writer usage and configuration.

---

## Overview

This project includes automated Excel result writing that integrates Playwright test execution with Excel test case templates.

**Key Files:**

- Utility: `src/utils/excel-result-writer.ts`
- Template: `excel/testcase-template.xlsm`
- Tracker: `.playwright-test-tracker/`

---

## Basic Usage

### In Test Files

```ts
import { excelResultWriter } from '@utils/excel-result-writer';

test.afterEach(async ({}, testInfo) => {
  await excelResultWriter.writeResult(testInfo);
});
```

### Test Requirements

Every test using Excel writer MUST include:

1. **TestCaseID tag** in the tag array
2. **Proper tag format**: `@TC_XXX`

```ts
test(
  'should login successfully when using valid credentials',
  {
    tag: ['@login', '@smoke', '@TC_001'], // @TC_001 is mandatory
  },
  async ({ page }) => {
    // Test steps...
  },
);
```

---

## TestCaseID Tag Requirements

### Format Rules

- **Required format**: `@TC_XXX` where XXX is the test case ID
- **Alternative format**: `@<TestCaseID>` matching Excel template ID
- **Location**: MUST be in `tag` array
- **Forbidden**: MUST NOT appear in test name

### Correct Examples

**Good:**

```ts
test(
  'should login successfully when using valid credentials',
  {
    tag: ['@login', '@smoke', '@TC_001'],
  },
  async ({ page }) => {
    // Test...
  },
);
```

**Bad:**

```ts
// TestCaseID in test name - WRONG!
test(
  'TC_001 should login successfully',
  {
    tag: ['@login', '@smoke'],
  },
  async ({ page }) => {
    // Test...
  },
);

// Missing TestCaseID tag - WRONG!
test(
  'should login successfully when using valid credentials',
  {
    tag: ['@login', '@smoke'], // No @TC_XXX
  },
  async ({ page }) => {
    // Test...
  },
);
```

---

## Data Written to Excel

The Excel writer automatically writes the following data:

| Field                | Description                  | Source                                |
| -------------------- | ---------------------------- | ------------------------------------- |
| **Result**           | `P` (Passed) or `F` (Failed) | Test execution status                 |
| **Date**             | Test execution date          | YYYY-MM-DD format                     |
| **Tester Name**      | Name of tester               | `TESTER_NAME` env variable            |
| **Report Link**      | Link to Playwright report    | Auto-generated with TestCaseID filter |
| **Auto Method Name** | Generated method name        | From test file path                   |
| **Folder Name**      | Test folder name             | Extracted from file path              |

---

## Round 1 vs Round 2

### Automatic Round Detection

The Excel writer automatically determines which round to write to:

- **Round 1**: If Round 1 data is empty
- **Round 2**: If Round 1 already has data

### Column Mapping

| Excel Column Header           | Data Written          |
| ----------------------------- | --------------------- |
| Result 1 / Result 2           | P or F                |
| Date 1 / Date 2               | YYYY-MM-DD            |
| Date / 試験日                 | YYYY-MM-DD            |
| Tester 1 / Tester 2           | Tester name           |
| Tester / 担当者               | Tester name           |
| Report Link 1 / Report Link 2 | Playwright report URL |

### Re-Running Tests

- Re-running tests updates the appropriate round
- Supports multiple test executions
- Preserves existing data in both rounds

---

## Multi-Project Test Execution

### How It Works

When running tests across multiple Playwright projects:

1. **Test runs on Project 1** (e.g., chromium)
   - Result tracked, NOT written to Excel yet

2. **Test runs on Project 2** (e.g., firefox)
   - Result tracked, NOT written to Excel yet

3. **Test runs on Project 3** (e.g., webkit)
   - This is the last run
   - Final status determined
   - Result written to Excel

### Final Status Logic

- **If ANY project failed** → writes `F` to Excel
- **If ALL projects passed** → writes `P` to Excel

### Example Scenario

```
Test TC_001 runs on:
- chromium → PASS
- firefox → FAIL
- webkit → PASS

Final Excel result: F (because firefox failed)
```

---

## Test Execution Tracking

### Tracker Directory

`.playwright-test-tracker/` contains JSON files:

- `PERFORMANCE.json` - Performance test tracking
- `SECURITY.json` - Security test tracking
- Individual test trackers per TestCaseID

### Tracker Data Structure

```json
{
  "count": 2,
  "totalProjects": 3,
  "results": {
    "chromium": {
      "status": "P",
      "projectName": "chromium"
    },
    "firefox": {
      "status": "F",
      "projectName": "firefox"
    }
  }
}
```

### Tracking Features

- Counts test runs across projects
- Stores results for each project
- Determines when all projects completed
- Writes to Excel only after last project run
- Prevents duplicate result writing

### Important Notes

- **Do NOT modify tracker files manually**
- Managed automatically by excel-result-writer
- Cleared/updated on each test run
- Essential for multi-project execution

---

## Configuration

### Default Configuration

```ts
{
  excelFilePath: 'excel/testcase-template.xlsm',
  sheetName: 'Super Admin -  List Admin',
  headerRowIndex: 7
}
```

### Custom Configuration

```ts
import { createExcelResultWriter } from '@utils/excel-result-writer';

const customWriter = createExcelResultWriter({
  excelFilePath: 'excel/my-template.xlsm',
  sheetName: 'My Sheet',
  headerRowIndex: 5,
});

test.afterEach(async ({}, testInfo) => {
  await customWriter.writeResult(testInfo);
});
```

### Configuration Options

| Option           | Type   | Description            | Default                        |
| ---------------- | ------ | ---------------------- | ------------------------------ |
| `excelFilePath`  | string | Path to Excel template | `excel/testcase-template.xlsm` |
| `sheetName`      | string | Excel sheet name       | `Super Admin - List Admin`     |
| `headerRowIndex` | number | Row index of headers   | `7`                            |

---

## Environment Variables

### Required Variables

```bash
# Tester name written to Excel
TESTER_NAME="John Doe"

# Base URL for Playwright report links
PLAYWRIGHT_REPORT_URL="http://localhost:9323"
```

### Setting Environment Variables

**Option 1: .env file**

```
TESTER_NAME=John Doe
PLAYWRIGHT_REPORT_URL=http://localhost:9323
```

**Option 2: Shell export**

```bash
export TESTER_NAME="John Doe"
export PLAYWRIGHT_REPORT_URL="http://localhost:9323"
```

**Option 3: npm script**

```json
{
  "scripts": {
    "test": "TESTER_NAME='John Doe' npx playwright test"
  }
}
```

---

## Complete Example

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
      tag: ['@login', '@smoke', '@TC_001'], // TestCaseID tag is mandatory
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Given
      await loginPage.goto();

      // When
      await loginPage.login(testData.validUser.username, testData.validUser.password);

      // Then
      await expect(page).toHaveURL(/dashboard/);
      await expect(page.locator('.welcome-message')).toBeVisible();
    },
  );

  test(
    'should show error when using invalid credentials',
    {
      tag: ['@login', '@regression', '@TC_002'], // TestCaseID tag is mandatory
    },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Given
      await loginPage.goto();

      // When
      await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

      // Then
      await expect(page.locator('.error-message')).toBeVisible();
    },
  );
});

// Excel result writer in afterEach hook
test.afterEach(async ({}, testInfo) => {
  await excelResultWriter.writeResult(testInfo);
});
```

---

## Troubleshooting

### Results Not Written to Excel

**Check:**

1. Is TestCaseID tag present? (`@TC_XXX`)
2. Is TestCaseID tag in the `tag` array?
3. Are environment variables set? (`TESTER_NAME`)
4. Does Excel template exist at specified path?
5. Is Excel template open? (Close it before running tests)

### Wrong Round Written

**Verify:**

- Check existing data in Excel template
- Ensure Round 1 columns are properly filled/empty
- Excel writer detects Round 1 by checking for existing data

### Multi-Project Issues

**Debug:**

- Check `.playwright-test-tracker/` directory
- Verify tracker JSON files are being created
- Ensure `totalProjects` count matches your Playwright config
- Check that all projects are actually running

---

## Best Practices

1. **Always include TestCaseID tag** for tests that need Excel reporting
2. **Set environment variables** before running tests
3. **Close Excel files** before test execution
4. **Don't modify tracker files** manually
5. **Use consistent TestCaseID format** across all tests
6. **Verify Excel template structure** matches expected format
