
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
  
  // Note: Email access is now restricted for privacy
  // Fallback directly to anonymous user if no full_name is available
  return 'Usuario';
};

export const getDisplayNameWithLogging = (profiles: ProfileData | null | undefined, context: string = 'Unknown'): string => {
  console.log(`👤 [${context}] Profile data:`, profiles);
  
  const displayName = getDisplayName(profiles);
  console.log(`✅ [${context}] Resolved display name: "${displayName}"`);
  
  return displayName;
};

export const getDisplayNameWithCurrentUser = (
  profiles: ProfileData | null | undefined, 
  profileUserId?: string | null,
  currentUserId?: string | null
): string => {
  const displayName = getDisplayName(profiles);
  
  // Add "(Yo)" if this is the current user's profile
  if (profileUserId && currentUserId && profileUserId === currentUserId) {
    return `${displayName} (Yo)`;
  }
  
  return displayName;
};

export const getDisplayNameWithCurrentUserAndLogging = (
  profiles: ProfileData | null | undefined, 
  profileUserId?: string | null,
  currentUserId?: string | null,
  context: string = 'Unknown'
): string => {
  console.log(`👤 [${context}] Profile data:`, profiles);
  console.log(`👤 [${context}] Profile user ID:`, profileUserId);
  console.log(`👤 [${context}] Current user ID:`, currentUserId);
  
  const displayName = getDisplayNameWithCurrentUser(profiles, profileUserId, currentUserId);
  console.log(`✅ [${context}] Resolved display name: "${displayName}"`);
  
  return displayName;
};
