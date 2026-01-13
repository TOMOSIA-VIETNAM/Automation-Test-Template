# Test Scenario: A001-LOGIN_023

## Test Case Information

| Field                | Value                                           |
| -------------------- | ----------------------------------------------- |
| **Test Case ID**     | A001-LOGIN_023                                  |
| **Test Type**        | Performance                                     |
| **Priority**         | High                                            |
| **Category**         | Load                                            |
| **Feature**          | Login                                           |
| **Scenario**         | Spam Login                                      |
| **Description**      | Rapid login attempts - 20 attempts in 5 seconds |
| **Function Name**    | loginSpam                                       |
| **Case Folder Name** | case-023-login                                  |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | admin02@libman.com                                          |
| **Password**         | wrongpassword                                               |
| **Attempts Count**   | 20                                                          |
| **Time Window**      | 5 seconds                                                   |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page

### Step 2: Perform rapid login attempts

- Execute 20 login attempts within 5 seconds
- Use wrong credentials to trigger authentication errors

### Step 3: Verify system handles load

- Verify system continues to respond
- Verify error messages are displayed correctly

---

## Expected Results

- System handles rapid login attempts without crashing
- Show error message: メールアドレスまたはパスワードが間違っています for each failed attempt
- System remains responsive

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
