import { resendClient } from "@shared/resendClient";
import { storage } from "./storage";

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    subject: "Welcome to Brandscaling - Your Journey Begins",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Welcome to Brandscaling!</h1>
        <p>We're excited to have you join our community of entrepreneurs scaling their businesses.</p>
        <p>Your next step is to complete your DNA assessment to unlock personalized content.</p>
        <a href="{{assessmentUrl}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Take DNA Assessment
        </a>
        <p>Best regards,<br>The Brandscaling Team</p>
      </div>
    `,
    textContent: `
      Welcome to Brandscaling!
      
      We're excited to have you join our community of entrepreneurs scaling their businesses.
      
      Your next step is to complete your DNA assessment to unlock personalized content.
      
      Take your assessment here: {{assessmentUrl}}
      
      Best regards,
      The Brandscaling Team
    `
  },
  
  dnaComplete: {
    subject: "Your DNA Results Are Ready - {{dnaType}} Entrepreneur",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Your Entrepreneurial DNA: {{dnaType}}</h1>
        <p>Congratulations! You've completed your DNA assessment.</p>
        <div style="background: {{dnaColor}}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin: 0;">You are an {{dnaType}}</h2>
          <p style="margin: 10px 0 0 0;">{{dnaDescription}}</p>
        </div>
        <p>Your personalized learning path is now ready. Start with courses designed specifically for {{dnaType}} entrepreneurs.</p>
        <a href="{{dashboardUrl}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Your Dashboard
        </a>
      </div>
    `,
    textContent: `
      Your Entrepreneurial DNA: {{dnaType}}
      
      Congratulations! You've completed your DNA assessment.
      
      You are an {{dnaType}}: {{dnaDescription}}
      
      Your personalized learning path is now ready. Start with courses designed specifically for {{dnaType}} entrepreneurs.
      
      View your dashboard: {{dashboardUrl}}
    `
  },

  courseComplete: {
    subject: "Course Completed - {{courseTitle}}",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Congratulations!</h1>
        <p>You've successfully completed <strong>{{courseTitle}}</strong>.</p>
        <p>As an {{dnaType}}, you're building the exact skills needed to scale your business effectively.</p>
        <h3>What's Next?</h3>
        <ul>
          <li>Continue with your recommended learning path</li>
          <li>Apply what you've learned to your business</li>
          <li>Share your progress with the community</li>
        </ul>
        <a href="{{nextCourseUrl}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Continue Learning
        </a>
      </div>
    `,
    textContent: `
      Congratulations!
      
      You've successfully completed {{courseTitle}}.
      
      As an {{dnaType}}, you're building the exact skills needed to scale your business effectively.
      
      What's Next?
      - Continue with your recommended learning path
      - Apply what you've learned to your business
      - Share your progress with the community
      
      Continue learning: {{nextCourseUrl}}
    `
  },

  weeklyDigest: {
    subject: "Your Weekly {{dnaType}} Scaling Insights",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Weekly Scaling Insights for {{dnaType}}s</h1>
        <p>Here's your personalized weekly roundup of scaling insights and community highlights.</p>
        
        <h3>This Week's Focus</h3>
        <p>{{weeklyFocus}}</p>
        
        <h3>Community Highlights</h3>
        <p>{{communityHighlights}}</p>
        
        <h3>Recommended Action</h3>
        <p>{{recommendedAction}}</p>
        
        <a href="{{dashboardUrl}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Dashboard
        </a>
      </div>
    `,
    textContent: `
      Weekly Scaling Insights for {{dnaType}}s
      
      Here's your personalized weekly roundup of scaling insights and community highlights.
      
      This Week's Focus:
      {{weeklyFocus}}
      
      Community Highlights:
      {{communityHighlights}}
      
      Recommended Action:
      {{recommendedAction}}
      
      View Dashboard: {{dashboardUrl}}
    `
  }
};

export async function sendWelcomeEmail(userEmail: string, userId: string) {
  try {
    const template = emailTemplates.welcome;
    const assessmentUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/quiz`;
    
    const htmlContent = template.htmlContent.replace('{{assessmentUrl}}', assessmentUrl);
    const textContent = template.textContent.replace('{{assessmentUrl}}', assessmentUrl);

    await resendClient.emails.send({
      from: 'Brandscaling <noreply@brandscaling.com>',
      to: [userEmail],
      subject: template.subject,
      html: htmlContent,
      text: textContent,
    });

    // Log email for tracking
    await storage.logEmail({
      userId,
      type: 'welcome',
      recipient: userEmail,
      subject: template.subject,
      status: 'sent'
    });

  } catch (error) {
    console.error('Failed to send welcome email:', error);
    await storage.logEmail({
      userId,
      type: 'welcome',
      recipient: userEmail,
      subject: emailTemplates.welcome.subject,
      status: 'failed',
      error: error.message
    });
    throw error;
  }
}

export async function sendDnaCompleteEmail(userEmail: string, userId: string, dnaType: string) {
  try {
    const template = emailTemplates.dnaComplete;
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/dashboard`;
    
    const dnaColors = {
      'Architect': '#3b82f6',
      'Alchemist': '#ef4444',
      'Blurred Identity': '#8b5cf6',
      'Unfocused Potential': '#6b7280'
    };
    
    const dnaDescriptions = {
      'Architect': 'You excel at systematic thinking and strategic planning',
      'Alchemist': 'You thrive on intuitive wisdom and creative transformation', 
      'Blurred Identity': 'You balance multiple entrepreneurial approaches',
      'Unfocused Potential': 'You have potential waiting to be unlocked'
    };

    let htmlContent = template.htmlContent
      .replace(/{{dnaType}}/g, dnaType)
      .replace('{{dnaColor}}', dnaColors[dnaType] || '#6b7280')
      .replace('{{dnaDescription}}', dnaDescriptions[dnaType] || '')
      .replace('{{dashboardUrl}}', dashboardUrl);

    let textContent = template.textContent
      .replace(/{{dnaType}}/g, dnaType)
      .replace('{{dnaDescription}}', dnaDescriptions[dnaType] || '')
      .replace('{{dashboardUrl}}', dashboardUrl);

    const subject = template.subject.replace('{{dnaType}}', dnaType);

    await resendClient.emails.send({
      from: 'Brandscaling <noreply@brandscaling.com>',
      to: [userEmail],
      subject,
      html: htmlContent,
      text: textContent,
    });

    await storage.logEmail({
      userId,
      type: 'dna_complete',
      recipient: userEmail,
      subject,
      status: 'sent'
    });

  } catch (error) {
    console.error('Failed to send DNA complete email:', error);
    await storage.logEmail({
      userId,
      type: 'dna_complete',
      recipient: userEmail,
      subject: emailTemplates.dnaComplete.subject,
      status: 'failed',
      error: error.message
    });
    throw error;
  }
}

export async function sendCourseCompleteEmail(userEmail: string, userId: string, courseTitle: string, dnaType: string) {
  try {
    const template = emailTemplates.courseComplete;
    const nextCourseUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/courses`;
    
    let htmlContent = template.htmlContent
      .replace('{{courseTitle}}', courseTitle)
      .replace(/{{dnaType}}/g, dnaType)
      .replace('{{nextCourseUrl}}', nextCourseUrl);

    let textContent = template.textContent
      .replace('{{courseTitle}}', courseTitle)
      .replace(/{{dnaType}}/g, dnaType)
      .replace('{{nextCourseUrl}}', nextCourseUrl);

    const subject = template.subject.replace('{{courseTitle}}', courseTitle);

    await resendClient.emails.send({
      from: 'Brandscaling <noreply@brandscaling.com>',
      to: [userEmail],
      subject,
      html: htmlContent,
      text: textContent,
    });

    await storage.logEmail({
      userId,
      type: 'course_complete',
      recipient: userEmail,
      subject,
      status: 'sent'
    });

  } catch (error) {
    console.error('Failed to send course complete email:', error);
    throw error;
  }
}

export async function sendWeeklyDigest() {
  try {
    const users = await storage.getAllActiveUsers();
    
    for (const user of users) {
      if (!user.email) continue;
      
      const dnaResult = await storage.getUserDnaResult(user.id);
      const dnaType = dnaResult?.dominantType || 'Entrepreneur';
      
      const template = emailTemplates.weeklyDigest;
      const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/dashboard`;
      
      // Get personalized content based on DNA type
      const weeklyContent = getWeeklyContentForDnaType(dnaType);
      
      let htmlContent = template.htmlContent
        .replace(/{{dnaType}}/g, dnaType)
        .replace('{{weeklyFocus}}', weeklyContent.focus)
        .replace('{{communityHighlights}}', weeklyContent.highlights)
        .replace('{{recommendedAction}}', weeklyContent.action)
        .replace('{{dashboardUrl}}', dashboardUrl);

      let textContent = template.textContent
        .replace(/{{dnaType}}/g, dnaType)
        .replace('{{weeklyFocus}}', weeklyContent.focus)
        .replace('{{communityHighlights}}', weeklyContent.highlights)
        .replace('{{recommendedAction}}', weeklyContent.action)
        .replace('{{dashboardUrl}}', dashboardUrl);

      const subject = template.subject.replace('{{dnaType}}', dnaType);

      await resendClient.emails.send({
        from: 'Brandscaling <noreply@brandscaling.com>',
        to: [user.email],
        subject,
        html: htmlContent,
        text: textContent,
      });

      await storage.logEmail({
        userId: user.id,
        type: 'weekly_digest',
        recipient: user.email,
        subject,
        status: 'sent'
      });
    }

  } catch (error) {
    console.error('Failed to send weekly digest:', error);
    throw error;
  }
}

function getWeeklyContentForDnaType(dnaType: string) {
  const content = {
    'Architect': {
      focus: 'This week, focus on building systematic processes that can scale without your direct involvement.',
      highlights: 'Fellow Architects are sharing frameworks for automated customer onboarding and team structure optimization.',
      action: 'Document one key process in your business and identify opportunities for automation.'
    },
    'Alchemist': {
      focus: 'This week, trust your intuition to identify transformational opportunities in your market.',
      highlights: 'Fellow Alchemists are discussing creative approaches to product innovation and customer experience transformation.',
      action: 'Experiment with one bold idea that could differentiate your business from competitors.'
    },
    'Blurred Identity': {
      focus: 'This week, leverage your ability to see multiple perspectives to find unique solutions.',
      highlights: 'Community members are sharing strategies that combine analytical and intuitive approaches.',
      action: 'Identify one challenge where you can apply both systematic analysis and creative thinking.'
    },
    'Unfocused Potential': {
      focus: 'This week, take the DNA assessment to unlock your personalized scaling strategy.',
      highlights: 'New members who completed their assessments are already seeing clearer paths to growth.',
      action: 'Complete your DNA assessment to join your entrepreneurial tribe.'
    }
  };

  return content[dnaType] || content['Unfocused Potential'];
}