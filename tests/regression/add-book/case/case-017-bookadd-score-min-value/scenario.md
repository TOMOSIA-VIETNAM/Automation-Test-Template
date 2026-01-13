# Test Scenario: A014-BOOKADD_017

## Test Case Information

| Field                | Value                            |
| -------------------- | -------------------------------- |
| **Test Case ID**     | A014-BOOKADD_017                 |
| **Test Type**        | Regression                       |
| **Priority**         | Medium                           |
| **Category**         | Positive                         |
| **Feature**          | Book                             |
| **Scenario**         | Score Min                        |
| **Function Name**    | addBookScoreMin                  |
| **Case Folder Name** | case-017-bookadd-score-min-value |

---

## Test Data

| Field                | Value                             |
| -------------------- | --------------------------------- |
| **Precondition**     | Admin logged in                   |
| **Score**            | 0                                 |
| **Expected Message** | 0より大きい数値を入力してください |

---

## Test Steps

1. Open Add Book screen
2. Enter score = 0
3. Click 送信

---

## Expected Results

- Show error message: 0より大きい数値を入力してください

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
