# Test Scenario: A001-LOGIN_021

## Test Case Information

| Field                | Value                                 |
| -------------------- | ------------------------------------- |
| **Test Case ID**     | A001-LOGIN_021                        |
| **Test Type**        | Regression                            |
| **Priority**         | Low                                   |
| **Category**         | Negative                              |
| **Feature**          | Login                                 |
| **Scenario**         | Password Too Short                    |
| **Description**      | Login with password that is too short |
| **Function Name**    | loginPWShort                          |
| **Case Folder Name** | case-021-login                        |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | admin02@libman.com                                          |
| **Password**         | "000" (3 characters - too short)                            |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page

### Step 2: Enter valid email

- Enter email: `admin02@libman.com`

### Step 3: Enter short password

- Enter password: `000` (only 3 characters)

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
