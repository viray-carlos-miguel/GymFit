"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProgressData = {
    date: Date;
    workoutCompleted: boolean;
    weight?: number;
    workoutDuration?: number;
    notes?: string;
    photoUrl?: string;
};

export default function MonthlyReportPage() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [progressData, setProgressData] = useState<Record<string, ProgressData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyStats, setMonthlyStats] = useState({
        workoutsCompleted: 0,
        totalWorkoutMinutes: 0,
        weightChange: null as number | null,
        bestStreak: 0,
        daysInMonth: 0,
    });

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;

                const response = await fetch(`/api/progress-summary?year=${year}&month=${month}`);
                const summary = await response.json();

                const dataMap = summary.entries.reduce((acc: Record<string, ProgressData>, entry: any) => {
                    const dateKey = format(entry.date, "yyyy-MM-dd");
                    acc[dateKey] = {
                        date: new Date(entry.date),
                        workoutCompleted: entry.workoutCompleted,
                        weight: entry.weight ?? undefined,
                        workoutDuration: entry.workoutDuration ?? undefined,
                        notes: entry.notes ?? undefined,
                        photoUrl: entry.photoUrl ?? undefined,
                    };
                    return acc;
                }, {});

                setProgressData(dataMap);
                setMonthlyStats({
                    workoutsCompleted: summary.workoutsCompleted,
                    totalWorkoutMinutes: summary.totalWorkoutMinutes,
                    weightChange: summary.weightChange,
                    bestStreak: summary.bestStreak,
                    daysInMonth: summary.daysInMonth,
                });
            } catch (error) {
                console.error("Failed to load progress data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [currentDate]);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6">Loading Report...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Monthly Progress Report</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold text-white">{format(currentDate, "MMMM yyyy")}</h2>
                        <Button variant="outline" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800/50">
                        <h3 className="text-lg font-medium text-blue-300 mb-2">Workouts Completed</h3>
                        <p className="text-3xl font-bold text-white">
                            {monthlyStats.workoutsCompleted} / {monthlyStats.daysInMonth}
                        </p>
                        <p className="text-sm text-blue-200 mt-2">
                            {Math.round((monthlyStats.workoutsCompleted / monthlyStats.daysInMonth) * 100)}% of days
                        </p>
                    </div>
                    <div className="bg-green-900/30 p-6 rounded-lg border border-green-800/50">
                        <h3 className="text-lg font-medium text-green-300 mb-2">Total Workout Time</h3>
                        <p className="text-3xl font-bold text-white">
                            {Math.floor(monthlyStats.totalWorkoutMinutes / 60)}h {monthlyStats.totalWorkoutMinutes % 60}m
                        </p>
                        <p className="text-sm text-green-200 mt-2">
                            Avg: {Math.round(monthlyStats.totalWorkoutMinutes / monthlyStats.workoutsCompleted) || 0} min/session
                        </p>
                    </div>
                    <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-800/50">
                        <h3 className="text-lg font-medium text-purple-300 mb-2">Weight Change</h3>
                        <p className="text-3xl font-bold text-white">
                            {monthlyStats.weightChange !== null
                                ? `${monthlyStats.weightChange > 0 ? "+" : ""}${monthlyStats.weightChange.toFixed(1)} kg`
                                : "N/A"}
                        </p>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mb-8">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="text-center font-medium text-sm text-gray-300">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {monthDays.map((day) => {
                            const dateKey = format(day, "yyyy-MM-dd");
                            const dayData = progressData[dateKey];
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const isCurrentDay = isToday(day);

                            return (
                                <div
                                    key={dateKey}
                                    className={`h-16 rounded-md flex flex-col items-center justify-center p-1
                  ${isCurrentDay ? "border-2 border-red-500" : ""}
                  ${!isCurrentMonth ? "opacity-50" : ""}
                  ${dayData?.workoutCompleted ? "bg-green-900/30" : "bg-gray-900"}
                  transition-colors duration-200
                  `}
                                >
                                    <span className={`text-sm ${isCurrentMonth ? "text-gray-300" : "text-gray-500"}`}>
                                        {format(day, "d")}
                                    </span>
                                    {dayData?.workoutCompleted && <span className="w-2 h-2 bg-green-500 rounded-full mt-1"></span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
