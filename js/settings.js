// Ez Gmail - Settings Manager
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

class SettingsManager {
  constructor() {
    this.defaults = {
      // Navigation Settings
      navigation: {
        enabled: true,
        showPageNumbers: true,
        showDateJump: true,
        showQuickJump: true,
        paginationStyle: 'full', // 'full', 'compact', 'minimal'
        itemsPerPage: 50, // Gmail default
        maxVisiblePages: 10
      },
      
      // Date Jump Settings
      dateJump: {
        enabled: true,
        defaultView: 'calendar', // 'calendar', 'list', 'quick'
        quickDates: ['today', 'yesterday', 'week', 'month', 'year'],
        showRelativeDates: true,
        dateFormat: 'MM/DD/YYYY'
      },
      
      // Sidebar Settings
      sidebar: {
        enabled: true,
        position: 'right', // 'left', 'right'
        width: 300,
        collapsible: true,
        defaultCollapsed: false,
        showStats: true,
        showQuickActions: true
      },
      
      // Quick Actions
      quickActions: {
        enabled: true,
        showCompose: true,
        showSearch: true,
        showMarkAllRead: true,
        showArchiveAll: false,
        customActions: []
      },
      
      // Templates
      templates: {
        enabled: true,
        showInCompose: true,
        showInSidebar: true,
        categories: ['Work', 'Personal', 'Follow-up'],
        defaultCategory: 'Work'
      },
      
      // Keyboard Shortcuts
      shortcuts: {
        enabled: true,
        quickCompose: 'Ctrl+Shift+C',
        quickSearch: 'Ctrl+Shift+F',
        dateJump: 'Ctrl+Shift+D',
        pageJump: 'Ctrl+Shift+P',
        toggleSidebar: 'Ctrl+Shift+S'
      },
      
      // UI/UX Settings
      ui: {
        theme: 'auto', // 'auto', 'light', 'dark'
        animations: true,
        notifications: true,
        notificationDuration: 3000,
        compactMode: false
      },
      
      // Advanced Settings
      advanced: {
        debugMode: false,
        cacheEnabled: true,
        autoSave: true,
        syncSettings: true,
        experimentalFeatures: false
      }
    };
    
    this.settings = null;
  }
  
  // Initialize settings
  async init() {
    try {
      const stored = await chrome.storage.sync.get(['ezGmailSettings']);
      
      if (stored.ezGmailSettings) {
        // Merge stored settings with defaults (in case new settings were added)
        this.settings = this.mergeSettings(this.defaults, stored.ezGmailSettings);
      } else {
        // Use defaults
        this.settings = JSON.parse(JSON.stringify(this.defaults));
        await this.save();
      }
      
      console.log('Ez Gmail settings initialized:', this.settings);
      return this.settings;
    } catch (error) {
      console.error('Error initializing settings:', error);
      this.settings = JSON.parse(JSON.stringify(this.defaults));
      return this.settings;
    }
  }
  
  // Deep merge settings
  mergeSettings(defaults, stored) {
    const merged = JSON.parse(JSON.stringify(defaults));
    
    for (const key in stored) {
      if (typeof stored[key] === 'object' && !Array.isArray(stored[key])) {
        merged[key] = this.mergeSettings(defaults[key] || {}, stored[key]);
      } else {
        merged[key] = stored[key];
      }
    }
    
    return merged;
  }
  
  // Get all settings
  getAll() {
    return this.settings;
  }
  
  // Get specific setting
  get(path) {
    const keys = path.split('.');
    let value = this.settings;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }
  
  // Set specific setting
  set(path, value) {
    const keys = path.split('.');
    let obj = this.settings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in obj) || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      obj = obj[key];
    }
    
    obj[keys[keys.length - 1]] = value;
  }
  
  // Save settings
  async save() {
    try {
      await chrome.storage.sync.set({ ezGmailSettings: this.settings });
      console.log('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
  
  // Reset to defaults
  async reset() {
    this.settings = JSON.parse(JSON.stringify(this.defaults));
    await this.save();
    return this.settings;
  }
  
  // Export settings
  export() {
    return JSON.stringify(this.settings, null, 2);
  }
  
  // Import settings
  async import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.settings = this.mergeSettings(this.defaults, imported);
      await this.save();
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsManager;
}
