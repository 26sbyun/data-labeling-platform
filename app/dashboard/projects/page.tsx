"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import NewProjectForm from "@/components/dashboard/NewProjectForm";

type Project = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt?: any;
  clientId: string;
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Project[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // This query may need a composite index: clientId asc + createdAt desc
        const qy = query(
          collection(db, "projects"),
          where("clientId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(qy);
        const list = snap.docs.map(d => ({ ...(d.data() as Project), id: d.id }));
        setItems(list);
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [user]);

  return (
    <div className="p-6 space-y-6">
        <Link
  href="/dashboard/projects"
  className="inline-block border rounded px-4 py-2 mt-4 hover:bg-gray-50"
>
  View Projects
</Link>
      <h1 className="text-2xl font-semibold">My Projects</h1>
      <NewProjectForm />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <ul className="space-y-2">
        {items.map(p => (
          <li key={p.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-sm text-gray-500 truncate">{p.description}</div>
              </div>
              <Link href={`/dashboard/projects/${p.id}`} className="underline">
                Open
              </Link>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">No projects yet.</p>}
      </ul>
    </div>
  );
}