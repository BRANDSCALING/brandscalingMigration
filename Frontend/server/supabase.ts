import { supabaseAdmin } from '../lib/supabase'

// Initialize Module 1 tables and data in Supabase
export async function initializeModule1Tables() {
  try {
    // Create workbook_sessions table if it doesn't exist
    const { error: createTableError } = await supabaseAdmin.rpc('create_workbook_sessions_table', {})
    
    if (createTableError && !createTableError.message.includes('already exists')) {
      console.error('Error creating workbook_sessions table:', createTableError)
    }

    // Create user_progress table for tracking course completion
    const { error: progressTableError } = await supabaseAdmin.rpc('create_user_progress_table', {})
    
    if (progressTableError && !progressTableError.message.includes('already exists')) {
      console.error('Error creating user_progress table:', progressTableError)
    }

    console.log('✓ Module 1 tables initialized in Supabase')
  } catch (error) {
    console.error('Failed to initialize Module 1 tables:', error)
  }
}

// Create a workbook session for a user
export async function createWorkbookSession(userId: string, email: string) {
  const { data, error } = await supabaseAdmin
    .from('workbook_sessions')
    .insert({
      user_id: userId,
      user_email: email,
      dna_mode: 'architect',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating workbook session:', error)
    throw error
  }

  return data
}

// Update workbook session data
export async function updateWorkbookSession(sessionId: string, data: any) {
  const { data: updatedSession, error } = await supabaseAdmin
    .from('workbook_sessions')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating workbook session:', error)
    throw error
  }

  return updatedSession
}

// Get workbook session by user ID
export async function getWorkbookSession(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('workbook_sessions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching workbook session:', error)
    throw error
  }

  return data
}

// Track user progress in courses/modules
export async function updateUserProgress(userId: string, moduleId: string, sectionId: string, completed: boolean = true) {
  const { data, error } = await supabaseAdmin
    .from('user_progress')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      section_id: sectionId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) {
    console.error('Error updating user progress:', error)
    throw error
  }

  return data
}

// Get user progress for a module
export async function getUserProgress(userId: string, moduleId?: string) {
  let query = supabaseAdmin
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (moduleId) {
    query = query.eq('module_id', moduleId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching user progress:', error)
    throw error
  }

  return data || []
}