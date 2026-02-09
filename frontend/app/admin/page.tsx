import Link from "next/link";
import Image from "next/image";
export default function AdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <section className="max-w-[96vw] lg:max-w-[80vw] px-6 py-10 bg-white shadow-sm rounded-lg border border-slate-200 flex flex-col items-center text-center space-y-6">
        <div>
          <Image
            src="/images/ministry-logo.png"
            alt="logo"
            width={70}
            height={70}
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-green-800 uppercase">
            BPPPI Admin Portal
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-3xl">
            Welcome to the Imo State Bureau of Public Procurement and Price Intelligence Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            This secure area is for BPPPI administrators and MDAs to manage procurement
            processes, configurations, and system-wide settings.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-md bg-green-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Go to Admin Login
          </Link>
        </div>
      </section>
    </main>
  );
}