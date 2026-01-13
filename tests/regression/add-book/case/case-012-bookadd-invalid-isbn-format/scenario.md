# Test Scenario: A014-BOOKADD_012

## Test Case Information

| Field                | Value                                |
| -------------------- | ------------------------------------ |
| **Test Case ID**     | A014-BOOKADD_012                     |
| **Test Type**        | Regression                           |
| **Priority**         | High                                 |
| **Category**         | Negative                             |
| **Feature**          | Book                                 |
| **Scenario**         | Invalid ISBN Format                  |
| **Function Name**    | addBookInvalidISBN                   |
| **Case Folder Name** | case-012-bookadd-invalid-isbn-format |

---

## Test Data

| Field                | Value           |
| -------------------- | --------------- |
| **Precondition**     | Admin logged in |
| **ISBN**             | ABC123          |
| **Expected Message** | 不正なISBN      |

---

## Test Steps

1. Open Add Book screen
2. Enter invalid ISBN
3. Click 送信

---

## Expected Results

- Show error message: 不正なISBN

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
