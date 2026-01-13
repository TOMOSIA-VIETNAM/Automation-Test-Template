# Test Scenario: A001-LOGIN_003

## Test Case Information

| Field                | Value                        |
| -------------------- | ---------------------------- |
| **Test Case ID**     | A001-LOGIN_003               |
| **Test Type**        | Regression                   |
| **Priority**         | High                         |
| **Category**         | Negative                     |
| **Feature**          | Login                        |
| **Scenario**         | Empty Email                  |
| **Description**      | Empty Email Field Validation |
| **Function Name**    | loginEmptyEmail              |
| **Case Folder Name** | case-003-login               |

---

## Test Data

| Field                | Value                                         |
| -------------------- | --------------------------------------------- |
| **Email**            | "" (empty)                                    |
| **Password**         | 000000                                        |
| **Expected Message** | メールアドレスを入力してください (message_52) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page
- Verify that the login page is displayed correctly

### Step 2: Leave Email field empty

- Do not enter any text in the email field

### Step 3: Enter valid password into Password field

- Locate the password input field
- Enter password: `000000`

### Step 4: Click Login button

- Click the Login button

### Step 5: Verify validation message

- Verify validation message is displayed under Email field
- Expected message: メールアドレスを入力してください

---

## Expected Results

### Primary Expected Result

- Validation error message is displayed under Email field

### Secondary Expected Results

- User remains on login page
- No API request is sent
- Password field retains entered value

---

## Pre-conditions

- Login page is accessible

---

## Post-conditions

- User remains on login page
- Email required message is displayed

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
