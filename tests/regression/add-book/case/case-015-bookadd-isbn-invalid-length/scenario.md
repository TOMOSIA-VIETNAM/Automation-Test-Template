# Test Scenario: A014-BOOKADD_015

## Test Case Information

| Field                | Value                                |
| -------------------- | ------------------------------------ |
| **Test Case ID**     | A014-BOOKADD_015                     |
| **Test Type**        | Regression                           |
| **Priority**         | Medium                               |
| **Category**         | Negative                             |
| **Feature**          | Book                                 |
| **Scenario**         | ISBN Invalid Length                  |
| **Function Name**    | addBookISBNInvalid                   |
| **Case Folder Name** | case-015-bookadd-isbn-invalid-length |

---

## Test Data

| Field                | Value                |
| -------------------- | -------------------- |
| **Precondition**     | Admin logged in      |
| **ISBN**             | 123456789 (9 digits) |
| **Expected Message** | 不正なISBN           |

---

## Test Steps

1. Open Add Book screen
2. Enter invalid ISBN length
3. Click 送信

---

## Expected Results

- Show error message: 不正なISBN

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
