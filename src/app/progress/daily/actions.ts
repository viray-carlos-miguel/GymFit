// src/app/progress/daily/actions.ts
"use server";

import { recordDailyProgress } from "~/server/queries";

export async function submitDailyProgress(formData: {
    workoutCompleted: boolean;
    weight?: number;
    workoutDuration?: number;
    notes: string;
}) {
    try {
        await recordDailyProgress({
            ...formData,
            workoutCompleted: true,
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to save progress:", error);
        return { success: false, error: "Failed to save progress" };
    }
}