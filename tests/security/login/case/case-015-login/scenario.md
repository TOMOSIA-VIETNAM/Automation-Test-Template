# Test Scenario: A001-LOGIN_015

## Test Case Information

| Field                | Value             |
| -------------------- | ----------------- |
| **Test Case ID**     | A001-LOGIN_015    |
| **Test Type**        | Security          |
| **Priority**         | High              |
| **Category**         | Negative          |
| **Feature**          | Login             |
| **Scenario**         | SQL Injection     |
| **Function Name**    | loginSQLInjection |
| **Case Folder Name** | case-015-login    |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | ' OR '1'='1                                                 |
| **Password**         | 000000                                                      |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

1. Open Login page
2. Enter SQL injection payload into Email field
3. Enter password
4. Click Login button
5. Verify system rejects the request safely

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています
- No database error exposed
- System handles injection safely

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
