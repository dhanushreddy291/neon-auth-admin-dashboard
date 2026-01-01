import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { useParams } from 'react-router';

export default function AuthPage() {
    const { path } = useParams();
    return (
        <div className="bg-gray-50 dark:bg-gray-900 flex min-h-screen items-center justify-center p-8">
            <AuthView pathname={path} />
        </div>
    );
}