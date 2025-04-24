"use client";

import { useState, useEffect } from "react";
import { format, addDays, isToday, isSameDay } from "date-fns";
import { UploadButton } from "../components/UploadButton";
import { Button } from "~/components/ui/button";

const EXERCISE_PLANS = {
    beginner: {
        strength: ["Bodyweight Squats", "Push-ups (knees)", "Assisted Pull-ups"] as const,
        cardio: ["Brisk Walking", "Cycling", "Swimming"] as const,
        flexibility: ["Basic Yoga", "Static Stretching"] as const
    },
    advanced: {
        strength: ["Barbell Squats", "Weighted Pull-ups", "Deadlifts"] as const,
        cardio: ["HIIT Sprints", "Box Jumps", "Battle Ropes"] as const,
        flexibility: ["Dynamic Stretching", "Plyometric Drills"] as const
    }
} as const;

type ExercisePlan = {
    strength: string;
    cardio: string;
    flexibility: string;
};

export default function ProgressPage() {
    const [date] = useState<Date>(new Date());
    const [level, setLevel] = useState<"beginner" | "advanced">("beginner");
    const [uploads, setUploads] = useState<Record<string, string>>({});
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [todaysPlan, setTodaysPlan] = useState<ExercisePlan | null>(null);
    const [isClient, setIsClient] = useState(false);

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = Array.from(
        { length: monthEnd.getDate() },
        (_, i) => addDays(monthStart, i)
    );

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const getExerciseIndex = (date: Date, max: number): number => {
            const dayOfYear = parseInt(format(date, 'DDD'), 10); // fixed here
            return dayOfYear % max;
        };


        const plan = EXERCISE_PLANS[level];
        setTodaysPlan({
            strength: plan.strength[getExerciseIndex(new Date(), plan.strength.length)]!,
            cardio: plan.cardio[getExerciseIndex(new Date(), plan.cardio.length)]!,
            flexibility: plan.flexibility[getExerciseIndex(new Date(), plan.flexibility.length)]!
        });
    }, [level, isClient]);

    const handleUploadSuccess = (url: string) => {
        const dateKey = format(selectedDay, "yyyy-MM-dd");
        setUploads(prev => ({ ...prev, [dateKey]: url }));
    };

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-6">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Monthly Progress Tracker</h1>

                <div className="flex gap-6 mb-8">
                    <Button
                        variant={level === "beginner" ? "default" : "outline"}
                        onClick={() => setLevel("beginner")}
                        className={level === "beginner" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        Beginner
                    </Button>
                    <Button
                        variant={level === "advanced" ? "default" : "outline"}
                        onClick={() => setLevel("advanced")}
                        className={level === "advanced" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        Advanced
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {format(date, "MMMM yyyy")}
                        </h2>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="text-center font-medium text-sm text-gray-300">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {daysInMonth.map(day => {
                                const dateKey = format(day, "yyyy-MM-dd");
                                const hasUpload = uploads[dateKey];
                                const isSelected = isSameDay(day, selectedDay);

                                return (
                                    <button
                                        key={dateKey}
                                        onClick={() => setSelectedDay(day)}
                                        className={`h-12 rounded-md flex items-center justify-center
                      ${isToday(day) ? "border-2 border-red-500" : ""}
                      ${isSelected ? "bg-gray-700" : "hover:bg-gray-700"}
                      ${hasUpload ? "bg-green-900/30" : "bg-gray-900"}
                      transition-colors duration-200
                    `}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className={`${isSelected ? "text-white font-bold" : "text-gray-300"}`}>
                                                {format(day, "d")}
                                            </span>
                                            {hasUpload && (
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {format(selectedDay, "MMMM d, yyyy")}
                        </h2>

                        {uploads[format(selectedDay, "yyyy-MM-dd")] ? (
                            <div className="mb-4">
                                <img
                                    src={uploads[format(selectedDay, "yyyy-MM-dd")]}
                                    alt="Progress"
                                    className="rounded-lg w-full h-64 object-cover border border-gray-700"
                                />
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full bg-gray-900 text-white hover:bg-gray-700"
                                    onClick={() => {
                                        const dateKey = format(selectedDay, "yyyy-MM-dd");
                                        const newUploads = { ...uploads };
                                        delete newUploads[dateKey];
                                        setUploads(newUploads);
                                    }}
                                >
                                    Remove Photo
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 mb-4 flex flex-col items-center justify-center h-64 bg-gray-900/50">
                                <UploadButton
                                    onSuccess={handleUploadSuccess}
                                    className="w-full"
                                />
                                <p className="text-gray-400 mt-2 text-sm">
                                    Upload your progress photo
                                </p>
                            </div>
                        )}

                        <div className="mt-4">
                            <h3 className="font-medium mb-2 text-white">Daily Notes</h3>
                            <textarea
                                className="w-full border border-gray-700 rounded-md p-2 min-h-[100px] bg-gray-900 text-white"
                                placeholder="Record your thoughts, measurements, or progress..."
                            />
                        </div>
                    </div>

                    {/* Exercise Plan Section */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            Today's Exercise Plan ({level})
                        </h2>

                        {todaysPlan ? (
                            <div className="space-y-4">
                                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/50">
                                    <h3 className="font-medium text-blue-300 mb-2">Strength</h3>
                                    <p className="text-white">{todaysPlan.strength}</p>
                                </div>

                                <div className="bg-green-900/30 p-4 rounded-lg border border-green-800/50">
                                    <h3 className="font-medium text-green-300 mb-2">Cardio</h3>
                                    <p className="text-white">{todaysPlan.cardio}</p>
                                </div>

                                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-800/50">
                                    <h3 className="font-medium text-purple-300 mb-2">Flexibility</h3>
                                    <p className="text-white">{todaysPlan.flexibility}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400">Loading plan...</div>
                        )}

                        <Button
                            className="mt-6 w-full bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                const plan = EXERCISE_PLANS[level];
                                const getExerciseIndex = (date: Date, max: number): number => {
                                    const dayOfYear = parseInt(format(date, 'DDD'), 10); // fixed here
                                    return dayOfYear % max;
                                };

                                
                                setTodaysPlan({
                                    strength: plan.strength[getExerciseIndex(new Date(), plan.strength.length)]!,
                                    cardio: plan.cardio[getExerciseIndex(new Date(), plan.cardio.length)]!,
                                    flexibility: plan.flexibility[getExerciseIndex(new Date(), plan.flexibility.length)]!
                                });
                            }}
                        >
                            Generate New Plan
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
