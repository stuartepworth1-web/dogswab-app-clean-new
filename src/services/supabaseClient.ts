import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export interface User {
  id: string;
  email: string;
  name?: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  stripeCustomerId?: string;
  createdAt: Date;
  emailVerified: boolean;
}

export const authService = {
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signup');

    return this.getCurrentUser();
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signin');

    return this.getCurrentUser();
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    if (!userData) {
      return {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name,
        subscriptionTier: 'free',
        subscriptionStatus: 'inactive',
        createdAt: new Date(authUser.created_at),
        emailVerified: !!authUser.email_confirmed_at
      };
    }

    return {
      id: userData.id,
      email: userData.email,
      name: authUser.user_metadata?.name,
      subscriptionTier: userData.subscription_tier || 'free',
      subscriptionStatus: userData.subscription_status || 'inactive',
      stripeCustomerId: userData.stripe_customer_id,
      createdAt: new Date(userData.created_at),
      emailVerified: !!authUser.email_confirmed_at
    };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (session?.user) {
          const user = await this.getCurrentUser();
          callback(user);
        } else {
          callback(null);
        }
      })();
    });
  }
};
