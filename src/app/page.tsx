"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FitnessSignIn } from "./components/FitnessSignIn";
import { TopNav } from "./_components/topnav";

// ✅ These are non-empty tuples
const QUOTES = [
  "The only bad workout is the one that didn't happen",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't",
  "Success starts with self-discipline",
  "Your body can stand almost anything. It's your mind you have to convince"
] as [string, ...string[]];

const WORKOUTS = [
  "Full Body HIIT Circuit",
  "Powerlifting Fundamentals",
  "Yoga for Strength",
  "Endurance Running Prep"
] as [string, ...string[]];

type Quote = typeof QUOTES[number];
type Workout = typeof WORKOUTS[number];

// ✅ Type-safe random selector (input must be a non-empty tuple)
function getRandomElement<T>(arr: readonly [T, ...T[]]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index] as T; // ✅ explicitly assert return type
}

export default function Home() {
  const [motivationalQuote, setMotivationalQuote] = useState<Quote>(QUOTES[0]);
  const [featuredWorkout, setFeaturedWorkout] = useState<Workout>(WORKOUTS[0]);

  useEffect(() => {
    setMotivationalQuote(getRandomElement(QUOTES));
    setFeaturedWorkout(getRandomElement(WORKOUTS));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Transform Your <span className="text-red-500">Fitness</span> Journey
          </h1>
          <p className="text-gray-400 mb-8 text-center max-w-2xl text-lg">
            Personalized training plans based on your BMI, age, and fitness level.
          </p>

          {/* Motivational Quote Banner */}
          <div className="w-full max-w-3xl bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 mb-12">
            <p className="text-white text-center italic text-xl">
              &ldquo;{motivationalQuote}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* Sign-In / Account Widget */}
          <div className="w-full lg:w-1/2">
            <FitnessSignIn />
          </div>

          {/* Featured Workout Section */}
          <div className="w-full lg:w-1/2 bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-red-500 mb-6">
              Today's Featured Workout
            </h2>
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                {featuredWorkout}
              </h3>
              <p className="text-gray-300 mb-4">
                Perfect for all fitness levels with scalable intensity options.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-medium transition-colors">
                View Routine
              </button>
            </div>

            {/* Progress Tracker */}
            <h3 className="text-xl font-bold text-red-500 mb-4">
              Progress Tracker Preview
            </h3>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <span className="text-gray-300">Weekly Goal</span>
                <span className="text-white font-medium">3/5 workouts</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-red-600 h-4 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Complete 2 more workouts to hit your weekly target!
              </p>
            </div>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Why Choose <span className="text-red-500">GYMFIT</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Plans",
                description: "Dynamic workout plans that adapt to your progress and feedback."
              },
              {
                title: "Expert Coaching",
                description: "Access to certified trainers and form analysis technology."
              },
              {
                title: "Community Support",
                description: "Join challenges and connect with fellow fitness enthusiasts."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-red-500 transition-all"
              >
                <h3 className="text-xl font-bold text-red-500 mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
