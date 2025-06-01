# ✅ BRANDSCALING BUILD CHECKLIST

This file outlines the strict build protocol for the Brandscaling platform. All developers and agents **must follow** these guardrails without exception.

---

## 🛡️ MASTER RULE (Copy + Paste Before Any Build Prompt)

Use the Brandscaling Master Rule:
❌ No dummy content. No assumptions. No placeholder text.  
✅ Only build what I tell you. Stop and ask if anything is unclear.  
🚫 Never fabricate. Never suggest. Never decide without confirmation.

---

## 🔁 STANDARD BUILD STEPS

1. **Start with the MASTER RULE above**
2. Clearly specify:
   - Role: (admin / student / public)
   - Page or feature name
   - UI components and layout
   - Exact text, labels, links, etc.
3. Request confirmation:
   - Ask: "Show me exactly what you will build before proceeding."
4. Review output before deploying.
5. Confirm it matches your vision.
6. Repeat with next feature or content.

---

## ✅ EXAMPLE PROMPT TO FOLLOW

"Use the Brandscaling Master Rule:
❌ No dummy content. No assumptions. No placeholder text.
✅ Only build what I tell you. Stop and ask if anything is unclear.

Build a [student/admin/public] page for [specific feature] with:
- Header: [exact text]
- Content sections: [specific layout]
- Buttons: [exact labels and actions]
- Colors: [specific brand colors]

Show me exactly what you will build before proceeding."

---

## 🚫 NEVER ALLOWED

- Lorem ipsum or placeholder text
- Made-up company information
- Fake user data or testimonials
- Assumed business details
- Sample content of any kind
- Mock data or example entries
- Fabricated course descriptions
- Imaginary pricing or features

---

## ✅ ALWAYS REQUIRED

- User-provided text only
- "AWAITING USER CONTENT" for empty sections
- Exact specifications before building
- Confirmation before deployment
- Adherence to brand guidelines
- Role-based access control
- Clean, professional UI

---

## 🔧 EMERGENCY PROTOCOL

If unauthorized content is detected:
1. Stop all builds immediately
2. Run: `python3 prebuild_guard.py`
3. Remove any flagged content
4. Replace with "AWAITING USER CONTENT"
5. Restart with MASTER RULE

---

**This checklist ensures the Brandscaling platform maintains absolute content integrity and professional standards.**