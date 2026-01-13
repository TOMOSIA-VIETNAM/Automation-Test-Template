# Test Scenario: A014-BOOKADD_011

## Test Case Information

| Field                | Value                           |
| -------------------- | ------------------------------- |
| **Test Case ID**     | A014-BOOKADD_011                |
| **Test Type**        | Regression                      |
| **Priority**         | High                            |
| **Category**         | Negative                        |
| **Feature**          | Book                            |
| **Scenario**         | Empty Quantity                  |
| **Function Name**    | addBookEmptyQty                 |
| **Case Folder Name** | case-011-bookadd-empty-quantity |

---

## Test Data

| Field                | Value                  |
| -------------------- | ---------------------- |
| **Precondition**     | Admin logged in        |
| **Expected Message** | この欄は空にできません |

---

## Test Steps

1. Open Add Book screen
2. Leave Quantity empty
3. Click 送信

---

## Expected Results

- Show error message: この欄は空にできません

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
