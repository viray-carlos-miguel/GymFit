// components/FitnessSignIn.tsx
"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";

export function FitnessSignIn() {
    const [age, setAge] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [bmi, setBmi] = useState<number | null>(null);
    const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "advanced">("beginner");
    const { isLoaded, user } = useUser();

    const calculateBmi = () => {
        if (weight && height) {
            const heightInMeters = Number(height) / 100;
            const calculatedBmi = Number(weight) / (heightInMeters * heightInMeters);
            setBmi(parseFloat(calculatedBmi.toFixed(1)));
        }
    };

    const getExerciseRecommendations = () => {
        if (!bmi || !age) return [];

        const baseRecommendations = [];
        const cardioExercises = ["Running", "Cycling", "Swimming", "Jump Rope"];
        const strengthExercises = ["Weight Lifting", "Resistance Bands", "Bodyweight Exercises"];
        const flexibilityExercises = ["Yoga", "Pilates", "Dynamic Stretching"];

        // BMI-based recommendations
        if (bmi < 18.5) {
            baseRecommendations.push(
                ...strengthExercises,
                "High-Protein Diet Focus",
                "Compound Movements (Squats, Deadlifts)"
            );
        } else if (bmi >= 18.5 && bmi < 25) {
            baseRecommendations.push(
                ...cardioExercises.slice(0, 2),
                ...strengthExercises,
                "Balanced Training Program"
            );
        } else {
            baseRecommendations.push(
                ...cardioExercises,
                "HIIT Workouts",
                "Circuit Training"
            );
        }

        // Age modifications
        if (age > 40) {
            baseRecommendations.push(
                ...flexibilityExercises,
                "Low-Impact Cardio",
                "Joint Mobility Work"
            );
            // Remove high-impact exercises for older users
            baseRecommendations.splice(baseRecommendations.indexOf("Running"), 1);
            baseRecommendations.splice(baseRecommendations.indexOf("Jump Rope"), 1);
        }

        // Fitness level modifications
        if (fitnessLevel === "advanced") {
            baseRecommendations.push(
                "Olympic Lifts",
                "Plyometrics",
                "Advanced Calisthenics"
            );
        } else {
            baseRecommendations.push(
                "Form Practice",
                "Light Weights with High Reps",
                "Beginner Yoga"
            );
        }

        return [...new Set(baseRecommendations)]; // Remove duplicates
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        calculateBmi();
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
                Fitness Profile Setup
            </h2>

            <SignedOut>
                <div className="mb-6">
                    <SignInButton>
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-bold transition-colors">
                            Sign In to Continue
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>

            <SignedIn>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Age</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
                            min="13"
                            max="100"
                            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : "")}
                                min="30"
                                max="200"
                                step="0.1"
                                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Height (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : "")}
                                min="100"
                                max="250"
                                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Fitness Level</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFitnessLevel("beginner")}
                                className={`flex-1 py-2 px-4 rounded-md ${fitnessLevel === "beginner" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"}`}
                            >
                                Beginner
                            </button>
                            <button
                                type="button"
                                onClick={() => setFitnessLevel("advanced")}
                                className={`flex-1 py-2 px-4 rounded-md ${fitnessLevel === "advanced" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"}`}
                            >
                                Advanced
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-bold transition-colors mt-4"
                    >
                        Get My Fitness Plan
                    </button>

                    {bmi && (
                        <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-700">
                            <h3 className="text-lg font-semibold text-red-500 mb-2">Your Custom Plan</h3>
                            <div className="mb-4">
                                <p className="text-white">
                                    <span className="font-bold">BMI:</span> {bmi} ({getBmiCategory(bmi)})
                                </p>
                                <p className="text-white">
                                    <span className="font-bold">Level:</span> {fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)}
                                </p>
                            </div>

                            <h4 className="font-medium text-red-400 mb-2">Recommended Exercises:</h4>
                            <ul className="grid grid-cols-2 gap-2">
                                {getExerciseRecommendations().map((exercise, index) => (
                                    <li key={index} className="text-gray-300 bg-gray-700 px-3 py-1 rounded text-sm">
                                        {exercise}
                                    </li>
                                ))}
                            </ul>

                            <h4 className="font-medium text-red-400 mt-4 mb-2">Weekly Plan:</h4>
                            <div className="bg-gray-700 p-3 rounded">
                                {fitnessLevel === "beginner" ? (
                                    <>
                                        <p className="text-gray-300"><span className="font-bold">Mon/Wed/Fri:</span> Strength Training (30min)</p>
                                        <p className="text-gray-300"><span className="font-bold">Tue/Thu:</span> Light Cardio (20min)</p>
                                        <p className="text-gray-300"><span className="font-bold">Sat:</span> Active Recovery</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-300"><span className="font-bold">Mon/Thu:</span> Heavy Strength (60min)</p>
                                        <p className="text-gray-300"><span className="font-bold">Tue/Fri:</span> HIIT Cardio (45min)</p>
                                        <p className="text-gray-300"><span className="font-bold">Wed/Sat:</span> Skill Work + Mobility</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </SignedIn>
        </div>
    );
}

// Helper function
function getBmiCategory(bmi: number) {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal weight";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
}