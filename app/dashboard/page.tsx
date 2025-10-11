"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "@/components/dashboard/FileUpload";
import Link from "next/link";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
            href="/dashboard/projects"
            className="inline-block border rounded px-4 py-2 mt-4 hover:bg-gray-50"
            >
            View Projects
        </Link>

        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button className="border rounded px-3 py-1" onClick={() => signOut().then(() => router.replace("/"))}>
          Sign out
        </button>
      </div>

      <FileUpload />
    </div>
  );
}
