// Ez Gmail - Settings UI Script
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

let settingsManager;
let hasUnsavedChanges = false;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  settingsManager = new SettingsManager();
  await settingsManager.init();
  
  loadSettings();
  setupEventListeners();
  setupTabNavigation();
});

// Load settings into UI
function loadSettings() {
  const settings = settingsManager.getAll();
  
  // Navigation
  document.getElementById('nav-enabled').checked = settings.navigation.enabled;
  document.getElementById('nav-page-numbers').checked = settings.navigation.showPageNumbers;
  document.getElementById('nav-date-jump').checked = settings.navigation.showDateJump;
  document.getElementById('nav-quick-jump').checked = settings.navigation.showQuickJump;
  document.getElementById('nav-pagination-style').value = settings.navigation.paginationStyle;
  document.getElementById('nav-max-pages').value = settings.navigation.maxVisiblePages;
  
  // Date Jump
  document.getElementById('date-enabled').checked = settings.dateJump.enabled;
  document.getElementById('date-default-view').value = settings.dateJump.defaultView;
  document.getElementById('date-relative').checked = settings.dateJump.showRelativeDates;
  document.getElementById('date-format').value = settings.dateJump.dateFormat;
  
  // Sidebar
  document.getElementById('sidebar-enabled').checked = settings.sidebar.enabled;
  document.getElementById('sidebar-position').value = settings.sidebar.position;
  document.getElementById('sidebar-width').value = settings.sidebar.width;
  document.getElementById('sidebar-collapsible').checked = settings.sidebar.collapsible;
  document.getElementById('sidebar-stats').checked = settings.sidebar.showStats;
  
  // Quick Actions
  document.getElementById('qa-enabled').checked = settings.quickActions.enabled;
  document.getElementById('qa-compose').checked = settings.quickActions.showCompose;
  document.getElementById('qa-search').checked = settings.quickActions.showSearch;
  document.getElementById('qa-mark-read').checked = settings.quickActions.showMarkAllRead;
  document.getElementById('qa-archive-all').checked = settings.quickActions.showArchiveAll;
  
  // Templates
  document.getElementById('tmpl-enabled').checked = settings.templates.enabled;
  document.getElementById('tmpl-in-compose').checked = settings.templates.showInCompose;
  document.getElementById('tmpl-in-sidebar').checked = settings.templates.showInSidebar;
  document.getElementById('tmpl-default-category').value = settings.templates.defaultCategory;
  
  // Shortcuts
  document.getElementById('shortcuts-enabled').checked = settings.shortcuts.enabled;
  document.getElementById('shortcut-compose').value = settings.shortcuts.quickCompose;
  document.getElementById('shortcut-search').value = settings.shortcuts.quickSearch;
  document.getElementById('shortcut-date').value = settings.shortcuts.dateJump;
  document.getElementById('shortcut-page').value = settings.shortcuts.pageJump;
  document.getElementById('shortcut-sidebar').value = settings.shortcuts.toggleSidebar;
  
  // UI
  document.getElementById('ui-theme').value = settings.ui.theme;
  document.getElementById('ui-animations').checked = settings.ui.animations;
  document.getElementById('ui-notifications').checked = settings.ui.notifications;
  document.getElementById('ui-notif-duration').value = settings.ui.notificationDuration;
  document.getElementById('ui-compact').checked = settings.ui.compactMode;
  
  // Advanced
  document.getElementById('adv-debug').checked = settings.advanced.debugMode;
  document.getElementById('adv-cache').checked = settings.advanced.cacheEnabled;
  document.getElementById('adv-autosave').checked = settings.advanced.autoSave;
  document.getElementById('adv-sync').checked = settings.advanced.syncSettings;
  document.getElementById('adv-experimental').checked = settings.advanced.experimentalFeatures;
}

// Save settings from UI
function saveSettings() {
  // Navigation
  settingsManager.set('navigation.enabled', document.getElementById('nav-enabled').checked);
  settingsManager.set('navigation.showPageNumbers', document.getElementById('nav-page-numbers').checked);
  settingsManager.set('navigation.showDateJump', document.getElementById('nav-date-jump').checked);
  settingsManager.set('navigation.showQuickJump', document.getElementById('nav-quick-jump').checked);
  settingsManager.set('navigation.paginationStyle', document.getElementById('nav-pagination-style').value);
  settingsManager.set('navigation.maxVisiblePages', parseInt(document.getElementById('nav-max-pages').value));
  
  // Date Jump
  settingsManager.set('dateJump.enabled', document.getElementById('date-enabled').checked);
  settingsManager.set('dateJump.defaultView', document.getElementById('date-default-view').value);
  settingsManager.set('dateJump.showRelativeDates', document.getElementById('date-relative').checked);
  settingsManager.set('dateJump.dateFormat', document.getElementById('date-format').value);
  
  // Sidebar
  settingsManager.set('sidebar.enabled', document.getElementById('sidebar-enabled').checked);
  settingsManager.set('sidebar.position', document.getElementById('sidebar-position').value);
  settingsManager.set('sidebar.width', parseInt(document.getElementById('sidebar-width').value));
  settingsManager.set('sidebar.collapsible', document.getElementById('sidebar-collapsible').checked);
  settingsManager.set('sidebar.showStats', document.getElementById('sidebar-stats').checked);
  
  // Quick Actions
  settingsManager.set('quickActions.enabled', document.getElementById('qa-enabled').checked);
  settingsManager.set('quickActions.showCompose', document.getElementById('qa-compose').checked);
  settingsManager.set('quickActions.showSearch', document.getElementById('qa-search').checked);
  settingsManager.set('quickActions.showMarkAllRead', document.getElementById('qa-mark-read').checked);
  settingsManager.set('quickActions.showArchiveAll', document.getElementById('qa-archive-all').checked);
  
  // Templates
  settingsManager.set('templates.enabled', document.getElementById('tmpl-enabled').checked);
  settingsManager.set('templates.showInCompose', document.getElementById('tmpl-in-compose').checked);
  settingsManager.set('templates.showInSidebar', document.getElementById('tmpl-in-sidebar').checked);
  settingsManager.set('templates.defaultCategory', document.getElementById('tmpl-default-category').value);
  
  // Shortcuts
  settingsManager.set('shortcuts.enabled', document.getElementById('shortcuts-enabled').checked);
  settingsManager.set('shortcuts.quickCompose', document.getElementById('shortcut-compose').value);
  settingsManager.set('shortcuts.quickSearch', document.getElementById('shortcut-search').value);
  settingsManager.set('shortcuts.dateJump', document.getElementById('shortcut-date').value);
  settingsManager.set('shortcuts.pageJump', document.getElementById('shortcut-page').value);
  settingsManager.set('shortcuts.toggleSidebar', document.getElementById('shortcut-sidebar').value);
  
  // UI
  settingsManager.set('ui.theme', document.getElementById('ui-theme').value);
  settingsManager.set('ui.animations', document.getElementById('ui-animations').checked);
  settingsManager.set('ui.notifications', document.getElementById('ui-notifications').checked);
  settingsManager.set('ui.notificationDuration', parseInt(document.getElementById('ui-notif-duration').value));
  settingsManager.set('ui.compactMode', document.getElementById('ui-compact').checked);
  
  // Advanced
  settingsManager.set('advanced.debugMode', document.getElementById('adv-debug').checked);
  settingsManager.set('advanced.cacheEnabled', document.getElementById('adv-cache').checked);
  settingsManager.set('advanced.autoSave', document.getElementById('adv-autosave').checked);
  settingsManager.set('advanced.syncSettings', document.getElementById('adv-sync').checked);
  settingsManager.set('advanced.experimentalFeatures', document.getElementById('adv-experimental').checked);
}

// Setup event listeners
function setupEventListeners() {
  // Save button
  document.getElementById('saveBtn').addEventListener('click', async () => {
    saveSettings();
    const success = await settingsManager.save();
    
    const status = document.getElementById('saveStatus');
    if (success) {
      status.textContent = '✓ Settings saved successfully!';
      status.className = 'save-status success';
      hasUnsavedChanges = false;
      
      // Notify content script to reload settings
      chrome.tabs.query({ url: 'https://mail.google.com/*' }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'reloadSettings' });
        });
      });
    } else {
      status.textContent = '✗ Error saving settings';
      status.className = 'save-status error';
    }
    
    setTimeout(() => {
      status.textContent = '';
      status.className = 'save-status';
    }, 3000);
  });
  
  // Cancel button
  document.getElementById('cancelBtn').addEventListener('click', () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        window.close();
      }
    } else {
      window.close();
    }
  });
  
  // Reset button
  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      await settingsManager.reset();
      loadSettings();
      alert('Settings have been reset to defaults.');
    }
  });
  
  // Export button
  document.getElementById('exportBtn').addEventListener('click', () => {
    const json = settingsManager.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ez-gmail-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Import button
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  
  document.getElementById('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const success = await settingsManager.import(event.target.result);
        if (success) {
          loadSettings();
          alert('Settings imported successfully!');
        } else {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  });
  
  // Track changes
  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', () => {
      hasUnsavedChanges = true;
    });
  });
}

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Remove active class from all
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked
      button.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
}

// Warn before closing with unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});
