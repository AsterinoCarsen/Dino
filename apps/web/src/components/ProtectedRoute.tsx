import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '../lib/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated()) {
            router.replace('/authenticate');
        }
    }, []);

    if (!mounted) return null;
    if (!isAuthenticated()) return null;

    return <>{children}</>;
}