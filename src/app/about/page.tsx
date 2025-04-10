"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-300 via-blue-200 to-indigo-300">
            <motion.div
                className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-extrabold mb-4 text-gray-800">🐾 About Pet Gallery</h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Welcome to <span className="text-indigo-600 font-semibold">Pet Gallery</span>, a place to share and cherish
                    memories of our beloved pets! 📸🐶🐱 Whether you want to upload pictures, explore adorable pet photos,
                    or connect with fellow pet lovers, this is the perfect space for you.
                </p>

                <div className="mt-6 flex justify-center gap-4">
                    <motion.button
                        className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        Explore Gallery
                    </motion.button>

                    <motion.button
                        className="px-6 py-2 border-2 border-indigo-500 text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-500 hover:text-white transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        Upload Photos
                    </motion.button>
                </div>
            </motion.div>
        </main>
    );
}
