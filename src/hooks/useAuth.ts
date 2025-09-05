import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, UserProfile } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (username: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Create email from username for simple authentication
      const email = `${username.toLowerCase()}@gmail.com`;

      console.log('Attempting to sign in with:', { username, email });

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Signin response:', { data, error });

      if (error) {
        console.error('Signin error:', error);
        toast({
          title: "Sign in failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: `Signed in as ${username}`,
      });

      return { error: null };
    } catch (error) {
      console.error('Signin catch error:', error);
      const authError = { message: 'An unexpected error occurred' } as AuthError;
      toast({
        title: "Sign in failed",
        description: authError.message,
        variant: "destructive"
      });
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, password: string) => {
    try {
      setLoading(true);

      // Create a valid email using username with Gmail domain
      const email = `${username.toLowerCase()}@gmail.com`;

      console.log('Attempting to sign up with:', { username, email });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Account created!",
        description: `Welcome ${username}! You can now start tracking your expenses.`,
      });

      return { error: null };
    } catch (error) {
      console.error('Signup catch error:', error);
      const authError = { message: 'An unexpected error occurred' } as AuthError;
      toast({
        title: "Sign up failed",
        description: authError.message,
        variant: "destructive"
      });
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};

export { AuthContext };