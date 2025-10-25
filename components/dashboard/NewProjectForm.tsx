// components/dashboard/NewProjectForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function NewProjectForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErr("Please sign in.");
      return;
    }
    if (!title.trim()) {
      setErr("Project title is required.");
      return;
    }
    setErr(null);
    setCreating(true);
    try {
      const ref = await addDoc(collection(db, "projects"), {
        title: title.trim(),
        description: description.trim() || null,
        clientId: user.uid,
        createdAt: serverTimestamp(),
        // OPTIONAL: add targetFiles for progress if you want
        // targetFiles: 1000,
      });
      setTitle("");
      setDescription("");
      router.push(`/dashboard/projects/${ref.id}`);
    } catch (e: any) {
      setErr(e.message ?? "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
      <h3 className="font-semibold mb-3">Create a new project</h3>
      {err && <p className="text-red-500 text-sm mb-2">{err}</p>}
      <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-3">
        <input
          className="border border-gray-700 bg-black text-white rounded px-3 py-2 sm:col-span-1"
          placeholder="Project title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="border border-gray-700 bg-black text-white rounded px-3 py-2 sm:col-span-2"
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-500 rounded px-4 py-2 font-medium"
          >
            {creating ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
