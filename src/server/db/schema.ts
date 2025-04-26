// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { pgTable, serial, varchar, timestamp, boolean, decimal, doublePrecision, integer, text } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
} from "drizzle-orm/pg-core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { url } from "inspector";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t4gallery_${name}`);

export const images = createTable(
  "images",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", {length: 1024}).notNull(),
    userId: varchar("UserId", {length: 1024}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })

);
// src/server/db/schema.ts

 


// src/server/db/schema.ts


export const dailyProgress = pgTable("progress_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  date: timestamp("date").notNull(),
  workoutCompleted: boolean("workout_completed").notNull().default(false),
  weight: decimal("weight", { precision: 5, scale: 1 }),
  workoutDuration: integer("workout_duration"),
  notes: text("notes"),
  photoUrl: varchar("photo_url", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

import { numeric, date } from "drizzle-orm/pg-core";

export const monthlyProgress = pgTable("monthly_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  totalWorkouts: integer("total_workouts").default(0),
  totalCaloriesBurned: integer("total_calories_burned").default(0),
  totalDistance: numeric("total_distance").default("0"), // in km
  totalWeightLifted: numeric("total_weight_lifted").default("0"), // in kg
  averageWorkoutDuration: numeric("average_workout_duration").default("0"), // in minutes
});
