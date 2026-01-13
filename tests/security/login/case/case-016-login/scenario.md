# Test Scenario: A001-LOGIN_016

## Test Case Information

| Field                | Value             |
| -------------------- | ----------------- |
| **Test Case ID**     | A001-LOGIN_016    |
| **Test Type**        | Security          |
| **Priority**         | High              |
| **Category**         | Negative          |
| **Feature**          | Login             |
| **Scenario**         | XSS Injection     |
| **Function Name**    | loginXSSInjection |
| **Case Folder Name** | case-016-login    |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | `<script>alert(1)</script>`                                 |
| **Password**         | 000000                                                      |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

1. Open Login page
2. Enter XSS payload into Email field
3. Enter password
4. Click Login button
5. Verify no script is executed and error message is shown

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています
- No script execution (no alert box)
- System sanitizes input safely

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
