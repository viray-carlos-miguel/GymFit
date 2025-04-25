import { db } from "./db";
import { progressEntries } from "./db/schema";
import { and, eq, gte, lte, isNotNull, asc } from "drizzle-orm";
import { ensureAuth, getMonthStartEnd, getDayStartEnd } from "./utils";

// Type for progress data
export type ProgressData = {
  date: Date;
  workoutCompleted: boolean;
  weight?: number | null;
  workoutDuration?: number | null;
  notes?: string | null;
  photoUrl?: string | null;
};
"use server";
// Record daily progress
export async function recordDailyProgress(data: Omit<ProgressData, 'date'>) {
  const user = await ensureAuth();
  const today = new Date();
  const { dayStart, dayEnd } = getDayStartEnd(today);

  const existingEntry = await db.query.progressEntries.findFirst({
    where: and(
      eq(progressEntries.userId, user.userId),
      gte(progressEntries.date, dayStart),
      lte(progressEntries.date, dayEnd)
    ),
  });

  if (existingEntry) {
    await db.update(progressEntries)
      .set({
        workoutCompleted: data.workoutCompleted,
        weight: data.weight !== undefined ? String(data.weight) : null,
        workoutDuration: data.workoutDuration ?? null,
        notes: data.notes ?? null,
        photoUrl: data.photoUrl ?? null,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(progressEntries.id, existingEntry.id),
          eq(progressEntries.userId, user.userId)
        )
      );
  } else {
    await db.insert(progressEntries).values({
      userId: user.userId,
      date: today,
      workoutCompleted: data.workoutCompleted,
      weight: data.weight !== undefined ? String(data.weight) : null,
      workoutDuration: data.workoutDuration ?? null,
      notes: data.notes ?? null,
      photoUrl: data.photoUrl ?? null
    });
  }
}

// Get daily progress
export async function getDailyProgress(date: Date) {
  const user = await ensureAuth();
  const { dayStart, dayEnd } = getDayStartEnd(date);

  const entry = await db.query.progressEntries.findFirst({
    where: and(
      eq(progressEntries.userId, user.userId),
      gte(progressEntries.date, dayStart),
      lte(progressEntries.date, dayEnd)
    ),
  });

  if (!entry) return null;

  return {
    ...entry,
    weight: entry.weight ? parseFloat(entry.weight) : null,
    workoutDuration: entry.workoutDuration ?? null,
    notes: entry.notes ?? null,
    photoUrl: entry.photoUrl ?? null
  };
}

// Get monthly progress summary
export async function getMonthlyProgressSummary(year: number, month: number) {
  const user = await ensureAuth();
  const { monthStart, monthEnd } = getMonthStartEnd(year, month);

  const entries = await db.query.progressEntries.findMany({
    where: and(
      eq(progressEntries.userId, user.userId),
      gte(progressEntries.date, monthStart),
      lte(progressEntries.date, monthEnd)
    ),
    orderBy: asc(progressEntries.date),
  });

  const transformedEntries = entries.map(entry => ({
    ...entry,
    weight: entry.weight ? parseFloat(entry.weight) : null,
    workoutDuration: entry.workoutDuration ?? null,
    notes: entry.notes ?? null,
    photoUrl: entry.photoUrl ?? null
  }));

  const workoutsCompleted = transformedEntries.filter(e => e.workoutCompleted).length;
  const totalWorkoutMinutes = transformedEntries.reduce((sum, entry) => sum + (entry.workoutDuration || 0), 0);

  let weightChange: number | null = null;
  if (transformedEntries.length > 1) {
    const firstWeight = transformedEntries[0]?.weight;
    const lastWeight = transformedEntries[transformedEntries.length - 1]?.weight;
    if (typeof firstWeight === 'number' && typeof lastWeight === 'number') {
      weightChange = lastWeight - firstWeight;
    }
  }

  let currentStreak = 0;
  let bestStreak = 0;
  transformedEntries.forEach(entry => {
    if (entry.workoutCompleted) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return {
    workoutsCompleted,
    totalWorkoutMinutes,
    averageWorkoutMinutes: workoutsCompleted > 0 ? Math.round(totalWorkoutMinutes / workoutsCompleted) : 0,
    weightChange,
    bestStreak,
    entries: transformedEntries,
    daysInMonth: Math.floor((monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    monthStart,
    monthEnd
  };
}

// Get progress photo for a specific date
export async function getProgressPhoto(date: Date) {
  const user = await ensureAuth();
  const { dayStart, dayEnd } = getDayStartEnd(date);

  const entry = await db.query.progressEntries.findFirst({
    where: and(
      eq(progressEntries.userId, user.userId),
      gte(progressEntries.date, dayStart),
      lte(progressEntries.date, dayEnd)
    ),
    columns: { photoUrl: true }
  });

  return entry?.photoUrl || null;
}

// Get weight trend for a time period
export async function getWeightTrend(startDate: Date, endDate: Date) {
  const user = await ensureAuth();

  const entries = await db.query.progressEntries.findMany({
    where: and(
      eq(progressEntries.userId, user.userId),
      gte(progressEntries.date, startDate),
      lte(progressEntries.date, endDate),
      isNotNull(progressEntries.weight)
    ),
    orderBy: asc(progressEntries.date),
    columns: { date: true, weight: true }
  });

  return entries.map(entry => ({
    date: entry.date,
    weight: entry.weight !== null ? parseFloat(entry.weight) : null
  }));
}
