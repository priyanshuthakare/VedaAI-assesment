"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "My Groups", href: "/groups", icon: "groups" },
  { label: "Assignments", href: "/assignments", icon: "assignments" },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: "book" },
  { label: "My Library", href: "/library", icon: "library" },
];

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

function GroupsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7 9C8.65685 9 10 7.65685 10 6C10 4.34315 8.65685 3 7 3C5.34315 3 4 4.34315 4 6C4 7.65685 5.34315 9 7 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2 17C2 14.2386 4.23858 12 7 12C9.76142 12 12 14.2386 12 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 9C14.6569 9 16 7.65685 16 6C16 4.34315 14.6569 3 13 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 12C16.7614 12 19 14.2386 19 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
      <rect x="12" y="4" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BookIcon() {
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

function LibraryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="shrink-0"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CreateAssignmentIcon() {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" aria-hidden="true">
      <path
        d="M9 0.8L10.6 6.1L16 8.5L10.6 10.9L9 16.2L7.4 10.9L2 8.5L7.4 6.1L9 0.8Z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="white"
      />
      <path
        d="M14.4 1.8L14.9 3.4L16.5 3.9L14.9 4.4L14.4 6L13.9 4.4L12.3 3.9L13.9 3.4L14.4 1.8Z"
        fill="white"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getIcon(icon: string) {
  switch (icon) {
    case "home":
      return <HomeIcon />;
    case "groups":
      return <GroupsIcon />;
    case "assignments":
      return <AssignmentsIcon />;
    case "book":
      return <BookIcon />;
    case "library":
      return <LibraryIcon />;
    default:
      return <HomeIcon />;
  }
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/assignments") return pathname.startsWith("/assignments") || pathname.startsWith("/status") || pathname.startsWith("/output") || pathname.startsWith("/create");
    return pathname === href;
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="flex items-center gap-8">
        <div className="dashboard-sidebar__logo-mark">
          <Image src="/logo11.png" alt="VedaAI logo" width={50} height={50} priority />
        </div>
        <span className="font-bricolage font-bold text-[28px] leading-[20px] tracking-[-1.68px] text-primary-text">
          VedaAI
        </span>
      </div>

    {/* Create Assignment Button */}
<div className="mt-32">
  <Link
    href="/create"
    className="inline-flex items-center justify-center gap-2 px-14 py-3 bg-[#1a1a1a] border-2 border-[#ff6b35] rounded-full font-inter font-medium text-[16px] leading-[28px] tracking-[-0.64px] text-white whitespace-nowrap transition-all duration-300 hover:bg-[#242424] hover:border-[#ff8855] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
    style={{
      boxShadow:
        "0px 8px 24px rgba(255,107,53,0.12), inset 0px 1px 2px rgba(255,255,255,0.08), inset 0px 0px 12px rgba(255,107,53,0.08), 0px 4px 12px rgba(0,0,0,0.3)",
    }}
  >
    <CreateAssignmentIcon />
    <span>Create Assignment</span>
  </Link>
</div>

      <nav className="mt-56 flex flex-col gap-8">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-8 px-12 py-9 rounded-[8px] transition-colors ${
                active
                  ? "bg-surface-muted text-primary-text"
                  : "text-secondary-text hover:bg-surface-secondary"
              }`}
            >
              <span className={active ? "text-primary-text" : "text-secondary-text"}>
                {getIcon(item.icon)}
              </span>
              <span
                className={`font-bricolage text-[16px] leading-[22px] tracking-[-0.64px] ${
                  active ? "font-semibold text-primary-text" : "font-normal text-secondary-text"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-8">
        <Link
          href="/settings"
          className="flex items-center gap-8 px-12 py-8 text-secondary-text hover:bg-surface-secondary rounded-[8px] transition-colors"
        >
          <SettingsIcon />
          <span className="font-bricolage text-[16px] leading-none tracking-[-0.64px]">
            Settings
          </span>
        </Link>

        <section className="dashboard-sidebar__school-profile" aria-label="School profile">
          <div className="dashboard-sidebar__school-row">
            <div className="dashboard-sidebar__school-avatar-shell">
              <Image
                className="dashboard-sidebar__school-avatar"
                src="/delhi-avatar.png"
                alt="Delhi Public School"
                width={44}
                height={44}
              />
            </div>
            <div className="dashboard-sidebar__school-copy">
              <p className="dashboard-sidebar__school-name">Delhi Public School</p>
              <p className="dashboard-sidebar__school-location">Bokaro Steel City</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
