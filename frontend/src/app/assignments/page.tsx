"use client";

import { CreateAssignmentDock, DashboardLayout } from "@/components/layout";
import { api } from "@/lib/api";
import type { Assignment } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5V17.5M2.5 10H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="#2F2F2F"
        strokeWidth="2"
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

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  };

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
      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col gap-12 pb-[88px] max-md:w-[373px] max-md:gap-10 max-md:pb-0">
        <div className="hidden max-md:flex max-md:h-[48px] max-md:w-[373px] max-md:items-center max-md:justify-between">
          <Link
            href="/"
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[100px] bg-[rgba(255,255,255,0.25)] backdrop-blur-[12px]"
          >
            <ArrowLeftIcon />
          </Link>
          <div className="flex h-[48px] w-[373px] items-center justify-center">
            <h2 className="font-bricolage text-[16px] font-bold leading-[22.4px] tracking-[-0.64px] text-primary-text">
              Assignments
            </h2>
          </div>
        </div>

        {/* Conditionally hide Header and Toolbar if database is completely empty */}
        {(loading || assignments.length > 0) && (
          <>
            {/* Header */}
            <div className="flex items-center gap-12 px-8 max-md:hidden">
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
            <div className="flex h-[64px] items-center gap-36 rounded-[20px] bg-white px-16 max-md:w-[373px] max-md:justify-between max-md:gap-0 max-md:rounded-[16px] max-md:px-[16px]">
              {/* Filter */}
              <div className="flex items-center gap-[4px]">
                <FilterIcon />
                <span className="font-bricolage text-[14px] font-normal leading-[19.6px] tracking-[-0.56px] text-[#A9A9A9]">
                  Filter
                </span>
              </div>

              {/* Search */}
              <div className="w-[340px] max-md:w-[228px] ml-auto">
                <div className="flex h-[44px] w-full items-center gap-[12px] rounded-[100px] border border-[rgba(0,0,0,0.2)] px-[16px] py-[11px]">
                  <SearchIcon />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Name"
                    className="flex-1 bg-transparent font-bricolage text-[14px] font-normal leading-[19.6px] tracking-[-0.56px] text-primary-text placeholder:text-[#A9A9A9] outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Content area */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="font-bricolage text-[16px] text-[#A9A9A9]">Loading assignments...</span>
          </div>
        ) : assignments.length === 0 ? (
          <section className="flex flex-col items-center justify-center flex-1 min-h-[60vh]">
            <div className="flex flex-col items-center max-w-[520px] text-center gap-6">
              <Image
                src="/noassignment.png"
                alt="No assignments yet"
                width={340}
                height={340}
                priority
                className="mb-2"
              />
              <div className="flex flex-col gap-3">
                <h2 className="font-bricolage font-bold text-[22px] leading-[28px] tracking-[-0.88px] text-[#2F2F2F]">
                  No assignments yet
                </h2>
                <p className="font-bricolage font-normal text-[15px] leading-[22px] tracking-[-0.6px] text-[#A9A9A9] max-w-[460px] mx-auto">
                  Create your first assignment to start collecting and grading
                  student submissions. You can set up rubrics, define marking
                  criteria, and let AI assist with grading.
                </p>
              </div>
              <Link
                href="/create"
                className="mt-2 flex items-center justify-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#2F2F2F] transition-colors rounded-[100px]"
              >
                <PlusIcon />
                <span className="font-inter font-medium text-[15px] text-white">
                  Create Your First Assignment
                </span>
              </Link>
            </div>
          </section>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-16 max-md:grid-cols-1">
            {filtered.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-24">
            <span className="font-bricolage text-[16px] text-[#A9A9A9]">No assignments match your search.</span>
          </div>
        )}

        {/* Conditionally hide the floating dock button in empty state */}
        {(!loading && assignments.length > 0) && <CreateAssignmentDock />}
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

function AssignmentCard({ assignment, onDelete }: { assignment: Assignment; onDelete: (id: string) => void }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const formattedDate = (dateStr: string) => {
    if (!dateStr) return "—";

    const d = new Date(dateStr);

    return `${d
      .getDate()
      .toString()
      .padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleCardClick = () => {
    const targetUrl = assignment.status === "completed"
      ? `/output/${assignment._id}`
      : `/status/${assignment._id}`;
    router.push(targetUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        rounded-[24px]
        border border-white/45
        bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.52))]
        backdrop-blur-[14px]
        supports-[backdrop-filter]:bg-[linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0.45))]

        h-[150px]

        p-24

        flex flex-col justify-between

        max-md:h-[110px]
        max-md:p-16

        transition-all duration-200
        hover:-translate-y-[2px]
        hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]

        active:scale-[0.99]

        cursor-pointer
      "
    >
      {/* Top Section */}
      <div className="flex items-start justify-between gap-16">
        <h3 className="font-bricolage font-extrabold text-[20px] leading-[29px] tracking-[-0.96px] text-primary-text">
          {assignment.input.topic}
        </h3>

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-4 rounded-[8px] shrink-0 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <MoreIcon />
          </div>

          {showDropdown && (
            <div 
              className="absolute top-[120%] right-0 bg-white rounded-[16px] p-[8px] z-20 flex flex-col gap-2 min-w-[180px]"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)" }}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCardClick();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-12 py-10 font-bricolage font-medium text-[14px] text-primary-text hover:bg-black/5 rounded-[10px] transition-colors"
              >
                View Assignment
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(assignment._id);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-12 py-10 font-bricolage font-medium text-[14px] text-[#DC2626] hover:bg-[#F0F0F0] rounded-[10px] transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between gap-32">
        {/* Assigned Date */}
        <div className="flex items-center gap-4 whitespace-nowrap min-w-0">
          <span className="font-bricolage font-semibold text-[16px] leading-[20px] tracking-[-0.64px] text-primary-text">
            Assigned on :
          </span>

          <span className="font-bricolage font-normal text-[16px] leading-[20px] tracking-[-0.64px] text-[#0000007F]">
            {formattedDate(assignment.createdAt)}
          </span>
        </div>

        {/* Due Date */}
        {assignment.input.dueDate && (
          <div className="flex items-center gap-4 whitespace-nowrap shrink-0">
            <span className="font-bricolage font-semibold text-[16px] leading-[20px] tracking-[-0.64px] text-primary-text">
              Due :
            </span>

            <span className="font-bricolage font-normal text-[16px] leading-[20px] tracking-[-0.64px] text-[#0000007F]">
              {assignment.input.dueDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
