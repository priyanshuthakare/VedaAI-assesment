"use client";

import Image from "next/image";
import Link from "next/link";

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

function BreadcrumbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1" stroke="#A9A9A9" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1" stroke="#A9A9A9" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1" stroke="#A9A9A9" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1" stroke="#A9A9A9" strokeWidth="1.5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L11.9 8.1L18 10L11.9 11.9L10 18L8.1 11.9L2 10L8.1 8.1L10 2Z" fill="#A9A9A9" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2C7.23858 2 5 4.23858 5 7V10.5858L3.29289 12.2929C3.00623 12.5796 2.92137 13.009 3.07612 13.3827C3.23088 13.7564 3.59554 14 4 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0786 13.009 16.9938 12.5796 16.7071 12.2929L15 10.5858V7C15 4.23858 12.7614 2 10 2Z"
        stroke="#2F2F2F"
        strokeWidth="1.5"
      />
      <path
        d="M8 14V15C8 16.1046 8.89543 17 10 17C11.1046 17 12 16.1046 12 15V14"
        stroke="#2F2F2F"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 10L12 15L17 10" stroke="#2F2F2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 7H21M3 12H21M3 17H21" stroke="#1D1B20" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface TopNavBarProps {
  breadcrumb?: string;
}

export function TopNavBar({ breadcrumb = "Assignment" }: TopNavBarProps) {
  const isCreateNew = breadcrumb.toLowerCase() === "create new";

  return (
    <>
      <header className="dashboard-topnav">
        <Link href="/" className="dashboard-topnav__back">
          <ArrowLeftIcon />
        </Link>
        <div className="dashboard-topnav__breadcrumb">
          {isCreateNew ? <SparkleIcon /> : <BreadcrumbIcon />}
          <span>{breadcrumb}</span>
        </div>
        <div className="dashboard-topnav__actions">
          <button className="dashboard-notification" aria-label="Notifications">
            <NotificationIcon />
            <span />
          </button>
          <div className="dashboard-profile">
            <Image src="/avatarmonkey.png" alt="" width={32} height={32} />
            <span>Priyanshu</span>
            <ChevronDownIcon />
          </div>
        </div>
      </header>


      <header className="mobile-app-header">
        <div className="mobile-app-header__brand">
          <div className="mobile-app-header__logo">
            <Image src="/logo11.png" alt="VedaAI logo" width={28} height={28} priority />
          </div>
          <span>VedaAI</span>
        </div>
        <div className="mobile-app-header__actions">
          <button className="dashboard-notification" aria-label="Notifications">
            <NotificationIcon />
            <span />
          </button>
          <Image className="mobile-app-header__avatar" src="/avatarmonkey.png" alt="" width={32} height={32} />
          <MenuIcon />
        </div>
      </header>
    </>
  );
}
