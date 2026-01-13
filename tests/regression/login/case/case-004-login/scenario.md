# Test Scenario: A001-LOGIN_004

## Test Case Information

| Field                | Value                           |
| -------------------- | ------------------------------- |
| **Test Case ID**     | A001-LOGIN_004                  |
| **Test Type**        | Regression                      |
| **Priority**         | High                            |
| **Category**         | Negative                        |
| **Feature**          | Login                           |
| **Scenario**         | Empty Password                  |
| **Description**      | Empty Password Field Validation |
| **Function Name**    | loginEmptyPassword              |
| **Case Folder Name** | case-004-login                  |

---

## Test Data

| Field                | Value                                     |
| -------------------- | ----------------------------------------- |
| **Email**            | admin02@libman.com                        |
| **Password**         | "" (empty)                                |
| **Expected Message** | パスワードを入力してください (message_53) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page

### Step 2: Enter valid email into Email field

- Enter email: `admin02@libman.com`

### Step 3: Leave Password field empty

- Do not enter any text in the password field

### Step 4: Click Login button

- Click the Login button

### Step 5: Verify validation message

- Verify validation message is displayed under Password field

---

## Expected Results

- Show validation message: パスワードを入力してください (message_53)
- User remains on login page

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
