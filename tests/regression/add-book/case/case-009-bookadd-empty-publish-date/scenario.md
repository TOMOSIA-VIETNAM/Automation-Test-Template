# Test Scenario: A014-BOOKADD_009

## Test Case Information

| Field                | Value                               |
| -------------------- | ----------------------------------- |
| **Test Case ID**     | A014-BOOKADD_009                    |
| **Test Type**        | Regression                          |
| **Priority**         | High                                |
| **Category**         | Negative                            |
| **Feature**          | Book                                |
| **Scenario**         | Empty Publish Date                  |
| **Function Name**    | addBookEmptyDate                    |
| **Case Folder Name** | case-009-bookadd-empty-publish-date |

---

## Test Data

| Field                | Value                  |
| -------------------- | ---------------------- |
| **Precondition**     | Admin logged in        |
| **Expected Message** | 日付を選択してください |

---

## Test Steps

1. Open Add Book screen
2. Leave Publish Date empty
3. Click 送信

---

## Expected Results

- Show error message: 日付を選択してください

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
