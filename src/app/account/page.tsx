import { Suspense } from "react";
import { AccountDashboard } from "@/components/account/account-dashboard";

export const metadata = {
  title: "Profile Account — WEBUOS",
  description: "Manage your WEBUOS profile, communication details, and business verification",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-slate-400">
          <div className="text-sm">Loading account…</div>
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  );
}
