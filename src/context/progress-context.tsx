"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

interface DailyProgress {
    id: string;
    date: Date;
    workoutCompleted: boolean;
    workoutDuration?: number;
    caloriesBurned?: number;
    distance?: number;
    weight?: number;
}

interface MonthlyProgress {
    month: number;
    year: number;
    totalWorkouts: number;
    totalCaloriesBurned: number;
    totalDistance: number;
    averageWorkoutDuration: number;
}

interface ProgressContextType {
    dailyProgress: DailyProgress[];
    monthlyProgress: MonthlyProgress[];
    addDailyProgress: (progress: Omit<DailyProgress, 'id'>) => void;
    getMonthlyProgress: (date: Date) => MonthlyProgress;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
    const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress[]>([]);

    const addDailyProgress = (newProgress: Omit<DailyProgress, 'id'>) => {
        const progressWithId = { ...newProgress, id: crypto.randomUUID() };
        setDailyProgress(prev => [...prev, progressWithId]);
        updateMonthlyProgress(newProgress.date);
    };

    const updateMonthlyProgress = (date: Date) => {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Get all daily progress for this month
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const monthData = dailyProgress.filter(entry =>
            isSameMonth(entry.date, date)
        );

        const completedWorkouts = monthData.filter(entry => entry.workoutCompleted);
        const totalWorkouts = completedWorkouts.length;
        const totalCalories = completedWorkouts.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);
        const totalDistance = completedWorkouts.reduce((sum, entry) => sum + (entry.distance || 0), 0);
        const avgDuration = totalWorkouts > 0
            ? completedWorkouts.reduce((sum, entry) => sum + (entry.workoutDuration || 0), 0) / totalWorkouts
            : 0;

        const monthlyData: MonthlyProgress = {
            month,
            year,
            totalWorkouts,
            totalCaloriesBurned: totalCalories,
            totalDistance,
            averageWorkoutDuration: avgDuration
        };

        setMonthlyProgress(prev => {
            const existing = prev.find(m => m.month === month && m.year === year);
            if (existing) {
                return prev.map(m =>
                    m.month === month && m.year === year ? monthlyData : m
                );
            }
            return [...prev, monthlyData];
        });
    };

    const getMonthlyProgress = (date: Date) => {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const defaultProgress: MonthlyProgress = {
            month,
            year,
            totalWorkouts: 0,
            totalCaloriesBurned: 0,
            totalDistance: 0,
            averageWorkoutDuration: 0
        };

        return monthlyProgress.find(m => m.month === month && m.year === year) || defaultProgress;
    };

    return (
        <ProgressContext.Provider value={{
            dailyProgress,
            monthlyProgress,
            addDailyProgress,
            getMonthlyProgress
        }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}