"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProjectFileUpload from "@/components/dashboard/ProjectFileUpload";

type Project = {
  title: string;
  description?: string;
  clientId: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "projects", id));
        if (!snap.exists()) { setErr("Project not found"); return; }
        setProject(snap.data() as Project);
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [id]);

  if (loading || !user || !project) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          {project.description && <p className="text-gray-500">{project.description}</p>}
        </div>
        <button className="border rounded px-3 py-1" onClick={() => signOut().then(()=>router.replace("/"))}>
          Sign out
        </button>
      </div>

      {/* Project-scoped uploads */}
      <ProjectFileUpload projectId={id} projectOwnerId={project.clientId} />
    </div>
  );
}
