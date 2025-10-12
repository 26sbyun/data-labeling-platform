// app/join/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type Role = "labeler" | "provider";
type Experience = "junior" | "mid" | "senior";

export default function JoinPage() {
  // Role & shared fields
  const [role, setRole] = useState<Role>("labeler");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Labeler-specific fields
  const [skills, setSkills] = useState("");         // freeform summary
  const [exp, setExp] = useState<Experience>("mid");
  const [availability, setAvailability] = useState("10-20 hrs/week");
  const [rate, setRate] = useState<number | "">("");

  // Provider-specific fields
  const [company, setCompany] = useState("");
  const [dataTypes, setDataTypes] = useState<string[]>([]); // images/videos/text
  const [desc, setDesc] = useState(""); // brief dataset/project description

  // Meta
  const [country, setCountry] = useState("");
  const [consent, setConsent] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggleType = (val: string) => {
    setDataTypes((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    );
  };

  const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Basic validation
    if (!name.trim()) return setErr("Please enter your name.");
    if (!validEmail(email)) return setErr("Please enter a valid email.");
    if (!consent) return setErr("Please accept the privacy notice.");

    // Role-specific validation
    if (role === "labeler") {
      if (!skills.trim()) return setErr("Please summarize your skills/experience.");
      if (rate !== "" && (typeof rate !== "number" || rate < 0))
        return setErr("Please provide a valid hourly rate or leave it blank.");
    } else {
      if (!company.trim()) return setErr("Please enter your company or team name.");
      if (dataTypes.length === 0) return setErr("Select at least one data type.");
      if (!desc.trim()) return setErr("Briefly describe your dataset or project.");
    }

    setLoading(true);
    try {
      // Normalize the payload so Admin can read consistently
      const payload: any = {
        role,
        name,
        email,
        country: country || null,
        createdAt: serverTimestamp(),
      };

      if (role === "labeler") {
        payload.skills = skills;
        payload.experience = exp;
        payload.availability = availability;
        payload.hourlyRate = rate === "" ? null : Number(rate);
      } else {
        payload.company = company;
        payload.dataTypes = dataTypes;
        payload.projectDescription = desc;
        // Keep "skills" populated too so the existing Admin page can render gracefully
        payload.skills = `Provider • ${company} • ${dataTypes.join(", ")}`;
      }

      await addDoc(collection(db, "join_requests"), payload);
      setSubmitted(true);

      // reset form (keep role)
      setName("");
      setEmail("");
      setSkills("");
      setExp("mid");
      setAvailability("10-20 hrs/week");
      setRate("");
      setCompany("");
      setDataTypes([]);
      setDesc("");
      setCountry("");
      setConsent(false);
    } catch (e: any) {
      setErr(e.message ?? "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-semibold mb-2">Thanks for joining!</h1>
        <p className="text-gray-300">
          We’ve received your information. Our team will reach out if there’s a fit for current
          projects. In the meantime, feel free to{" "}
          <a className="underline text-blue-400" href="/pricing">check pricing</a> or{" "}
          <a className="underline text-blue-400" href="/contact">contact us</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-semibold">Join Our Network</h1>
      <p className="mt-2 text-gray-300">
        Apply as a <span className="text-blue-400">Labeler</span> or a{" "}
        <span className="text-blue-400">Data Provider</span>. We’ll review and get in touch.
      </p>

      {/* Benefits */}
      <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="font-medium">For Labelers</p>
          <ul className="mt-2 text-gray-300 list-disc pl-5 space-y-1">
            <li>Paid, remote work on vetted AI projects</li>
            <li>Skill-aligned tasks (CV/NLP/multilingual)</li>
            <li>Quality bonuses for top reviewers</li>
          </ul>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="font-medium">For Data Providers</p>
          <ul className="mt-2 text-gray-300 list-disc pl-5 space-y-1">
            <li>Secure storage and scoped access</li>
            <li>Human-in-the-loop QA workflows</li>
            <li>Fast turnarounds with clear SLAs</li>
          </ul>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="mt-6 inline-flex rounded-lg overflow-hidden border border-gray-700">
        <button
          className={`px-4 py-2 ${role === "labeler" ? "bg-blue-600" : "bg-black"}`}
          onClick={() => setRole("labeler")}
          type="button"
        >
          Labeler
        </button>
        <button
          className={`px-4 py-2 ${role === "provider" ? "bg-blue-600" : "bg-black"}`}
          onClick={() => setRole("provider")}
          type="button"
        >
          Data Provider
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {err && <p className="text-red-500">{err}</p>}

        {/* Shared */}
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="border border-gray-700 bg-black text-white rounded p-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border border-gray-700 bg-black text-white rounded p-2"
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="border border-gray-700 bg-black text-white rounded p-2"
            placeholder="Country (optional)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {/* spacer or dynamic field spot */}
          <div />
        </div>

        {/* Role-specific sections */}
        {role === "labeler" ? (
          <>
            <label className="block text-sm text-gray-300">Experience level</label>
            <div className="grid grid-cols-3 gap-2">
              {(["junior", "mid", "senior"] as Experience[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExp(lvl)}
                  className={`rounded border px-3 py-2 text-sm ${
                    exp === lvl ? "border-blue-600 bg-blue-600/20" : "border-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {lvl[0].toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>

            <label className="block text-sm text-gray-300">Availability</label>
            <select
              className="w-full border border-gray-700 bg-black text-white rounded p-2"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option>5-10 hrs/week</option>
              <option>10-20 hrs/week</option>
              <option>20-30 hrs/week</option>
              <option>30+ hrs/week</option>
            </select>

            <label className="block text-sm text-gray-300">Hourly rate (USD)</label>
            <input
              className="w-full border border-gray-700 bg-black text-white rounded p-2"
              type="number"
              min={0}
              placeholder="Optional"
              value={rate}
              onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
            />

            <label className="block text-sm text-gray-300">Skills / tools / domains</label>
            <textarea
              className="w-full border border-gray-700 bg-black text-white rounded p-2"
              rows={4}
              placeholder="e.g., CV (boxes, polygons), NLP (NER, sentiment), tools (CVAT, Label Studio), languages, domain expertise..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <label className="block text-sm text-gray-300">Company / Team</label>
            <input
              className="w-full border border-gray-700 bg-black text-white rounded p-2"
              placeholder="Company or team name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <label className="block text-sm text-gray-300">Data types</label>
            <div className="flex flex-wrap gap-2">
              {["images", "videos", "text"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`rounded border px-3 py-1.5 text-sm ${
                    dataTypes.includes(t) ? "border-blue-600 bg-blue-600/20" : "border-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <label className="block text-sm text-gray-300">Dataset / Project overview</label>
            <textarea
              className="w-full border border-gray-700 bg-black text-white rounded p-2"
              rows={4}
              placeholder="Briefly describe your data, target labels, scope, timing, and any compliance needs."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </>
        )}

        {/* Consent */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I agree to the processing of my information as described in the{" "}
            <a className="underline text-blue-400" href="/privacy">privacy notice</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 rounded p-2 font-semibold text-white"
        >
          {loading ? "Submitting..." : role === "labeler" ? "Apply as Labeler" : "Contact Sales"}
        </button>
      </form>

      {/* Process steps */}
      <div className="mt-10 grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="font-medium">1) Submit</p>
          <p className="text-gray-300 mt-1">Send your details and role. We’ll review quickly.</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="font-medium">2) Review</p>
          <p className="text-gray-300 mt-1">We check fit vs. active projects and timelines.</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
          <p className="font-medium">3) Kickoff</p>
          <p className="text-gray-300 mt-1">We align on scope, access, and QA process.</p>
        </div>
      </div>
    </div>
  );
}
