"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Users, Theater, TrendingUp, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mainNavItems = [
  { href: "/markets", label: "Home", icon: Home },
  { href: "/markets?category=tech", label: "Tech", icon: Settings },
  { href: "/markets?category=social", label: "Social", icon: Users },
  { href: "/markets?category=culture", label: "Culture", icon: Theater },
  { href: "/markets?category=trending", label: "Trending", icon: TrendingUp }
];

const myTopics = [
  { id: "crypto", label: "Crypto Markets", color: "bg-green-500" },
  { id: "oscars", label: "Oscars 2024", color: "bg-purple-500" }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-[#1E2329] border border-[#2A2F36] rounded-lg text-white"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-[#2A2F36] bg-[#151921] overflow-y-auto transition-transform z-40",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/markets" &&
                  pathname.startsWith("/markets") &&
                  !pathname.includes("category"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#1E2329] text-white"
                      : "text-[#A0A5B0] hover:bg-[#1E2329] hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* My Topics Section */}
          <div className="mt-8">
            <h3 className="px-4 mb-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              MY TOPICS
            </h3>
            <div className="space-y-2">
              {myTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/markets?topic=${topic.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#A0A5B0] hover:bg-[#1E2329] hover:text-white transition-colors"
                >
                  <div className={cn("w-2 h-2 rounded-full", topic.color)} />
                  <span className="text-sm">{topic.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
