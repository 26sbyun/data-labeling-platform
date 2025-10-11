"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // lightweight icons

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
    { href: "/join", label: "Join" },
    { href: "/admin", label: "Admin" },
    ];

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <header className="bg-black/90 backdrop-blur text-white sticky top-0 z-50 shadow-sm border-b border-gray-800">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="font-semibold text-lg text-white hover:text-gray-300">
          Data Labeling Platform
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-gray-300 ${
                pathname === href ? "font-medium text-blue-400" : "text-gray-200"
              }`}
            >
              {label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/login"
                className="border border-gray-600 rounded px-3 py-1 hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-gray-600 rounded px-3 py-1 hover:bg-gray-800"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-gray-600 rounded px-3 py-1 hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-200 hover:text-gray-100"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 py-3 space-y-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block py-2 hover:text-gray-300 ${
                pathname === href ? "text-blue-400 font-medium" : "text-gray-200"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link
                href="/login"
                className="block border border-gray-600 rounded px-3 py-1 text-center hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block border border-gray-600 rounded px-3 py-1 text-center hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full border border-gray-600 rounded px-3 py-1 hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}