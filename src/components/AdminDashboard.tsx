import { useEffect, useState } from 'react';
import { authClient } from '../auth';
import { UserRow } from './UserRow';
import { RedirectToSignIn, SignedIn } from '@neondatabase/neon-js/auth/react/ui';
import type { User } from '@neondatabase/neon-js/auth/types';

export type UserType = User & { banned: boolean | null } & { role?: string | null };

export default function AdminDashboard() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [userDataLoading, setUserDataLoading] = useState(false);
    const { data, isPending: isSessionDataLoading } = authClient.useSession();

    const fetchUsers = async () => {
        setUserDataLoading(true);
        const { data, error } = await authClient.admin.listUsers({
            query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' },
        });

        if (data) {
            setUsers(data.users);
        } else {
            console.error(error);
            alert('Failed to fetch users.');
        }
        setUserDataLoading(false);
    };

    useEffect(() => {
        if (data?.user?.role === 'admin') fetchUsers();
    }, [data]);

    if (userDataLoading || isSessionDataLoading) {
        return (
            <div className="text-gray-600 dark:text-gray-300 flex min-h-screen items-center justify-center">
                Loading users…
            </div>
        );
    }

    const isImpersonating = data?.session?.impersonatedBy;

    return (
        <div
            className={`bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-8 lg:px-8 sm:px-6 ${isImpersonating ? 'pt-20' : ''}`}
        >
            <SignedIn>
                {data?.user?.role === 'admin' ? (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-gray-900 text-2xl font-semibold dark:text-white">
                                Support Dashboard
                            </h1>
                        </div>

                        <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 relative overflow-x-auto rounded-lg border bg-white shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">User Name</th>
                                        <th className="px-4 py-3 text-left font-medium">Email</th>
                                        <th className="px-4 py-3 text-left font-medium">Role</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-gray-200 dark:divide-gray-700 divide-y">
                                    {users.map((user) => (
                                        <UserRow key={user.id} user={user} refreshData={fetchUsers} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-300 mx-auto max-w-lg rounded-lg border p-6 text-center">
                        <h2 className="mb-2 text-lg font-semibold">Access Denied</h2>
                        <p>You do not have permission to view this page.</p>
                    </div>
                )}
            </SignedIn>

            <RedirectToSignIn />
        </div>
    );
}