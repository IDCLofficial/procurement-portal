"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Home, FileText, FileCheck, ClipboardList, LogOut } from "lucide-react";
import { useLogout } from "@/app/admin/hooks/useLogout";
import { ConfirmationDialog } from "@/app/admin/components/general/confirmation-dialog";
import { useAppSelector } from "../../redux/hooks";


// Define interface for NavItem props
interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href: string;
  active?: boolean;
}

// NavItem component for the sidebar
function NavItem({ icon: Icon, text, href, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        active
          ? 'bg-green-50 text-green-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`mr-3 h-5 w-5 ${
          active ? 'text-green-500' : 'text-gray-400'
        }`}
        aria-hidden="true"
      />
      {text}
    </Link>
  );
}
export default function SidebarUser() {
  const params = useParams();
  const id = params?.id as string;
  const pathname = usePathname();
  const handleLogout = useLogout();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const isRegistrar = user?.role === "Registrar";

  const dashboardHref = `/admin/${id}`;
  const applicationsHref = `/admin/${id}/applications`;
  const certificatesHref = `/admin/${id}/certificates`;
  const transactionsHref = `/admin/${id}/transactions`;

  const isDashboardActive = pathname === dashboardHref || pathname === `${dashboardHref}/`;
  const isApplicationsActive = pathname.startsWith(applicationsHref);
  const isCertificatesActive = pathname.startsWith(certificatesHref);
  const isTransactionsActive = pathname.startsWith(transactionsHref);
  return (
    <div className="hidden md:flex md:
    shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Image
            src="/images/ministry-logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="ml-2 text-lg font-semibold">BPPPI Admin</span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavItem icon={Home} text="Dashboard" href={dashboardHref} active={isDashboardActive} />
          <NavItem icon={FileText} text="Applications" href={applicationsHref} active={isApplicationsActive} />
          {isRegistrar && (
            <>
              <NavItem
                icon={FileCheck}
                text="Certificates"
                href={certificatesHref}
                active={isCertificatesActive}
              />
              {/* <NavItem
                icon={ClipboardList}
                text="Transactions"
                href={transactionsHref}
                active={isTransactionsActive}
              /> */}
            </>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200">
          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>SLA Compliance</span>
              <span>94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "94.2%" }}></div>
            </div>
          </div>

          <button
            onClick={() => setLogoutDialogOpen(true)}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-2 text-gray-500" />
            Logout
          </button>
          <ConfirmationDialog
            isOpen={logoutDialogOpen}
            onClose={() => setLogoutDialogOpen(false)}
            onConfirm={() => {
              setLogoutDialogOpen(false);
              handleLogout();
            }}
            title="Are you sure you want to quit?"
            description="You will be logged out of the portal."
            confirmText="Logout"
            cancelText="Cancel"
            variant="destructive"
          />
        </div>
      </div>
    </div>
  );
}
