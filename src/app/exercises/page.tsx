"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Exercise = {
    id: string;
    name: string;
    muscleGroup: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    description: string;
    videoUrl?: string;
    imageUrl?: string;
};

const EXERCISE_DATA: Exercise[] = [
    {
        id: "1",
        name: "Barbell Squat",
        muscleGroup: "Legs",
        difficulty: "Intermediate",
        description: "Compound exercise that targets quads, hamstrings, and glutes. Keep your back straight and lower until thighs are parallel to the floor.",
        videoUrl: "https://www.youtube.com/embed/Dy28eq2PjcM", // Added link
    },
    {
        id: "2",
        name: "Bench Press",
        muscleGroup: "Chest",
        difficulty: "Intermediate",
        description: "Lie on a bench and lower the barbell to your chest, then press upward until arms are extended.",
        videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", // Added link
    },
    {
        id: "3",
        name: "Pull-ups",
        muscleGroup: "Back",
        difficulty: "Advanced",
        description: "Hang from a bar with palms facing away and pull your chin over the bar.",
        videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g", // Added link
    },
    {
        id: "4",
        name: "Push-ups",
        muscleGroup: "Chest",
        difficulty: "Beginner",
        description: "Basic bodyweight exercise. Keep your body straight and lower your chest to the floor.",
        videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4", // Added link
    },
    {
        id: "5",
        name: "Deadlift",
        muscleGroup: "Full Body",
        difficulty: "Advanced",
        description: "Lift a loaded barbell from the ground to hip level, keeping your back straight.",
        videoUrl: "https://www.youtube.com/embed/1ZXobu7JvvE", // Added link
    },
    {
        id: "6",
        name: "Dumbbell Shoulder Press",
        muscleGroup: "Shoulders",
        difficulty: "Intermediate",
        description: "Press dumbbells overhead while seated or standing.",
        videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog", // Added link
    },
];

export default function ExercisesPage() {
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const muscleGroups = ["All", ...new Set(EXERCISE_DATA.map(ex => ex.muscleGroup))];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

    const filteredExercises = EXERCISE_DATA.filter(ex => {
        const muscleMatch = selectedMuscleGroup === "All" || ex.muscleGroup === selectedMuscleGroup;
        const difficultyMatch = selectedDifficulty === "All" || ex.difficulty === selectedDifficulty;
        return muscleMatch && difficultyMatch;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-8 text-center text-red-500"
                >
                    Exercise Library
                </motion.h1>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-800 p-4 rounded-lg">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium mb-1">Muscle Group</label>
                        <select
                            value={selectedMuscleGroup}
                            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                        >
                            {muscleGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium mb-1">Difficulty</label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                        >
                            {difficulties.map(difficulty => (
                                <option key={difficulty} value={difficulty}>{difficulty}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Exercise Grid and Detail View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Exercise List */}
                    <div className="lg:col-span-1 bg-gray-800 p-4 rounded-lg h-fit lg:sticky lg:top-4">
                        <h2 className="text-xl font-semibold mb-4">Exercises ({filteredExercises.length})</h2>
                        <div className="space-y-2">
                            {filteredExercises.map(exercise => (
                                <motion.div
                                    key={exercise.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedExercise(exercise)}
                                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedExercise?.id === exercise.id
                                        ? "bg-red-600"
                                        : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                >
                                    <h3 className="font-medium">{exercise.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-xs px-2 py-1 bg-gray-600 rounded-full">
                                            {exercise.muscleGroup}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${exercise.difficulty === "Beginner" ? "bg-green-600" :
                                            exercise.difficulty === "Intermediate" ? "bg-yellow-600" :
                                                "bg-red-600"
                                            }`}>
                                            {exercise.difficulty}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Exercise Detail */}
                    <div className="lg:col-span-2">
                        {selectedExercise ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gray-800 p-6 rounded-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-sm px-2 py-1 bg-gray-700 rounded-full">
                                                {selectedExercise.muscleGroup}
                                            </span>
                                            <span className={`text-sm px-2 py-1 rounded-full ${selectedExercise.difficulty === "Beginner" ? "bg-green-600" :
                                                selectedExercise.difficulty === "Intermediate" ? "bg-yellow-600" :
                                                    "bg-red-600"
                                                }`}>
                                                {selectedExercise.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selectedExercise.videoUrl && (
                                    <div className="mb-6 aspect-video bg-black rounded-lg overflow-hidden">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={selectedExercise.videoUrl}
                                            title={`${selectedExercise.name} tutorial`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                <div className="prose prose-invert max-w-none">
                                    <h3 className="text-xl font-semibold mb-2">How to Perform</h3>
                                    <p className="mb-6">{selectedExercise.description}</p>

                                    <h3 className="text-xl font-semibold mb-2">Tips</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Maintain proper form throughout the movement</li>
                                        <li>Start with lighter weights to master technique</li>
                                        <li>Breathe out during exertion, breathe in during relaxation</li>
                                        <li>Engage your core for stability</li>
                                    </ul>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-gray-800 p-6 rounded-lg text-center">
                                <h2 className="text-xl font-semibold">Select an exercise to view details</h2>
                                <p className="text-gray-400 mt-2">Browse our library of exercises to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}