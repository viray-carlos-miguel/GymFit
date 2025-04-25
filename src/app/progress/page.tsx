"use client";

import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
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
    const [level, setLevel] = useState<"beginner" | "advanced">("beginner");
    const [uploads, setUploads] = useState<Record<string, string>>({});
    const [todaysPlan, setTodaysPlan] = useState<ExercisePlan | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [notes, setNotes] = useState<Record<string, string>>({});

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const getExerciseIndex = (date: Date, max: number): number => {
            const dayOfYear = parseInt(format(date, 'd'), 10); // Changed from 'D' to 'd'
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
        const dateKey = format(new Date(), "yyyy-MM-dd");
        setUploads(prev => ({ ...prev, [dateKey]: url }));
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const dateKey = format(new Date(), "yyyy-MM-dd");
        setNotes(prev => ({ ...prev, [dateKey]: e.target.value }));
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

    const dateKey = format(new Date(), "yyyy-MM-dd");
    const currentUpload = uploads[dateKey];
    const currentNote = notes[dateKey] || "";

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Daily Progress Tracker</h1>

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {format(new Date(), "MMMM d, yyyy")}
                        </h2>

                        {currentUpload ? (
                            <div className="mb-4">
                                <img
                                    src={currentUpload}
                                    alt="Progress"
                                    className="rounded-lg w-full h-64 object-cover border border-gray-700"
                                />
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full bg-gray-900 text-white hover:bg-gray-700"
                                    onClick={() => {
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
                            <h3 className="font-medium mb-2 text-white">Today's Notes</h3>
                            <textarea
                                className="w-full border border-gray-700 rounded-md p-2 min-h-[100px] bg-gray-900 text-white"
                                placeholder="Record your thoughts, measurements, or progress..."
                                value={currentNote}
                                onChange={handleNoteChange}
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

                        <div className="mt-6 space-y-4">
                            <Button
                                className="w-full bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                    const plan = EXERCISE_PLANS[level];
                                    const getExerciseIndex = (date: Date, max: number): number => {
                                        const dayOfYear = parseInt(format(date, 'd'), 10); // Changed from 'D' to 'd'
                                        return dayOfYear % max;
                                    };

                                    setTodaysPlan({
                                        strength: plan.strength[getExerciseIndex(new Date(), plan.strength.length)]!,
                                        cardio: plan.cardio[getExerciseIndex(new Date(), plan.cardio.length)]!,
                                        flexibility: plan.flexibility[getExerciseIndex(new Date(), plan.flexibility.length)]!
                                    });
                                }}
                            >
                                Regenerate Today's Plan
                            </Button>

                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="font-medium text-white mb-2">Daily Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-300 text-sm">Weight (kg)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                            placeholder="Enter weight"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-300 text-sm">Workout Time (min)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                            placeholder="Enter duration"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}