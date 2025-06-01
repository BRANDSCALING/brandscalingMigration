import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function updateUserAfterPurchase(email: string, product: string, stripeId: string) {
  try {
    const role = product === "mastermind" ? "mastermind" : "buyer";

    // Find user by email
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    if (!existingUser) {
      console.log(`User with email ${email} not found, creating new user`);
      
      // Create new user if they don't exist
      await db.insert(users).values({
        id: `stripe_${Date.now()}`, // Generate unique ID
        email,
        role,
        stripeCustomerId: stripeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing user
      await db.update(users)
        .set({
          role,
          stripeCustomerId: stripeId,
          updatedAt: new Date(),
        })
        .where(eq(users.email, email));
    }

    console.log(`User ${email} updated with role ${role} and stripe ID ${stripeId}`);

    // TODO: Trigger onboarding email flow (integrate with your ESP)
    // await sendOnboardingEmail(email, product, role);

  } catch (error) {
    console.error('Error updating user after purchase:', error);
    throw error;
  }
}