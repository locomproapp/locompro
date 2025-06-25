
/**
 * Utility function to consistently resolve display names across the application
 * This centralizes the logic and ensures consistent behavior everywhere
 */

interface ProfileData {
  full_name?: string | null;
  email?: string | null;
}

export const getDisplayName = (profiles: ProfileData | null | undefined): string => {
  // Check for valid full_name first
  if (profiles?.full_name && profiles.full_name.trim() !== '') {
    return profiles.full_name.trim();
  }
  
  // Fallback to email username if available
  if (profiles?.email && profiles.email.trim() !== '') {
    const emailUsername = profiles.email.split('@')[0];
    if (emailUsername && emailUsername.trim() !== '') {
      return emailUsername.trim();
    }
  }
  
  // Last resort fallback
  return 'Usuario anónimo';
};

export const getDisplayNameWithLogging = (profiles: ProfileData | null | undefined, context: string = 'Unknown'): string => {
  console.log(`👤 [${context}] Profile data:`, profiles);
  
  const displayName = getDisplayName(profiles);
  console.log(`✅ [${context}] Resolved display name: "${displayName}"`);
  
  return displayName;
};
