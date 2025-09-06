import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Wallet } from 'lucide-react';

export const Header = () => {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-card/70 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent shadow-lg">
              <Wallet className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold gradient-text">
                Expense Tracker
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                💰 Your friendly money buddy
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3 border border-border/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">👋 Welcome back,</p>
                <p className="text-lg font-bold text-primary">{profile?.username || 'User'}!</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};