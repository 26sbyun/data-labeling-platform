// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
  limit,
  getCountFromServer,
} from "firebase/firestore";
import NewProjectForm from "@/components/dashboard/NewProjectForm";

type Project = {
  id: string;
  title: string;
  description?: string | null;
  clientId: string;
  createdAt?: any;
  targetFiles?: number; // optional for progress
};

type FileDoc = {
  id?: string;
  fileName: string;
  size: number;
  contentType: string | null;
  storagePath: string;
  downloadURL: string;
  uploadedAt?: any;
  projectId?: string; // attached during aggregation
};

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [storageUsed, setStorageUsed] = useState<number>(0); // bytes
  const [recentUploads, setRecentUploads] = useState<FileDoc[]>([]);
  const [lastUploadAt, setLastUploadAt] = useState<Date | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setBusy(true);
      setErr(null);
      try {
        // 1) Load all projects for this user
        const pq = query(
          collection(db, "projects"),
          where("clientId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const pSnap = await getDocs(pq);
        const plist: Project[] = pSnap.docs.map((d) => ({
          ...(d.data() as Project),
          id: d.id,
        }));
        setProjects(plist);

        // 2) For each project: count files, sum storage, get latest
        let totalFilesAcc = 0;
        let storageAcc = 0;
        const recentCandidates: FileDoc[] = [];

        await Promise.all(
          plist.map(async (p) => {
            // count via aggregation (fast)
            const cntSnap = await getCountFromServer(
              collection(db, "projects", p.id, "files")
            );
            const count = cntSnap.data().count;
            totalFilesAcc += count;

            // Latest uploads (take top 3 per project for a richer recent feed)
            const fq = query(
              collection(db, "projects", p.id, "files"),
              orderBy("uploadedAt", "desc"),
              limit(3)
            );
            const fSnap = await getDocs(fq);
            fSnap.forEach((fd) => {
              const data = fd.data() as FileDoc;
              storageAcc += Number(data.size || 0);
              recentCandidates.push({
                ...data,
                id: fd.id,
                projectId: p.id,
              });
            });
          })
        );

        setTotalFiles(totalFilesAcc);
        setStorageUsed(storageAcc);

        // 3) Build Recent Activity (up to 12 newest globally)
        recentCandidates.sort((a, b) => {
          const at = a.uploadedAt?.seconds ?? 0;
          const bt = b.uploadedAt?.seconds ?? 0;
          return bt - at;
        });
        const topRecent = recentCandidates.slice(0, 12);
        setRecentUploads(topRecent);

        // last upload time
        if (topRecent.length > 0) {
          const d =
            topRecent[0].uploadedAt?.toDate?.() ??
            (topRecent[0].uploadedAt instanceof Timestamp
              ? (topRecent[0].uploadedAt as Timestamp).toDate()
              : null);
          setLastUploadAt(d);
        } else {
          setLastUploadAt(null);
        }
      } catch (e: any) {
        setErr(e.message ?? "Failed to load dashboard");
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  const lastUploadText = useMemo(() => {
    if (!lastUploadAt) return "—";
    return lastUploadAt.toLocaleString();
  }, [lastUploadAt]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }
  if (!user) {
    return <div className="p-6 text-gray-400">Please log in.</div>;
  }

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="border border-gray-700 rounded px-3 py-1 hover:bg-gray-900"
          >
            View Projects
          </Link>
        </div>
      </div>

      {err && <p className="text-red-500 mt-3">{err}</p>}

      {/* Overview cards */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Projects" value={projects.length.toString()} />
        <StatCard label="Total files" value={totalFiles.toLocaleString()} />
        <StatCard label="Storage used" value={formatBytes(storageUsed)} />
        <StatCard label="Last upload" value={lastUploadText} />
      </section>

      {/* Quick actions */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
          <h3 className="font-semibold">Start new project</h3>
          <p className="text-sm text-gray-400 mt-1">
            Create a scoped space for files, guidelines, and progress.
          </p>
          <div className="mt-3">
            <NewProjectForm />
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
          <h3 className="font-semibold">Upload to a project</h3>
          <p className="text-sm text-gray-400 mt-1">
            Jump to a project and add files securely.
          </p>
          <div className="mt-3">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {projects.slice(0, 6).map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className="border border-gray-700 rounded px-3 py-1 hover:bg-gray-900 text-sm"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
          <h3 className="font-semibold">Need help?</h3>
          <p className="text-sm text-gray-400 mt-1">
            Have questions about scope, QA, or timelines?
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-2 text-sm font-medium"
            >
              Contact support
            </Link>
            <Link
              href="/pricing"
              className="border border-gray-700 hover:bg-gray-900 rounded px-3 py-2 text-sm"
            >
              Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Recent activity</h2>
        {busy && <p className="text-gray-400">Loading…</p>}
        {!busy && recentUploads.length === 0 && (
          <p className="text-gray-400 text-sm">No uploads yet.</p>
        )}
        {!busy && recentUploads.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="min-w-full text-sm">
              <thead className="bg-black/40 text-gray-300">
                <tr>
                  <th className="text-left px-4 py-2 border-b border-gray-800">File</th>
                  <th className="text-left px-4 py-2 border-b border-gray-800">Project</th>
                  <th className="text-left px-4 py-2 border-b border-gray-800">Type</th>
                  <th className="text-left px-4 py-2 border-b border-gray-800">Size</th>
                  <th className="text-left px-4 py-2 border-b border-gray-800">Uploaded</th>
                  <th className="text-left px-4 py-2 border-b border-gray-800">Open</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((u) => {
                  const proj = projects.find((p) => p.id === u.projectId);
                  const when =
                    u.uploadedAt?.toDate?.() ??
                    (u.uploadedAt instanceof Timestamp
                      ? (u.uploadedAt as any).toDate()
                      : null);
                  return (
                    <tr key={u.id} className="odd:bg-black/20">
                      <td className="px-4 py-2">{u.fileName}</td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/dashboard/projects/${u.projectId}`}
                          className="underline text-blue-400 hover:text-blue-300"
                        >
                          {proj?.title ?? u.projectId}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {u.contentType ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {formatBytes(u.size)}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {when ? when.toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={u.downloadURL}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-gray-700 rounded px-2 py-1 hover:bg-gray-900"
                        >
                          Open
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Your projects */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Your projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No projects yet. Create one above.
          </p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  // light client-side count fetch per project (optional visual)
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getCountFromServer(
          collection(db, "projects", project.id, "files")
        );
        setCount(snap.data().count);
      } catch {
        setCount(null);
      }
    })();
  }, [project.id]);

  const target = project.targetFiles;
  const pct =
    target && count != null && target > 0
      ? Math.min(100, Math.round((count / target) * 100))
      : null;

  return (
    <li className="rounded-xl border border-gray-800 bg-black/40 p-4">
      <div className="font-medium truncate">{project.title}</div>
      {project.description && (
        <div className="text-sm text-gray-400 mt-1 line-clamp-2">
          {project.description}
        </div>
      )}

      <div className="text-sm text-gray-400 mt-3">
        Files:{" "}
        <span className="text-gray-200">
          {count == null ? "…" : count.toLocaleString()}
        </span>
        {target ? (
          <>
            {" "}
            / <span className="text-gray-200">{target.toLocaleString()}</span>
          </>
        ) : null}
      </div>

      {pct != null && (
        <div className="mt-2">
          <div className="h-2 bg-gray-800 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${pct}%` }}
              aria-label={`Progress ${pct}%`}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">{pct}% complete</div>
        </div>
      )}

      <div className="mt-3">
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="underline text-blue-400 hover:text-blue-300 text-sm"
        >
          Open project →
        </Link>
      </div>
    </li>
  );
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "—";
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) return bytes + " B";
  const units = ["KB", "MB", "GB", "TB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(2)} ${units[u]}`;
}
