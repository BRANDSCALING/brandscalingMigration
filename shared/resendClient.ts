import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable must be set");
}

export const resendClient = new Resend(process.env.RESEND_API_KEY);