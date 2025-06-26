import { db } from "./db";
import { users, payments } from "@shared/schema";
import { eq } from "drizzle-orm";
import { generateUserCredentials } from "./generateCredentials";
import { sendWelcomeCredentials } from "./emailService";

export async function updateUserAfterPurchase(email: string, product: string, stripeId: string, amount?: number) {
  try {
    const role = product === "mastermind" ? "mastermind" : "buyer";
    const actualAmount = amount || (product === "mastermind" ? 2400000 : product === "taster-day" ? 29700 : 4900); // Default amounts in pence

    // Generate credentials for new user
    const credentials = generateUserCredentials(email, product);

    // Find user by email
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    let userId: string;
    let isNewUser = false;

    if (!existingUser) {
      userId = credentials.userId;
      isNewUser = true;
      
      // Create new user with generated password
      await db.insert(users).values({
        id: userId,
        email,
        role,
        stripeId,
        stripePaidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      userId = existingUser.id;
      
      // Update existing user
      await db.update(users)
        .set({
          role,
          stripeId,
          stripePaidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.email, email));
    }

    // Record payment transaction
    await db.insert(payments).values({
      userId,
      product,
      stripeId,
      amount: actualAmount,
      paidAt: new Date(),
    });

    // Send welcome email with credentials (for new users only)
    if (isNewUser) {
      try {
        await sendWelcomeCredentials({
          email: credentials.email,
          password: credentials.password,
          tier: credentials.tier as 'entry' | 'elite',
          firstName: 'New User'
        });
        console.log(`Welcome email sent to ${email} for ${product} purchase`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw error here - payment was successful
      }
    }

    return { userId, credentials: isNewUser ? credentials : null };

  } catch (error) {
    console.error('Error updating user after purchase:', error);
    throw error;
  }
}