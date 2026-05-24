"use client";

import Link from "next/link";

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M10 4V16M4 10H16"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CreateAssignmentDock() {
  return (
    <div className="create-assignment-dock">
      <Link href="/create" className="create-assignment-dock__button flex items-center justify-center gap-8 leading-none">
        <PlusIcon />
        <span> Create Assignment</span>
      </Link>
    </div>
  );
}
