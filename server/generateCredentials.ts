// Generate secure random password
export function generatePassword(): string {
  const length = 12;
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

// Generate user credentials after purchase
export function generateUserCredentials(email: string, product: string) {
  const password = generatePassword();
  const tier = product === 'mastermind' ? 'elite' : 'entry';
  
  return {
    email,
    password,
    tier,
    userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}