"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactsPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Message sent! We'll get back to you soon.");
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-300">
            <motion.div
                className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-extrabold mb-4 text-gray-800">📬 Contact Us</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Got questions? We'd love to hear from you! Reach out via email or send us a message below.
                </p>

                {/* Email Contact */}
                <p className="text-lg font-semibold text-gray-800">
                    📧 Email:{" "}
                    <a href="mailto:support@petgallery.com" className="text-blue-600 hover:underline">
                        support@petgallery.com
                    </a>
                </p>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={4}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <motion.button
                        type="submit"
                        className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        Send Message
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}
