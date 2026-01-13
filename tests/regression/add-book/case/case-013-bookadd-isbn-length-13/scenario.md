# Test Scenario: A014-BOOKADD_013

## Test Case Information

| Field                | Value                           |
| -------------------- | ------------------------------- |
| **Test Case ID**     | A014-BOOKADD_013                |
| **Test Type**        | Regression                      |
| **Priority**         | High                            |
| **Category**         | Positive                        |
| **Feature**          | Book                            |
| **Scenario**         | ISBN Length 13                  |
| **Function Name**    | addBookISBN13                   |
| **Case Folder Name** | case-013-bookadd-isbn-length-13 |

---

## Test Data

| Field                | Value                     |
| -------------------- | ------------------------- |
| **Precondition**     | Admin logged in           |
| **ISBN**             | 9784567890123 (13 digits) |
| **Expected Message** | 送信されました            |

---

## Test Steps

1. Open Add Book screen
2. Enter ISBN 13 digits
3. Click 送信

---

## Expected Results

- Show success dialog: 送信されました

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
