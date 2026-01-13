# Test Scenario: A001-LOGIN_025

## Test Case Information

| Field                | Value                                                                    |
| -------------------- | ------------------------------------------------------------------------ |
| **Test Case ID**     | A001-LOGIN_025                                                           |
| **Test Type**        | Security                                                                 |
| **Priority**         | High                                                                     |
| **Category**         | Security                                                                 |
| **Feature**          | Login                                                                    |
| **Scenario**         | Brute Force Protection                                                   |
| **Description**      | Test brute force protection by exceeding failed login attempts threshold |
| **Function Name**    | loginBruteForce                                                          |
| **Case Folder Name** | case-025-login                                                           |
| **Precondition**     | Threshold set for failed attempts                                        |

---

## Test Data

| Field                         | Value                                                       |
| ----------------------------- | ----------------------------------------------------------- |
| **Email**                     | admin02@libman.com                                          |
| **Password**                  | wrongpassword                                               |
| **Failed Attempts Threshold** | 10 attempts                                                 |
| **Expected Message**          | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page

### Step 2: Perform multiple failed login attempts

- Execute 10+ failed login attempts with wrong password
- Use the same email address for all attempts

### Step 3: Verify brute force protection

- Verify system behavior after exceeding threshold
- System may block further attempts or show rate limiting message

---

## Expected Results

- System detects brute force attack pattern
- After threshold is exceeded, appropriate protection is triggered
- Error messages are displayed for each failed attempt

---

## Notes

This test validates that the system has brute force protection mechanisms in place.

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
