import { storage } from "./storage";

// Create a test admin user for development
export async function createTestAdminUser() {
  try {
    const adminUserData = {
      id: "QlOH1t5vQGYfRRNb6MWLLMwobgT2", // Use the current user ID from logs
      email: "admin@brandscaling.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      accessTier: "mastermind",
      profileImageUrl: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };

    // Check if user already exists
    const existingUser = await storage.getUser(adminUserData.id);
    
    if (existingUser) {
      // Update existing user to admin role
      await storage.updateUserRole(adminUserData.id, "admin");
      console.log("Updated existing user to admin role");
      return existingUser;
    } else {
      // Create new admin user
      const newUser = await storage.upsertUser(adminUserData);
      console.log("Created new admin user");
      return newUser;
    }
  } catch (error) {
    console.error("Error creating test admin user:", error);
    throw error;
  }
}