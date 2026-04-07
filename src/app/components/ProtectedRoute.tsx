import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-background)]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[var(--theme-accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--theme-muted-foreground)]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
