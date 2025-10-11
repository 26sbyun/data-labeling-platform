"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import type { UploadDoc } from "@/lib/types";

export default function FileUpload() {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadDoc[]>([]);

  const MAX_SIZE_MB = 100;

  // Live list of my uploads (requires composite index ownerId+uploadedAt desc)
  useEffect(() => {
    if (!user) return;
    const qy = query(
      collection(db, "uploads"),
      where("ownerId", "==", user.uid),
      orderBy("uploadedAt", "desc")
    );
    const unsub = onSnapshot(qy, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as UploadDoc) }));
      setUploads(items);
    });
    return unsub;
  }, [user]);

  const openPicker = () => inputRef.current?.click();

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const vetted = files.filter((f) => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${f.name}" > ${MAX_SIZE_MB}MB`);
        return false;
      }
      return true;
    });
    setQueue((prev) => [...prev, ...vetted]);
    e.target.value = "";
  };

  const startUpload = async () => {
    if (!user) return setError("Please sign in to upload.");
    setError(null);
    for (const file of queue) {
      await uploadOne(file, user.uid);
    }
  };

  const uploadOne = async (file: File, uid: string) => {
    const storagePath = `users/${uid}/uploads/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, storagePath);
    const task = uploadBytesResumable(fileRef, file, {
      contentType: file.type || undefined,
    });

    task.on(
      "state_changed",
      (s) => {
        const pct = Math.round((s.bytesTransferred / s.totalBytes) * 100);
        setProgress((p) => ({ ...p, [file.name]: pct }));
      },
      (err) => setError(err.message),
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, "uploads"), {
          ownerId: uid,
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

  const removeUpload = async (u: UploadDoc) => {
    try {
      if (!u.id) return;
      // 1) delete file from Storage
      await deleteObject(ref(storage, u.storagePath));
      // 2) delete metadata doc from Firestore
      await deleteDoc(doc(db, "uploads", u.id));
    } catch (e: any) {
      setError(e.message ?? "Failed to delete file");
    }
  };

  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const fmtWhen = (ts: any) => {
    if (!ts?.seconds) return "pending…";
    return new Date(ts.seconds * 1000).toLocaleString();
    // you can localize further if you want
  };

  return (
    <section className="space-y-6">
      {/* Picker */}
      <div className="border-2 border-dashed rounded-xl p-6 text-center">
        <p className="mb-2 font-medium">Drag & drop or select files</p>
        <button
          type="button"
          onClick={openPicker}
          className="border rounded px-3 py-1 hover:bg-gray-50"
        >
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onPick}
        />
        <p className="mt-3 text-xs text-gray-500">
          Max {MAX_SIZE_MB} MB per file.
        </p>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Upload queue</h3>
            <button
              onClick={startUpload}
              className="border rounded px-3 py-1 hover:bg-gray-50"
            >
              Start upload
            </button>
          </div>
          <ul className="space-y-2">
            {queue.map((file) => (
              <li key={file.name} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate">{file.name}</span>
                  <span>{progress[file.name] ?? 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-gray-700 rounded"
                    style={{ width: `${progress[file.name] ?? 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded files */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Your uploads</h3>
        {uploads.length === 0 ? (
          <p className="text-sm text-gray-500">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {uploads.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-3 justify-between border rounded p-2"
              >
                {/* Left: thumbnail + meta */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail preview for images */}
                  {u.contentType?.startsWith("image/") ? (
                    <img
                      src={u.downloadURL}
                      alt={u.fileName}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200 grid place-items-center text-xs">
                      {u.contentType?.split("/")[1] ?? "file"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <a
                      href={u.downloadURL}
                      target="_blank"
                      rel="noreferrer"
                      className="underline block truncate"
                      title={u.fileName}
                    >
                      {u.fileName}
                    </a>
                    <div className="text-xs text-gray-500">
                      {fmtSize(u.size)} • {u.contentType ?? "unknown"} • {fmtWhen(u.uploadedAt)}
                    </div>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={u.downloadURL}
                    target="_blank"
                    rel="noreferrer"
                    className="border rounded px-2 py-1 text-sm hover:bg-gray-50"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => removeUpload(u)}
                    className="border rounded px-2 py-1 text-sm hover:bg-gray-50"
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
