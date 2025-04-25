// src/app/progress/daily/page.tsx
"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { recordDailyProgress } from "~/server/queries";

export default function DailyTrackerPage() {
    const [formData, setFormData] = useState({
        workoutCompleted: false,
        weight: undefined as number | undefined,
        workoutDuration: undefined as number | undefined,
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await recordDailyProgress({
                ...formData,
                workoutCompleted: true,
            });
            alert("Progress saved successfully!");
        } catch (error) {
            console.error("Failed to save progress:", error);
            alert("Failed to save progress");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-white mb-6">Daily Progress Tracker</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="workoutCompleted"
                            checked={formData.workoutCompleted}
                            onChange={(e) => setFormData({ ...formData, workoutCompleted: e.target.checked })}
                            className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="workoutCompleted" className="text-white">
                            Completed workout today
                        </label>
                    </div>

                    <div>
                        <label htmlFor="weight" className="block text-white mb-1">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            value={formData.weight || ""}
                            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            step="0.1"
                        />
                    </div>

                    <div>
                        <label htmlFor="workoutDuration" className="block text-white mb-1">
                            Workout Duration (minutes)
                        </label>
                        <input
                            type="number"
                            id="workoutDuration"
                            value={formData.workoutDuration || ""}
                            onChange={(e) => setFormData({ ...formData, workoutDuration: parseInt(e.target.value) })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-white mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white min-h-[100px]"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Save Progress
                    </Button>
                </form>
            </div>
        </div>
    );
}