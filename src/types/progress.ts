// src/types/progress.ts
export interface ProgressEntry {
    id: number;
    userId: string;
    date: Date;
    workoutCompleted: boolean;
    weight: number | null;
    workoutDuration: number | null;
    notes: string | null;
    photoUrl: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface MonthlyProgressData {
    workoutsCompleted: number;
    totalWorkoutMinutes: number;
    averageWorkoutMinutes: number;
    weightChange: number | null;
    bestStreak: number;
    entries: ProgressEntry[];
    daysInMonth: number;
    monthStart: Date;
    monthEnd: Date;
}

export interface WeightTrendPoint {
    date: Date;
    weight: number;
}