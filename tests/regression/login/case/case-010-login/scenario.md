# Test Scenario: A001-LOGIN_010

## Test Case Information

| Field                | Value               |
| -------------------- | ------------------- |
| **Test Case ID**     | A001-LOGIN_010      |
| **Test Type**        | Regression          |
| **Priority**         | Medium              |
| **Category**         | Boundary Positive   |
| **Feature**          | Login               |
| **Scenario**         | Email Max Length    |
| **Precondition**     | Account exists      |
| **Function Name**    | loginEmailMaxLength |
| **Case Folder Name** | case-010-login      |

---

## Test Data

| Field                | Value                               |
| -------------------- | ----------------------------------- |
| **Email**            | 253 characters email                |
| **Password**         | 000000                              |
| **Expected Message** | ログインに成功しました (message_54) |

---

## Test Steps

1. Open Login page
2. Enter email with maximum allowed length (253 characters)
3. Enter valid password
4. Click Login button
5. Verify login is successful

---

## Expected Results

- Go to the dashboard
- Show success message: ログインに成功しました

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
