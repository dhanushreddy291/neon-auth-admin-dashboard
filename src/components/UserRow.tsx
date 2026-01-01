import { useState } from 'react';
import { authClient } from '../auth';
import type { UserType } from './AdminDashboard';

export function UserRow({ user, refreshData }: { user: UserType; refreshData: () => void }) {
    const [showBanModal, setShowBanModal] = useState(false);
    const [banReason, setBanReason] = useState('');

    const handleBanToggle = async () => {
        if (user.banned) {
            await authClient.admin.unbanUser({ userId: user.id });
            refreshData();
        } else {
            setShowBanModal(true);
        }
    };

    const handleConfirmBan = async () => {
        await authClient.admin.banUser({
            userId: user.id,
            banReason: banReason || 'No reason provided',
        });
        setShowBanModal(false);
        setBanReason('');
        refreshData();
    };

    const handleImpersonate = async () => {
        const { data } = await authClient.admin.impersonateUser({
            userId: user.id,
        });

        if (data) {
            window.location.href = '/';
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4">{user.name}</td>
            <td className="p-4">{user.email}</td>
            <td className="p-4">
                <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded px-2 py-1 text-xs font-bold uppercase tracking-wide">
                    {user.role || 'user'}
                </span>
            </td>
            <td className="p-4">
                {user.banned ? (
                    <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full px-3 py-1 text-sm font-medium">
                        Banned
                    </span>
                ) : (
                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full px-3 py-1 text-sm font-medium">
                        Active
                    </span>
                )}
            </td>
            <td className="flex gap-2 p-4">
                <button
                    onClick={handleImpersonate}
                    className={`hover:bg-blue-50 border-blue-200 text-blue-600 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 rounded border px-3 py-1 text-sm font-medium transition ${user.banned ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    disabled={user.banned ?? false}
                >
                    Impersonate
                </button>

                <button
                    onClick={handleBanToggle}
                    className={`bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer rounded px-3 py-1 text-sm font-medium text-white transition`}
                >
                    {user.banned ? 'Unban' : 'Ban'}
                </button>
            </td>

            {showBanModal && (
                <td className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="dark:bg-gray-900 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="text-gray-900 mb-4 text-lg font-semibold dark:text-white">
                            Ban User: {user.name}
                        </h3>
                        <label className="text-gray-700 dark:text-gray-300 mb-2 block text-sm font-medium">
                            Quick select reason
                        </label>
                        <div className="mb-3 flex flex-wrap gap-2">
                            {[
                                'Violated terms of service',
                                'Free tier abuse',
                                'Spam or suspicious activity',
                                'Non payment of dues',
                            ].map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => setBanReason(reason)}
                                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${banReason === reason
                                            ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/40 dark:border-red-500 dark:text-red-300'
                                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        <label className="text-gray-700 dark:text-gray-300 mb-2 block text-sm font-medium">
                            Reason for ban
                        </label>
                        <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Enter the reason for banning this user..."
                            className="border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 w-full resize-none rounded-md border px-3 py-2 shadow-sm focus:ring-2 dark:text-white"
                            rows={3}
                            autoFocus
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowBanModal(false);
                                    setBanReason('');
                                }}
                                className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBan}
                                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white transition"
                            >
                                Confirm Ban
                            </button>
                        </div>
                    </div>
                </td>
            )}
        </tr>
    );
}