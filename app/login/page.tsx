"use client";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  const [email,setEmail] = useState(""); const [pw,setPw] = useState("");
  const [err,setErr] = useState<string|null>(null);

  useEffect(() => { if (!loading && user) router.replace("/dashboard"); }, [loading, user, router]);

  const onSubmit = async (e:FormEvent) => {
    e.preventDefault(); setErr(null);
    try { await signIn(email, pw); router.replace("/dashboard"); }
    catch (e:any) { setErr(e.message ?? "Login failed"); }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} required/>
        <button className="w-full border rounded p-2 hover:bg-gray-50" type="submit">Sign in</button>
      </form>
      <p className="mt-3 text-sm">
        Don’t have an account?{" "}
        <a href="/register" className="underline text-blue-400">
            Create one
        </a>
      </p>
    </div>
  );
}
