```text id="f9mr2d"
# Enforce Step Validation Before Navigation

Implement comprehensive form validation across all multi-step forms in the application. Users must not be allowed to proceed to the next step until all required fields in the current step are completed and valid.

## Objective

Every step should validate its required fields before allowing the user to continue.

The validation experience should be clear, user-friendly, fully localized, and consistent across the entire application.

---

## Scope

Apply this behavior to **every multi-step workflow**, including but not limited to:

- Registration
- Complete Profile
- Government Services
- Residency Service
- Entry Visa Service
- Driving License Service
- OCR Review Forms
- Any future multi-step form

---

## Step Validation

When the user clicks **Next** or attempts to continue:

- Validate all required fields in the current step.
- Prevent navigation if any validation fails.
- Keep the user on the current step.
- Automatically focus or scroll to the first invalid field.

The user must not be able to bypass validation by clicking the Next button.

---

## Field-Level Validation

Every required field must have its own validation rules.

Examples include:

- Required fields
- Email format
- Phone number format
- Password strength
- Password confirmation
- Date validation
- Number validation
- File upload validation
- OCR-required fields
- Dropdown selection
- Checkbox acceptance
- Radio button selection

Each field should validate independently.

---

## Individual Error Messages

Every field must display its own clear validation message directly below the field.

Do not use generic messages such as:

- "Please fill all fields."
- "Invalid form."

Instead, provide field-specific messages.

Examples:

Business Name

English:
"Business name is required."

Arabic:
"اسم النشاط التجاري مطلوب."

---

Email

English:
"Please enter a valid email address."

Arabic:
"يرجى إدخال بريد إلكتروني صحيح."

---

Phone Number

English:
"Please enter a valid phone number."

Arabic:
"يرجى إدخال رقم جوال صحيح."

---

Password

English:
"Password must contain at least 8 characters."

Arabic:
"يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."

---

Sponsor Civil ID

English:
"Please upload both the front and back sides of the Sponsor Civil ID."

Arabic:
"يرجى رفع وجهي البطاقة المدنية للكفيل."

---

Passport

English:
"Passport upload is required."

Arabic:
"يرجى رفع جواز السفر."

---

Terms & Conditions

English:
"You must accept the Terms and Conditions."

Arabic:
"يجب الموافقة على الشروط والأحكام."

---

## Real-Time Validation

After an error appears:

- Revalidate the field as the user types or changes its value.
- Remove the error immediately once the field becomes valid.
- Do not wait until the user clicks Next again.

---

## Error Styling

All validation errors should:

- Be displayed directly beneath the related field.
- Use consistent styling across the application.
- Be easy to read.
- Work correctly in both RTL and LTR layouts.
- Never overlap other UI elements.

Invalid fields should also have a clear visual state (e.g., error border or highlight) consistent with the project's design system.

---

## Localization

All validation messages must be fully localized.

Every validation message should exist in both:

- Arabic
- English

No validation message should be hardcoded.

Use the existing translation system for every validation rule.

---

## Accessibility

- Associate each error message with its corresponding field.
- Move focus to the first invalid field after validation.
- Support keyboard navigation.
- Ensure screen readers can announce validation errors where applicable.

---

## Technical Requirements

- Reuse the existing validation framework.
- Centralize validation rules wherever possible.
- Avoid duplicated validation logic.
- Preserve existing business logic.
- Follow Clean Architecture.
- Maintain the project's coding standards.
- Deliver a production-ready validation system with consistent behavior across the entire application.
```
