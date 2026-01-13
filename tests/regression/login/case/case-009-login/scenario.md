# Test Scenario: A001-LOGIN_009

## Test Case Information

| Field                | Value                         |
| -------------------- | ----------------------------- |
| **Test Case ID**     | A001-LOGIN_009                |
| **Test Type**        | Regression                    |
| **Priority**         | High                          |
| **Category**         | Negative                      |
| **Feature**          | Login                         |
| **Scenario**         | Email With Special Characters |
| **Function Name**    | loginEmailSpecialChars        |
| **Case Folder Name** | case-009-login                |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | test#[user@test.com]                                        |
| **Password**         | 000000                                                      |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

1. Open Login page
2. Enter email containing special characters
3. Enter valid password
4. Click Login button
5. Verify authentication error message is displayed

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
