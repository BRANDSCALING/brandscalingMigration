import { supabase } from '../backend/services/supabase';

export async function seedDatabase() {
  try {
    // Seed courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .insert([
        {
          title: 'The Infinite Scaling Methodology',
          description: 'Master the foundational framework for exponential business growth',
          tier: 'beginner',
          architect_content: {
            focus: 'Systems and structure-driven approach',
            modules: ['Framework Design', 'Process Optimization', 'Scalable Systems']
          },
          alchemist_content: {
            focus: 'Intuitive and relationship-driven approach', 
            modules: ['Vision Crafting', 'Emotional Intelligence', 'Creative Problem Solving']
          }
        },
        {
          title: 'Advanced DNA Optimization',
          description: 'Deep dive into your entrepreneurial DNA for maximum effectiveness',
          tier: 'intermediate',
          architect_content: {
            focus: 'Data-driven personality optimization',
            modules: ['Analytics Deep Dive', 'Systematic Improvement', 'Performance Metrics']
          },
          alchemist_content: {
            focus: 'Intuitive self-discovery and growth',
            modules: ['Inner Wisdom Access', 'Emotional Mastery', 'Creative Expression']
          }
        }
      ])
      .select();

    if (coursesError) {
      console.error('Error seeding courses:', coursesError);
      return;
    }

    console.log('Database seeded successfully');
    console.log('Courses created:', courses?.length);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}