# Test Scenario: A001-LOGIN_020

## Test Case Information

| Field                | Value                                 |
| -------------------- | ------------------------------------- |
| **Test Case ID**     | A001-LOGIN_020                        |
| **Test Type**        | Regression                            |
| **Priority**         | Low                                   |
| **Category**         | Negative                              |
| **Feature**          | Login                                 |
| **Scenario**         | Password With Spaces                  |
| **Description**      | Login with password containing spaces |
| **Function Name**    | loginPWContainSpace                   |
| **Case Folder Name** | case-020-login                        |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | admin02@libman.com                                          |
| **Password**         | "000 000" (with space in the middle)                        |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page

### Step 2: Enter valid email

- Enter email: `admin02@libman.com`

### Step 3: Enter password with spaces

- Enter password: `000 000` (with space in the middle)

### Step 4: Click Login button

- Click the Login button

### Step 5: Verify error message

- Verify authentication error message is displayed

---

## Expected Results

- Show error message: メールアドレスまたはパスワードが間違っています
- User remains on login page

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
