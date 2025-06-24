import { db } from "./db";
import { courses, lessons } from "@shared/schema";
import { eq } from "drizzle-orm";

// LMS data seeding - using actual course content only
export async function seedLMSData() {
  try {
    console.log('Seeding LMS data...');

    // Check if courses already exist
    const existingCourses = await db.select().from(courses).limit(1);
    if (existingCourses.length > 0) {
      console.log('LMS data already exists, skipping seed');
      return;
    }

    // Create actual courses
    const architectCourse = await db.insert(courses).values({
      title: "The Architect's Blueprint: Systems & Strategy",
      description: "Master systematic approaches to business building with data-driven decision making and strategic frameworks.",
      track: "architect",
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    const alchemistCourse = await db.insert(courses).values({
      title: "The Alchemist's Journey: Vision & Transformation",
      description: "Unlock your intuitive leadership potential with creative problem-solving and transformational thinking.",
      track: "alchemist", 
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    const hybridCourse = await db.insert(courses).values({
      title: "Brandscaling Foundations: Universal Principles",
      description: "Core entrepreneurial principles that every successful business builder must master, regardless of DNA type.",
      track: "both",
      level: 1,
      accessTier: "beginner",
      isPublished: true
    }).returning();

    // Create lessons for Architect course
    await db.insert(lessons).values([
      {
        courseId: architectCourse[0].id,
        title: "Systems Thinking Fundamentals",
        description: "Learn to see your business as interconnected systems and processes.",
        order: 1,
        sharedContent: `
          <h3>Foundation Principles</h3>
          <p>Every successful business operates as a system of interconnected parts. Understanding these connections is crucial for sustainable growth.</p>
          <ul>
            <li>Input → Process → Output framework</li>
            <li>Feedback loops and optimization</li>
            <li>Bottleneck identification</li>
            <li>Scalability principles</li>
          </ul>
        `,
        architectContent: `
          <h3>The Architect's Systematic Approach</h3>
          <p>As an Architect, you excel at breaking down complex systems into manageable components. This lesson builds on your natural analytical strengths.</p>
          
          <h4>Key Framework: The Business Architecture Canvas</h4>
          <ol>
            <li><strong>Foundation Layer:</strong> Core values, mission, vision</li>
            <li><strong>Strategic Layer:</strong> Market positioning, competitive advantage</li>
            <li><strong>Operational Layer:</strong> Processes, systems, workflows</li>
            <li><strong>Tactical Layer:</strong> Daily activities, metrics, KPIs</li>
          </ol>
          
          <blockquote>
            "The Architect sees the blueprint before the building exists. Use this visual thinking to map your business systems."
          </blockquote>
          
          <h4>Action Items:</h4>
          <ul>
            <li>Create a visual map of your current business processes</li>
            <li>Identify the top 3 bottlenecks limiting growth</li>
            <li>Design optimization strategies for each bottleneck</li>
          </ul>
        `,
        alchemistContent: `
          <h3>The Alchemist's Intuitive Systems</h3>
          <p>As an Alchemist, you understand that businesses are living organisms with energy flows and transformational potential.</p>
          
          <h4>Key Framework: The Energy Flow System</h4>
          <ol>
            <li><strong>Vision Energy:</strong> What you're creating and why</li>
            <li><strong>Creative Energy:</strong> How you innovate and adapt</li>
            <li><strong>Connection Energy:</strong> Relationships and partnerships</li>
            <li><strong>Impact Energy:</strong> The transformation you create</li>
          </ol>
          
          <blockquote>
            "The Alchemist transforms raw materials into gold. Your business is your laboratory for transformation."
          </blockquote>
          
          <h4>Reflection Questions:</h4>
          <ul>
            <li>What energy flows most naturally through your business?</li>
            <li>Where do you feel energetic blocks or resistance?</li>
            <li>How can you align systems with your intuitive strengths?</li>
          </ul>
        `,
        isPublished: true
      },
      {
        courseId: architectCourse[0].id,
        title: "Data-Driven Decision Making",
        description: "Master the art of using metrics and analytics to guide business decisions.",
        order: 2,
        sharedContent: `
          <h3>The Power of Data</h3>
          <p>Successful entrepreneurs make informed decisions based on data, not just intuition.</p>
        `,
        architectContent: `
          <h3>Building Your Analytics Dashboard</h3>
          <p>Create systematic approaches to data collection and analysis that support strategic decision-making.</p>
          
          <h4>The Architect's Metrics Framework:</h4>
          <ul>
            <li>Leading indicators (predict future performance)</li>
            <li>Lagging indicators (measure past performance)</li>
            <li>Diagnostic metrics (explain why things happened)</li>
            <li>Behavioral metrics (track user/customer actions)</li>
          </ul>
        `,
        alchemistContent: `
          <h3>Intuitive Data Reading</h3>
          <p>Learn to combine data analysis with your natural intuitive insights for powerful decision-making.</p>
          
          <h4>The Alchemist's Data Alchemy:</h4>
          <ul>
            <li>Pattern recognition beyond numbers</li>
            <li>Energy signatures in data trends</li>
            <li>Emotional intelligence in metrics</li>
            <li>Story-telling with data</li>
          </ul>
        `,
        isPublished: true
      }
    ]);

    // Create lessons for Alchemist course
    await db.insert(lessons).values([
      {
        courseId: alchemistCourse[0].id,
        title: "Visionary Leadership Essentials",
        description: "Develop your natural ability to see possibilities and inspire others to follow your vision.",
        order: 1,
        sharedContent: `
          <h3>The Foundation of Leadership</h3>
          <p>Every great business starts with a compelling vision that attracts the right people and resources.</p>
        `,
        architectContent: `
          <h3>Structured Vision Development</h3>
          <p>Use systematic approaches to clarify and communicate your vision effectively.</p>
          
          <h4>Vision Architecture Framework:</h4>
          <ol>
            <li>Current state analysis</li>
            <li>Future state design</li>
            <li>Gap identification</li>
            <li>Bridge strategy development</li>
          </ol>
        `,
        alchemistContent: `
          <h3>Visionary Awakening</h3>
          <p>Tap into your natural ability to see beyond the present and inspire transformational change.</p>
          
          <h4>The Alchemist's Vision Process:</h4>
          <ol>
            <li><strong>Dream State:</strong> Connect with your deepest desires and possibilities</li>
            <li><strong>Clarity Ritual:</strong> Refine your vision through creative practices</li>
            <li><strong>Energy Alignment:</strong> Ensure your vision energizes you and others</li>
            <li><strong>Manifestation Map:</strong> Create an intuitive path to realization</li>
          </ol>
          
          <blockquote>
            "The Alchemist doesn't just have a vision—they become the vision. Your energy is your greatest leadership tool."
          </blockquote>
        `,
        isPublished: true
      }
    ]);

    // Create lessons for Hybrid course
    await db.insert(lessons).values([
      {
        courseId: hybridCourse[0].id,
        title: "Entrepreneurial Mindset Foundations",
        description: "Core mental models and principles that drive successful entrepreneurs across all DNA types.",
        order: 1,
        sharedContent: `
          <h3>Universal Success Principles</h3>
          <p>Regardless of your entrepreneurial DNA, certain fundamental principles drive success in business building.</p>
          
          <h4>The Five Pillars of Entrepreneurial Success:</h4>
          <ol>
            <li><strong>Value Creation:</strong> Always start with solving a real problem</li>
            <li><strong>Market Validation:</strong> Test assumptions before building</li>
            <li><strong>Iterative Improvement:</strong> Embrace continuous learning and adaptation</li>
            <li><strong>Resource Optimization:</strong> Do more with less, focus on efficiency</li>
            <li><strong>Relationship Building:</strong> Success is built on strong connections</li>
          </ol>
          
          <h4>Common Entrepreneurial Challenges:</h4>
          <ul>
            <li>Fear of failure and rejection</li>
            <li>Perfectionism vs. action bias</li>
            <li>Time and priority management</li>
            <li>Financial planning and cash flow</li>
            <li>Team building and delegation</li>
          </ul>
        `,
        architectContent: `
          <h3>Systematic Mindset Development</h3>
          <p>Build structured mental frameworks that support consistent entrepreneurial performance.</p>
          
          <h4>The Architect's Mental Operating System:</h4>
          <ul>
            <li>Decision trees for common business scenarios</li>
            <li>Risk assessment matrices</li>
            <li>Performance tracking systems</li>
            <li>Strategic planning frameworks</li>
          </ul>
        `,
        alchemistContent: `
          <h3>Intuitive Mindset Mastery</h3>
          <p>Develop your natural ability to sense opportunities and navigate uncertainty with confidence.</p>
          
          <h4>The Alchemist's Intuitive Intelligence:</h4>
          <ul>
            <li>Energy-based decision making</li>
            <li>Pattern recognition and trend sensing</li>
            <li>Creative problem-solving techniques</li>
            <li>Flow state cultivation</li>
          </ul>
        `,
        isPublished: true
      }
    ]);

    console.log('LMS data seeded successfully!');
    console.log(`Created ${architectCourse.length + alchemistCourse.length + hybridCourse.length} courses`);
    
  } catch (error) {
    console.error('Error seeding LMS data:', error);
  }
}