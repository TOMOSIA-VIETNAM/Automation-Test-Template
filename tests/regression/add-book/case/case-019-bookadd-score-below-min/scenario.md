# Test Scenario: A014-BOOKADD_019

## Test Case Information

| Field                | Value                            |
| -------------------- | -------------------------------- |
| **Test Case ID**     | A014-BOOKADD_019                 |
| **Test Type**        | Regression                       |
| **Priority**         | Medium                           |
| **Category**         | Negative                         |
| **Feature**          | Book                             |
| **Scenario**         | Score Below Min                  |
| **Function Name**    | addBookScoreBelow                |
| **Case Folder Name** | case-019-bookadd-score-below-min |

---

## Test Data

| Field                | Value                             |
| -------------------- | --------------------------------- |
| **Precondition**     | Admin logged in                   |
| **Score**            | -1                                |
| **Expected Message** | 0より大きい数値を入力してください |

---

## Test Steps

1. Open Add Book screen
2. Enter score below min
3. Click 送信

---

## Expected Results

- Show error message: 0より大きい数値を入力してください

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
