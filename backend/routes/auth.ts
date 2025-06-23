import { Router } from 'express';
import { supabase, supabaseAdmin } from '../services/supabase';

const router = Router();

// Get current user profile
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // Create user profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          profile_image_url: user.user_metadata?.avatar_url || null,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user profile:', createError);
        return res.status(500).json({ error: 'Failed to create user profile' });
      }

      return res.json(newProfile);
    }

    res.json(profile);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { first_name, last_name, tier } = req.body;

    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        tier,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;