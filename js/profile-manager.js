// Ez Gmail - Profile Manager
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Manage user profiles for template variable auto-fill

class ProfileManager {
  constructor() {
    this.profiles = [];
    this.storageKey = 'ezgmail_profiles';
    this.activeProfileId = null;
    this.initialized = false;
  }

  // Initialize profile manager
  async init() {
    if (this.initialized) return;
    
    console.log('Ez Gmail: Initializing Profile Manager...');
    await this.loadProfiles();
    await this.loadActiveProfile();
    this.initialized = true;
    console.log('Ez Gmail: Profile Manager initialized with', this.profiles.length, 'profiles');
  }

  // Load profiles from Chrome storage
  async loadProfiles() {
    try {
      const result = await chrome.storage.local.get(this.storageKey);
      this.profiles = result[this.storageKey] || [];
      
      // Ensure all profiles have required fields
      this.profiles = this.profiles.map(profile => ({
        id: profile.id || this.generateId(),
        name: profile.name || 'Untitled Profile',
        variables: profile.variables || {},
        created: profile.created || new Date().toISOString(),
        modified: profile.modified || new Date().toISOString(),
        isDefault: profile.isDefault || false
      }));
      
      return this.profiles;
    } catch (error) {
      console.error('Ez Gmail: Error loading profiles:', error);
      return [];
    }
  }

  // Load active profile ID
  async loadActiveProfile() {
    try {
      const result = await chrome.storage.local.get('ezgmail_active_profile');
      this.activeProfileId = result.ezgmail_active_profile || null;
      return this.activeProfileId;
    } catch (error) {
      console.error('Ez Gmail: Error loading active profile:', error);
      return null;
    }
  }

  // Save profiles to Chrome storage
  async saveProfiles() {
    try {
      await chrome.storage.local.set({ [this.storageKey]: this.profiles });
      console.log('Ez Gmail: Profiles saved successfully');
      return true;
    } catch (error) {
      console.error('Ez Gmail: Error saving profiles:', error);
      return false;
    }
  }

  // Save active profile ID
  async saveActiveProfile() {
    try {
      await chrome.storage.local.set({ ezgmail_active_profile: this.activeProfileId });
      return true;
    } catch (error) {
      console.error('Ez Gmail: Error saving active profile:', error);
      return false;
    }
  }

  // Create new profile
  async createProfile(profileData) {
    const profile = {
      id: this.generateId(),
      name: profileData.name || 'Untitled Profile',
      variables: profileData.variables || {},
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      isDefault: profileData.isDefault || false
    };

    // If this is set as default, unset other defaults
    if (profile.isDefault) {
      this.profiles.forEach(p => p.isDefault = false);
    }

    this.profiles.push(profile);
    await this.saveProfiles();
    
    console.log('Ez Gmail: Profile created:', profile.name);
    return profile;
  }

  // Update existing profile
  async updateProfile(id, updates) {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) {
      console.error('Ez Gmail: Profile not found:', id);
      return null;
    }

    const profile = this.profiles[index];
    const updatedProfile = {
      ...profile,
      ...updates,
      modified: new Date().toISOString()
    };

    // If this is set as default, unset other defaults
    if (updatedProfile.isDefault) {
      this.profiles.forEach((p, i) => {
        if (i !== index) p.isDefault = false;
      });
    }

    this.profiles[index] = updatedProfile;
    await this.saveProfiles();
    
    console.log('Ez Gmail: Profile updated:', updatedProfile.name);
    return updatedProfile;
  }

  // Delete profile
  async deleteProfile(id) {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) {
      console.error('Ez Gmail: Profile not found:', id);
      return false;
    }

    const profile = this.profiles[index];
    this.profiles.splice(index, 1);
    
    // If this was the active profile, clear it
    if (this.activeProfileId === id) {
      this.activeProfileId = null;
      await this.saveActiveProfile();
    }
    
    await this.saveProfiles();
    
    console.log('Ez Gmail: Profile deleted:', profile.name);
    return true;
  }

  // Get profile by ID
  getProfile(id) {
    return this.profiles.find(p => p.id === id);
  }

  // Get all profiles
  getAllProfiles() {
    return [...this.profiles];
  }

  // Get default profile
  getDefaultProfile() {
    return this.profiles.find(p => p.isDefault);
  }

  // Get active profile
  getActiveProfile() {
    if (this.activeProfileId) {
      return this.getProfile(this.activeProfileId);
    }
    return this.getDefaultProfile();
  }

  // Set active profile
  async setActiveProfile(id) {
    const profile = this.getProfile(id);
    if (!profile) {
      console.error('Ez Gmail: Profile not found:', id);
      return false;
    }

    this.activeProfileId = id;
    await this.saveActiveProfile();
    
    console.log('Ez Gmail: Active profile set to:', profile.name);
    return true;
  }

  // Clear active profile
  async clearActiveProfile() {
    this.activeProfileId = null;
    await this.saveActiveProfile();
    return true;
  }

  // Get variable value from active profile
  getVariableValue(variableName) {
    const profile = this.getActiveProfile();
    if (!profile) return null;
    
    return profile.variables[variableName] || null;
  }

  // Get all variable values from active profile
  getVariableValues(variableNames) {
    const profile = this.getActiveProfile();
    if (!profile) return {};
    
    const values = {};
    variableNames.forEach(name => {
      if (profile.variables[name]) {
        values[name] = profile.variables[name];
      }
    });
    
    return values;
  }

  // Update variable in profile
  async updateProfileVariable(profileId, variableName, value) {
    const profile = this.getProfile(profileId);
    if (!profile) return false;

    profile.variables[variableName] = value;
    profile.modified = new Date().toISOString();
    
    await this.saveProfiles();
    return true;
  }

  // Update multiple variables in profile
  async updateProfileVariables(profileId, variables) {
    const profile = this.getProfile(profileId);
    if (!profile) return false;

    profile.variables = {
      ...profile.variables,
      ...variables
    };
    profile.modified = new Date().toISOString();
    
    await this.saveProfiles();
    return true;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get profile statistics
  getStats() {
    return {
      totalProfiles: this.profiles.length,
      hasDefault: this.profiles.some(p => p.isDefault),
      hasActive: this.activeProfileId !== null,
      activeProfileName: this.getActiveProfile()?.name || null
    };
  }

  // Export profiles to JSON
  exportProfiles() {
    return JSON.stringify(this.profiles, null, 2);
  }

  // Import profiles from JSON
  async importProfiles(jsonString, merge = true) {
    try {
      const imported = JSON.parse(jsonString);
      
      if (!Array.isArray(imported)) {
        console.error('Ez Gmail: Invalid profile format');
        return false;
      }

      if (merge) {
        // Merge with existing profiles (avoid duplicates by name)
        const existingNames = new Set(this.profiles.map(p => p.name));
        const newProfiles = imported.filter(p => !existingNames.has(p.name));
        
        // Regenerate IDs for imported profiles
        newProfiles.forEach(p => {
          p.id = this.generateId();
          p.created = new Date().toISOString();
          p.modified = new Date().toISOString();
        });
        
        this.profiles.push(...newProfiles);
        await this.saveProfiles();
        
        console.log('Ez Gmail: Imported', newProfiles.length, 'new profiles');
        return newProfiles.length;
      } else {
        // Replace all profiles
        this.profiles = imported.map(p => ({
          ...p,
          id: this.generateId(),
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        }));
        
        await this.saveProfiles();
        
        console.log('Ez Gmail: Replaced with', this.profiles.length, 'profiles');
        return this.profiles.length;
      }
    } catch (error) {
      console.error('Ez Gmail: Error importing profiles:', error);
      return false;
    }
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.EzGmailProfileManager = window.EzGmailProfileManager || new ProfileManager();
}
