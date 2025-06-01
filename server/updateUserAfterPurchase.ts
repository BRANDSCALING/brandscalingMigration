import { db } from "./db";
import { users, payments } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function updateUserAfterPurchase(email: string, product: string, stripeId: string) {
  try {
    const role = product === "mastermind" ? "mastermind" : "buyer";
    
    // Calculate amount based on product
    const amount = product === "mastermind" ? 2400000 : 29700; // £24,000 or £297 in pence

    // Find user by email
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    let userId: string;

    if (!existingUser) {
      
      userId = `stripe_${Date.now()}`;
      
      // Create new user if they don't exist
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
      amount,
      paidAt: new Date(),
    });



  } catch (error) {
    console.error('Error updating user after purchase:', error);
    throw error;
  }
}