"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", number: "01" },
  { href: "/admin/posts", label: "Posts", number: "02" },
  { href: "/admin/images", label: "Images", number: "03" }
];

export function AdminShell({
  username,
  children
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-construct-paper">
      <header className="sticky top-0 z-40 border-b-8 border-construct-black bg-construct-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="block h-8 w-8 bg-construct-red" />
            <div>
              <div className="font-display text-xs uppercase tracking-[0.24em] text-construct-yellow">
                Constructivist Admin
              </div>
              <div className="construct-heading text-lg">{username}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="construct-button construct-button-secondary !px-3 !py-2"
            >
              Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="construct-button construct-button-danger !px-3 !py-2"
              disabled={loggingOut}
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8 md:py-10">
        <aside className="hidden w-64 shrink-0 md:block">
          <nav className="construct-card bg-white p-4">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mb-3 flex items-center justify-between border-4 px-4 py-3 font-display text-sm uppercase transition-all last:mb-0 ${
                    active
                      ? "border-construct-black bg-construct-red text-white"
                      : "border-transparent text-construct-black hover:border-construct-black hover:bg-construct-yellow"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-70">{item.number}</span>
                </Link>
              );
            })}
          </nav>

          <div className="construct-card mt-6 bg-construct-black p-5 text-white">
            <div className="font-display text-xs uppercase tracking-[0.2em] text-construct-yellow">
              Notice
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/70">
              Uploaded images are stored locally in storage/uploads and served
              through a protected filename route.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav className="construct-scrollbar mb-6 flex gap-3 overflow-x-auto md:hidden">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap border-4 px-4 py-2 font-display text-xs uppercase ${
                    active
                      ? "border-construct-black bg-construct-red text-white"
                      : "border-construct-black bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </div>
      </div>
    </div>
  );
}
