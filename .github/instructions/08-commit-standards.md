# Commit Standards

Conventional commit message format and standards.

---

## Commit Message Format

Follow **Conventional Commits v1.0.0** standard:

```
<type>(optional-scope): <short description>

[optional body]

[optional footer]
```

---

## Allowed Commit Types

| Type       | Description                       | Example                                        |
| ---------- | --------------------------------- | ---------------------------------------------- |
| `feat`     | New feature                       | `feat(login): add remember me checkbox`        |
| `fix`      | Bug fix                           | `fix(api): resolve timeout in user service`    |
| `docs`     | Documentation only                | `docs(readme): update installation steps`      |
| `style`    | Code formatting (no logic change) | `style(login): format code with prettier`      |
| `refactor` | Code restructuring                | `refactor(auth): simplify token validation`    |
| `perf`     | Performance improvement           | `perf(search): optimize query performance`     |
| `test`     | Add or modify tests               | `test(checkout): add payment validation tests` |
| `build`    | Build system changes              | `build(deps): upgrade playwright to 1.40`      |
| `ci`       | CI/CD configuration               | `ci(github): add automated test workflow`      |
| `chore`    | Maintenance tasks                 | `chore(deps): update npm packages`             |
| `revert`   | Revert previous commit            | `revert: revert "feat(login): add SSO"`        |

---

## Structure Rules

### Subject Line (Required)

**Format:**

```
<type>(scope): <description>
```

**Rules:**

- Must include type
- Scope is optional but recommended
- Description is mandatory
- Use **imperative mood** (add, not added or adds)
- **Lowercase** after colon
- **No trailing period**
- **Max 100 characters**

**Good:**

```
feat(login): add valid login scenario
fix(api): resolve timeout issue in request client
docs(readme): update installation instructions
test(register): add negative test cases
```

**Bad:**

```
Fix: Fixed login issue.          # Capital after colon, period
added new feature                # Missing type, past tense
Update files                     # Too generic, capital letter
feat(login) Add login feature    # Missing colon
```

### Body (Optional)

**Rules:**

- Wrap at **100 characters** per line
- Explain **what** changed and **why**
- Not a duplicate of subject
- Separate from subject with blank line

**Example:**

```
refactor(auth-service): improve token refresh flow

The previous implementation failed when multiple requests were queued.
This update centralizes token refreshing and prevents duplicate calls.
```

### Footer (Optional)

**Use for:**

- Issue references
- Breaking changes

**Examples:**

```
BREAKING CHANGE: login API route changed from /auth/login to /api/v2/login
```

```
Closes #42
Fixes #123
Relates to #456
```

---

## Scope Guidelines

Scopes must be **lowercase, dash-separated**:

**Common Scopes:**

- `login`
- `register`
- `checkout`
- `api`
- `pom`
- `fixtures`
- `config`
- `ci`
- `docs`
- `deps`
- `utils`
- `reporting`

**Examples:**

```
test(login): add UI validation for incorrect password
feat(checkout): implement payment gateway integration
fix(api): handle network timeout errors
docs(excel-integration): add usage examples
```

---

## Examples by Type

### feat (New Feature)

```
feat(login): add remember me functionality

Implement "Remember Me" checkbox that persists user session
for 30 days using secure cookies.
```

### fix (Bug Fix)

```
fix(checkout): resolve cart total calculation error

Fixed issue where discount was not applied correctly when
multiple items with different tax rates were in cart.

Fixes #234
```

### docs (Documentation)

```
docs(readme): add Excel integration setup guide

Include step-by-step instructions for configuring Excel
result writer with screenshots and examples.
```

### test (Tests)

```
test(login): add invalid credential scenarios

Added test cases for:
- Empty username
- Empty password
- Invalid email format
- SQL injection attempts
```

### refactor (Code Restructuring)

```
refactor(page-objects): consolidate common methods

Extract repeated navigation and assertion logic into
BasePage class to reduce code duplication.
```

### chore (Maintenance)

```
chore(deps): update Playwright to v1.40.0

Update dependencies and adjust tests for new API changes.
```

---

## Forbidden Patterns

**NEVER use:**

**Generic messages:**

```
update files
fix bug
temp commit
work in progress
WIP
test
```

**Empty messages:**

```
(no message)
```

**Missing type:**

```
added login feature
fixed issue
```

**Too long subject:**

```
feat(login): add comprehensive login functionality with remember me checkbox and forgot password link and error messages and validation
```

**Past tense:**

```
Fixed login issue      # Use "fix" not "Fixed"
Added new feature      # Use "add" not "Added"
```

**Capital letters:**

```
Fix: Fixed the bug    # Don't capitalize after colon
FEAT: Add feature     # Don't use all caps
```

---

## Correct Examples

### Simple Commits

```
feat(login): add valid login scenario
fix(api): resolve timeout issue
docs(readme): update installation guide
test(checkout): add payment validation tests
style(pom): format LoginPage with prettier
```

### With Body

```
feat(excel-integration): add multi-project support

Excel result writer now tracks test runs across multiple
Playwright projects and writes final status only after
all projects complete execution.

Implements #156
```

```
fix(reporting): correct screenshot path in Allure

Screenshots were not appearing in Allure reports due to
incorrect relative path calculation. Updated to use
absolute paths relative to project root.

Fixes #198
```

### Breaking Changes

```
feat(api)!: migrate to v2 authentication endpoint

BREAKING CHANGE: All API authentication now uses /api/v2/auth
instead of /auth/login. Update all test configurations to use
new endpoint.

Migration guide: docs/migration-v2.md
```

---

## Commit Message Checklist

Before committing:

- [ ] Includes type (`feat`, `fix`, `docs`, etc.)
- [ ] Uses imperative mood ("add" not "added")
- [ ] Lowercase after colon
- [ ] No trailing period
- [ ] Subject under 100 characters
- [ ] Body wrapped at 100 characters (if present)
- [ ] Explains what and why (if body present)
- [ ] Includes issue reference (if applicable)
- [ ] Marks breaking changes (if applicable)

---

## Tools Integration

### Commitlint Configuration

This project uses `commitlint` to enforce standards automatically.

Configuration in `commitlint.config.ts`:

```ts
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
  },
};
```

### Husky Hook

Pre-commit hook validates messages automatically:

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

---

## GitHub Copilot Usage

When GitHub Copilot suggests commits:

1. **Review the suggestion** - ensure it follows standards
2. **Adjust type** - verify correct commit type
3. **Improve description** - make it clear and specific
4. **Add body if needed** - explain complex changes
5. **Reference issues** - link related issues

---

## Quick Reference

| Need         | Use               | Example                              |
| ------------ | ----------------- | ------------------------------------ |
| Add test     | `test(scope)`     | `test(login): add validation tests`  |
| Fix bug      | `fix(scope)`      | `fix(api): handle null response`     |
| New feature  | `feat(scope)`     | `feat(checkout): add payment method` |
| Update docs  | `docs(scope)`     | `docs(readme): update setup guide`   |
| Code cleanup | `refactor(scope)` | `refactor(utils): simplify helpers`  |
| Update deps  | `chore(deps)`     | `chore(deps): update playwright`     |
