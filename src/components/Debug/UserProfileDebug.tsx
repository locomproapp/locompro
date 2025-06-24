
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const UserProfileDebug = () => {
  const { user } = useAuth();

  const checkProfile = async () => {
    if (!user) {
      toast({ title: "No user logged in" });
      return;
    }

    console.log('=== CHECKING USER PROFILE ===');
    console.log('Current user:', user);
    console.log('User ID:', user.id);
    console.log('User email:', user.email);
    console.log('User metadata:', user.user_metadata);

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('Profile query result:', { profile, profileError });

    if (!profile && !profileError) {
      console.log('Profile not found, creating one...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
        })
        .select()
        .single();

      console.log('Profile creation result:', { newProfile, createError });
      
      if (createError) {
        toast({ 
          title: "Error creating profile", 
          description: createError.message,
          variant: "destructive" 
        });
      } else {
        toast({ title: "Profile created successfully" });
      }
    }
  };

  const checkBuyRequests = async () => {
    console.log('=== CHECKING BUY REQUESTS WITH PROFILES ===');
    
    const { data: requests, error } = await supabase
      .from('buy_requests')
      .select(`
        id,
        title,
        user_id,
        profiles (
          id,
          full_name,
          email
        )
      `)
      .limit(5);

    console.log('Buy requests with profiles:', { requests, error });
    
    // Check for orphaned requests (requests without profiles)
    const orphanedRequests = requests?.filter(req => !req.profiles);
    if (orphanedRequests && orphanedRequests.length > 0) {
      console.log('Found orphaned requests (no profile):', orphanedRequests);
    }
  };

  if (!user) {
    return (
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">User Profile Debug (Not logged in)</h3>
        <p>Please log in to debug profile issues</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">User Profile Debug</h3>
      <div className="space-y-2">
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
        <p>Full Name: {user.user_metadata?.full_name || 'Not set'}</p>
        <div className="flex gap-2">
          <Button onClick={checkProfile} size="sm">
            Check/Create Profile
          </Button>
          <Button onClick={checkBuyRequests} size="sm" variant="outline">
            Check Buy Requests
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDebug;
