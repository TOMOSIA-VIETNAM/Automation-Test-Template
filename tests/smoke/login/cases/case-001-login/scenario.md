# Test Scenario: A001-LOGIN_001

## Test Case Information

| Field                | Value          |
| -------------------- | -------------- |
| **Test Case ID**     | A001-LOGIN_001 |
| **Test Type**        | Smoke          |
| **Priority**         | High           |
| **Category**         | Positive       |
| **Feature**          | Login          |
| **Scenario**         | Valid Login    |
| **Description**      | User exists    |
| **Function Name**    | loginValid     |
| **Case Folder Name** | case-001-login |

---

## Test Data

| Field                | Value                               |
| -------------------- | ----------------------------------- |
| **Email**            | admin@libman.com                    |
| **Password**         | 000000                              |
| **Expected Message** | ログインに成功しました (message_54) |

---

## Test Steps

### Step 1: Open Login page

- Navigate to the login page
- Verify that the login page is displayed correctly

### Step 2: Enter valid email into Email field

- Locate the email input field
- Enter email: `admin@libman.com`
- Verify that the email is entered correctly

### Step 3: Enter valid password into Password field

- Locate the password input field
- Enter password: `000000`
- Verify that the password is entered correctly (masked)

### Step 4: Click Login button

- Locate the Login button
- Click the Login button
- Verify that the button is clickable

### Step 5: Wait for system response

- Wait for the page to complete loading
- Wait for all network requests to complete
- Verify that there are no console errors

### Step 6: Verify user is redirected to Dashboard page

- Verify that the URL contains "home"
- Verify that the Dashboard page is displayed
- Verify that the user information is shown correctly

---

## Expected Results

### Primary Expected Result

- User is successfully redirected to the Dashboard page after login

### Secondary Expected Results

- Success dialog appears with message: **"ログインに成功しました"** (message_54)
- User's email is displayed on the Dashboard
- No error messages are shown
- Session is created successfully

---

## Pre-conditions

- Login page is accessible
- User account `admin@libman.com` exists in the system
- User account is active and not locked

---

## Post-conditions

- User is logged in successfully
- User session is created
- User can access Dashboard features
- Browser cookies/session storage contains authentication token

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
