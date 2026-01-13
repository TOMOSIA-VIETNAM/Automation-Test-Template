# Test Scenario: A014-BOOKADD_035

## Test Case Information

| Field                | Value                          |
| -------------------- | ------------------------------ |
| **Test Case ID**     | A014-BOOKADD_035               |
| **Test Type**        | Security                       |
| **Priority**         | High                           |
| **Category**         | Negative                       |
| **Feature**          | Book                           |
| **Scenario**         | SQL Injection                  |
| **Function Name**    | addBookSQLi                    |
| **Case Folder Name** | case-035-bookadd-sql-injection |

---

## Test Data

| Field               | Value                                          |
| ------------------- | ---------------------------------------------- |
| **Precondition**    | Admin logged in                                |
| **SQL Payload**     | `'; DROP TABLE books; --`                      |
| **Expected Result** | SQL injection is prevented, no data corruption |

---

## Test Steps

1. Open Add Book screen
2. Enter SQL injection string in Title field
3. Click 送信

---

## Expected Results

- SQL injection is prevented, no data corruption

---

## Test Data Reference

See [test-data.json](./test-data.json) for complete test data configuration.
