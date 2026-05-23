"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout";
import { api } from "@/lib/api";
import type { Assignment } from "@/types";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="#A9A9A9" strokeWidth="2" />
      <path d="M14 14L17 17" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5H17M6 10H14M8 15H12"
        stroke="#A9A9A9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="4" r="1.5" fill="#5D5D5D" />
      <circle cx="10" cy="10" r="1.5" fill="#5D5D5D" />
      <circle cx="10" cy="16" r="1.5" fill="#5D5D5D" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await api.get("/assignments");
        setAssignments(res.data.assignments || []);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  const filtered = assignments.filter((a) =>
    a.input.topic.toLowerCase().includes(search.toLowerCase())
  );

  const placeholderCards = Array.from({ length: 6 }).map((_, index) => ({
    _id: `placeholder-${index + 1}`,
    title: "Quiz on Electricity",
    assignedOn: "20-06-2025",
    dueOn: "21-06-2025",
  }));

  return (
    <DashboardLayout breadcrumb="Assignment">
      <div className="flex flex-col w-full max-w-[1100px] mx-auto gap-12">
        {/* Header */}
        <div className="flex items-center gap-12 px-8">
          <div className="relative">
            <div className="w-[12px] h-[12px] rounded-full bg-accent-green" />
            <div className="absolute inset-[-4px] rounded-full border-[4px] border-[#4BC16C66]" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-bricolage font-bold text-[20px] leading-[28px] tracking-[-0.8px] text-primary-text">
              Assignments
            </h1>
            <p className="font-bricolage font-normal text-[14px] leading-[20px] tracking-[-0.56px] text-[#5D5D5D8C]">
              Manage and create assignments for your classes.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-36 bg-white rounded-[20px] px-16 h-[64px] max-md:flex-col max-md:h-auto max-md:py-12 max-md:gap-12">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <FilterIcon />
            <span className="font-bricolage font-normal text-[14px] text-[#A9A9A9]">Filter By</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[380px] max-md:max-w-full max-md:w-full">
            <div className="flex items-center gap-12 border border-[#00000033] rounded-[100px] px-16 py-11">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Assignment"
                className="flex-1 bg-transparent font-bricolage text-[14px] text-primary-text placeholder:text-[#A9A9A9] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Assignment Cards */}
        <div className="grid grid-cols-2 gap-16 max-md:grid-cols-1">
          {!loading && filtered.length > 0
            ? filtered.map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))
            : placeholderCards.map((card) => (
                <PlaceholderCard key={card._id} title={card.title} assignedOn={card.assignedOn} dueOn={card.dueOn} />
              ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function PlaceholderCard({
  title,
  assignedOn,
  dueOn,
}: {
  title: string;
  assignedOn: string;
  dueOn: string;
}) {
  return (
    <div className="bg-white rounded-[24px] p-24 h-[162px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <h3 className="font-bricolage font-extrabold text-[24px] leading-[28.8px] tracking-[-0.96px] text-primary-text">
          {title}
        </h3>
        <button className="p-4 hover:bg-surface-secondary rounded-[8px] transition-colors">
          <MoreIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bricolage font-normal text-[16px] leading-[19.2px] tracking-[-0.64px] text-[#0000007F]">
          <strong className="font-bold text-primary-text">Assigned on</strong> : {assignedOn}
        </span>
        <span className="font-bricolage font-normal text-[16px] leading-[19.2px] tracking-[-0.64px] text-[#0000007F]">
          <strong className="font-bold text-primary-text">Due</strong> : {dueOn}
        </span>
      </div>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const formattedDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`;
  };

  const statusColor =
    assignment.status === "completed"
      ? "bg-accent-green"
      : assignment.status === "failed"
      ? "bg-[#FF4040]"
      : "bg-[#FFA009]";

  return (
    <div className="bg-white rounded-[24px] p-24 flex flex-col gap-48 max-md:gap-24 max-md:p-16">
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <div className={`w-[8px] h-[8px] rounded-full ${statusColor}`} />
            <h3 className="font-bricolage font-extrabold text-[24px] leading-[29px] tracking-[-0.96px] text-primary-text">
              {assignment.input.topic}
            </h3>
          </div>
          <div className="flex items-center gap-16 mt-4">
            <span className="font-bricolage font-normal text-[16px] leading-[19px] tracking-[-0.64px] text-[#0000007F]">
              Assigned on : {formattedDate(assignment.createdAt)}
            </span>
            {assignment.input.dueDate && (
              <span className="font-bricolage font-normal text-[16px] leading-[19px] tracking-[-0.64px] text-[#0000007F]">
                Due : {assignment.input.dueDate}
              </span>
            )}
          </div>
        </div>
        <button className="p-4 hover:bg-surface-secondary rounded-[8px] transition-colors">
          <MoreIcon />
        </button>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between">
        <Link
          href={
            assignment.status === "completed"
              ? `/output/${assignment._id}`
              : `/status/${assignment._id}`
          }
          className="flex items-center gap-4 font-bricolage font-medium text-[14px] leading-[20px] tracking-[-0.56px] text-primary-text hover:opacity-70 transition-opacity"
        >
          <span>View Assignment</span>
          <ArrowRightIcon />
        </Link>

        <span className="font-bricolage font-medium text-[12px] text-secondary-text capitalize">
          {assignment.status}
        </span>
      </div>
    </div>
  );
}
