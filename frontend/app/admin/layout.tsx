"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { store } from "./redux/store";
import { AuthProvider } from "./providers/AuthProvider";
import { useAppSelector } from "./redux/hooks";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) return;

    if (!pathname || !pathname.startsWith("/admin")) return;

    if (pathname === "/admin" || pathname === "/admin/login") return;

    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [initialized, isAuthenticated, pathname, router]);

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AuthProvider>
    </Provider>
  );
}
