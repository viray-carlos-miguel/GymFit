"use client";

import { addMonths, format, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Dumbbell, Flame, MapPin, Clock, Award, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useProgress } from "~/context/progress-context";

export default function MonthlyProgressPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { getMonthlyProgress } = useProgress();
    const progress = getMonthlyProgress(currentDate);

    // Example data for demonstration
    const exampleWorkouts = [
        { day: "Mon", count: 3 },
        { day: "Tue", count: 5 },
        { day: "Wed", count: 2 },
        { day: "Thu", count: 4 },
        { day: "Fri", count: 6 },
        { day: "Sat", count: 1 },
        { day: "Sun", count: 0 }
    ];

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Calculate percentage for progress bars (example values)
    const workoutCompletion = Math.min((progress.totalWorkouts / 20) * 100, 100);
    const calorieGoal = Math.min((progress.totalCaloriesBurned / 10000) * 100, 100);
    const distanceGoal = Math.min((progress.totalDistance / 50) * 100, 100);

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header with Month Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Fitness Dashboard</h1>
                    <p className="text-muted-foreground">Track your monthly fitness journey</p>
                </div>
                <div className="flex items-center gap-2 bg-background rounded-lg p-1 border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrevMonth}
                        className="hover:bg-accent"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-medium px-4 min-w-[180px] text-center">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNextMonth}
                        className="hover:bg-accent"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Workouts Completed"
                    value={progress.totalWorkouts}
                    unit="sessions"
                    icon={<Dumbbell className="h-5 w-5 text-primary" />}
                    progress={workoutCompletion}
                    goal={20}
                />
                <StatCard
                    title="Calories Burned"
                    value={progress.totalCaloriesBurned}
                    unit="kcal"
                    icon={<Flame className="h-5 w-5 text-orange-500" />}
                    progress={calorieGoal}
                    goal={10000}
                />
                <StatCard
                    title="Distance Covered"
                    value={progress.totalDistance.toFixed(1)}
                    unit="km"
                    icon={<MapPin className="h-5 w-5 text-green-500" />}
                    progress={distanceGoal}
                    goal={50}
                />
                <StatCard
                    title="Avg Duration"
                    value={progress.averageWorkoutDuration.toFixed(0)}
                    unit="mins/session"
                    icon={<Clock className="h-5 w-5 text-blue-500" />}
                />
            </div>

            {/* Additional Metrics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Weekly Workout Frequency */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-500" />
                            Weekly Workout Frequency
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {exampleWorkouts.map((item) => (
                                <div key={item.day} className="flex items-center gap-4">
                                    <span className="w-8 font-medium">{item.day}</span>
                                    <Progress
                                        value={(item.count / 6) * 100}
                                        className="h-2"
                                    />
                                    <span className="w-8 text-right text-sm text-muted-foreground">
                                        {item.count}x
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Records */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            This Month's PRs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                <span>Longest Workout</span>
                                <span className="font-medium">72 mins</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                <span>Highest Calories</span>
                                <span className="font-medium">620 kcal</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                <span>Longest Distance</span>
                                <span className="font-medium">8.2 km</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                                <span>Most Active Day</span>
                                <span className="font-medium">Friday</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Workout Types */}
                <Card>
                    <CardHeader>
                        <CardTitle>Workout Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                                    Strength Training
                                </span>
                                <span className="font-medium">12 sessions</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-green-500" />
                                    Cardio
                                </span>
                                <span className="font-medium">8 sessions</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-purple-500" />
                                    Yoga
                                </span>
                                <span className="font-medium">5 sessions</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-orange-500" />
                                    HIIT
                                </span>
                                <span className="font-medium">3 sessions</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Motivation Section */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="text-primary">Monthly Summary</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {progress.totalWorkouts > 15
                            ? "🔥 Amazing work this month! You're crushing your fitness goals!"
                            : progress.totalWorkouts > 8
                                ? "💪 Solid effort this month! Keep up the good work!"
                                : "🌟 Every workout counts! Next month will be even better!"}
                    </p>
                    <div className="mt-4 flex gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {progress.totalWorkouts} workouts
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                            {progress.totalDistance.toFixed(1)} km
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-orange-500/10 text-orange-500">
                            {progress.totalCaloriesBurned} kcal
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number | string;
    unit: string;
    icon?: React.ReactNode;
    progress?: number;
    goal?: number;
}

function StatCard({ title, value, unit, icon, progress, goal }: StatCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-sm text-muted-foreground mb-1">{unit}</p>
                    </div>
                    {progress !== undefined && goal !== undefined && (
                        <div className="space-y-1">
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                                {Math.round(progress)}% of {goal.toLocaleString()} {unit} goal
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}