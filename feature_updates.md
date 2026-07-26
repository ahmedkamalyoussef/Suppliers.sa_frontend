```text id="n6kw2r"
# Improve RTL Layout Spacing Using Gap-Based Layouts

Perform a complete audit of the frontend layout when the application language is switched to Arabic (RTL).

## Objective

The Arabic interface currently has inconsistent spacing. Many elements become attached to each other or have uneven spacing because margins are being used instead of proper layout gaps.

The goal is to achieve a clean, balanced, production-quality RTL interface with consistent spacing across the entire application.

---

## Required Changes

Review every page and component in Arabic mode.

Replace layouts that rely on individual margins with proper layout spacing using:

- `gap`
- `row-gap`
- `column-gap`
- Flexbox gap
- CSS Grid gap

Use spacing from the parent container instead of manually adding margins to child elements whenever possible.

---

## Audit Scope

Inspect all frontend pages and components, including:

- Forms
- Input groups
- Buttons
- Cards
- Navigation
- Header
- Footer
- Sidebar
- Upload components
- OCR workflow
- Review pages
- Tables
- Lists
- Dialogs
- Modals
- Alerts
- Toasts
- Empty states
- Error pages
- Dashboard
- Authentication pages
- Landing page
- Every reusable UI component

---

## RTL Requirements

When the application is in Arabic:

- All spacing should remain visually balanced.
- Components should not stick together.
- Labels and inputs should have consistent spacing.
- Icons and text should maintain proper separation.
- Buttons should have equal spacing between them.
- Cards should have equal internal padding and external gaps.
- Grid layouts should preserve equal spacing.
- Flex layouts should use `gap` instead of directional margins whenever possible.

---

## Standardize the Design System

Create consistent spacing rules throughout the application.

Examples:

- Vertical spacing between sections
- Space between form fields
- Space between labels and inputs
- Space between buttons
- Space between cards
- Space between icons and text
- Space inside modals
- Space inside tables
- Space inside upload components

Avoid each component using different spacing values unless intentionally designed.

---

## Avoid Margin-Based RTL Issues

Wherever possible:

- Replace `margin-left` / `margin-right` with logical properties (`margin-inline-start`, `margin-inline-end`) if margins are still required.
- Prefer `gap` for spacing between sibling elements.
- Avoid negative margins.
- Remove spacing hacks that break in RTL mode.

---

## Responsive Compatibility

These spacing improvements must work consistently across:

- Mobile
- Tablet
- Laptop
- Desktop

The layout should remain visually balanced in both LTR and RTL without requiring duplicate styles.

---

## Technical Requirements

- Preserve all existing functionality.
- Do not modify business logic.
- Reuse existing components.
- Follow the current design system where applicable.
- Keep the implementation clean, reusable, and maintainable.
- Follow Clean Architecture and existing coding standards.

---

## Expected Result

The Arabic version of the application should have professional, consistent spacing across every screen. No elements should appear cramped, attached together, or unevenly spaced. The UI should rely on modern `gap`-based layouts instead of margin-heavy positioning wherever possible.
```
