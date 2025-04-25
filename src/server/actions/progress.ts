// src/server/actions/progress.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import { and, eq, gte, lte } from "drizzle-orm";
import { progressEntries } from "../db/schema";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { MonthlyProgressData } from "~/types/progress";

export async function getMonthlyProgress(year: number, month: number): Promise<MonthlyProgressData> {
    const user = await auth();
    if (!user.userId) throw new Error("Unauthorized");

    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(new Date(year, month - 1));

    const entries = await db.query.progressEntries.findMany({
        where: (model, { and, eq, gte, lte }) =>
            and(
                eq(model.userId, user.userId),
                gte(model.date, monthStart),
                lte(model.date, monthEnd)
            ),
        orderBy: (model, { asc }) => asc(model.date),
    });

    const workoutsCompleted = entries.filter(e => e.workoutCompleted).length;
    const totalWorkoutMinutes = entries.reduce((sum, entry) => {
        return sum + (entry.workoutDuration ?? 0);
    }, 0);

    let weightChange = null;
    if (entries.length > 1) {
        const firstWeight = entries[0]?.weight;
        const lastWeight = entries[entries.length - 1]?.weight;
        if (firstWeight && lastWeight) {
            weightChange = Number(lastWeight) - Number(firstWeight);
        }
    }

    let currentStreak = 0;
    let bestStreak = 0;
    entries.forEach(entry => {
        if (entry.workoutCompleted) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    });

    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd }).length;

    return {
        workoutsCompleted,
        totalWorkoutMinutes,
        averageWorkoutMinutes: workoutsCompleted > 0 ? Math.round(totalWorkoutMinutes / workoutsCompleted) : 0,
        weightChange,
        bestStreak,
        entries: entries.map(entry => ({
            ...entry,
            weight: entry.weight ? Number(entry.weight) : null,
            workoutDuration: entry.workoutDuration ?? null,
            notes: entry.notes ?? null,
            photoUrl: entry.photoUrl ?? null,
            createdAt: entry.createdAt ?? null,
            updatedAt: entry.updatedAt ?? null
        })),
        daysInMonth,
        monthStart,
        monthEnd
    };
}