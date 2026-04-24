import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations, sql, InferSelectModel, InferInsertModel } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const exerciseCategoryEnum = pgEnum('exercise_category', [
  'strength',
  'cardio',
  'flexibility',
  'sports',
  'other',
]);

export const weightUnitEnum = pgEnum('weight_unit', ['kg', 'lbs']);

export const distanceUnitEnum = pgEnum('distance_unit', ['km', 'mi', 'm']);

// ---------------------------------------------------------------------------
// exercises — reusable catalog (global + user-created custom)
// ---------------------------------------------------------------------------

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    category: exerciseCategoryEnum('category').notNull().default('other'),
    muscleGroups: text('muscle_groups').array(),
    instructions: text('instructions'),
    isGlobal: boolean('is_global').notNull().default(true),
    createdByUserId: varchar('created_by_user_id', { length: 256 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('exercises_created_by_user_id_idx').on(t.createdByUserId),
    index('exercises_category_idx').on(t.category),
    index('exercises_name_idx').on(t.name),
  ]
);

// ---------------------------------------------------------------------------
// workouts — a single training session belonging to a Clerk user
// ---------------------------------------------------------------------------

export const workouts = pgTable(
  'workouts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    date: timestamp('date').notNull().defaultNow(),
    startedAt: timestamp('started_at'),
    completedOn: timestamp('completed_on'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('workouts_user_id_date_idx').on(t.userId, t.date),
  ]
);

// ---------------------------------------------------------------------------
// workout_exercises — ordered list of exercises within a workout session
// ---------------------------------------------------------------------------

export const workoutExercises = pgTable(
  'workout_exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    orderIndex: integer('order_index').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('workout_exercises_workout_id_order_idx').on(t.workoutId, t.orderIndex),
    index('workout_exercises_exercise_id_idx').on(t.exerciseId),
  ]
);

// ---------------------------------------------------------------------------
// sets — individual sets within a workout exercise entry
// ---------------------------------------------------------------------------

export const sets = pgTable(
  'sets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutExerciseId: uuid('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    reps: integer('reps'),
    weight: numeric('weight', { precision: 8, scale: 3 }),
    weightUnit: weightUnitEnum('weight_unit'),
    durationSeconds: integer('duration_seconds'),
    distance: numeric('distance', { precision: 10, scale: 3 }),
    distanceUnit: distanceUnitEnum('distance_unit'),
    rpe: numeric('rpe', { precision: 3, scale: 1 }),
    isCompleted: boolean('is_completed').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('sets_workout_exercise_id_set_number_idx').on(t.workoutExerciseId, t.setNumber),
    index('sets_incomplete_idx').on(t.workoutExerciseId).where(sql`${t.isCompleted} = false`),
  ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

// ---------------------------------------------------------------------------
// Inferred TypeScript types
// ---------------------------------------------------------------------------

export type Exercise           = InferSelectModel<typeof exercises>;
export type NewExercise        = InferInsertModel<typeof exercises>;
export type Workout            = InferSelectModel<typeof workouts>;
export type NewWorkout         = InferInsertModel<typeof workouts>;
export type WorkoutExercise    = InferSelectModel<typeof workoutExercises>;
export type NewWorkoutExercise = InferInsertModel<typeof workoutExercises>;
export type Set                = InferSelectModel<typeof sets>;
export type NewSet             = InferInsertModel<typeof sets>;
