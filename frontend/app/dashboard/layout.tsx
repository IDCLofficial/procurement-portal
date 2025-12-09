import ProtectedRoute from "@/components/providers/public-service/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}