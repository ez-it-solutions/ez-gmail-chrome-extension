// Ez Gmail - Settings Integration
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Adds custom settings tab to Gmail settings page

class SettingsIntegration {
  constructor() {
    this.settingsTabAdded = false;
    this.observer = null;
    this.observers = []; // Track all observers for cleanup
  }

  // Initialize settings integration
  init() {
    console.log('Ez Gmail: Initializing settings integration...');
    
    // Add left sidebar button with retries (works on all pages)
    setTimeout(() => this.addLeftSidebarButton(), 2000);
    setTimeout(() => this.addLeftSidebarButton(), 4000);
    setTimeout(() => this.addLeftSidebarButton(), 6000);
    
    // Wait for settings page to load
    this.waitForSettingsPage();
    
    // Monitor for navigation to settings
    this.monitorSettingsNavigation();
  }

  // Wait for settings page elements
  waitForSettingsPage() {
    const checkSettings = setInterval(() => {
      // Check if we're on settings page
      if (!window.location.hash.includes('settings')) {
        return;
      }

      // Look for settings tabs container
      const tabsContainer = document.querySelector('.fY') || // Settings tabs container
                           document.querySelector('[role="navigation"]');
      
      if (tabsContainer && !this.settingsTabAdded) {
        console.log('Ez Gmail: Settings page detected, adding custom tab');
        this.addCustomSettingsTab(tabsContainer);
        clearInterval(checkSettings);
      }
    }, 500);

    // Stop checking after 30 seconds
    setTimeout(() => clearInterval(checkSettings), 30000);
  }

  // Add custom Ez Gmail settings tab
  addCustomSettingsTab(tabsContainer) {
    // Try to find both the left sidebar and horizontal tabs
    this.addLeftSidebarButton();
    this.addHorizontalTab();
    
    this.settingsTabAdded = true;
    console.log('Ez Gmail: Custom settings tabs added successfully');
  }

  // Add button to left sidebar
  addLeftSidebarButton() {
    // Find the left navigation sidebar - look for the main nav container
    // The structure is: .aeN (main container) > .TK (items like Inbox, Starred, etc.)
    const mainNav = document.querySelector('.aeN');
    
    if (!mainNav) {
      console.log('Ez Gmail: Could not find main navigation (.aeN), retrying...');
      setTimeout(() => this.addLeftSidebarButton(), 1000);
      return;
    }
    
    // Check if button already exists
    if (document.querySelector('.ez-gmail-sidebar-btn')) {
      console.log('Ez Gmail: Sidebar button already exists');
      return;
    }

    console.log('Ez Gmail: Adding left sidebar button to main navigation');

    // Create button matching Gmail's exact style
    const ezButton = document.createElement('div');
    ezButton.className = 'TK ez-gmail-sidebar-btn';
    ezButton.setAttribute('data-ez-gmail', 'true');
    ezButton.setAttribute('data-extension', 'true'); // Prevent Gmail from removing it
    ezButton.setAttribute('role', 'button');
    ezButton.setAttribute('tabindex', '0');
    ezButton.setAttribute('aria-label', 'Ez Gmail Settings');
    
    // Add inline styles to position at bottom and center content
    ezButton.style.cssText = `
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 16px 0 !important;
      cursor: pointer !important;
      border-top: 1px solid #e0e0e0 !important;
      background: white !important;
      opacity: 0 !important;
      transition: all 0.3s ease !important;
      z-index: 100 !important;
      overflow: visible !important;
    `;
    
    ezButton.innerHTML = `
      <div class="TO" style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center; width: 100%;">
        <div class="aio UKr6le" style="margin-bottom: 6px; display: flex; justify-content: center; width: 100%;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
        </div>
        <div class="nU n1" style="font-size: 13px; line-height: 1.3; white-space: nowrap; font-weight: 500; width: 100%; text-align: center;">
          Ez<br>Gmail
        </div>
      </div>
    `;

    // Create popup menu
    const popupMenu = document.createElement('div');
    popupMenu.className = 'ez-gmail-popup-menu';
    popupMenu.style.cssText = `
      position: fixed !important;
      bottom: auto !important;
      left: auto !important;
      background: white !important;
      border: 1px solid #dadce0 !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: all 0.2s ease !important;
      z-index: 10000 !important;
      overflow: hidden !important;
      min-width: 200px !important;
    `;
    
    popupMenu.innerHTML = `
      <div class="ez-menu-item" data-action="insert-template" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #202124; transition: background 0.2s;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
        </svg>
        Insert Template
      </div>
      <div class="ez-menu-item" data-action="switch-signature" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #202124; transition: background 0.2s;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        Switch Signature
      </div>
      <div class="ez-menu-divider" style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
      <div class="ez-menu-item" data-action="settings" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #202124; transition: background 0.2s;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
        Ez Gmail Settings
      </div>
    `;
    
    // Add menu item hover effects
    const menuItems = popupMenu.querySelectorAll('.ez-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.background = '#f8f9fa';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = 'white';
      });
      
      // Add click handlers
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.getAttribute('data-action');
        
        if (action === 'insert-template') {
          // TODO: Open template selector
          console.log('Ez Gmail: Insert template clicked');
          chrome.runtime.sendMessage({ action: 'openTemplates' });
        } else if (action === 'switch-signature') {
          // TODO: Open signature switcher
          console.log('Ez Gmail: Switch signature clicked');
        } else if (action === 'settings') {
          window.location.hash = '#settings/ezgmail';
          setTimeout(() => this.showEzGmailSettings(), 100);
        }
        
        // Hide menu
        popupMenu.style.opacity = '0';
        popupMenu.style.visibility = 'hidden';
      });
    });
    
    // Append menu to document body (not button) so it's not constrained
    document.body.appendChild(popupMenu);
    
    let hoverTimeout;
    
    // Add hover effect with menu
    ezButton.addEventListener('mouseenter', () => {
      ezButton.style.backgroundColor = '#f8f9fa';
      ezButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      
      // Show menu after short delay
      hoverTimeout = setTimeout(() => {
        // Calculate position for fixed menu
        const buttonRect = ezButton.getBoundingClientRect();
        popupMenu.style.left = buttonRect.left + 'px';
        popupMenu.style.bottom = (window.innerHeight - buttonRect.top + 8) + 'px';
        popupMenu.style.width = buttonRect.width + 'px';
        
        popupMenu.style.opacity = '1';
        popupMenu.style.visibility = 'visible';
      }, 300);
    });
    
    ezButton.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      ezButton.style.backgroundColor = 'white';
      ezButton.style.boxShadow = 'none';
      
      // Hide menu
      setTimeout(() => {
        if (!popupMenu.matches(':hover')) {
          popupMenu.style.opacity = '0';
          popupMenu.style.visibility = 'hidden';
        }
      }, 100);
    });
    
    // Keep menu visible when hovering over it
    popupMenu.addEventListener('mouseenter', () => {
      popupMenu.style.opacity = '1';
      popupMenu.style.visibility = 'visible';
    });
    
    popupMenu.addEventListener('mouseleave', () => {
      popupMenu.style.opacity = '0';
      popupMenu.style.visibility = 'hidden';
    });
    
    // Add click handler (goes directly to settings)
    ezButton.addEventListener('click', () => {
      window.location.hash = '#settings/ezgmail';
      setTimeout(() => this.showEzGmailSettings(), 100);
    });

    // Set parent container to relative positioning
    mainNav.style.position = 'relative';
    
    // Append to bottom of main navigation
    mainNav.appendChild(ezButton);
    
    // Trigger fade-in animation
    setTimeout(() => {
      ezButton.style.opacity = '1';
    }, 50);
    
    // Add MutationObserver to keep button in place
    const observer = new MutationObserver((mutations) => {
      // Check if our button still exists
      if (!document.querySelector('.ez-gmail-sidebar-btn')) {
        console.log('Ez Gmail: Sidebar button removed, re-adding...');
        if (mainNav && mainNav.parentNode) {
          mainNav.appendChild(ezButton);
        }
      }
    });
    
    // Observe the main nav for changes
    observer.observe(mainNav, {
      childList: true,
      subtree: false
    });
    
    // Register with cleanup manager
    this.observers.push(observer);
    if (window.EzGmailCleanup) {
      window.EzGmailCleanup.registerObserver(observer, 'SettingsIntegration - Sidebar Button');
    }
    
    console.log('Ez Gmail: Sidebar button added successfully');
  }

  // Add tab to horizontal settings tabs
  addHorizontalTab() {
    // Find the horizontal tabs container - it's inside div.fY
    const tabsContainer = document.querySelector('.fY');
    
    if (!tabsContainer) {
      console.log('Ez Gmail: Could not find horizontal tabs container (.fY)');
      // Retry after a delay
      setTimeout(() => this.addHorizontalTab(), 500);
      return;
    }

    // Check if already added
    if (document.querySelector('.ez-gmail-horizontal-tab')) {
      console.log('Ez Gmail: Horizontal tab already exists');
      return;
    }
    
    console.log('Ez Gmail: Found tabs container, adding Ez Gmail tab...');

    // Create wrapper matching Gmail's .fZ structure
    const ezWrapper = document.createElement('div');
    ezWrapper.className = 'fZ ez-gmail-tab-wrapper';
    ezWrapper.setAttribute('data-ez-gmail', 'true');
    
    // Create tab matching Gmail's exact style
    const ezTab = document.createElement('div');
    ezTab.className = 'J-J5-Ji ez-gmail-horizontal-tab';
    ezTab.setAttribute('role', 'tab');
    ezTab.setAttribute('tabindex', '-1');
    ezTab.setAttribute('aria-selected', 'false');
    
    // Add inline styles to match Gmail tabs
    ezTab.style.cssText = `
      color: #5f6368;
      cursor: pointer;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      padding: 12px 16px;
      text-decoration: none;
      transition: all 0.2s;
      margin: 0;
      line-height: normal;
    `;
    
    ezTab.textContent = 'Ez Gmail';
    
    // Add tab to wrapper
    ezWrapper.appendChild(ezTab);
    
    // Add hover styles
    ezTab.addEventListener('mouseenter', () => {
      if (!ezTab.classList.contains('aKh')) {
        ezTab.style.color = '#202124';
      }
    });
    
    ezTab.addEventListener('mouseleave', () => {
      if (!ezTab.classList.contains('aKh')) {
        ezTab.style.color = '#5f6368';
      }
    });

    // Add click handler
    ezTab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove active state from all tabs
      tabsContainer.querySelectorAll('.J-J5-Ji').forEach(tab => {
        tab.classList.remove('aKh');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });
      
      // Add active state to our tab
      ezTab.classList.add('aKh');
      ezTab.setAttribute('aria-selected', 'true');
      ezTab.setAttribute('tabindex', '0');
      
      window.location.hash = '#settings/ezgmail';
      setTimeout(() => this.showEzGmailSettings(), 100);
    });

    // Insert BEFORE existing div.dJ element
    // Wait a moment for all tabs to be rendered
    setTimeout(() => {
      // Find the existing div.dJ element
      const existingDJ = tabsContainer.querySelector('.dJ');
      
      if (existingDJ) {
        console.log('Ez Gmail: Found div.dJ element, inserting Ez Gmail tab before it');
        
        // Remove if already exists (in wrong position)
        const existingWrapper = document.querySelector('.ez-gmail-tab-wrapper');
        if (existingWrapper && existingWrapper.parentNode) {
          existingWrapper.parentNode.removeChild(existingWrapper);
        }
        
        // Insert wrapper BEFORE existing div.dJ
        tabsContainer.insertBefore(ezWrapper, existingDJ);
        
        console.log('Ez Gmail: Tab wrapper inserted before existing dJ');
      } else {
        console.log('Ez Gmail: div.dJ not found, appending to end');
        tabsContainer.appendChild(ezWrapper);
      }
      
      // Verify insertion
      const verifyTab = document.querySelector('.ez-gmail-horizontal-tab');
      if (verifyTab) {
        const position = Array.from(tabsContainer.children).indexOf(verifyTab);
        console.log('Ez Gmail: Tab verification SUCCESS - Position:', position);
      } else {
        console.log('Ez Gmail: Tab verification FAILED');
      }
      
      // Check if we should activate the tab based on current hash
      const currentHash = window.location.hash;
      console.log('Ez Gmail: Current hash:', currentHash);
      if (currentHash.includes('settings/ezgmail')) {
        console.log('Ez Gmail: Activating tab - on Ez Gmail settings page');
        ezTab.classList.add('aKh');
        ezTab.setAttribute('aria-selected', 'true');
        ezTab.setAttribute('tabindex', '0');
        setTimeout(() => this.showEzGmailSettings(), 200);
      } else {
        console.log('Ez Gmail: Tab inactive - not on Ez Gmail settings page, hash:', currentHash);
      }
      
      // NOW attach event listeners to other tabs (after insertion)
      const allTabs = tabsContainer.querySelectorAll('.J-J5-Ji:not(.ez-gmail-horizontal-tab)');
      console.log('Ez Gmail: Attaching click handlers to', allTabs.length, 'other tabs');
      
      allTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          try {
            console.log('Ez Gmail: Other tab clicked, deactivating Ez Gmail tab');
            
            // Remove active state from our tab
            ezTab.classList.remove('aKh');
            ezTab.setAttribute('aria-selected', 'false');
            ezTab.setAttribute('tabindex', '-1');
            
            // Restore original Gmail settings content
            this.restoreOriginalContent();
          } catch (error) {
            console.error('Ez Gmail: Error in tab click handler:', error);
          }
        }, { capture: true });
      });
    }, 100);
  }

  // Add quick-link buttons to settings header
  addQuickLinks() {
    // Find the settings header
    const settingsHeader = document.querySelector('.nH.nn') || 
                          document.querySelector('h1');
    
    if (!settingsHeader || document.querySelector('.ez-gmail-quick-links')) {
      return;
    }

    // Create quick links container
    const quickLinks = document.createElement('div');
    quickLinks.className = 'ez-gmail-quick-links';
    quickLinks.style.cssText = `
      display: inline-flex;
      gap: 8px;
      align-items: center;
      gap: 4px;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
      </svg>
      Templates
    </button>
    `;

    // Insert after settings header
    if (settingsHeader.parentNode) {
      settingsHeader.parentNode.insertBefore(quickLinks, settingsHeader.nextSibling);
    }
  }

  // Show Ez Gmail settings panel
  showEzGmailSettings() {
    console.log('Ez Gmail: ========== SHOWING EZ GMAIL SETTINGS ==========');
    console.log('Ez Gmail: Current URL hash:', window.location.hash);
    console.log('Ez Gmail: Current page title:', document.title);
    
    // Hide navigation bar if present
    const navBar = document.getElementById('ez-gmail-navigation');
    if (navBar) {
      navBar.style.display = 'none';
      console.log('Ez Gmail: ✓ Navigation bar hidden');
    } else {
      console.log('Ez Gmail: ℹ Navigation bar not found (may not be initialized)');
    }
    
    // Add quick links to header
    console.log('Ez Gmail: Adding quick links to header...');
    this.addQuickLinks();
    
    // Find the settings content area
    console.log('Ez Gmail: Searching for settings content area...');
    const contentArea = document.querySelector('.Tm.aeJ') || 
                       document.querySelector('[role="main"]') ||
                       document.querySelector('.nH.w-asV.aiw');
    
    if (!contentArea) {
      console.error('Ez Gmail: ✗ FAILED - Could not find settings content area!');
      console.log('Ez Gmail: Tried selectors: .Tm.aeJ, [role="main"], .nH.w-asV.aiw');
      console.log('Ez Gmail: Available elements:', {
        'Tm.aeJ': document.querySelectorAll('.Tm.aeJ').length,
        '[role="main"]': document.querySelectorAll('[role="main"]').length,
        'nH.w-asV.aiw': document.querySelectorAll('.nH.w-asV.aiw').length
      });
      return;
    }
    
    console.log('Ez Gmail: ✓ Found settings content area:', contentArea.className);

    // Check if our panel already exists
    let settingsPanel = contentArea.querySelector('.ez-gmail-settings-panel');
    if (settingsPanel) {
      console.log('Ez Gmail: Settings panel already exists, showing it');
      
      // Hide Gmail content
      Array.from(contentArea.children).forEach(child => {
        if (!child.classList.contains('ez-gmail-settings-panel')) {
          child.style.display = 'none';
          child.setAttribute('data-ez-hidden', 'true');
        }
      });
      
      // Show our panel
      settingsPanel.style.display = 'block';
      return;
    }
    
    // Hide existing Gmail content instead of clearing it
    Array.from(contentArea.children).forEach(child => {
      if (!child.classList.contains('ez-gmail-settings-panel')) {
        child.style.display = 'none';
        child.setAttribute('data-ez-hidden', 'true');
      }
    });
    console.log('Ez Gmail: Hid existing Gmail content');
    
    // Create our settings panel
    settingsPanel = document.createElement('div');
    settingsPanel.className = 'ez-gmail-settings-panel';
    settingsPanel.setAttribute('data-ez-gmail-panel', 'true');
    settingsPanel.style.cssText = `
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
      background: white;
      position: relative;
      z-index: 1;
    `;

    settingsPanel.innerHTML = `
      <div style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="url(#ezGradient)">
            <defs>
              <linearGradient id="ezGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1a73e8;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#34a853;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
          <div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 400; color: #202124;">Ez Gmail Settings</h1>
            <p style="margin: 4px 0 0 0; color: #5f6368; font-size: 14px;">Customize your Gmail experience</p>
          </div>
        </div>
      </div>

      <!-- Navigation Settings -->
      <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500; color: #202124; display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a73e8">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          Navigation Bar
        </h2>
        <p style="color: #5f6368; margin-bottom: 20px; font-size: 14px;">Control the navigation bar appearance and behavior</p>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <label class="ez-setting-label" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; border-radius: 4px; transition: background 0.2s;">
            <input type="checkbox" id="ezNavEnabled" checked style="width: 18px; height: 18px; cursor: pointer;">
            <div>
              <div style="font-weight: 500; color: #202124;">Enable Navigation Bar</div>
              <div style="font-size: 13px; color: #5f6368;">Show the Ez Gmail navigation bar in email list views</div>
            </div>
          </label>
          
          <label class="ez-setting-label" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; border-radius: 4px; transition: background 0.2s;">
            <input type="checkbox" id="ezNavDatePicker" checked style="width: 18px; height: 18px; cursor: pointer;">
            <div>
              <div style="font-weight: 500; color: #202124;">Show Date Picker</div>
              <div style="font-size: 13px; color: #5f6368;">Display the date navigation controls</div>
            </div>
          </label>
          
          <label class="ez-setting-label" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; border-radius: 4px; transition: background 0.2s;">
            <input type="checkbox" id="ezNavPageNumbers" checked style="width: 18px; height: 18px; cursor: pointer;">
            <div>
              <div style="font-weight: 500; color: #202124;">Show Page Numbers</div>
              <div style="font-size: 13px; color: #5f6368;">Display page number indicators</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Template Settings -->
      <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500; color: #202124; display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#34a853">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-7v2H9v-2h6zm0 4v2H9v-2h6z"/>
          </svg>
          Email Templates
        </h2>
        <p style="color: #5f6368; margin-bottom: 20px; font-size: 14px;">Manage your email templates and signatures</p>
        
        <div style="display: flex; gap: 12px;">
          <button id="ezOpenTemplatesBtn" style="
            background: linear-gradient(135deg, #1a73e8 0%, #34a853 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
          ">
            Open Template Manager
          </button>
          
          <button id="ezImportTemplatesBtn" style="
            background: white;
            color: #1a73e8;
            border: 1px solid #dadce0;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
          ">
            Import Templates
          </button>
        </div>
      </div>

      <!-- Verse & Quote Settings -->
      <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500; color: #202124; display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ea4335">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h14v2H5zm0 4h14v2H5z"/>
          </svg>
          Bible Verses & Quotes
        </h2>
        <p style="color: #5f6368; margin-bottom: 20px; font-size: 14px;">Configure dynamic verse and quote features</p>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <label class="ez-setting-label" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; border-radius: 4px; transition: background 0.2s;">
            <input type="checkbox" id="ezVerseEnabled" checked style="width: 18px; height: 18px; cursor: pointer;">
            <div>
              <div style="font-weight: 500; color: #202124;">Enable Verse of the Day</div>
              <div style="font-size: 13px; color: #5f6368;">Automatically rotate Bible verses daily</div>
            </div>
          </label>
          
          <div style="padding: 12px; border-radius: 4px; background: #f8f9fa;">
            <label style="display: block; margin-bottom: 16px;">
              <div style="font-weight: 500; color: #202124; margin-bottom: 4px;">Religion</div>
              <div style="font-size: 13px; color: #5f6368; margin-bottom: 8px;">Select your religious tradition</div>
              <select id="ezReligion" style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #dadce0;
                border-radius: 4px;
                font-size: 14px;
                color: #202124;
                background: white;
                cursor: pointer;
              ">
                <option value="Christianity">Christianity</option>
                <option value="Judaism">Judaism</option>
                <option value="Islam">Islam</option>
                <option value="Other">Other/Secular</option>
              </select>
            </label>
            
            <label style="display: block; margin-bottom: 16px;">
              <div style="font-weight: 500; color: #202124; margin-bottom: 4px;">Theology/Denomination</div>
              <div style="font-size: 13px; color: #5f6368; margin-bottom: 8px;">Select your theological tradition (Default: Southern Baptist)</div>
              <select id="ezTheology" style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #dadce0;
                border-radius: 4px;
                font-size: 14px;
                color: #202124;
                background: white;
                cursor: pointer;
              ">
                <option value="Southern Baptist" selected>Southern Baptist</option>
                <option value="Independent Baptist">Independent Baptist</option>
                <option value="Reformed Baptist">Reformed Baptist</option>
                <option value="Methodist">Methodist</option>
                <option value="Presbyterian">Presbyterian</option>
                <option value="Lutheran">Lutheran</option>
                <option value="Pentecostal">Pentecostal</option>
                <option value="Non-Denominational">Non-Denominational</option>
                <option value="Catholic">Catholic</option>
                <option value="Orthodox">Orthodox</option>
                <option value="Anglican/Episcopal">Anglican/Episcopal</option>
                <option value="Assemblies of God">Assemblies of God</option>
                <option value="Church of Christ">Church of Christ</option>
                <option value="Nazarene">Nazarene</option>
                <option value="Evangelical Free">Evangelical Free</option>
              </select>
            </label>
            
            <label style="display: block; margin-bottom: 8px;">
              <div style="font-weight: 500; color: #202124; margin-bottom: 4px;">Bible Translation</div>
              <div style="font-size: 13px; color: #5f6368; margin-bottom: 8px;">Select your preferred Bible version for Verse of the Day</div>
              <select id="ezBibleTranslation" style="
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #dadce0;
                border-radius: 4px;
                font-size: 14px;
                color: #202124;
                background: white;
                cursor: pointer;
              ">
                <option value="CSB">CSB - Christian Standard Bible</option>
                <option value="ESV">ESV - English Standard Version</option>
                <option value="NIV">NIV - New International Version</option>
                <option value="NKJV">NKJV - New King James Version</option>
                <option value="KJV">KJV - King James Version</option>
                <option value="NLT">NLT - New Living Translation</option>
                <option value="NASB">NASB - New American Standard Bible</option>
                <option value="AMP">AMP - Amplified Bible</option>
                <option value="MSG">MSG - The Message</option>
              </select>
            </label>
          </div>
          
          <label class="ez-setting-label" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 12px; border-radius: 4px; transition: background 0.2s;">
            <input type="checkbox" id="ezQuoteEnabled" checked style="width: 18px; height: 18px; cursor: pointer;">
            <div>
              <div style="font-weight: 500; color: #202124;">Enable Quote of the Day</div>
              <div style="font-size: 13px; color: #5f6368;">Show inspirational quotes in templates</div>
            </div>
          </label>
          
          <!-- Verse Presets Section -->
          <div style="padding: 16px; border-radius: 4px; background: #e8f0fe; margin-top: 16px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 500; color: #202124;">Verse Translation Presets</h3>
            <p style="font-size: 13px; color: #5f6368; margin-bottom: 12px;">Download pre-translated verse collections for offline use</p>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
              <button id="ezDownloadCSB" class="ez-preset-btn" style="
                background: white;
                color: #1a73e8;
                border: 1px solid #dadce0;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
              ">
                📥 Download CSB
              </button>
              <button id="ezDownloadESV" class="ez-preset-btn" style="
                background: white;
                color: #1a73e8;
                border: 1px solid #dadce0;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
              ">
                📥 Download ESV
              </button>
              <button id="ezDownloadNKJV" class="ez-preset-btn" style="
                background: white;
                color: #1a73e8;
                border: 1px solid #dadce0;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
              ">
                📥 Download NKJV
              </button>
            </div>
            
            <h3 style="margin: 16px 0 12px 0; font-size: 16px; font-weight: 500; color: #202124;">Custom Verses</h3>
            <p style="font-size: 13px; color: #5f6368; margin-bottom: 12px;">Import your own verses or customize existing ones</p>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button id="ezImportVerses" class="ez-preset-btn" style="
                background: linear-gradient(135deg, #1a73e8 0%, #34a853 100%);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: transform 0.2s;
              ">
                📤 Import Custom Verses
              </button>
              <button id="ezExportVerses" class="ez-preset-btn" style="
                background: white;
                color: #1a73e8;
                border: 1px solid #dadce0;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
              ">
                💾 Export Custom Verses
              </button>
              <button id="ezAddVerse" class="ez-preset-btn" style="
                background: white;
                color: #34a853;
                border: 1px solid #dadce0;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
              ">
                ➕ Add New Verse
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%); border: 1px solid #dadce0; border-radius: 8px; padding: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 500; color: #202124;">About Ez Gmail</h2>
        <p style="color: #5f6368; margin-bottom: 12px; font-size: 14px; line-height: 1.6;">
          Ez Gmail enhances your Gmail experience with powerful navigation, email templates, and productivity features.
        </p>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="http://www.Ez-IT-Solutions.com" target="_blank" style="color: #1a73e8; text-decoration: none; font-weight: 500; font-size: 14px;">
            Visit Ez IT Solutions
          </a>
          <span style="color: #dadce0;">•</span>
          <span style="color: #5f6368; font-size: 14px;">Version 2.1 - Optimized</span>
          <span style="color: #dadce0;">•</span>
          <a href="#" id="ezHelpLink" style="color: #1a73e8; text-decoration: none; font-weight: 500; font-size: 14px;">
            Help & Documentation
          </a>
        </div>
      </div>
    `;

    console.log('Ez Gmail: Appending settings panel to content area...');
    contentArea.appendChild(settingsPanel);
    console.log('Ez Gmail: ✓ Settings panel appended to DOM');
    
    // Add event listeners for settings
    console.log('Ez Gmail: Attaching event listeners to settings controls...');
    this.attachSettingsListeners();
    console.log('Ez Gmail: ✓ Event listeners attached');
    
    // Show navigation bar on this settings page
    console.log('Ez Gmail: Showing navigation bar on settings tab...');
    this.showNavigationOnSettingsTab();
    
    console.log('Ez Gmail: ========== EZ GMAIL SETTINGS COMPLETE ==========');
  }

  // Attach event listeners to settings controls
  attachSettingsListeners() {
    console.log('Ez Gmail: attachSettingsListeners() called');
    // Add hover effects to all labels
    const labels = document.querySelectorAll('.ez-setting-label');
    labels.forEach(label => {
      label.addEventListener('mouseenter', () => {
        label.style.background = '#f8f9fa';
      });
      label.addEventListener('mouseleave', () => {
        label.style.background = 'transparent';
      });
    });
    
    // Open Templates button
    const openTemplatesBtn = document.getElementById('ezOpenTemplatesBtn');
    if (openTemplatesBtn) {
      openTemplatesBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({action: 'openTemplates'});
      });
      openTemplatesBtn.addEventListener('mouseenter', () => {
        openTemplatesBtn.style.transform = 'translateY(-2px)';
        openTemplatesBtn.style.boxShadow = '0 4px 12px rgba(26,115,232,0.4)';
      });
      openTemplatesBtn.addEventListener('mouseleave', () => {
        openTemplatesBtn.style.transform = 'translateY(0)';
        openTemplatesBtn.style.boxShadow = 'none';
      });
    }
    
    // Import Templates button
    const importTemplatesBtn = document.getElementById('ezImportTemplatesBtn');
    if (importTemplatesBtn) {
      importTemplatesBtn.addEventListener('click', () => {
        alert('Coming soon!');
      });
      importTemplatesBtn.addEventListener('mouseenter', () => {
        importTemplatesBtn.style.background = '#f8f9fa';
      });
      importTemplatesBtn.addEventListener('mouseleave', () => {
        importTemplatesBtn.style.background = 'white';
      });
    }
    
    // Help link
    const helpLink = document.getElementById('ezHelpLink');
    if (helpLink) {
      helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Help documentation coming soon!');
        return false;
      });
    }
    
    // Religion selector
    const religionSelect = document.getElementById('ezReligion');
    if (religionSelect) {
      religionSelect.addEventListener('change', (e) => {
        const religion = e.target.value;
        chrome.storage.local.set({ ezReligion: religion });
        console.log('Ez Gmail: Religion changed to:', religion);
        
        // Update theology options based on religion
        this.updateTheologyOptions(religion);
        
        // Update VerseQuoteManager if available
        if (window.EzGmailVerseQuoteManager) {
          const theologySelect = document.getElementById('ezTheology');
          const theology = theologySelect ? theologySelect.value : 'Southern Baptist';
          window.EzGmailVerseQuoteManager.saveReligionSettings(religion, theology);
        }
      });
    }
    
    // Theology selector
    const theologySelect = document.getElementById('ezTheology');
    if (theologySelect) {
      theologySelect.addEventListener('change', (e) => {
        const theology = e.target.value;
        chrome.storage.local.set({ ezTheology: theology });
        console.log('Ez Gmail: Theology changed to:', theology);
        
        // Update VerseQuoteManager if available
        if (window.EzGmailVerseQuoteManager) {
          const religionSelect = document.getElementById('ezReligion');
          const religion = religionSelect ? religionSelect.value : 'Christianity';
          window.EzGmailVerseQuoteManager.saveReligionSettings(religion, theology);
        }
      });
    }
    
    // Bible translation selector
    const bibleTranslation = document.getElementById('ezBibleTranslation');
    if (bibleTranslation) {
      bibleTranslation.addEventListener('change', (e) => {
        chrome.storage.local.set({ ezBibleTranslation: e.target.value });
        console.log('Ez Gmail: Bible translation changed to:', e.target.value);
      });
    }
    
    // Navigation settings
    const navEnabled = document.getElementById('ezNavEnabled');
    if (navEnabled) {
      navEnabled.addEventListener('change', (e) => {
        chrome.storage.local.set({ ezNavEnabled: e.target.checked });
        console.log('Ez Gmail: Navigation enabled:', e.target.checked);
      });
    }

    // Verse preset download buttons
    const downloadCSB = document.getElementById('ezDownloadCSB');
    if (downloadCSB) {
      downloadCSB.addEventListener('click', () => {
        if (window.EzGmailVersePresets) {
          window.EzGmailVersePresets.downloadPreset('CSB');
          alert('CSB verse preset downloaded!');
        }
      });
    }
    
    const downloadESV = document.getElementById('ezDownloadESV');
    if (downloadESV) {
      downloadESV.addEventListener('click', () => {
        if (window.EzGmailVersePresets) {
          window.EzGmailVersePresets.downloadPreset('ESV');
          alert('ESV verse preset downloaded!');
        }
      });
    }
    
    const downloadNKJV = document.getElementById('ezDownloadNKJV');
    if (downloadNKJV) {
      downloadNKJV.addEventListener('click', () => {
        if (window.EzGmailVersePresets) {
          window.EzGmailVersePresets.downloadPreset('NKJV');
          alert('NKJV verse preset downloaded!');
        }
      });
    }
    
    // Import custom verses
    const importVerses = document.getElementById('ezImportVerses');
    if (importVerses) {
      importVerses.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (file) {
            const text = await file.text();
            if (window.EzGmailVersePresets) {
              const success = await window.EzGmailVersePresets.importCustomVerses(text);
              if (success) {
                alert('Custom verses imported successfully!');
              } else {
                alert('Error importing verses. Please check file format.');
              }
            }
          }
        });
        fileInput.click();
      });
    }
    
    // Export custom verses
    const exportVerses = document.getElementById('ezExportVerses');
    if (exportVerses) {
      exportVerses.addEventListener('click', async () => {
        if (window.EzGmailVersePresets) {
          const success = await window.EzGmailVersePresets.exportCustomVerses();
          if (success) {
            alert('Custom verses exported successfully!');
          } else {
            alert('No custom verses to export.');
          }
        }
      });
    }
    
    // Add new verse
    const addVerse = document.getElementById('ezAddVerse');
    if (addVerse) {
      addVerse.addEventListener('click', () => {
        this.showAddVerseModal();
      });
    }
    
    // Add hover effects to preset buttons
    const presetBtns = document.querySelectorAll('.ez-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (btn.style.background === 'white' || btn.style.background.includes('rgb(255, 255, 255)')) {
          btn.style.background = '#f8f9fa';
        } else if (btn.style.background.includes('gradient')) {
          btn.style.transform = 'translateY(-2px)';
          btn.style.boxShadow = '0 4px 12px rgba(26,115,232,0.4)';
        }
      });
      btn.addEventListener('mouseleave', () => {
        if (btn.style.background === '#f8f9fa' || btn.style.background.includes('rgb(248, 249, 250)')) {
          btn.style.background = 'white';
        } else if (btn.style.background.includes('gradient')) {
          btn.style.transform = 'translateY(0)';
          btn.style.boxShadow = 'none';
        }
      });
    });

    // Load saved settings
    chrome.storage.local.get([
      'ezNavEnabled', 'ezNavDatePicker', 'ezNavPageNumbers', 
      'ezVerseEnabled', 'ezQuoteEnabled', 'ezBibleTranslation',
      'ezReligion', 'ezTheology'
    ], (result) => {
      if (result.ezNavEnabled !== undefined) {
        const checkbox = document.getElementById('ezNavEnabled');
        if (checkbox) checkbox.checked = result.ezNavEnabled;
      }
      
      // Load Religion (default to Christianity)
      const religionSelect = document.getElementById('ezReligion');
      if (religionSelect) {
        religionSelect.value = result.ezReligion || 'Christianity';
        // Update theology options based on loaded religion
        this.updateTheologyOptions(result.ezReligion || 'Christianity');
      }
      
      // Load Theology (default to Southern Baptist)
      const theologySelect = document.getElementById('ezTheology');
      if (theologySelect) {
        theologySelect.value = result.ezTheology || 'Southern Baptist';
      }
      
      // Load Bible translation (default to CSB)
      const translationSelect = document.getElementById('ezBibleTranslation');
      if (translationSelect) {
        translationSelect.value = result.ezBibleTranslation || 'CSB';
      }
    });
  }
  
  // Show add verse modal
  showAddVerseModal() {
    const modal = document.createElement('div');
    modal.className = 'ez-variable-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    modal.innerHTML = `
      <div style="background: white; border-radius: 8px; padding: 24px; max-width: 500px; width: 90%;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500; color: #202124;">Add Custom Verse</h2>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #202124;">Verse Key</label>
          <input type="text" id="verseKey" placeholder="e.g., john-3:16" style="width: 100%; padding: 8px; border: 1px solid #dadce0; border-radius: 4px;">
          <small style="color: #5f6368; font-size: 12px;">Use format: book-chapter:verse (e.g., john-3:16, ps-23:1)</small>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #202124;">Reference</label>
          <input type="text" id="verseReference" placeholder="e.g., John 3:16" style="width: 100%; padding: 8px; border: 1px solid #dadce0; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #202124;">Translation</label>
          <input type="text" id="verseVersion" placeholder="e.g., CSB, ESV, NKJV" style="width: 100%; padding: 8px; border: 1px solid #dadce0; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 500; color: #202124;">Verse Text</label>
          <textarea id="verseText" rows="4" placeholder="Enter the verse text..." style="width: 100%; padding: 8px; border: 1px solid #dadce0; border-radius: 4px; resize: vertical;"></textarea>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button id="cancelAddVerse" style="padding: 8px 16px; border: 1px solid #dadce0; border-radius: 4px; background: white; cursor: pointer;">Cancel</button>
          <button id="saveAddVerse" style="padding: 8px 16px; border: none; border-radius: 4px; background: linear-gradient(135deg, #1a73e8 0%, #34a853 100%); color: white; cursor: pointer;">Add Verse</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('cancelAddVerse').addEventListener('click', () => modal.remove());
    document.getElementById('saveAddVerse').addEventListener('click', async () => {
      const key = document.getElementById('verseKey').value.trim();
      const reference = document.getElementById('verseReference').value.trim();
      const version = document.getElementById('verseVersion').value.trim();
      const text = document.getElementById('verseText').value.trim();
      
      if (!key || !reference || !version || !text) {
        alert('Please fill in all fields');
        return;
      }
      
      const verse = { text, reference, version };
      
      if (window.EzGmailVersePresets) {
        await window.EzGmailVersePresets.addCustomVerse(key, verse);
        alert('Custom verse added successfully!');
        modal.remove();
      }
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  // Update theology options based on selected religion
  updateTheologyOptions(religion) {
    const theologySelect = document.getElementById('ezTheology');
    if (!theologySelect) return;
    
    // Get theologies from VerseQuoteManager if available
    let theologies = [];
    if (window.EzGmailVerseQuoteManager) {
      theologies = window.EzGmailVerseQuoteManager.getTheologies(religion);
    } else {
      // Fallback theologies
      const theologyMap = {
        'Christianity': [
          'Southern Baptist', 'Independent Baptist', 'Reformed Baptist',
          'Methodist', 'Presbyterian', 'Lutheran', 'Pentecostal',
          'Non-Denominational', 'Catholic', 'Orthodox', 'Anglican/Episcopal',
          'Assemblies of God', 'Church of Christ', 'Nazarene', 'Evangelical Free'
        ],
        'Judaism': ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist'],
        'Islam': ['Sunni', 'Shia', 'Sufi'],
        'Other': ['Secular', 'Spiritual', 'Interfaith']
      };
      theologies = theologyMap[religion] || [];
    }
    
    // Clear and repopulate options
    theologySelect.innerHTML = '';
    theologies.forEach(theology => {
      const option = document.createElement('option');
      option.value = theology;
      option.textContent = theology;
      theologySelect.appendChild(option);
    });
    
    // Set default based on religion
    if (religion === 'Christianity') {
      theologySelect.value = 'Southern Baptist';
    } else if (theologies.length > 0) {
      theologySelect.value = theologies[0];
    }
    
    console.log(`Ez Gmail: Updated theology options for ${religion}`);
  }

  // Show navigation bar on Ez Gmail settings tab
  showNavigationOnSettingsTab() {
    // Check if we have a navigation instance
    if (window.ezGmailNavigation) {
      const nav = document.getElementById('ez-gmail-navigation');
      if (nav) {
        nav.style.display = 'block';
      }
    }
  }

  // Restore original Gmail settings content
  restoreOriginalContent() {
    // Only restore if we're on a settings page
    if (!window.location.hash.includes('settings')) {
      console.log('Ez Gmail: Not on settings page, skipping restore');
      return;
    }
    
    console.log('Ez Gmail: Restoring original Gmail settings content');
    
    const contentArea = document.querySelector('.Tm.aeJ') || 
                       document.querySelector('[role="main"]') ||
                       document.querySelector('.nH.w-asV.aiw');
    
    if (!contentArea) {
      console.log('Ez Gmail: Content area not found');
      return;
    }
    
    // Hide our panel instead of removing it (for faster re-showing)
    const ezPanels = contentArea.querySelectorAll('.ez-gmail-settings-panel, [data-ez-gmail-panel="true"]');
    ezPanels.forEach(panel => {
      console.log('Ez Gmail: Hiding Ez Gmail settings panel');
      panel.style.display = 'none';
    });
    
    // Show navigation bar if it was hidden
    const navBar = document.getElementById('ez-gmail-navigation');
    if (navBar) {
      navBar.style.display = '';
      console.log('Ez Gmail: Navigation bar restored');
    }
    
    // Unhide all Gmail content that we previously hid
    const hiddenElements = contentArea.querySelectorAll('[data-ez-hidden="true"]');
    hiddenElements.forEach(element => {
      element.style.display = '';
      element.removeAttribute('data-ez-hidden');
      console.log('Ez Gmail: Unhid Gmail content element');
    });
    
    console.log('Ez Gmail: Gmail content restored, letting Gmail handle navigation');
  }

  // Monitor for navigation to settings
  monitorSettingsNavigation() {
    // Track if we're intentionally on Ez Gmail settings
    let onEzGmailSettings = false;
    let isRestoringHash = false;
    
    // Watch for hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      console.log('Ez Gmail: Hash changed to:', hash);
      
      // If we're in the middle of restoring the hash, ignore this event
      if (isRestoringHash) {
        isRestoringHash = false;
        console.log('Ez Gmail: Ignoring hash change (we caused it)');
        return;
      }
      
      if (hash.includes('settings')) {
        if (!this.settingsTabAdded) {
          setTimeout(() => this.waitForSettingsPage(), 500);
        }
        
        // Check if we're on Ez Gmail settings specifically
        if (hash.includes('settings/ezgmail')) {
          console.log('Ez Gmail: Navigated to Ez Gmail settings, showing panel');
          onEzGmailSettings = true;
          setTimeout(() => this.showEzGmailSettings(), 100);
        } else {
          // Check if our tab is still active (user clicked our tab, not another tab)
          const ezTab = document.querySelector('.ez-gmail-horizontal-tab');
          const isEzTabActive = ezTab && ezTab.classList.contains('aKh');
          
          if (isEzTabActive && hash === '#settings') {
            // Gmail reset the hash but our tab is still active - keep showing our panel
            console.log('Ez Gmail: Hash reset but Ez tab still active, keeping panel visible');
            onEzGmailSettings = true;
            // Don't call showEzGmailSettings again, panel should already be visible
          } else {
            // On other settings pages - restore original content and deactivate our tab
            console.log('Ez Gmail: Navigated to other settings page:', hash);
            onEzGmailSettings = false;
            this.restoreOriginalContent();
            
            // Deactivate our tab
            if (ezTab) {
              ezTab.classList.remove('aKh');
              ezTab.setAttribute('aria-selected', 'false');
              ezTab.setAttribute('tabindex', '-1');
            }
          }
        }
      } else {
        // Navigating away from settings entirely - hide Ez Gmail settings panel if visible
        const ezPanel = document.querySelector('.ez-gmail-settings-panel');
        if (ezPanel && ezPanel.parentNode) {
          console.log('Ez Gmail: Navigating away from settings, removing Ez Gmail panel');
          ezPanel.parentNode.removeChild(ezPanel);
          this.originalContent = null; // Clear stored content
        }
      }
    });
  }

  // Cleanup
  destroy() {
    console.log('Ez Gmail: Destroying SettingsIntegration...');
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Disconnect all tracked observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
    
    console.log('Ez Gmail: SettingsIntegration destroyed');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ezGmailSettings = new SettingsIntegration();
    window.ezGmailSettings.init();
  });
} else {
  window.ezGmailSettings = new SettingsIntegration();
  window.ezGmailSettings.init();
}
