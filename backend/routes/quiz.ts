import { Router } from 'express';
import { supabase } from '../services/supabase';

const router = Router();

// Check quiz eligibility
router.get('/entrepreneurial-dna/eligibility', async (req, res) => {
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

    const { data, error: queryError } = await supabase
      .from('quiz_results')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('Error checking quiz eligibility:', queryError);
      return res.status(500).json({ error: 'Failed to check eligibility' });
    }

    if (!data || data.length === 0) {
      return res.json({ canRetake: true });
    }

    const lastTakeDate = new Date(data[0].created_at);
    const thirtyDaysLater = new Date(lastTakeDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const canRetake = new Date() >= thirtyDaysLater;

    res.json({
      canRetake,
      nextRetakeDate: canRetake ? null : thirtyDaysLater.toISOString(),
    });
  } catch (error) {
    console.error('Quiz eligibility error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit quiz results
router.post('/entrepreneurial-dna/submit', async (req, res) => {
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

    const { responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length !== 20) {
      return res.status(400).json({ error: 'Invalid responses format' });
    }

    // Calculate result
    const defaultTypeResponses = responses.slice(0, 10);
    const awarenessResponses = responses.slice(10, 20);

    let architectScore = 0;
    let alchemistScore = 0;
    let awarenessScore = 0;

    defaultTypeResponses.forEach((response) => {
      if (response.answer === 'A' || response.answer === 'C') {
        architectScore++;
      } else {
        alchemistScore++;
      }
    });

    awarenessResponses.forEach((response) => {
      if (response.answer === 'A' || response.answer === 'B') {
        awarenessScore++;
      }
    });

    const awarenessPercentage = (awarenessScore / 10) * 100;

    let defaultType;
    if (architectScore > alchemistScore) {
      defaultType = awarenessPercentage >= 70 ? 'Architect' : 'Blurred Identity';
    } else if (alchemistScore > architectScore) {
      defaultType = awarenessPercentage >= 70 ? 'Alchemist' : 'Blurred Identity';
    } else {
      defaultType = 'Unfocused Potential';
    }

    // Save to database
    const { data: result, error: insertError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        default_type: defaultType,
        awareness_percentage: awarenessPercentage,
        responses: responses,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving quiz result:', insertError);
      return res.status(500).json({ error: 'Failed to save quiz result' });
    }

    res.json({
      defaultType,
      awarenessPercentage,
      canRetake: false,
      nextRetakeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get latest quiz result
router.get('/entrepreneurial-dna/result', async (req, res) => {
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

    const { data, error: queryError } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('Error fetching quiz result:', queryError);
      return res.status(500).json({ error: 'Failed to fetch quiz result' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No quiz results found' });
    }

    const result = data[0];
    res.json({
      defaultType: result.default_type,
      awarenessPercentage: result.awareness_percentage,
      createdAt: result.created_at,
    });
  } catch (error) {
    console.error('Quiz result fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;