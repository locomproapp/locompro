
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureProfileExists = async (user: User) => {
    try {
      console.log('Ensuring profile exists for user:', user.id);
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile:', checkError);
        return;
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        console.log('Creating profile for user:', user.id);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully for user:', user.id);
        }
      } else {
        console.log('Profile already exists for user:', user.id);
      }
    } catch (error) {
      console.error('Error in ensureProfileExists:', error);
    }
  };

  useEffect(() => {
    console.log('🔐 Auth hook initializing...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', {
          event,
          userId: session?.user?.id,
          domain: window.location.hostname,
          hasSession: !!session
        });
        
        // Update state immediately
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle profile creation for sign-in events only
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          try {
            await ensureProfileExists(session.user);
          } catch (error) {
            console.error('Error ensuring profile exists:', error);
          }
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
        } else {
          console.log('✅ Initial session retrieved:', {
            hasSession: !!session,
            userId: session?.user?.id,
            domain: window.location.hostname
          });
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Ensure profile exists for initial session
        if (session?.user) {
          try {
            await ensureProfileExists(session.user);
          } catch (error) {
            console.error('Error ensuring profile exists for initial session:', error);
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('🔐 Auth hook cleanup');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('🚪 Starting logout process...', {
        domain: window.location.hostname,
        hasUser: !!user
      });
      
      // Clear local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out locally to avoid cross-domain conflicts
      });
      
      if (error) {
        console.error('❌ Error during logout:', error);
        // Even if there's an error, we've cleared local state
        // so the user appears logged out in the UI
      } else {
        console.log('✅ Logout successful');
      }
    } catch (error) {
      console.error('💥 Unexpected error during logout:', error);
      // Clear local state even if there's an error
      setUser(null);
      setSession(null);
    }
  };

  return {
    user,
    session,
    loading,
    signOut
  };
};
