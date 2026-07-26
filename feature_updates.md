```text id="u9xp4n"
# Redesign the Business Hours and Branches Experience

Improve the user experience for both the **Business Hours** section and the **Branches** section. The current implementation is functional but not intuitive enough and has several RTL usability issues.

---

# 1. Redesign the Weekly Business Hours

## Objective

The current weekly schedule is difficult to use and doesn't provide the best user experience.

Create a cleaner, simpler, and more modern interface that allows users to configure their opening hours quickly with minimal effort.

---

## New Design Requirements

Create a card for each day of the week.

Each day should contain:

- Day Name
- Open / Closed Toggle

If the business is **Closed** that day:

- Hide all time fields.

If the business is **Open**:

Display only:

- Opening Time
- Closing Time

The layout should be simple, clean, and easy to scan.

---

## Better Time Picker

Replace the current time input with a more user-friendly time picker.

Requirements:

- Easy to use on desktop.
- Easy to use on mobile.
- Consistent design.
- Clear AM / PM selection.
- Smooth interaction.

Avoid requiring users to manually type times whenever possible.

---

## RTL Improvements

The current Arabic layout has several issues.

When the application language is Arabic:

- Opening Time and Closing Time should remain visually clear.
- Time picker layout should not break.
- AM / PM controls should remain properly aligned and easy to use.
- Input fields should not overlap.
- Icons should mirror correctly.
- Field spacing should remain consistent.
- The Arabic version should feel identical in quality to the English version.

The RTL implementation should be native, not simply mirrored.

---

## Optional Productivity Features

If compatible with the existing architecture, include:

- Copy Monday's hours to all days.
- Apply the same schedule to selected days.
- Quick "Open 24 Hours" option.
- Quick "Closed All Day" option.

These actions should save users time without adding unnecessary complexity.

---

# 2. Improve the Branches Section

## Objective

The current Branches section works, but the design can be significantly cleaner and easier to use.

Redesign it using a simpler, more modern layout that matches the rest of the application.

---

## Branch Creation Flow

Each branch should only require:

- Branch Name
- Branch Address
- Select Location on Map

After selecting the location:

- Save the coordinates.
- Close the location picker.
- Return to the branch form.

---

## Remove the Persistent Map

Currently, after selecting a branch location, the map remains visible below the form.

This is unnecessary and takes up valuable space.

### Required Behavior

- Show the map only while the user is selecting a location.
- Once the location is confirmed, hide the map automatically.
- Display a simple confirmation instead, such as:
  - "Location Selected"
  - Or a small location summary with an edit/change location button.

The map should reopen only if the user chooses to change the branch location.

---

## Branch Cards

After saving a branch:

Display it as a clean card showing:

- Branch Name
- Branch Address
- Location Selected indicator

Provide actions to:

- Edit
- Change Location
- Delete

Keep the cards compact and visually consistent.

---

## User Experience

The overall experience should be:

- Minimal
- Modern
- Easy for non-technical users
- Fully responsive
- RTL/LTR compatible
- Consistent with the application's design system

Reduce unnecessary scrolling and make the interface feel lighter and more intuitive.

---

## Technical Requirements

- Preserve all existing functionality.
- Do not change business logic.
- Reuse existing components wherever possible.
- Maintain compatibility with existing APIs and data models.
- Follow Clean Architecture and the project's coding standards.
- Deliver a polished, production-ready implementation with an improved user experience for both Business Hours and Branch Management.
```
