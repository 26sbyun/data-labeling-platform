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
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return setErr("Please sign in");
    setErr(null); setBusy(true);
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        clientId: user.uid,
        title,
        description: desc,
        status: "active",
        createdAt: serverTimestamp(),
      });
      router.push(`/dashboard/projects/${docRef.id}`);
    } catch (e: any) {
      setErr(e.message ?? "Failed to create project");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 border rounded-lg p-4">
      <h3 className="font-semibold">New Project</h3>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <input
        className="w-full border rounded p-2"
        placeholder="Project title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="Short description"
        value={desc}
        onChange={e=>setDesc(e.target.value)}
        rows={3}
      />
      <button disabled={busy} className="border rounded px-3 py-1">
        {busy ? "Creating..." : "Create project"}
      </button>
    </form>
  );
}
