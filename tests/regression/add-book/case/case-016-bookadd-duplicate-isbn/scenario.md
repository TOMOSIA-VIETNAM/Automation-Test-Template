# Test Scenario: A014-BOOKADD_016

## Test Case Information

| Field                | Value                           |
| -------------------- | ------------------------------- |
| **Test Case ID**     | A014-BOOKADD_016                |
| **Test Type**        | Regression                      |
| **Priority**         | High                            |
| **Category**         | Negative                        |
| **Feature**          | Book                            |
| **Scenario**         | Duplicate ISBN                  |
| **Function Name**    | addBookDuplicateISBN            |
| **Case Folder Name** | case-016-bookadd-duplicate-isbn |

---

## Test Data

| Field                | Value                                 |
| -------------------- | ------------------------------------- |
| **Precondition**     | Existing ISBN in database             |
| **ISBN**             | Existing ISBN                         |
| **Expected Message** | 不正なISBN (frontend validation only) |

---

## Test Steps

1. Open Add Book screen
2. Enter existing ISBN
3. Click 送信

---

## Expected Results

- Show error message: 不正なISBN

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
