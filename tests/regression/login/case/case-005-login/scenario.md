# Test Scenario: A001-LOGIN_005

## Test Case Information

| Field                | Value               |
| -------------------- | ------------------- |
| **Test Case ID**     | A001-LOGIN_005      |
| **Test Type**        | Regression          |
| **Priority**         | High                |
| **Category**         | Negative            |
| **Feature**          | Login               |
| **Scenario**         | Missing Both Fields |
| **Function Name**    | loginEmptyBoth      |
| **Case Folder Name** | case-005-login      |

---

## Test Data

| Field                | Value                                         |
| -------------------- | --------------------------------------------- |
| **Email**            | "" (empty)                                    |
| **Password**         | "" (empty)                                    |
| **Expected Message** | メールアドレスを入力してください (message_52) |

---

## Test Steps

1. Open Login page
2. Leave both Email and Password fields empty
3. Click Login button
4. Verify Email required message is displayed
5. Verify Password required message is displayed

---

## Expected Results

- Show validation message for email: メールアドレスを入力してください
- User remains on login page

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
