# Test Scenario: A001-LOGIN_011

## Test Case Information

| Field                | Value             |
| -------------------- | ----------------- |
| **Test Case ID**     | A001-LOGIN_011    |
| **Test Type**        | Regression        |
| **Priority**         | Medium            |
| **Category**         | Boundary Negative |
| **Feature**          | Login             |
| **Scenario**         | Email Too Long    |
| **Function Name**    | loginEmailTooLong |
| **Case Folder Name** | case-011-login    |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | 254+ characters email                                       |
| **Password**         | 000000                                                      |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

1. Open Login page
2. Enter email exceeding maximum length (254+ characters)
3. Enter valid password
4. Click Login button
5. Verify authentication error message is displayed

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
