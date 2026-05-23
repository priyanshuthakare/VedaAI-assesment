import { DashboardLayout } from "@/components/layout";
import Image from "next/image";
import Link from "next/link";

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5V17.5M2.5 10H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <DashboardLayout breadcrumb="Assignment">
      <section className="empty-dashboard">
        <div className="empty-dashboard__body">
          <Image
            className="empty-dashboard__illustration"
            src="/noassignment.png"
            alt=""
            width={300}
            height={300}
            priority
          />
          <div className="empty-dashboard__copy">
            <h2 className="empty-dashboard__title">
              No assignments yet
            </h2>
            <p className="empty-dashboard__description">
              Create your first assignment to start collecting and grading
              student submissions. You can set up rubrics, define marking
              criteria, and let AI assist with grading.
            </p>
          </div>
        </div>
        <Link href="/create" className="empty-dashboard__button">
          <PlusIcon />
          <span>Create Your First Assignment</span>
        </Link>
      </section>
    </DashboardLayout>
  );
}
