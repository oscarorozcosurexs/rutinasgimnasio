# Data Fetching Standards

## CRITICAL: Server Components Only

**ALL data fetching MUST be done exclusively via React Server Components.**

- Do NOT fetch data in client components (`"use client"`)
- Do NOT fetch data in Next.js route handlers (`src/app/api/`)
- Do NOT use `useEffect` + `fetch` patterns
- Do NOT use SWR, React Query, or any client-side data fetching library
- The only permitted data fetching pattern is `async` server components that call helper functions from `/data`

## Database Access via `/data` Helpers

All database queries must go through helper functions located in the `/data` directory.

- Do NOT write raw SQL anywhere in the codebase
- Do NOT use Drizzle's query builder directly inside components or pages
- ALL queries must use Drizzle ORM via helper functions in `/data`

**Example structure:**

```
src/
  data/
    routines.ts     # getAllRoutines(userId), getRoutineById(userId, id), etc.
    exercises.ts    # getExercisesByRoutine(userId, routineId), etc.
```

**Example helper function:**

```ts
// src/data/routines.ts
import { db } from "@/lib/db";
import { routines } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getRoutinesByUser(userId: string) {
  return db.select().from(routines).where(eq(routines.userId, userId));
}
```

**Example server component consuming the helper:**

```ts
// src/app/dashboard/page.tsx
import { getRoutinesByUser } from "@/data/routines";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const routines = await getRoutinesByUser(session.user.id);
  // ...
}
```

## Data Ownership — Authorization is Mandatory

**A logged-in user must ONLY ever be able to access their own data.**

Every helper function in `/data` that returns user-owned data MUST:

1. Accept `userId` as a parameter
2. Filter ALL queries by that `userId` using a `WHERE userId = ?` clause via Drizzle
3. Never return records that belong to a different user

**This is non-negotiable.** Failing to scope queries by `userId` is a critical security vulnerability.

### Rules

- Never write a helper that returns all rows from a table without filtering by `userId`
- Never trust a `resourceId` alone to authorize access — always combine it with `userId` in the query
- Always derive `userId` from the authenticated session (e.g. `auth()`) in the server component, and pass it down to the helper — do NOT accept `userId` from URL params, query strings, or request bodies as the authoritative identity

**Correct:**

```ts
// Scoped to the authenticated user — safe
export async function getRoutineById(userId: string, routineId: string) {
  return db
    .select()
    .from(routines)
    .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));
}
```

**Wrong:**

```ts
// Not scoped by userId — any user could access any routine by guessing the ID
export async function getRoutineById(routineId: string) {
  return db.select().from(routines).where(eq(routines.id, routineId));
}
```
