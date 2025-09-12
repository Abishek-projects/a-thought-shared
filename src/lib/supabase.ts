// Re-export the configured Supabase client from integrations
export { supabase } from '@/integrations/supabase/client';

// Database types
export interface UserProfile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseExpense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}