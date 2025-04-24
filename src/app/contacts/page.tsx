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
        alert("Message sent! Our team will contact you shortly.");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <motion.div
                className="bg-gray-800 shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2 text-white">Get In Touch</h1>
                    <div className="w-20 h-1 bg-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">
                        Have questions about memberships, classes, or facilities? Reach out to our team.
                    </p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 className="font-bold text-white mb-2">📍 Location</h3>
                        <p className="text-gray-300">123 Fitness Street, Gym City</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 className="font-bold text-white mb-2">📞 Phone</h3>
                        <p className="text-gray-300">(555) 123-4567</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 className="font-bold text-white mb-2">🕒 Hours</h3>
                        <p className="text-gray-300">Mon-Fri: 5AM - 11PM</p>
                        <p className="text-gray-300">Weekends: 7AM - 9PM</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 className="font-bold text-white mb-2">📧 Email</h3>
                        <a href="mailto:info@gymfit.com" className="text-red-400 hover:underline">
                            info@gymfit.com
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400"
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400"
                    />
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={4}
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400"
                    />
                    <motion.button
                        type="submit"
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        SEND MESSAGE
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}