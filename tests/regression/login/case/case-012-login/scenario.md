# Test Scenario: A001-LOGIN_012

## Test Case Information

| Field                | Value              |
| -------------------- | ------------------ |
| **Test Case ID**     | A001-LOGIN_012     |
| **Test Type**        | Regression         |
| **Priority**         | High               |
| **Category**         | Negative           |
| **Feature**          | Login              |
| **Scenario**         | Wrong Password     |
| **Precondition**     | User exists        |
| **Function Name**    | loginWrongPassword |
| **Case Folder Name** | case-012-login     |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | admin02@libman.com                                          |
| **Password**         | wrong123                                                    |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

1. Open Login page
2. Enter valid email
3. Enter incorrect password
4. Click Login button
5. Verify authentication error message is displayed

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
