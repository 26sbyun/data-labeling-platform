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
  description?: string;
  clientId: string;
  createdAt?: any;
};

type FileDoc = {
  id?: string;
  fileName: string;
  size: number;
  contentType: string | null;
  storagePath: string;
  downloadURL: string;
  uploadedAt?: any;
  projectId?: string; // we’ll attach when aggregating
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [recentUploads, setRecentUploads] = useState<FileDoc[]>([]);
  const [lastUploadAt, setLastUploadAt] = useState<Date | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // redirect handled by middleware or individual pages if you have it
      // or keep them here to show friendly msg
    }
  }, [loading, user]);

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

        // 2) For each project: count files and fetch latest 1 for Recent Activity
        //    We’ll aggregate totals and pick latest across all projects
        let totalFilesAcc = 0;
        const recentCandidates: FileDoc[] = [];

        await Promise.all(
          plist.map(async (p) => {
            // count
            const cnt = await getCountFromServer(collection(db, "projects", p.id, "files"));
            totalFilesAcc += cnt.data().count;

            // latest upload (if any)
            const fq = query(
              collection(db, "projects", p.id, "files"),
              orderBy("uploadedAt", "desc"),
              limit(1)
            );
            const fSnap = await getDocs(fq);
            fSnap.forEach((fd) => {
              const data = fd.data() as FileDoc;
              recentCandidates.push({ ...data, id: fd.id, projectId: p.id });
            });
          })
        );

        setTotalFiles(totalFilesAcc);

        // 3) Build Recent Activity (up to 8 newest across projects)
        recentCandidates.sort((a, b) => {
          const at = a.uploadedAt?.seconds ?? 0;
          const bt = b.uploadedAt?.seconds ?? 0;
          return bt - at;
        });
        const topRecent = recentCandidates.slice(0, 8);
        setRecentUploads(topRecent);

        // last upload time (from the very newest)
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

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/projects" className="border border-gray-700 rounded px-3 py-1 hover:bg-gray-900">
            View Projects
          </Link>
        </div>
      </div>

      {err && <p className="text-red-500 mt-3">{err}</p>}

      {/* Overview cards */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
          <div className="text-sm text-gray-400">Projects</div>
          <div className="text-3xl font-semibold mt-1">{projects.length}</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
          <div className="text-sm text-gray-400">Total files</div>
          <div className="text-3xl font-semibold mt-1">
            {totalFiles.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
          <div className="text-sm text-gray-400">Last upload</div>
          <div className="text-lg font-medium mt-1">{lastUploadText}</div>
        </div>
      </section>

      {!busy && projects.length === 0 && totalFiles === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-700 bg-black/30 p-5">
          <p className="text-gray-300">
            Welcome! Create your first project to start uploading data.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Projects keep files scoped and secure per your account.
          </p>
        </div>
      )}

      {/* Quick create */}
      <section className="mt-8">
        <NewProjectForm />
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
          <p className="text-gray-400 text-sm">No projects yet. Create one above.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <li key={p.id} className="rounded-xl border border-gray-800 bg-black/40 p-4">
                <div className="font-medium truncate">{p.title}</div>
                {p.description && (
                  <div className="text-sm text-gray-400 mt-1 line-clamp-2">{p.description}</div>
                )}
                <div className="mt-3">
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="underline text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Open project →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes && bytes !== 0) return "—";
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
