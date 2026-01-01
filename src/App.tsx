import { RedirectToSignIn, SignedIn, UserButton } from '@neondatabase/neon-js/auth/react';
import AdminDashboard from './components/AdminDashboard';
import { Link, Route, Routes } from 'react-router';
import Auth from './pages/Auth';
import Account from './pages/Account';
import { authClient } from './auth';

const HomePage = () => {
  const { data, isPending } = authClient.useSession();
  const isImpersonating = data?.session?.impersonatedBy;

  if (isPending) {
    return (
      <div className="text-gray-600 dark:text-gray-300 flex min-h-screen items-center justify-center">
        Loading session…
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-8 ${isImpersonating ? 'pt-20' : ''}`}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <SignedIn>
          <div className="flex items-center justify-between">
            <h1 className="text-gray-900 text-3xl font-semibold dark:text-white">
              Client Dashboard
            </h1>
            <UserButton className="bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 ring-gray-200 dark:ring-gray-700 focus-visible:ring-blue-500 flex items-center gap-2 rounded-full ring-1 transition-all duration-150 focus:outline-none focus-visible:ring-2" />
          </div>

          <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg border bg-white p-5 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              <span className="font-semibold">Status:</span>{' '}
              {data?.session ? (
                <span className="text-green-600 dark:text-green-400">Authenticated</span>
              ) : (
                <span className="text-red-500">Guest</span>
              )}
            </p>

            {data?.user && (
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                <span className="font-semibold">User ID:</span> {data.user.id}
              </p>
            )}
          </div>

          <div className="border-gray-200 bg-gray-950 text-gray-100 dark:border-gray-700 rounded-lg border p-4 text-sm shadow-sm">
            <div className="text-gray-400 mb-2 text-xs font-semibold uppercase tracking-wide">
              Session Data
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {data?.user?.role === 'admin' && (
            <div className="border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/30 rounded-lg border p-5">
              <h2 className="text-green-800 dark:text-green-200 mb-2 text-lg font-semibold">
                Admin Access
              </h2>
              <p className="text-green-700 dark:text-green-100 mb-4 text-sm">
                You have permission to manage users and system settings.
              </p>

              <Link
                to="/admin"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition"
              >
                Go to Admin Dashboard →
              </Link>
            </div>
          )}
        </SignedIn>

        <RedirectToSignIn />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/auth/:path" element={<Auth />} />
      <Route path="/account/:path" element={<Account />} />
    </Routes>
  );
}