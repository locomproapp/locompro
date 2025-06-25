
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
  console.log(`👤 [${context}] Profile data detailed analysis:`, {
    profiles_exists: !!profiles,
    profiles_is_null: profiles === null,
    profiles_is_undefined: profiles === undefined,
    profiles_type: typeof profiles,
    profiles_keys: profiles ? Object.keys(profiles) : 'N/A',
    raw_profiles_object: profiles,
    full_name_value: profiles?.full_name,
    full_name_type: typeof profiles?.full_name,
    full_name_length: profiles?.full_name?.length,
    full_name_trimmed: profiles?.full_name?.trim(),
    email_value: profiles?.email,
    email_type: typeof profiles?.email,
    email_length: profiles?.email?.length,
    email_trimmed: profiles?.email?.trim(),
    full_name_valid: !!(profiles?.full_name && profiles.full_name.trim() !== ''),
    email_valid: !!(profiles?.email && profiles.email.trim() !== '')
  });
  
  const displayName = getDisplayName(profiles);
  console.log(`✅ [${context}] Resolved display name: "${displayName}"`);
  
  return displayName;
};
