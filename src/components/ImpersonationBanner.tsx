import { authClient } from '../auth';

export function ImpersonationBanner() {
    const { data: session } = authClient.useSession();

    // Only render if currently impersonating
    if (!session?.session.impersonatedBy) return null;

    const stopImpersonation = async () => {
        await authClient.admin.stopImpersonating();
        window.location.reload();
    };

    return (
        <div className="bg-amber-400 text-amber-900 fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-4 p-3 font-medium shadow-md">
            <span>
                👀 You are impersonating <strong>{session.user.email}</strong>
            </span>
            <button
                onClick={stopImpersonation}
                className="bg-amber-900 text-amber-50 hover:bg-amber-800 rounded px-4 py-1 text-sm font-bold shadow-sm transition"
            >
                Return to Admin
            </button>
        </div>
    );
}