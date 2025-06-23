import { resendClient } from '../../shared/resendClient';

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export class ResendEmailService {
  
  static async sendWelcomeEmail(userEmail: string, userName?: string): Promise<void> {
    const template: EmailTemplate = {
      subject: 'Welcome to Brandscaling - Discover Your Entrepreneurial DNA',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937; margin-bottom: 24px;">Welcome to Brandscaling!</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Welcome to the Brandscaling platform! We're excited to help you discover your entrepreneurial DNA and unlock your business potential.</p>
          
          <div style="background: #f3f4f6; padding: 24px; border-radius: 8px; margin: 24px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Next Steps:</h2>
            <ol>
              <li>Take the Entrepreneurial DNA Quiz to discover your type</li>
              <li>Explore personalized courses based on your results</li>
              <li>Use the Smart Business Builder for AI-powered insights</li>
            </ol>
          </div>
          
          <p>Ready to get started? Take your DNA quiz now and unlock your potential!</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/quiz" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Take DNA Quiz
            </a>
          </div>
          
          <p>Best regards,<br>The Brandscaling Team</p>
        </div>
      `,
      textContent: `
        Welcome to Brandscaling!
        
        Hi ${userName || 'there'},
        
        Welcome to the Brandscaling platform! We're excited to help you discover your entrepreneurial DNA and unlock your business potential.
        
        Next Steps:
        1. Take the Entrepreneurial DNA Quiz to discover your type
        2. Explore personalized courses based on your results  
        3. Use the Smart Business Builder for AI-powered insights
        
        Ready to get started? Visit ${process.env.FRONTEND_URL || 'http://localhost:5000'}/quiz to take your DNA quiz now!
        
        Best regards,
        The Brandscaling Team
      `
    };

    await resendClient.emails.send({
      from: 'Brandscaling <welcome@brandscaling.com>',
      to: [userEmail],
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent,
    });
  }

  static async sendQuizCompletionEmail(
    userEmail: string, 
    dnaType: string, 
    awarenessPercentage: number,
    userName?: string
  ): Promise<void> {
    const template: EmailTemplate = {
      subject: `Your Entrepreneurial DNA Results: ${dnaType}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937; margin-bottom: 24px;">Your DNA Results Are Ready!</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Congratulations on completing the Entrepreneurial DNA Quiz! Your results are now available.</p>
          
          <div style="background: #f3f4f6; padding: 24px; border-radius: 8px; margin: 24px 0; text-align: center;">
            <h2 style="color: #1f2937; margin-top: 0;">Your Entrepreneurial DNA Type:</h2>
            <h3 style="color: #3b82f6; font-size: 28px; margin: 16px 0;">${dnaType}</h3>
            <p style="font-size: 18px; color: #6b7280;">Awareness Level: ${awarenessPercentage}%</p>
          </div>
          
          <p>This assessment reveals your natural entrepreneurial tendencies and provides personalized insights for your business growth journey.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/quiz-result" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 16px;">
              View Full Results
            </a>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/courses" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Explore Courses
            </a>
          </div>
          
          <p>Best regards,<br>The Brandscaling Team</p>
        </div>
      `,
      textContent: `
        Your DNA Results Are Ready!
        
        Hi ${userName || 'there'},
        
        Congratulations on completing the Entrepreneurial DNA Quiz! Your results are now available.
        
        Your Entrepreneurial DNA Type: ${dnaType}
        Awareness Level: ${awarenessPercentage}%
        
        This assessment reveals your natural entrepreneurial tendencies and provides personalized insights for your business growth journey.
        
        View your full results: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/quiz-result
        Explore courses: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/courses
        
        Best regards,
        The Brandscaling Team
      `
    };

    await resendClient.emails.send({
      from: 'Brandscaling <results@brandscaling.com>',
      to: [userEmail],
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent,
    });
  }
}