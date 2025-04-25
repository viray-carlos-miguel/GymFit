"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { UploadCloud, X, Dumbbell, Weight, Clock, Edit } from "lucide-react";
import { recordDailyProgress } from "~/server/queries";

export default function DailyTrackerPage() {
    const [formData, setFormData] = useState({
        workoutCompleted: false,
        weight: undefined as number | undefined,
        workoutDuration: undefined as number | undefined,
        notes: "",
        photoUrl: null as string | null,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suggestion, setSuggestion] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, photoUrl: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await recordDailyProgress({
                ...formData,
                workoutCompleted: true,
            });
            alert("Progress saved successfully!");
            setFormData({
                workoutCompleted: false,
                weight: undefined,
                workoutDuration: undefined,
                notes: "",
                photoUrl: null,
            });
            setPreviewImage(null);
            setSuggestion("");
        } catch (error) {
            console.error("Failed to save progress:", error);
            alert("Failed to save progress");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateSuggestion = () => {
        if (!formData.workoutDuration) return "";

        if (formData.workoutDuration < 30) {
            return "Beginner: Try adding 5 more minutes tomorrow! Focus on form before intensity.";
        } else if (formData.workoutDuration >= 30 && formData.workoutDuration < 60) {
            return "Intermediate: Great work! Try adding supersets to challenge yourself.";
        } else {
            return "Advanced: Impressive stamina! Consider active recovery sessions.";
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-700 to-red-900 p-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                        <Dumbbell className="h-8 w-8" />
                        Daily Progress Tracker
                    </h1>
                    <p className="text-red-200 mt-1">
                        Log your workout and track your fitness journey
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Workout Completed */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                        <input
                            type="checkbox"
                            id="workoutCompleted"
                            checked={formData.workoutCompleted}
                            onChange={(e) => {
                                setFormData({ ...formData, workoutCompleted: e.target.checked });
                                setSuggestion(generateSuggestion());
                            }}
                            className="h-6 w-6 text-red-500 rounded focus:ring-red-500 border-gray-600"
                        />
                        <label htmlFor="workoutCompleted" className="text-white text-lg font-medium">
                            Did you complete your workout today?
                        </label>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Weight Input */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                        >
                            <label htmlFor="weight" className="flex items-center gap-2 text-white mb-3">
                                <Weight className="h-5 w-5 text-red-400" />
                                <span className="font-medium">Weight (kg)</span>
                            </label>
                            <input
                                type="number"
                                id="weight"
                                value={formData.weight || ""}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                step="0.1"
                                min="0"
                                placeholder="Current weight"
                            />
                        </motion.div>

                        {/* Workout Duration */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                        >
                            <label htmlFor="workoutDuration" className="flex items-center gap-2 text-white mb-3">
                                <Clock className="h-5 w-5 text-red-400" />
                                <span className="font-medium">Duration (mins)</span>
                            </label>
                            <input
                                type="number"
                                id="workoutDuration"
                                value={formData.workoutDuration || ""}
                                onChange={(e) => {
                                    const duration = e.target.value ? parseInt(e.target.value) : undefined;
                                    setFormData({ ...formData, workoutDuration: duration });
                                    setSuggestion(generateSuggestion());
                                }}
                                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                min="0"
                                placeholder="Workout duration"
                            />
                        </motion.div>
                    </div>

                    {/* Image Upload - Perfectly Fitted */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                        <label className="flex items-center gap-2 text-white mb-3">
                            <UploadCloud className="h-5 w-5 text-red-400" />
                            <span className="font-medium">Progress Photo</span>
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors overflow-hidden">
                                {previewImage ? (
                                    <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="max-h-full max-w-full object-contain p-1"
                                            style={{
                                                maxHeight: "calc(100% - 8px)",
                                                maxWidth: "calc(100% - 8px)"
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-gray-900 rounded-full p-1.5 hover:bg-gray-800 transition-colors"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 text-center">
                                        <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-1 text-sm text-gray-300">
                                            Upload progress photo
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                                    </div>
                                )}
                                <input
                                    id="photo"
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    ref={fileInputRef}
                                />
                            </label>
                        </div>
                    </motion.div>

                    {/* Notes */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                        <label htmlFor="notes" className="flex items-center gap-2 text-white mb-3">
                            <Edit className="h-5 w-5 text-red-400" />
                            <span className="font-medium">Workout Notes</span>
                        </label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[120px]"
                            placeholder="How did your workout feel today? Any observations?"
                        />
                    </motion.div>

                    {/* Suggestion */}
                    {suggestion && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-red-900/70 to-red-800/70 p-4 rounded-lg border border-red-800/50"
                        >
                            <h3 className="text-sm font-bold text-red-300 mb-1">TRAINER'S SUGGESTION</h3>
                            <p className="text-sm text-red-100">{suggestion}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors text-lg"
                            disabled={isSubmitting || !formData.workoutCompleted}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                "SAVE TODAY'S PROGRESS"
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}