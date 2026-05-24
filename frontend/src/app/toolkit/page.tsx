import { DashboardLayout } from "@/components/layout";

export default function ToolkitPage() {
  return (
    <DashboardLayout breadcrumb="AI Teacher's Toolkit">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="font-bricolage text-[32px] font-bold text-primary-text mb-4">Coming Soon</h2>
        <p className="font-bricolage text-[16px] text-secondary-text">This feature is currently under development. Want to see it live? Hire Priyanshu! 🚀</p>
      </div>
    </DashboardLayout>
  );
}
