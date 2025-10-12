"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: any;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  skills: string;
  createdAt?: any;
}

type ViewTab = "contacts" | "join_requests";
type SortDir = "desc" | "asc";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [joins, setJoins] = useState<JoinRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // UI state
  const [tab, setTab] = useState<ViewTab>("contacts");
  const [qText, setQText] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [fromDate, setFromDate] = useState<string>(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState<string>("");     // yyyy-mm-dd

  const fetchData = async () => {
    try {
      const contactSnap = await getDocs(
        query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      );
      const joinSnap = await getDocs(
        query(collection(db, "join_requests"), orderBy("createdAt", "desc"))
      );
      setContacts(
        contactSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Contact[]
      );
      setJoins(
        joinSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as JoinRequest[]
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
    }
  };

  useEffect(() => {
    if (user && user.uid === ADMIN_UID) fetchData();
  }, [user, ADMIN_UID]);

  const handleDelete = async (type: ViewTab, id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteDoc(doc(db, type, id));
      await fetchData();
    } catch (e: any) {
      alert(e.message ?? "Delete failed");
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    setDownloading(true);
    const headers = Object.keys(data[0]);
    const rows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => JSON.stringify(row[h] ?? "").replace(/"/g, '""'))
          .join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setDownloading(false);
  };

  // helpers
  const norm = (s: any) => String(s ?? "").toLowerCase();
  const toJsDate = (ts: any): Date | null =>
    ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : null;
  const inDateRange = (ts: any) => {
    const d = toJsDate(ts);
    if (!d) return true;
    if (fromDate) {
      const from = new Date(fromDate + "T00:00:00");
      if (d < from) return false;
    }
    if (toDate) {
      const to = new Date(toDate + "T23:59:59.999");
      if (d > to) return false;
    }
    return true;
  };
  const when = (ts: any) => {
    const d = toJsDate(ts);
    return d ? d.toLocaleString() : "Just now";
  };

  // filtering/sorting
  const filteredContacts = useMemo(() => {
    const needle = norm(qText);
    const base = contacts.filter(
      (c) =>
        inDateRange(c.createdAt) &&
        (norm(c.name).includes(needle) ||
          norm(c.email).includes(needle) ||
          norm(c.message).includes(needle))
    );
    base.sort((a, b) => {
      const at = toJsDate(a.createdAt)?.getTime() ?? 0;
      const bt = toJsDate(b.createdAt)?.getTime() ?? 0;
      return sortDir === "desc" ? bt - at : at - bt;
    });
    return base;
  }, [contacts, qText, sortDir, fromDate, toDate]);

  const filteredJoins = useMemo(() => {
    const needle = norm(qText);
    const base = joins.filter(
      (j) =>
        inDateRange(j.createdAt) &&
        (norm(j.name).includes(needle) ||
          norm(j.email).includes(needle) ||
          norm(j.skills).includes(needle))
    );
    base.sort((a, b) => {
      const at = toJsDate(a.createdAt)?.getTime() ?? 0;
      const bt = toJsDate(b.createdAt)?.getTime() ?? 0;
      return sortDir === "desc" ? bt - at : at - bt;
    });
    return base;
  }, [joins, qText, sortDir, fromDate, toDate]);

  // bulk copy emails (filtered)
  const copyEmails = async (rows: { email: string }[]) => {
    const unique = Array.from(new Set(rows.map((r) => r.email).filter(Boolean)));
    await navigator.clipboard.writeText(unique.join(", "));
    alert(`Copied ${unique.length} email(s) to clipboard`);
  };

  if (loading) return <p className="text-center text-gray-400 p-10">Loading...</p>;
  if (!user) return <p className="text-center text-gray-400 p-10">Please log in.</p>;
  if (user.uid !== ADMIN_UID)
    return <p className="text-center text-red-500 p-10">Access denied.</p>;

  const activeData =
    tab === "contacts" ? filteredContacts : filteredJoins;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Tabs */}
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-700">
          <button
            className={`px-4 py-2 ${tab === "contacts" ? "bg-blue-600" : "bg-black"} `}
            onClick={() => setTab("contacts")}
          >
            Contacts
          </button>
          <button
            className={`px-4 py-2 ${tab === "join_requests" ? "bg-blue-600" : "bg-black"} `}
            onClick={() => setTab("join_requests")}
          >
            Join Requests
          </button>
        </div>

        {/* Search + Date range + Sort + Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Search name, email, message/skills…"
            className="w-64 max-w-full border border-gray-700 bg-black text-white rounded px-3 py-2"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-700 bg-black text-white rounded px-3 py-2"
            title="From date"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-700 bg-black text-white rounded px-3 py-2"
            title="To date"
          />
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="border border-gray-700 rounded px-3 py-2 hover:bg-gray-800"
            title="Toggle sort"
          >
            Sort: {sortDir === "desc" ? "Newest" : "Oldest"}
          </button>

          {activeData.length > 0 && (
            <>
              <button
                onClick={() =>
                  exportToCSV(
                    activeData,
                    tab === "contacts" ? "contacts.csv" : "join_requests.csv"
                  )
                }
                disabled={downloading}
                className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-2"
              >
                {downloading ? "Exporting…" : "Export CSV"}
              </button>
              <button
                onClick={() => copyEmails(activeData as any[])}
                className="border border-gray-700 rounded px-3 py-2 hover:bg-gray-800"
                title="Copy all filtered emails"
              >
                Copy Emails
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lists */}
      {tab === "contacts" ? (
        <section>
          {filteredContacts.length === 0 ? (
            <p className="text-gray-400">No contacts found.</p>
          ) : (
            <ul className="space-y-3">
              {filteredContacts.map((c) => (
                <li
                  key={c.id}
                  className="border border-gray-700 rounded-lg p-4 bg-black/40"
                >
                  <div className="flex justify-between gap-6">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {c.name}
                        <button
                          onClick={() => navigator.clipboard.writeText(c.email)}
                          className="ml-3 text-xs text-blue-400 hover:text-blue-300 underline"
                          title="Copy email"
                        >
                          Copy email
                        </button>
                      </p>
                      <p className="text-gray-400 text-sm truncate">{c.email}</p>
                      <p className="mt-2 text-gray-200 whitespace-pre-wrap break-words">
                        {c.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{when(c.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => handleDelete("contacts", c.id)}
                      className="text-red-400 hover:text-red-300 text-sm shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section>
          {filteredJoins.length === 0 ? (
            <p className="text-gray-400">No join requests found.</p>
          ) : (
            <ul className="space-y-3">
              {filteredJoins.map((j) => (
                // new change
                <li key={j.id} className="border border-gray-700 rounded-lg p-4 bg-black/40">
                  <div className="flex justify-between gap-6">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {j.name} <span className="ml-2 text-xs text-blue-400">[{(j as any).role ?? "join"}]</span>
                      </p>
                      <p className="text-gray-400 text-sm truncate">{j.email}</p>

                      {/* Provider fields */}
                      {(j as any).company && (
                        <p className="text-gray-300 text-sm mt-1">
                          <span className="text-gray-500">Company:</span> {(j as any).company}
                        </p>
                      )}
                      {(j as any).dataTypes && Array.isArray((j as any).dataTypes) && (
                        <p className="text-gray-300 text-sm mt-1">
                          <span className="text-gray-500">Data types:</span> {(j as any).dataTypes.join(", ")}
                        </p>
                      )}

                      {/* Labeler fields */}
                      {(j as any).experience && (
                        <p className="text-gray-300 text-sm mt-1">
                          <span className="text-gray-500">Experience:</span> {(j as any).experience}
                        </p>
                      )}
                      {(j as any).availability && (
                        <p className="text-gray-300 text-sm mt-1">
                          <span className="text-gray-500">Availability:</span> {(j as any).availability}
                        </p>
                      )}
                      {(j as any).hourlyRate != null && (
                        <p className="text-gray-300 text-sm mt-1">
                          <span className="text-gray-500">Rate:</span> ${(j as any).hourlyRate}/hr
                        </p>
                      )}

                      {/* Common freeform */}
                      {j.skills && (
                        <p className="mt-2 text-gray-200 whitespace-pre-wrap break-words">{j.skills}</p>
                      )}
                      {(j as any).projectDescription && (
                        <p className="mt-2 text-gray-200 whitespace-pre-wrap break-words">
                          {(j as any).projectDescription}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        {j.createdAt?.toDate ? j.createdAt.toDate().toLocaleString() : "Just now"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete("join_requests", j.id)}
                      className="text-red-400 hover:text-red-300 text-sm shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                </li>
                // <li
                //   key={j.id}
                //   className="border border-gray-700 rounded-lg p-4 bg-black/40"
                // >
                //   <div className="flex justify-between gap-6">
                //     <div className="min-w-0">
                //       <p className="font-semibold truncate">
                //         {j.name}
                //         <button
                //           onClick={() => navigator.clipboard.writeText(j.email)}
                //           className="ml-3 text-xs text-blue-400 hover:text-blue-300 underline"
                //           title="Copy email"
                //         >
                //           Copy email
                //         </button>
                //       </p>
                //       <p className="text-gray-400 text-sm truncate">{j.email}</p>
                //       <p className="mt-2 text-gray-200 whitespace-pre-wrap break-words">
                //         {j.skills}
                //       </p>
                //       <p className="text-xs text-gray-500 mt-1">{when(j.createdAt)}</p>
                //     </div>
                //     <button
                //       onClick={() => handleDelete("join_requests", j.id)}
                //       className="text-red-400 hover:text-red-300 text-sm shrink-0"
                //     >
                //       Delete
                //     </button>
                //   </div>
                // </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
