"use client";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { user, loading, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (!loading && user) router.replace("/dashboard"); }, [loading, user, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try { await signUp(email, pw); router.replace("/dashboard"); }
    catch (e: any) { setErr(e.message ?? "Registration failed"); }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" type="email" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
               value={pw} onChange={e=>setPw(e.target.value)} required />
        <button className="w-full border rounded p-2" type="submit">Sign up</button>
      </form>
      <p className="mt-3 text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline text-blue-400">
            Sign in
        </a>
      </p>
    </div>
  );
}
