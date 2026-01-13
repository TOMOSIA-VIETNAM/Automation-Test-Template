# Test Scenario: A001-LOGIN_013

## Test Case Information

| Field                | Value           |
| -------------------- | --------------- |
| **Test Case ID**     | A001-LOGIN_013  |
| **Test Type**        | Regression      |
| **Priority**         | High            |
| **Category**         | Negative        |
| **Feature**          | Login           |
| **Scenario**         | Wrong Email     |
| **Function Name**    | loginWrongEmail |
| **Case Folder Name** | case-013-login  |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | notexist@libman.com                                         |
| **Password**         | 000000                                                      |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

1. Open Login page
2. Enter non-existing email
3. Enter valid password
4. Click Login button
5. Verify authentication error message is displayed

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
