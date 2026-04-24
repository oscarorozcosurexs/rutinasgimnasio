# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do not create custom components. If a UI element is needed, find the appropriate shadcn/ui component or compose from existing shadcn/ui primitives.
- All shadcn/ui components live in `src/components/ui/`. Add new ones via the shadcn CLI: `npx shadcn@latest add <component>`.
- Do not write raw HTML elements styled with Tailwind when a shadcn/ui component exists for that purpose (e.g. use `<Button>` not `<button className="...">`).

## Date Formatting

All date formatting must use **date-fns**.

Dates must be displayed in the following format: ordinal day + abbreviated month + full year.

| Date | Correct format |
|------|---------------|
| September 1, 2026 | 1st Sep 2026 |
| January 3, 2026 | 3rd Jan 2026 |
| June 4, 2024 | 4th Jun 2024 |

Use `format` and `formatOrdinal` utilities from date-fns to produce the ordinal suffix. Example:

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"), 10);
  const suffix = getOrdinalSuffix(day);
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
```

Never use `toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.
