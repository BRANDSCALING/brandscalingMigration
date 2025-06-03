import { storage } from "./storage";

export async function createTestAdminUser() {
  try {
    // Create a test admin user for development
    const adminUser = await storage.upsertUser({
      id: "admin-dev-12345",
      email: "admin@brandscaling.com",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      accessTier: "mastermind"
    });

    console.log("Test admin user created:", adminUser);
    return adminUser;
  } catch (error) {
    console.error("Error creating test admin user:", error);
    throw error;
  }
}