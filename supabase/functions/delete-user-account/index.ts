import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create regular client to verify user authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const userId = user.id
    console.log(`Starting account deletion for user: ${userId}`)

    // Delete user data in correct order (respecting foreign key constraints)
    
    // 1. Delete chat messages
    const { error: messagesError } = await supabaseAdmin
      .from('chat_messages')
      .delete()
      .eq('sender_id', userId)
    
    if (messagesError) {
      console.error('Error deleting chat messages:', messagesError)
    }

    // 2. Delete chats where user is buyer or seller
    const { error: chatsError } = await supabaseAdmin
      .from('chats')
      .delete()
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    
    if (chatsError) {
      console.error('Error deleting chats:', chatsError)
    }

    // 3. Delete reviews
    const { error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .delete()
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    
    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError)
    }

    // 4. Delete buy request offers
    const { error: buyRequestOffersError } = await supabaseAdmin
      .from('buy_request_offers')
      .delete()
      .eq('seller_id', userId)
    
    if (buyRequestOffersError) {
      console.error('Error deleting buy request offers:', buyRequestOffersError)
    }

    // 5. Delete offers
    const { error: offersError } = await supabaseAdmin
      .from('offers')
      .delete()
      .eq('seller_id', userId)
    
    if (offersError) {
      console.error('Error deleting offers:', offersError)
    }

    // 6. Delete buy requests
    const { error: buyRequestsError } = await supabaseAdmin
      .from('buy_requests')
      .delete()
      .eq('user_id', userId)
    
    if (buyRequestsError) {
      console.error('Error deleting buy requests:', buyRequestsError)
    }

    // 7. Delete posts
    const { error: postsError } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('user_id', userId)
    
    if (postsError) {
      console.error('Error deleting posts:', postsError)
    }

    // 8. Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // 9. Finally, delete the user from auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user account' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully deleted account for user: ${userId}`)

    return new Response(
      JSON.stringify({ message: 'Account deleted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})