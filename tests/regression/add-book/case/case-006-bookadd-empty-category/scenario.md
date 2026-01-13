# Test Scenario: A014-BOOKADD_006

## Test Case Information

| Field                | Value                           |
| -------------------- | ------------------------------- |
| **Test Case ID**     | A014-BOOKADD_006                |
| **Test Type**        | Regression                      |
| **Priority**         | High                            |
| **Category**         | Negative                        |
| **Feature**          | Book                            |
| **Scenario**         | Empty Category                  |
| **Function Name**    | addBookEmptyCategory            |
| **Case Folder Name** | case-006-bookadd-empty-category |

---

## Test Data

| Field                | Value                        |
| -------------------- | ---------------------------- |
| **Precondition**     | Admin logged in              |
| **Expected Message** | カテゴリーを選択してください |

---

## Test Steps

1. Open Add Book screen
2. Do not select Category
3. Click 送信

---

## Expected Results

- Show error message: カテゴリーを選択してください

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
