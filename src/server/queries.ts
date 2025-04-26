"use server";
import { db } from "./db";
import { dailyProgress } from "./db/schema";
import { and, eq, gte, lte, isNotNull, asc } from "drizzle-orm";
import { ensureAuth, getMonthStartEnd, getDayStartEnd } from "./utils";

export type ProgressData = {
  date: Date;
  workoutCompleted: boolean;
  weight?: number | null;
  workoutDuration?: number | null;
  notes?: string | null;
  photoUrl?: string | null;
};

export type ProgressEntry = {
  id: string;
  userId: string;
  date: Date;
  workoutCompleted: boolean;
  weight: number | null;
  workoutDuration: number | null;
  notes: string | null;
  photoUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};



const parseWeight = (weight: number | string | null): number | null => {
  if (weight === null || weight === undefined) return null;
  const parsed = typeof weight === "string" ? parseFloat(weight) : weight;
  return isNaN(parsed) ? null : parsed;
};

export async function recordDailyProgress(data: Omit<ProgressData, "date">) {
  try {
    const user = await ensureAuth();
    const today = new Date();
    const { dayStart, dayEnd } = getDayStartEnd(today);

    const existingEntry = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, user.userId),
        gte(dailyProgress.date, dayStart),
        lte(dailyProgress.date, dayEnd)
      ),
    });

    const weightValue =
      data.weight !== undefined && data.weight !== null
        ? String(data.weight)
        : null;

    const updateData = {
      workoutCompleted: data.workoutCompleted,
      weight: weightValue,
      workoutDuration: data.workoutDuration ?? null,
      notes: data.notes ?? null,
      photoUrl: data.photoUrl ?? null,
      updatedAt: new Date(),
    };

    if (existingEntry) {
      await db
        .update(dailyProgress)
        .set(updateData)
        .where(
          and(
            eq(dailyProgress.id, existingEntry.id),
            eq(dailyProgress.userId, user.userId)
          )
        );
    } else {
      await db.insert(dailyProgress).values({
        userId: user.userId,
        date: today,
        ...updateData,
        createdAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error recording daily progress:", error);
    return { success: false, error: "Failed to record progress" };
  }
}

export async function getDailyProgress(date: Date): Promise<ProgressEntry | null> {
  try {
    const user = await ensureAuth();
    const { dayStart, dayEnd } = getDayStartEnd(date);

    const entry = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, user.userId),
        gte(dailyProgress.date, dayStart),
        lte(dailyProgress.date, dayEnd)
      ),
    });

    if (!entry || entry.createdAt === null || entry.updatedAt === null) return null;

    return {
      ...entry,
      id: String(entry.id),
      weight: parseWeight(entry.weight),
      workoutDuration: entry.workoutDuration ?? null,
      notes: entry.notes ?? null,
      photoUrl: entry.photoUrl ?? null,
      createdAt:
        entry.createdAt instanceof Date
          ? entry.createdAt
          : entry.createdAt !== null
            ? new Date(entry.createdAt)
            : null,
      updatedAt:
        entry.updatedAt instanceof Date
          ? entry.updatedAt
          : entry.updatedAt !== null
            ? new Date(entry.updatedAt)
            : null,
    };
  } catch (error) {
    console.error("Error getting daily progress:", error);
    throw new Error("Failed to fetch daily progress");
  }
}

export async function getMonthlyProgressSummary(year: number, month: number) {
  try {
    const user = await ensureAuth();
    const { monthStart, monthEnd } = getMonthStartEnd(year, month);

    const entries = await db.query.dailyProgress.findMany({
      where: and(
        eq(dailyProgress.userId, user.userId),
        gte(dailyProgress.date, monthStart),
        lte(dailyProgress.date, monthEnd)
      ),
      orderBy: asc(dailyProgress.date),
    });

    const transformedEntries: ProgressEntry[] = entries
      .filter((entry): entry is Required<typeof entry> =>
        entry.createdAt !== null && entry.updatedAt !== null
      )
      .map((entry) => ({
        ...entry,
        id: String(entry.id),
        weight: parseWeight(entry.weight),
        workoutDuration: entry.workoutDuration ?? null,
        notes: entry.notes ?? null,
        photoUrl: entry.photoUrl ?? null,
        createdAt:
          entry.createdAt instanceof Date
            ? entry.createdAt
            : entry.createdAt !== null
              ? new Date(entry.createdAt)
              : null,
        updatedAt:
          entry.updatedAt instanceof Date
            ? entry.updatedAt
            : entry.updatedAt !== null
              ? new Date(entry.updatedAt)
              : null,
      }));

    const workoutEntries = transformedEntries.filter((e) => e.workoutCompleted);
    const workoutsCompleted = workoutEntries.length;
    const totalWorkoutMinutes = workoutEntries.reduce(
      (sum, entry) => sum + (entry.workoutDuration || 0),
      0
    );

    const weightEntries = transformedEntries.filter((e) => e.weight !== null);
    let weightChange: number | null = null;
    if (weightEntries.length >= 2) {
      const firstWeight = weightEntries[0]?.weight;
      const lastWeight = weightEntries[weightEntries.length - 1]?.weight;

      if (firstWeight != null && lastWeight != null) {
        weightChange = lastWeight - firstWeight;
      }
    }

    let currentStreak = 0;
    let bestStreak = 0;

    const sortedEntries = [...transformedEntries].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    for (const entry of sortedEntries) {
      if (entry.workoutCompleted) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      workoutsCompleted,
      totalWorkoutMinutes,
      averageWorkoutMinutes:
        workoutsCompleted > 0
          ? Math.round(totalWorkoutMinutes / workoutsCompleted)
          : 0,
      weightChange,
      bestStreak,
      entries: transformedEntries,
      daysInMonth:
        Math.floor((monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      monthStart,
      monthEnd,
    };
  } catch (error) {
    console.error("Error getting monthly summary:", error);
    throw new Error("Failed to fetch monthly summary");
  }
}

export async function getProgressPhoto(date: Date): Promise<string | null> {
  try {
    const user = await ensureAuth();
    const { dayStart, dayEnd } = getDayStartEnd(date);

    const entry = await db.query.dailyProgress.findFirst({
      where: and(
        eq(dailyProgress.userId, user.userId),
        gte(dailyProgress.date, dayStart),
        lte(dailyProgress.date, dayEnd)
      ),
      columns: { photoUrl: true },
    });

    return entry?.photoUrl ?? null;
  } catch (error) {
    console.error("Error getting progress photo:", error);
    return null;
  }
}

export async function getWeightTrend(startDate: Date, endDate: Date) {
  try {
    const user = await ensureAuth();

    const entries = await db.query.dailyProgress.findMany({
      where: and(
        eq(dailyProgress.userId, user.userId),
        gte(dailyProgress.date, startDate),
        lte(dailyProgress.date, endDate),
        isNotNull(dailyProgress.weight)
      ),
      orderBy: asc(dailyProgress.date),
      columns: { date: true, weight: true },
    });

    return entries
      .map((entry) => ({
        date: entry.date,
        weight: parseWeight(entry.weight),
      }))
      .filter((entry): entry is { date: Date; weight: number } => entry.weight !== null);
  } catch (error) {
    console.error("Error getting weight trend:", error);
    return [];
  }
}
