"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) =>
    setOpenDropdown(openDropdown === label ? null : label);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/industries", label: "Industries" },
    {
      label: "Company",
      sub: [
        { href: "/company/about", label: "About" },
        { href: "/company/team", label: "Team" },
        { href: "/company/careers", label: "Careers" },
      ],
    },
    {
      label: "Resources",
      sub: [
        { href: "/resources/docs", label: "Docs" },
        { href: "/resources/blog", label: "Blog" },
        { href: "/resources/api", label: "API" },
      ],
    },
    { href: "/contact", label: "Contact" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-black/90 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          Data Labeling Platform
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.sub ? (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="flex items-center gap-1 hover:text-blue-400"
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-black border border-gray-700 rounded-lg mt-2 py-2 w-40">
                    {item.sub.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-blue-400"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-300"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 py-3 space-y-2">
          {navItems.map((item) =>
            item.sub ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="flex justify-between w-full text-left text-gray-300"
                >
                  {item.label}
                  <ChevronDown size={14} />
                </button>
                {openDropdown === item.label && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.sub.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block text-gray-400 hover:text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-300 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
