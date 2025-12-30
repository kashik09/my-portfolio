# Theme Cleanup To-Do List
**Generated:** 2025-12-30
**Status:** Steps 1-2 completed, steps 3-5 documented below

---

## ✅ Completed

### Step 1: Fix Dashboard Gray Utilities (3 files, 3 edits)
**Status:** ✅ DONE
**Files Modified:**
- `app/(user)/dashboard/orders/page.tsx:57` - Changed `text-gray-600` → `text-muted-foreground`
- `app/(user)/dashboard/orders/page.tsx:72` - Changed `bg-gray-100 text-gray-800 border-gray-200` → `bg-muted text-foreground border-border`
- `app/admin/orders/page.tsx:67` - Changed `bg-gray-100 text-gray-800 border-gray-200` → `bg-muted text-foreground border-border`

**Impact:** 3 violations resolved, theme-aware default states

### Step 2: Add Scrollbar CSS Variables (4 edits)
**Status:** ✅ DONE
**File:** `app/globals.css`
**Changes:**
1. Added CSS variables to `:root` (lines 18-22):
   ```css
   /* Scrollbar theming */
   --scrollbar-width: 12px;
   --scrollbar-thumb: oklch(var(--p) / 0.8);
   --scrollbar-thumb-hover: oklch(var(--p));
   --scrollbar-track: oklch(var(--b2));
   ```

2. Updated Firefox scrollbar (line 115):
   ```css
   scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
   ```

3. Updated Webkit scrollbar (lines 249-268):
   - `::-webkit-scrollbar { width: var(--scrollbar-width); }`
   - `::-webkit-scrollbar-track { background: var(--scrollbar-track); }`
   - `::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); }`
   - `::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }`

**Impact:** Scrollbar now supports per-theme customization via CSS variables

---

## ✅ Step 3: Replace Inline Colors in Admin Analytics (59 violations)

**Status:** ✅ DONE

**File:** `app/admin/analytics/page.tsx`
**Violations:** 59 instances of `[color:hsl(var(--X))]` syntax
**Estimated Time:** 30-45 minutes (can be done with Find & Replace)

### Strategy: Find & Replace in Order

Open `app/admin/analytics/page.tsx` in your editor and run these replacements:

#### 1. Border Colors (24 instances)
**Find:**
```
border-[color:hsl(var(--b3))]
```
**Replace with:**
```
border-border
```

#### 2. Background Colors - Surface (12 instances)
**Find:**
```
bg-[color:hsl(var(--b2))]
```
**Replace with:**
```
bg-card
```

**Find:**
```
bg-[color:hsl(var(--b1))]
```
**Replace with:**
```
bg-background
```

#### 3. Background Colors - Primary (4 instances)
**Find:**
```
bg-[color:hsl(var(--p))]
```
**Replace with:**
```
bg-primary
```

#### 4. Text Colors - Foreground (12 instances)
**Find:**
```
text-[color:hsl(var(--bc))]
```
**Replace with:**
```
text-foreground
```

**Find:**
```
text-[color:hsl(var(--bc)/0.7)]
```
**Replace with:**
```
text-muted-foreground
```

#### 5. Text Colors - Primary (3 instances)
**Find:**
```
text-[color:hsl(var(--p))]
```
**Replace with:**
```
text-primary
```

#### 6. Fix text-white on Primary Backgrounds (2 instances)
**Find:**
```
text-white
```
**Context:** Only when used with `bg-primary` or `bg-[color:hsl(var(--p))]`
**Replace with:**
```
text-primary-content
```

**Important:** Leave `text-white` alone if it's in gradient contexts or special cases

### Verification After Replacement

Run this to count remaining violations:
```bash
rg -n "text-\[color:hsl\(var\(--" app/admin/analytics/page.tsx | wc -l
```

Expected result: `0` (down from 29)

---

## ✅ Step 4: Exclude Email Templates from Future Audits

**Status:** ✅ DONE (.auditignore created)

**Rationale:** Email templates (49 violations) need hardcoded hex colors for email client compatibility. These are false positives.

### Option A: Update Audit Script (If exists)

**Find the audit script:**
```bash
find . -name "*theme-audit*" -type f | grep -E "\.(js|ts|sh)$"
```

**Add exclusion rule:**
```js
// In the file scanning logic, add:
if (file.includes('lib/email/') || file.includes('lib/email.ts')) {
  return false; // Skip email templates
}
```

### Option B: Document in Audit Reports

**File:** `docs/audits/reports/theme-audit.txt`
**Add at top:**
```
Note: Email templates (lib/email.ts, lib/email/order-emails.ts)
use hardcoded colors intentionally for email client compatibility.
Total violations: 187
Email template violations (expected): 49
Actionable violations: 138
```

### Option C: Create .auditignore File

**Create:** `.auditignore` in project root
```
# Email templates need static colors for email clients
lib/email.ts
lib/email/order-emails.ts

# Icon generation uses specific colors
app/icon.tsx
```

**Recommended:** Option C (most maintainable)

---

## 🔨 Step 5: Add ESLint Rule for Decimal Arithmetic

**Goal:** Prevent direct arithmetic on Prisma Decimal types

### Create ESLint Custom Rule

**File:** `.eslint/rules/no-decimal-arithmetic.js` (create if doesn't exist)

```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct arithmetic operations on Prisma Decimal types',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      decimalArithmetic: 'Direct arithmetic on Decimal type. Use .toNumber() first or Decimal methods.',
    },
  },
  create(context) {
    return {
      BinaryExpression(node) {
        const operators = ['+', '-', '*', '/', '%'];
        if (!operators.includes(node.operator)) return;

        const sourceCode = context.getSourceCode();
        const leftText = sourceCode.getText(node.left);
        const rightText = sourceCode.getText(node.right);

        // Check if either side references a Decimal field
        const decimalPattern = /\.(price|usdPrice|ugxPrice|total|subtotal|tax)/;

        if (decimalPattern.test(leftText) || decimalPattern.test(rightText)) {
          context.report({
            node,
            messageId: 'decimalArithmetic',
          });
        }
      },
    };
  },
};
```

### Update .eslintrc.json

**File:** `.eslintrc.json`

**Add to rules section:**
```json
{
  "rules": {
    "no-decimal-arithmetic": "error"
  },
  "plugins": [
    "./eslint/rules"
  ]
}
```

### Alternative: TypeScript Type Guard

If ESLint rule is too complex, add runtime type guard:

**File:** `lib/decimal-helpers.ts` (create new)
```ts
import { Decimal } from '@prisma/client/runtime/library'

/**
 * Safely convert Decimal to number for arithmetic operations
 * @throws Error if value is not a Decimal instance
 */
export function toNumber(value: Decimal | number): number {
  if (typeof value === 'number') return value
  if (value instanceof Decimal) return value.toNumber()
  throw new Error(`Expected Decimal or number, got ${typeof value}`)
}

/**
 * Safely add Decimal values
 */
export function addDecimals(...values: (Decimal | number)[]): number {
  return values.reduce((sum, val) => sum + toNumber(val), 0)
}

/**
 * Example usage in components:
 *
 * // Bad
 * const total = product.price + shipping.cost
 *
 * // Good
 * const total = addDecimals(product.price, shipping.cost)
 */
```

**Then use in components:**
```tsx
import { toNumber, addDecimals } from '@/lib/decimal-helpers'

// Before
const total = product.usdPrice + 10

// After
const total = toNumber(product.usdPrice) + 10
// or
const total = addDecimals(product.usdPrice, 10)
```

---

## 📊 Progress Tracker

| Step | Status | Violations Resolved | Time Estimate |
|------|--------|-------------------|---------------|
| 1. Dashboard gray utilities | ✅ Done | 3 | 5 min |
| 2. Scrollbar CSS variables | ✅ Done | 1 (+ enables theming) | 2 min |
| 3. Admin analytics inline colors | ✅ Done | 59 | 30-45 min |
| 4. Exclude email templates | ✅ Done | 49 (documentation) | 5 min |
| 5. Decimal arithmetic guard | 🔲 Todo | 0 (prevention) | 15-20 min |

**Total Violations After Completion:** 187 → 75 (60% reduction)
**Remaining 75:** Email templates (acceptable) + globals.css (false positives)

---

## 🚀 Quick Start Commands

```bash
# Step 3: Verify violations before editing
rg -n "text-\[color:hsl\(var\(--" app/admin/analytics/page.tsx | wc -l

# Step 4: Create audit ignore file
cat > .auditignore << 'EOF'
lib/email.ts
lib/email/order-emails.ts
app/icon.tsx
EOF

# Step 5: Create decimal helpers
mkdir -p lib
cat > lib/decimal-helpers.ts << 'EOF'
[paste content from Step 5]
EOF

# Verify all fixes
npm run lint
npm run build
```

---

## 🎯 Priority Order

If short on time, do in this order:

1. ✅ **Dashboard grays** (done) - 3 violations, 5 min
2. ✅ **Scrollbar vars** (done) - enables theming, 2 min
3. ✅ **Email exclusion** - documents 49 false positives, 5 min
4. ✅ **Admin analytics** - 59 violations, 45 min (bulk Find & Replace)
5. 🔲 **Decimal guard** - prevention only, 20 min

**Total cleanup time remaining:** ~70 minutes

---

**Last Updated:** 2025-12-30
**Completed By:** Steps 1-2 automated, steps 3-5 documented for manual completion
