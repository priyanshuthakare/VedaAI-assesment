"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function AssignmentsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="11" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 10H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ToolkitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 4.5C3 3.67157 3.67157 3 4.5 3H8C9.10457 3 10 3.89543 10 5V16.5C10 15.6716 9.32843 15 8.5 15H4.5C3.67157 15 3 15.6716 3 16.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17 4.5C17 3.67157 16.3284 3 15.5 3H12C10.8954 3 10 3.89543 10 5V16.5C10 15.6716 10.6716 15 11.5 15H15.5C16.3284 15 17 15.6716 17 16.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CreateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const navItems = [
  { label: "Home", href: "/", icon: <HomeIcon /> },
  { label: "Assignments", href: "/assignments", icon: <AssignmentsIcon /> },
  { label: "Library", href: "/library", icon: <CreateIcon /> },
  { label: "AI Toolkit", href: "/toolkit", icon: <ToolkitIcon /> },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return false;
    if (href === "/assignments") return pathname === "/" || pathname.startsWith(href);
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="mobile-nav-blur" aria-hidden="true" />
      <Link href="/create" className="mobile-create-button" aria-label="Create assignment">
        <CreateIcon />
      </Link>
      <nav className="mobile-dock">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={active ? "mobile-dock__item mobile-dock__item--active" : "mobile-dock__item"}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mobile-home-indicator" />
    </>
  );
}
