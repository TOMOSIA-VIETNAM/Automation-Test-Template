# Test Scenario: A014-BOOKADD_008

## Test Case Information

| Field                | Value                            |
| -------------------- | -------------------------------- |
| **Test Case ID**     | A014-BOOKADD_008                 |
| **Test Type**        | Regression                       |
| **Priority**         | High                             |
| **Category**         | Negative                         |
| **Feature**          | Book                             |
| **Scenario**         | Empty Publisher                  |
| **Function Name**    | addBookEmptyPublisher            |
| **Case Folder Name** | case-008-bookadd-empty-publisher |

---

## Test Data

| Field                | Value                      |
| -------------------- | -------------------------- |
| **Precondition**     | Admin logged in            |
| **Expected Message** | 出版社名を入力してください |

---

## Test Steps

1. Open Add Book screen
2. Leave Publisher empty
3. Click 送信

---

## Expected Results

- Show error message: 出版社名を入力してください

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
