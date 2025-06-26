import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface UserCredentials {
  email: string;
  password: string;
  tier: 'entry' | 'elite';
  firstName?: string;
}

export async function sendWelcomeCredentials(credentials: UserCredentials) {
  try {
    const { email, password, tier, firstName = 'New User' } = credentials;
    
    const tierName = tier === 'entry' ? 'Entry Tier' : 'Elite Tier';
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/auth`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Brandscaling</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Welcome to Brandscaling!</h1>
            
            <p>Hi ${firstName},</p>
            
            <p>Congratulations on your ${tierName} purchase! Your payment has been processed successfully.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">Your Login Credentials</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
              <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
            </div>
            
            <p>You now have access to:</p>
            <ul>
              <li>Entrepreneurial DNA Quiz</li>
              <li>AI Business Advisors (Architect & Alchemist)</li>
              <li>Smart Business Builder</li>
              ${tier === 'elite' ? '<li>Elite Mastermind Content</li><li>Private Strategy Sessions</li>' : ''}
            </ul>
            
            <p>Get started by taking your <a href="${loginUrl}">Entrepreneurial DNA Quiz</a> to discover your business personality type.</p>
            
            <p>Welcome to your entrepreneurial journey!</p>
            
            <p>Best regards,<br>The Brandscaling Team</p>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Brandscaling <welcome@brandscaling.com>',
      to: [email],
      subject: `Welcome to Brandscaling - Your ${tierName} Access`,
      html: htmlContent,
    });

    console.log('Welcome email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

// Test function - can be called manually
export async function testEmailService(testEmail: string) {
  const testCredentials: UserCredentials = {
    email: testEmail,
    password: 'TempPass123!',
    tier: 'entry',
    firstName: 'Test User'
  };
  
  try {
    const result = await sendWelcomeCredentials(testCredentials);
    console.log('Test email sent successfully to:', testEmail);
    return result;
  } catch (error) {
    console.error('Test email failed:', error);
    throw error;
  }
}