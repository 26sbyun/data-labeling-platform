"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

type UploadDoc = {
  id?: string;
  fileName: string;
  size: number;
  contentType: string | null;
  storagePath: string;
  downloadURL: string;
  uploadedAt: any;
};

export default function ProjectFileUpload({
  projectId,
  projectOwnerId,
}: {
  projectId: string;
  projectOwnerId: string;
}) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [files, setFiles] = useState<UploadDoc[]>([]);
  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE_MB = 200;

  // 🔄 Live list of this project's files
  useEffect(() => {
    const qy = query(
      collection(db, "projects", projectId, "files"),
      orderBy("uploadedAt", "desc")
    );
    const unsub = onSnapshot(qy, (snap) => {
      setFiles(snap.docs.map((d) => ({ ...(d.data() as UploadDoc), id: d.id })));
    });
    return unsub;
  }, [projectId]);

  // 📂 Open file picker
  const openPicker = () => inputRef.current?.click();

  // 📤 When user picks files
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files; // ✅ correctly typed as FileList | null
    if (!files) return;
    setQueue((q) => [...q, ...Array.from(files)]);
    e.currentTarget.value = ""; // reset so same file can be reselected
  };

  // 🚀 Start upload
  const startUpload = async () => {
    if (!user) return setError("Please sign in to upload.");
    if (user.uid !== projectOwnerId)
      return setError("Only the project owner can upload.");
    setError(null);
    for (const file of queue) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" > ${MAX_SIZE_MB}MB`);
        continue;
      }
      await uploadOne(file);
    }
  };

  // ⬆️ Upload one file to Storage + Firestore
  const uploadOne = async (file: File) => {
    if (!user) return;
    const storagePath = `projects/${user.uid}/${projectId}/files/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, storagePath);
    const task = uploadBytesResumable(fileRef, file, {
      contentType: file.type || undefined,
    });

    task.on(
      "state_changed",
      (s) =>
        setProgress((p) => ({
          ...p,
          [file.name]: Math.round(
            (s.bytesTransferred / s.totalBytes) * 100
          ),
        })),
      (e) => setError(e.message),
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, "projects", projectId, "files"), {
          fileName: file.name,
          size: file.size,
          contentType: file.type || null,
          storagePath,
          downloadURL,
          uploadedAt: serverTimestamp(),
        } as Omit<UploadDoc, "id">);
        setQueue((q) => q.filter((f) => f.name !== file.name));
      }
    );
  };

  // ❌ Delete file
  const removeFile = async (u: UploadDoc) => {
    if (!user || user.uid !== projectOwnerId || !u.id) return;
    await deleteObject(ref(storage, u.storagePath));
    await deleteDoc(doc(db, "projects", projectId, "files", u.id));
  };

  // Helpers for display
  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <section className="space-y-6">
      {/* Upload section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Project files</h3>
          <div className="space-x-2">
            <button
              onClick={openPicker}
              className="border rounded px-3 py-1 hover:bg-gray-50"
            >
              Choose files
            </button>
            <button
              onClick={startUpload}
              className="border rounded px-3 py-1 hover:bg-gray-50"
            >
              Start upload
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onPick}
        />

        {queue.length > 0 && (
          <ul className="space-y-2">
            {queue.map((f) => (
              <li key={f.name} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <span>{progress[f.name] ?? 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-gray-700 rounded"
                    style={{ width: `${progress[f.name] ?? 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* File list */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Files</h3>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No files yet.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between text-sm"
              >
                <a
                  href={u.downloadURL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline truncate"
                >
                  {u.fileName}
                </a>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-gray-500">{fmtSize(u.size)}</span>
                  <a
                    href={u.downloadURL}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded px-2 py-1 hover:bg-gray-50"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => removeFile(u)}
                    className="border rounded px-2 py-1 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </section>
  );
}
