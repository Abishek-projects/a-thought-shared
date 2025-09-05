import { useAuth } from "@/hooks/useAuth";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

export const MainApp = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && profile) {
    return <Dashboard user={{ username: profile.username }} onLogout={() => {}} />;
  }

  return <LoginForm />;
};