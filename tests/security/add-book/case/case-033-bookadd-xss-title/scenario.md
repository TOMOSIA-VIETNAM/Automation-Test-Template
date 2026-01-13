# Test Scenario: A014-BOOKADD_033

## Test Case Information

| Field                | Value                      |
| -------------------- | -------------------------- |
| **Test Case ID**     | A014-BOOKADD_033           |
| **Test Type**        | Security                   |
| **Priority**         | High                       |
| **Category**         | Negative                   |
| **Feature**          | Book                       |
| **Scenario**         | XSS Title                  |
| **Function Name**    | addBookXSS                 |
| **Case Folder Name** | case-033-bookadd-xss-title |

---

## Test Data

| Field               | Value                                       |
| ------------------- | ------------------------------------------- |
| **Precondition**    | Admin logged in                             |
| **XSS Payload**     | `<script>alert('XSS')</script>`             |
| **Expected Result** | No script executed, input is safely handled |

---

## Test Steps

1. Open Add Book screen
2. Enter XSS payload in Title field
3. Click 送信

---

## Expected Results

- No script executed, input is safely handled

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
