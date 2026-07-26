````text id="g4tn8y"
# Internationalize All Error Messages, Success Messages, and Toast Notifications

Perform a complete internationalization (i18n) audit of the entire application to ensure that **every user-facing message** is fully localized.

## Objective

Some messages are still hardcoded in English, for example:

> "User not found. Please check your email or create a new account."

These messages should never appear directly in the UI.

Every error message, success message, warning, information message, validation message, and toast notification must support both Arabic and English through the project's localization system.

---

# Scope

Audit the entire project, including:

- Frontend
- API response handling
- Toast notifications
- Alert dialogs
- Validation errors
- Authentication
- OCR workflow
- File uploads
- Forms
- Dashboard
- Government services
- Review pages
- PDF generation flow
- Network errors
- Permission errors
- Generic error handlers
- Shared utility functions
- Custom hooks
- Services
- Context providers
- Global error boundaries

---

# Messages to Localize

Every user-facing message must use the translation system.

Examples include:

## Authentication

- User not found
- Invalid email
- Invalid password
- Incorrect OTP
- OTP expired
- Account already exists
- Login successful
- Registration successful
- Password updated
- Email already in use
- Session expired

---

## Validation

- Required field
- Invalid phone number
- Invalid email address
- Passwords do not match
- Invalid file type
- File too large
- Missing required documents
- Invalid date
- Invalid format

---

## OCR

- Upload successful
- OCR started
- OCR completed
- OCR failed
- Unable to extract data
- Low confidence detected
- Please review extracted information
- Unsupported document

---

## Uploads

- Upload failed
- File uploaded successfully
- Scan completed
- Camera permission denied
- Unsupported file format

---

## Network

- Network error
- Server unavailable
- Request timeout
- Internal server error
- Unauthorized
- Forbidden
- Resource not found
- Something went wrong
- Please try again later

---

## Toast Notifications

Every toast should use translations.

Examples:

Success

- Saved successfully
- Updated successfully
- Deleted successfully
- Generated successfully

Warning

- Unsaved changes
- Missing information

Info

- Processing...
- Uploading...
- Extracting document...

Error

- Failed to save
- Upload failed
- OCR failed
- Unexpected error

---

# API Error Handling

Do not display raw backend messages directly to users.

Instead:

1. Map backend error codes (or HTTP status codes) to localization keys whenever possible.
2. Display the translated message based on the current language.
3. Preserve the original backend message internally for logging and debugging if needed.

Example:

Backend:

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found."
}
```

Frontend:

```ts
t("errors.userNotFound")
```

Instead of displaying the raw English text.

---

# Translation Files

Ensure every message exists in:

- Arabic translations
- English translations

Maintain a consistent structure, for example:

```json
{
  "errors": {
    "userNotFound": "...",
    "invalidPassword": "...",
    "networkError": "..."
  },
  "success": {
    "saved": "...",
    "updated": "..."
  },
  "validation": {
    "required": "...",
    "invalidEmail": "..."
  },
  "toast": {
    "uploadSuccess": "...",
    "ocrCompleted": "..."
  }
}
```

---

# Runtime Audit

Search the entire codebase for:

- Hardcoded English strings
- Hardcoded Arabic strings
- `toast.success("...")`
- `toast.error("...")`
- `toast.warning("...")`
- `toast.info("...")`
- `alert("...")`
- `console messages` accidentally shown to users
- Error dialogs
- Snackbar components
- Modal messages

Replace every user-facing string with a translation key.

---

# Technical Requirements

- Do not change business logic.
- Reuse the existing localization system.
- Preserve current functionality.
- Do not introduce duplicate translation keys.
- Centralize common messages for reuse.
- Follow the existing translation architecture.
- Maintain Clean Architecture and coding standards.

---

## Expected Result

There should be **zero hardcoded user-facing messages** anywhere in the application.

Regardless of where a message originates (frontend, API, validation, OCR, upload, authentication, or toast), it must always be displayed in the currently selected language (Arabic or English) using the project's localization system.
````
