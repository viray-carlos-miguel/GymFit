// src/app/progress/monthly/MonthlyReportView.tsx
"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { MonthlyProgressData } from "~/types/progress";

export default function MonthlyReportView({
    initialData,
    year,
    month,
}: {
    initialData: MonthlyProgressData;
    year: number;
    month: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data] = useState(initialData);

    const currentDate = new Date(year, month - 1);
    const monthStart = data.monthStart;
    const monthEnd = data.monthEnd;
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handleMonthChange = (newYear: number, newMonth: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("year", newYear.toString());
        params.set("month", newMonth.toString());
        router.push(`/progress/monthly?${params.toString()}`);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(year, month - 2);
        handleMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
    };

    const handleNextMonth = () => {
        const newDate = new Date(year, month);
        handleMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
    };

    const progressData = data.entries.reduce((acc: Record<string, typeof data.entries[number]>, entry) => {
        const dateKey = format(entry.date, 'yyyy-MM-dd');
        return { ...acc, [dateKey]: entry };
    }, {});

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Monthly Progress Report</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-xl font-semibold text-white">
                            {format(currentDate, "MMMM yyyy")}
                        </h2>
                        <Button variant="outline" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800/50">
                        <h3 className="text-lg font-medium text-blue-300 mb-2">Workouts Completed</h3>
                        <p className="text-3xl font-bold text-white">
                            {data.workoutsCompleted} / {data.daysInMonth}
                        </p>
                        <p className="text-sm text-blue-200 mt-2">
                            {Math.round((data.workoutsCompleted / data.daysInMonth) * 100)}% of days
                        </p>
                    </div>

                    <div className="bg-green-900/30 p-6 rounded-lg border border-green-800/50">
                        <h3 className="text-lg font-medium text-green-300 mb-2">Total Workout Time</h3>
                        <p className="text-3xl font-bold text-white">
                            {Math.floor(data.totalWorkoutMinutes / 60)}h {data.totalWorkoutMinutes % 60}m
                        </p>
                        <p className="text-sm text-green-200 mt-2">
                            Avg: {data.averageWorkoutMinutes} min/session
                        </p>
                    </div>

                    <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-800/50">
                        <h3 className="text-lg font-medium text-purple-300 mb-2">Weight Change</h3>
                        <p className="text-3xl font-bold text-white">
                            {data.weightChange !== null ?
                                `${data.weightChange > 0 ? '+' : ''}${data.weightChange.toFixed(1)} kg` :
                                'N/A'}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mb-8">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="text-center font-medium text-sm text-gray-300">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {monthDays.map(day => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const dayData = progressData[dateKey];
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const isCurrentDay = isToday(day);

                            return (
                                <div
                                    key={dateKey}
                                    className={`h-16 rounded-md flex flex-col items-center justify-center p-1
                    ${isCurrentDay ? 'border-2 border-red-500' : ''}
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    ${dayData?.workoutCompleted ? 'bg-green-900/30' : 'bg-gray-900'}
                    transition-colors duration-200
                  `}
                                >
                                    <span className={`text-sm ${isCurrentMonth ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {format(day, 'd')}
                                    </span>
                                    {dayData?.workoutCompleted && (
                                        <span className="w-2 h-2 bg-green-500 rounded-full mt-1"></span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Progress Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-white mb-2">Workout Consistency</h3>
                            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${(data.workoutsCompleted / data.daysInMonth) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                You worked out on {data.workoutsCompleted} out of {data.daysInMonth} days this month.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-2">Best Workout Streak</h3>
                            <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold text-white">
                                    {data.bestStreak}
                                </div>
                                <span className="text-gray-400">days in a row</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Monthly Notes Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {monthDays
                            .filter(day => progressData[format(day, 'yyyy-MM-dd')]?.notes)
                            .slice(0, 3)
                            .map(day => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                return (
                                    <div key={dateKey} className="bg-gray-700 p-4 rounded-lg">
                                        <h3 className="font-medium text-white mb-1">
                                            {format(day, 'MMM d')}
                                        </h3>
                                        <p className="text-gray-300 text-sm line-clamp-3">
                                            {progressData[dateKey]?.notes}
                                        </p>
                                    </div>
                                );
                            })}
                    </div>
                    {monthDays.filter(day => progressData[format(day, 'yyyy-MM-dd')]?.notes).length === 0 && (
                        <p className="text-gray-400">No notes recorded this month</p>
                    )}
                </div>
            </div>
        </div>
    );
}