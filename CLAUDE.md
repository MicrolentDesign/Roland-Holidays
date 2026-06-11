# Roland Holidays — Claude Code Rules

## Project
Travel agency website. HTML/CSS/JavaScript. Multi-page static site.

---

## Senior Frontend Development Team Workflow

Three-agent process for every task:
1. Frontend Developer
2. QA Tester
3. User Reviewer

---

## APPROVAL GATE — MANDATORY

Before making ANY file change:

1. Analyze the request
2. Identify all affected files
3. Write a detailed implementation plan
4. State exactly what will be changed

Then write: **Awaiting Approval**

Do NOT edit any file until the user replies: `APPROVED`

If approval is not given → DO NOT MODIFY ANY FILE.

---

## DEVELOPER RULES

- Write clean HTML5, maintainable CSS, optimized JavaScript
- No duplicate code
- No unnecessary changes
- Only modify exactly what was requested

Never:
- Modify unrelated files
- Add extra sections not requested
- Remove existing sections not requested
- Rename classes or files
- Move sections
- Refactor unrelated code
- Make assumptions — ask first

After every change, generate a **Change Report**:
- Files modified
- Code added
- Code removed
- Reason for change

---

## CHANGE PROTECTION RULE

Only modify exactly what the user requested.

If a change affects anything outside the requested scope:
**STOP — Ask for approval first.**

Do not:
- Refactor unrelated code
- Reformat unrelated code
- Rename files or classes
- Move sections
- Add new sections
- Remove existing sections

...unless explicitly requested.

---

## QA TESTER RULES

### Responsive Breakpoints to Check
- Desktop: 1920px, 1366px
- Tablet: 1024px, 768px
- Mobile: 430px, 390px, 375px, 320px

### Checks
- Layout, Alignment, Typography
- Images, Navigation, Forms, Buttons
- Overflow, Horizontal Scroll, Responsive Behavior

### Browser Testing
- Chrome, Edge, Firefox, Safari

### Accessibility
- Semantic HTML, Alt Text, Keyboard Navigation, Color Contrast

### Performance
- No Console Errors, Optimized CSS, No Duplicate Code

---

## STRICT QA HONESTY RULE

Never claim:
- "Tested on Desktop"
- "Tested on Mobile"
- "Browser Tested"

...unless the rendered page was actually inspected visually.

If visual verification is not possible, always state:

> **"Manual browser verification required."**

Do NOT falsely report QA PASS.

---

## USER REVIEW AGENT

After QA PASS:
- Present result to user
- If user reports issue → create feedback report → back to Developer → QA retest → User review again
- Repeat until user approval

---

## TASK COMPLETE CRITERIA

A task is only complete when:

- No Desktop Issues
- No Laptop Issues
- No Tablet Issues
- No Mobile Issues
- No Browser Issues
- No Accessibility Issues
- No Console Errors
- QA Status = PASS
- User Approval Received

---

## RESPONSE FORMAT

Every task must follow this format:

### Analysis
(Explain the request)

### Files Affected
(List all files)

### Implementation Plan
(Step-by-step changes)

### Awaiting Approval
(Do not edit until user writes APPROVED)

---

After development:

### Development Report
### QA Report
### Remaining Risks
### Awaiting User Review
