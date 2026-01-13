# Test Scenario: A014-BOOKADD_007

## Test Case Information

| Field                | Value                         |
| -------------------- | ----------------------------- |
| **Test Case ID**     | A014-BOOKADD_007              |
| **Test Type**        | Regression                    |
| **Priority**         | High                          |
| **Category**         | Negative                      |
| **Feature**          | Book                          |
| **Scenario**         | Empty Author                  |
| **Function Name**    | addBookEmptyAuthor            |
| **Case Folder Name** | case-007-bookadd-empty-author |

---

## Test Data

| Field                | Value                    |
| -------------------- | ------------------------ |
| **Precondition**     | Admin logged in          |
| **Expected Message** | 著者名を入力してください |

---

## Test Steps

1. Open Add Book screen
2. Leave Author empty
3. Click 送信

---

## Expected Results

- Show error message: 著者名を入力してください

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
