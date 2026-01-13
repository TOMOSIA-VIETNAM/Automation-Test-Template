# Test Scenario: A001-LOGIN_019

## Test Case Information

| Field                | Value                                               |
| -------------------- | --------------------------------------------------- |
| **Test Case ID**     | A001-LOGIN_019                                      |
| **Test Type**        | UI/Usability                                        |
| **Priority**         | Medium                                              |
| **Category**         | Usability                                           |
| **Feature**          | Login                                               |
| **Scenario**         | Trim Input                                          |
| **Description**      | Login with email containing leading/trailing spaces |
| **Function Name**    | loginTrimSpaces                                     |
| **Case Folder Name** | case-019-login                                      |

---

## Test Data

| Field                | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| **Email**            | " admin02@libman.com " (with leading/trailing spaces)       |
| **Password**         | 000000                                                      |
| **Expected Message** | メールアドレスまたはパスワードが間違っています (message_28) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page

### Step 2: Enter email with leading/trailing spaces

- Enter email: `admin02@libman.com` (with spaces before and after)

### Step 3: Enter valid password

- Enter password: `000000`

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
