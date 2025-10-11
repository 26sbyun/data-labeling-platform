"use client";

import { useState, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (e: any) {
      setError(e.message ?? "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-white">
        <h1 className="text-2xl font-semibold mb-2">Thanks for reaching out!</h1>
        <p className="text-gray-400">We’ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-600 bg-black text-white rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-600 bg-black text-white rounded p-2"
          required
        />
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-600 bg-black text-white rounded p-2"
          rows={4}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 rounded p-2 font-semibold text-white"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
