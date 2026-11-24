// Ez Gmail - Settings Integration
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Adds custom settings tab to Gmail settings page

class SettingsIntegration {
  constructor() {
    this.initialized = false; // Guard against duplicate init (double listeners/observers)
    this.settingsTabAdded = false;
    this.observer = null;
    this.observers = []; // Track all observers for cleanup
    this.protectionObserver = null; // Track content protection observer
    this.ezGmailSettingsActive = false; // Track if Ez Gmail settings are currently showing
    this.lastShowSettingsTime = 0; // Rate limiting for showEzGmailSettings
    this.enforcementInterval = null; // Interval to enforce hash and tab state
    this.tabObserver = null; // Observer watching the settings tab bar
  }

  // Initialize settings integration
  init() {
    if (this.initialized) {
      console.log('Ez Gmail: Settings integration already initialized, skipping');
      return;
    }
    this.initialized = true;
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

  // Find Gmail's settings tabs container. The real tab bar is the
  // smallest ancestor containing >=5 real settings anchors
  // (<a role="tab" href="...#settings/<name>">). Transient "Loading..."
  // skeletons, hidden stale DOM ("Fetching mail..."), and unrelated
  // [role=tab] elements can never satisfy that, so this returns null
  // until Gmail's real strip is rendered.
  findTabsContainer() {
    const isRealTab = (el) =>
      !this.isExtensionElement(el) &&
      el.offsetParent !== null &&                 // hidden/stale DOM
      !!(el.textContent || '').trim();            // placeholder

    const walkUp = (el, sel, need) => {
      let node = el.parentElement;
      while (node && node !== document.body) {
        if (node.querySelectorAll(sel).length >= need) return node;
        node = node.parentElement;
      }
      return el.parentElement;
    };

    // Primary: current markup - real settings anchors with real hrefs
    const anchors = Array.from(
      document.querySelectorAll('a[role="tab"][href*="#settings/"]'))
      .filter(isRealTab);
    if (anchors.length >= 5) {
      return walkUp(anchors[0], 'a[role="tab"][href*="#settings/"]', 5);
    }

    // Fallback: legacy .J-J5-Ji div tabs - also require >=5 so a tiny
    // transient bar can never win.
    const legacy = Array.from(document.querySelectorAll('.J-J5-Ji'))
      .filter(isRealTab);
    if (legacy.length >= 5) {
      return walkUp(legacy[0], '.J-J5-Ji', 5);
    }

    return null; // Real strip not rendered yet - caller retries
  }

  // Get all settings tabs inside the container (Gmail tabs + ours).
  // Gmail's current markup uses <a role="tab"> inside .r1 cells; older
  // versions used .J-J5-Ji divs. Union both so we always get everything.
  getSettingsTabs(container) {
    if (!container) return [];
    const tabs = container.querySelectorAll('.J-J5-Ji, [role="tab"]');
    return Array.from(tabs);
  }

  // True for elements owned by this extension - these must never be
  // hidden or "restored" by the Gmail-content hide/restore logic
  // (e.g. the navigation bar, our settings panel).
  isExtensionElement(el) {
    if (!el || el.nodeType !== 1) return false;
    return el.id === 'ez-gmail-navigation' ||
           el.hasAttribute('data-extension-element') ||
           el.classList.contains('ez-gmail-settings-panel') ||
           el.classList.contains('ez-gmail-popup-menu') ||
           el.classList.contains('ez-gmail-sidebar-btn');
  }

  // Wait for settings page elements
  waitForSettingsPage() {
    const checkSettings = setInterval(() => {
      // Check if we're on settings page
      if (!window.location.hash.includes('settings')) {
        return;
      }

      // Look for settings tabs container
      const tabsContainer = this.findTabsContainer();
      if (!tabsContainer) return;

      // Decide by DOM, not by the settingsTabAdded flag - the flag goes
      // stale (tab dropped on re-render, or user left settings and the
      // flag was never reset).
      if (tabsContainer.querySelector('.ez-gmail-horizontal-tab')) {
        clearInterval(checkSettings); // already there - done
        return;
      }

      console.log('Ez Gmail: Settings page detected, adding custom tab');
      this.addCustomSettingsTab(tabsContainer);
      clearInterval(checkSettings);
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
      <div class="ez-menu-item" data-action="pick-verse" style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; color: #202124; transition: background 0.2s;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
        </svg>
        Signature Verse
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
          try {
            chrome.runtime.sendMessage({ action: 'openTemplates' });
          } catch (e) {
            console.warn('Ez Gmail: Could not open templates (context invalidated)', e);
          }
        } else if (action === 'switch-signature') {
          console.log('Ez Gmail: Switch signature clicked');
          if (window.EzGmailSignatureManager) {
            window.EzGmailSignatureManager.showSignatureSwitcher();
          } else {
            console.warn('Ez Gmail: Signature manager not available');
          }
        } else if (action === 'pick-verse') {
          console.log('Ez Gmail: Pick verse clicked');
          if (window.EzGmailVerseQuoteManager) {
            window.EzGmailVerseQuoteManager.showVersePicker();
          } else {
            console.warn('Ez Gmail: Verse manager not available');
          }
        } else if (action === 'settings') {
          window.location.hash = '#settings/ezgmail';
          // hashchange event will handle showing the panel
        }
        
        // Hide menu
        popupMenu.style.opacity = '0';
        popupMenu.style.visibility = 'hidden';
      });
    });
    
    // Append menu to document body (not button) so it's not constrained
    document.body.appendChild(popupMenu);
    
    // Position and show the popup menu above the button
    const showMenu = () => {
      const buttonRect = ezButton.getBoundingClientRect();
      popupMenu.style.left = buttonRect.left + 'px';
      popupMenu.style.bottom = (window.innerHeight - buttonRect.top + 8) + 'px';
      popupMenu.style.width = buttonRect.width + 'px';
      popupMenu.style.opacity = '1';
      popupMenu.style.visibility = 'visible';
    };
    
    const hideMenu = () => {
      popupMenu.style.opacity = '0';
      popupMenu.style.visibility = 'hidden';
    };
    
    const isMenuVisible = () => popupMenu.style.visibility === 'visible';
    
    // Hover only highlights the button - the menu opens on CLICK only
    ezButton.addEventListener('mouseenter', () => {
      ezButton.style.backgroundColor = '#f8f9fa';
      ezButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    ezButton.addEventListener('mouseleave', () => {
      ezButton.style.backgroundColor = 'white';
      ezButton.style.boxShadow = 'none';
    });
    
    // Click toggles the popup menu (does NOT navigate)
    ezButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isMenuVisible()) {
        hideMenu();
      } else {
        showMenu();
      }
    });
    
    // Close the menu when clicking anywhere else
    document.addEventListener('click', (e) => {
      if (isMenuVisible() && !popupMenu.contains(e.target) && !ezButton.contains(e.target)) {
        hideMenu();
      }
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
  addHorizontalTab(retryCount = 0) {
    // Find the horizontal tabs container - it's inside div.fY (or a fallback)
    const tabsContainer = this.findTabsContainer();
    
    if (!tabsContainer) {
      // Bound retries to avoid an infinite loop when not on the settings page
      if (retryCount < 20 && window.location.hash.includes('settings')) {
        setTimeout(() => this.addHorizontalTab(retryCount + 1), 500);
      } else if (retryCount >= 20) {
        console.log('Ez Gmail: Gave up looking for settings tabs container');
      }
      return;
    }
    // Guard against concurrent calls - the deferred insertion below can
    // race and insert duplicate tabs.
    if (this._addingTab) {
      return;
    }

    // Check if already added - but verify it's inside the real tab bar,
    // not a stale placeholder container. Remove ALL copies found
    // elsewhere (races can create duplicates).
    const existingTabs = document.querySelectorAll('.ez-gmail-horizontal-tab');
    let inRealBar = false;
    existingTabs.forEach(tab => {
      if (tabsContainer.contains(tab)) {
        if (!inRealBar) {
          inRealBar = true;
        } else {
          // Duplicate inside the real bar - remove it
          (tab.closest('.ez-gmail-tab-wrapper') || tab).remove();
        }
      } else {
        // Stranded in a stale container - remove it
        (tab.closest('.ez-gmail-tab-wrapper') || tab).remove();
      }
    });
    if (inRealBar) {
      console.log('Ez Gmail: Horizontal tab already exists');
      return;
    }
    if (existingTabs.length) {
      console.log('Ez Gmail: Removed tab from stale container, re-adding to real tab bar');
    }

    this._addingTab = true;

    console.log('Ez Gmail: Found tabs container, adding Ez Gmail tab...');

    // Create wrapper matching Gmail's .fZ structure.
    // display:contents makes the wrapper layout-neutral - the stale fZ
    // class was rendering as a block box that pushed content down and
    // hid the tab from the tab strip.
    const ezWrapper = document.createElement('div');
    ezWrapper.className = 'fZ ez-gmail-tab-wrapper';
    ezWrapper.setAttribute('data-ez-gmail', 'true');
    ezWrapper.style.display = 'contents';
    
    // Create tab matching Gmail's style. NO Gmail classes (.J-J5-Ji,
    // .f0 etc.) - in the new markup they carry layout styles that can
    // stretch our div over the whole strip and swallow other tabs'
    // clicks. role=tab is enough for our own detection.
    const ezTab = document.createElement('div');
    ezTab.className = 'ez-gmail-horizontal-tab';
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
      height: auto !important;
    `;
    
    ezTab.textContent = 'Ez Gmail';
    
    // Add tab to wrapper
    ezWrapper.appendChild(ezTab);
    
    // Add hover styles
    ezTab.addEventListener('mouseenter', () => {
      if (ezTab.getAttribute('aria-selected') !== 'true') {
        ezTab.style.color = '#202124';
      }
    });
    
    ezTab.addEventListener('mouseleave', () => {
      if (ezTab.getAttribute('aria-selected') !== 'true') {
        ezTab.style.color = '#5f6368';
      }
    });

    // Add click handler
    ezTab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove active state from all tabs
      this.getSettingsTabs(tabsContainer).forEach(tab => {
        tab.classList.remove('aKh');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      });
      
      // Add active state to our tab (no aKh - that Gmail class carries
      // height:56px and blows up the tab row)
      ezTab.setAttribute('aria-selected', 'true');
      ezTab.setAttribute('tabindex', '0');
      
      if (window.location.hash === '#settings/ezgmail') {
        // Same-hash navigation - hashchange won't fire, show directly.
        // (Happens when Gmail kept our hash while showing General's
        // content, leaving clicks here as no-ops.)
        this._lastEzGmailNav = Date.now();
        this.showEzGmailSettings();
      } else {
        window.location.hash = '#settings/ezgmail';
        // hashchange event will handle showing the panel
      }
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
      
      // Verify insertion (wrapper is the direct child of the container)
      const verifyTab = document.querySelector('.ez-gmail-horizontal-tab');
      if (verifyTab) {
        const position = Array.from(tabsContainer.children).indexOf(ezWrapper);
        console.log('Ez Gmail: Tab verification SUCCESS - Position:', position);
      } else {
        console.log('Ez Gmail: Tab verification FAILED');
      }
      
      // Check if we should activate the tab based on current hash
      const currentHash = window.location.hash;
      console.log('Ez Gmail: Current hash:', currentHash);
      if (currentHash.includes('settings/ezgmail')) {
        console.log('Ez Gmail: Activating tab - on Ez Gmail settings page');
        ezTab.setAttribute('aria-selected', 'true');
        ezTab.setAttribute('tabindex', '0');
        setTimeout(() => this.showEzGmailSettings(), 200);
      } else {
        console.log('Ez Gmail: Tab inactive - not on Ez Gmail settings page, hash:', currentHash);
      }
      
      // NOW attach event listeners to other tabs (after insertion)
      const allTabs = this.getSettingsTabs(tabsContainer)
        .filter(tab => !tab.classList.contains('ez-gmail-horizontal-tab'));
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

            // Resolve the clicked tab's canonical route. The element
            // receiving this listener may be a div wrapper - check the
            // anchor itself, a child, or an ancestor.
            const resolveTarget = () => {
              const anchor = tab.tagName === 'A' ? tab :
                            (tab.querySelector('a[href]') ||
                             tab.closest('a[href]'));
              let target = null;
              if (anchor) {
                // Gmail hrefs are often ABSOLUTE
                // (mail.google.com/mail/u/0/#settings/general) - pull
                // the hash portion out rather than requiring '#'.
                const m = (anchor.getAttribute('href') || '')
                            .match(/#settings\/[\w-]+/);
                if (m) target = m[0];
              }
              if (!target) {
                // General's anchor points at bare #settings, but its
                // canonical route is /general.
                const label = (tab.textContent || '').trim().toLowerCase();
                if (label === 'general') target = '#settings/general';
              }
              return target;
            };
            const target = resolveTarget();
            console.log('Ez Gmail: Other-tab route resolved to:', target);

            // Drop back to the neutral #settings baseline NOW, before
            // Gmail's handler runs - same starting point as a plain
            // 'See all settings' load. Writing the TARGET here proved
            // fragile: Gmail's click logic keys off the current hash,
            // and seeing the destination already in the URL confused it.
            const hNow = window.location.hash;
            if (hNow.includes('ezgmail')) {
              console.log('Ez Gmail: Pre-writing baseline hash', hNow, '-> #settings');
              window.history.replaceState(null, '', '#settings');
            }

            // Safety net: if Gmail writes its own hash late and lands on
            // a stale value, sync again after it settles.
            const syncUrl = () => {
              try {
                if (!target) return;
                const h = window.location.hash;
                const stale = h === '#settings' || h === '#settings/' ||
                              h.includes('ezgmail');
                if (stale && h !== target) {
                  console.log('Ez Gmail: Syncing stale hash', h, '->', target);
                  window.history.replaceState(null, '', target);
                }
              } catch (e) { /* non-fatal */ }
            };
            setTimeout(syncUrl, 150);
            setTimeout(syncUrl, 500);
            setTimeout(syncUrl, 1200);
          } catch (error) {
            console.error('Ez Gmail: Error in tab click handler:', error);
          }
        }, { capture: true });
      });

      this._addingTab = false;
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
      margin-left: 16px;
    `;

    quickLinks.innerHTML = `
      <button class="ez-gmail-quick-link" data-action="templates" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid #dadce0; border-radius: 16px; background: #fff; color: #1a73e8; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
        </svg>
        Templates
      </button>
    `;

    // Wire up the templates button to open the templates page
    const templatesBtn = quickLinks.querySelector('[data-action="templates"]');
    if (templatesBtn) {
      templatesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          chrome.runtime.sendMessage({ action: 'openTemplates' }, () => {
            if (chrome.runtime.lastError) {
              // Fallback: open the page directly
              try {
                window.open(chrome.runtime.getURL('pages/templates.html'), '_blank');
              } catch (e2) { /* context invalidated */ }
            }
          });
        } catch (e) {
          console.warn('Ez Gmail: Could not open templates (context invalidated)', e);
        }
      });
      templatesBtn.addEventListener('mouseenter', () => {
        templatesBtn.style.background = '#e8f0fe';
      });
      templatesBtn.addEventListener('mouseleave', () => {
        templatesBtn.style.background = '#fff';
      });
    }

    // Insert after settings header
    if (settingsHeader.parentNode) {
      settingsHeader.parentNode.insertBefore(quickLinks, settingsHeader.nextSibling);
    }
  }

  // Show Ez Gmail settings panel
  showEzGmailSettings() {
    // CRITICAL: Set flag IMMEDIATELY to prevent race conditions
    this.ezGmailSettingsActive = true;
    console.log('Ez Gmail: ✓ Ez Gmail settings marked as ACTIVE (at start)');
    
    // Rate limiting: Don't call this more than once per 200ms
    const now = Date.now();
    if (now - this.lastShowSettingsTime < 200) {
      console.log('Ez Gmail: ⚠ Rate limited - showEzGmailSettings called too soon, skipping');
      return;
    }
    this.lastShowSettingsTime = now;
    
    console.log('Ez Gmail: ========== SHOWING EZ GMAIL SETTINGS ==========');
    console.log('Ez Gmail: Current URL hash:', window.location.hash);
    console.log('Ez Gmail: Current page title:', document.title);
    
    // CRITICAL: Deactivate all other tabs and activate only Ez Gmail tab
    console.log('Ez Gmail: Searching for tabs...');
    const tabsContainer = this.findTabsContainer();
    if (!tabsContainer) {
      // Gmail may not have rendered the settings tabs yet - retry a few
      // times, then give up until the next navigation event.
      this._missingTabsRetries = (this._missingTabsRetries || 0) + 1;
      if (this._missingTabsRetries <= 20) {
        console.warn('Ez Gmail: ⚠ Tabs container not found, retrying shortly...');
        setTimeout(() => this.showEzGmailSettings(), 300);
      } else {
        console.warn('Ez Gmail: ⚠ Tabs container still not found, giving up for now');
      }
      return;
    } else {
      console.log('Ez Gmail: ✓ Tabs container found');
    }
    
    const allTabs = this.getSettingsTabs(tabsContainer);
    console.log(`Ez Gmail: Found ${allTabs.length} total tabs`);
    let ezGmailTabFound = false;
    
    allTabs.forEach((tab, index) => {
      const isEzGmailTab = tab.classList.contains('ez-gmail-horizontal-tab');
      const tabText = tab.textContent ? tab.textContent.trim() : '(no text)';
      console.log(`Ez Gmail: Tab ${index}: "${tabText}" - Ez Gmail: ${isEzGmailTab}`);
      
      if (isEzGmailTab) {
        // Activate Ez Gmail tab
        tab.classList.add('aKh');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        tab.style.setProperty('color', '#1a73e8', 'important');
        ezGmailTabFound = true;
        console.log('Ez Gmail: ✓ Ez Gmail tab activated');
      } else {
        // Deactivate all other tabs
        tab.classList.remove('aKh');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    });
    
    if (!ezGmailTabFound) {
      console.log('Ez Gmail: ⚠ Ez Gmail tab not found in tab list!');
      console.log('Ez Gmail: Attempting to find tab by other selectors...');
      const ezTab = document.querySelector('.ez-gmail-horizontal-tab');
      if (ezTab) {
        const tabText = ezTab.textContent ? ezTab.textContent.trim() : '(no text)';
        console.log(`Ez Gmail: ✓ Found Ez Gmail tab by direct selector: "${tabText}"`);
        ezTab.setAttribute('aria-selected', 'true');
        ezTab.setAttribute('tabindex', '0');
        ezTab.style.setProperty('color', '#1a73e8', 'important');
        ezTab.style.setProperty('box-shadow', 'inset 0 -2px 0 0 #1a73e8', 'important');
        ezGmailTabFound = true;
      } else {
        // Gmail re-rendered the tab bar and dropped our tab - re-add it
        console.warn('Ez Gmail: ✗ Ez Gmail tab missing - re-adding it');
        this.settingsTabAdded = false;
        this.addHorizontalTab();
      }
    }
    
    // Don't hide navigation bar on settings - it's part of our UI
    console.log('Ez Gmail: Keeping navigation bar visible on settings page');
    
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
      console.log('Ez Gmail: ✓ Settings panel already exists, showing it');
      
      // Hide Gmail content aggressively - but never our own elements
      let hiddenCount = 0;
      Array.from(contentArea.children).forEach(child => {
        if (!this.isExtensionElement(child)) {
          child.style.display = 'none';
          child.style.visibility = 'hidden';
          child.style.opacity = '0';
          child.style.position = 'absolute';
          child.style.zIndex = '-1';
          child.setAttribute('data-ez-hidden', 'true');
          hiddenCount++;
        }
      });
      console.log(`Ez Gmail: ✓ Hid ${hiddenCount} Gmail content elements`);
      
      // Show our panel
      settingsPanel.style.display = 'block';
      settingsPanel.style.visibility = 'visible';
      settingsPanel.style.opacity = '1';
      settingsPanel.style.position = 'relative';
      settingsPanel.style.zIndex = '1000';
      console.log('Ez Gmail: ✓ Ez Gmail panel now visible');
      
      // Re-enable protection
      console.log('Ez Gmail: Re-enabling content protection...');
      this.protectEzGmailContent(contentArea, settingsPanel);
      
      // Resume enforcement - it was cleared when Gmail stripped /ezgmail
      // from the URL and restoreOriginalContent() ran. Without this, the
      // nav bar and tab state stop being enforced.
      this.startEnforcement();
      
      return;
    }
    
    // Hide existing Gmail content instead of clearing it
    console.log('Ez Gmail: Hiding Gmail content children...');
    
    // First, collapse the content area AND its parent containers
    contentArea.style.setProperty('min-height', '0', 'important');
    contentArea.style.setProperty('padding', '0', 'important');
    
    // Also collapse parent .nH container
    const parentContainer = contentArea.closest('.nH');
    if (parentContainer) {
      parentContainer.style.setProperty('min-height', '0', 'important');
      parentContainer.style.setProperty('padding-top', '0', 'important');
      parentContainer.style.setProperty('padding-bottom', '0', 'important');
      console.log('Ez Gmail: ✓ Collapsed parent container padding');
    }
    
    let hiddenCount = 0;
    Array.from(contentArea.children).forEach(child => {
      if (!this.isExtensionElement(child)) {
        // Use display:none and height:0 to completely collapse the element
        child.style.setProperty('display', 'none', 'important');
        child.style.setProperty('height', '0', 'important');
        child.style.setProperty('min-height', '0', 'important');
        child.style.setProperty('max-height', '0', 'important');
        child.style.setProperty('visibility', 'hidden', 'important');
        child.style.setProperty('opacity', '0', 'important');
        child.style.setProperty('position', 'absolute', 'important');
        child.style.setProperty('z-index', '-9999', 'important');
        child.style.setProperty('overflow', 'hidden', 'important');
        child.setAttribute('data-ez-hidden', 'true');
        hiddenCount++;
      }
    });
    console.log(`Ez Gmail: ✓ Hid ${hiddenCount} Gmail content elements`);
    
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
      z-index: 1000;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
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

      <!-- Signature Settings -->
      <div style="background: white; border: 1px solid #dadce0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500; color: #202124; display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Signatures
        </h2>
        <p style="color: #5f6368; margin-bottom: 20px; font-size: 14px;">Edit your profile fields and signature templates. Fields are used for {{variable}} placeholders.</p>

        <!-- Profile fields -->
        <div id="ezProfileFields" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; margin-bottom: 12px;">
          <label style="font-size:12px;color:#5f6368">Name<input id="ezProf-fullName" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Title<input id="ezProf-title" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Subtitle<input id="ezProf-subtitle" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Company<input id="ezProf-company" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Phone<input id="ezProf-phone" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Email<input id="ezProf-email" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Website<input id="ezProf-website" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">Address<input id="ezProf-address" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">City<input id="ezProf-city" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px"></label>
          <label style="font-size:12px;color:#5f6368">State / ZIP<input id="ezProf-statezip" class="ez-prof-input" style="display:block;width:100%;height:36px;margin-top:4px;padding:0 10px;border:1px solid #dadce0;border-radius:4px;font-size:14px" placeholder="TX 75766"></label>
        </div>
        <button id="ezSaveProfile" style="background:#1a73e8;color:white;border:none;padding:8px 20px;border-radius:6px;font-weight:500;cursor:pointer;margin-bottom:20px">Save Profile</button>
        <div id="ezProfileStatus" style="font-size:13px;color:#34a853;margin:-12px 0 16px;min-height:16px"></div>

        <!-- Signature list -->
        <h3 style="margin:0 0 10px;font-size:15px;font-weight:500;color:#202124">Your Signatures</h3>
        <div id="ezSignatureList" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px"></div>
        <button id="ezNewSignature" style="background:white;color:#1a73e8;border:1px solid #dadce0;padding:8px 16px;border-radius:6px;font-weight:500;cursor:pointer">+ New Signature</button>
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
            <button id="ezVersePicker" style="
              background: white;
              color: #1a73e8;
              border: 1px solid #dadce0;
              padding: 8px 16px;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              font-size: 13px;
            ">📖 Choose Verse, Rotation & Favorites…</button>
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
          <span style="color: #5f6368; font-size: 14px;">Version 2.2 - Stable</span>
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
    
    // Don't show navigation bar on settings page - it doesn't fit the layout
    console.log('Ez Gmail: Navigation bar will remain hidden on settings page');
    
    // CRITICAL: Protect our panel from Gmail interference
    console.log('Ez Gmail: Setting up content protection...');
    this.protectEzGmailContent(contentArea, settingsPanel);
    
    // Start enforcement interval to maintain hash and tab state
    this.startEnforcement();
    
    console.log('Ez Gmail: ========== EZ GMAIL SETTINGS COMPLETE ==========');
  }

  // Start aggressive enforcement of hash and tab state
  startEnforcement() {
    // Clear any existing interval
    if (this.enforcementInterval) {
      clearInterval(this.enforcementInterval);
    }
    
    // Enforce immediately
    this.enforceHashAndTab();
    
    // Set up MutationObserver to watch tabs for changes
    const tabsContainer = this.findTabsContainer();
    if (tabsContainer) {
      // Disconnect any previous tab observer - repeated startEnforcement()
      // calls used to stack observers, which fed back on each other and
      // froze the page.
      if (this.tabObserver) {
        try { this.tabObserver.disconnect(); } catch (e) { /* ignore */ }
        this.tabObserver = null;
      }
      
      this.tabObserver = new MutationObserver(() => {
        // Skip while we're the ones writing attributes (feedback loop)
        if (this.ezGmailSettingsActive && !this._enforcingTab) {
          this.enforceTabState();
        }
      });
      
      this.tabObserver.observe(tabsContainer, {
        attributes: true,
        attributeFilter: ['class', 'aria-selected'],
        subtree: true
      });
      
      if (window.EzGmailCleanup) {
        window.EzGmailCleanup.registerObserver(this.tabObserver, 'SettingsIntegration - Tab State Observer');
      }
      console.log('Ez Gmail: ✓ Started tab mutation observer');
    }
    
    // Enforce hash and tab state periodically to fight Gmail's resets.
    // 250ms is responsive enough without hammering the DOM.
    this.enforcementInterval = setInterval(() => {
      if (!this.ezGmailSettingsActive) {
        clearInterval(this.enforcementInterval);
        this.enforcementInterval = null;
        return;
      }
      
      // Keep /ezgmail visible in the URL - Gmail strips it to bare
      // #settings. replaceState is silent (no hashchange), and this
      // whole interval dies the instant ezGmailSettingsActive is
      // cleared by another tab's click handler.
      if (window.location.hash === '#settings' ||
          window.location.hash === '#settings/') {
        window.history.replaceState(null, '', '#settings/ezgmail');
      }

      this.enforceHashAndTab();
    }, 250);
    
    console.log('Ez Gmail: ✓ Started enforcement interval (250ms)');
  }

  // Enforce hash and tab state together
  enforceHashAndTab() {
    // DON'T enforce hash - let Gmail have it at #settings
    // Our protection observer will keep content visible
    
    // Only enforce tab state
    this.enforceTabState();
    
    // Remove the email navigation bar entirely on our settings page.
    // DOM removal can't be overridden by Gmail's re-renders, style
    // resets, or our own restore sweeps. GmailNavigation.init()
    // re-creates it once we navigate to a non-settings page.
    document.querySelectorAll('#ez-gmail-navigation').forEach(nav => nav.remove());

    // Collapse the vertical gap around Gmail's settings header
    this.collapseSettingsChrome();
  }

  // Collapse the vertical gap between Gmail's "Settings" header/tab bar
  // and our settings panel. The .du (Settings heading), .Y7 spacer, .qZ
  // wrapper, .fY tab bar margins and the .dJ placeholder all leave a
  // large empty hole above the content area.
  collapseSettingsChrome() {
    const collapse = (el, props) => {
      if (!el || this.isExtensionElement(el)) return;
      props.forEach(prop => el.style.setProperty(prop, '0', 'important'));
    };

    const header = document.querySelector('.aeH');
    if (header) {
      collapse(header.querySelector('.du'), ['margin-bottom', 'padding-bottom', 'min-height']);
      collapse(header.querySelector('.Y7'), ['height', 'min-height', 'margin', 'padding']);
      collapse(header.querySelector('h2.dt, .dt'), ['margin-bottom', 'padding-bottom']);
      collapse(header.querySelector('.qZ'), ['margin-bottom', 'padding-bottom']);
    }

    const tabsContainer = this.findTabsContainer();
    if (tabsContainer) {
      collapse(tabsContainer, ['margin-bottom', 'padding-bottom']);
      collapse(tabsContainer.querySelector('.dJ'), ['height', 'min-height', 'margin', 'padding']);
    }

    collapse(document.querySelector('.Tm.aeJ'), ['margin-top', 'padding-top', 'min-height']);
  }

  // Protect Ez Gmail content from Gmail interference
  protectEzGmailContent(contentArea, settingsPanel) {
    // Disconnect existing protection observer if any
    if (this.protectionObserver) {
      console.log('Ez Gmail: Disconnecting existing protection observer...');
      try {
        this.protectionObserver.disconnect();
      } catch (e) {
        console.warn('Ez Gmail: Error disconnecting old observer:', e);
      }
      this.protectionObserver = null;
    }
    
    // Validate inputs
    if (!contentArea || !settingsPanel) {
      console.error('Ez Gmail: Cannot protect content - missing contentArea or settingsPanel');
      return;
    }
    
    // Create NEW observer to watch for Gmail trying to restore its content
    try {
      this.protectionObserver = new MutationObserver((mutations) => {
        // CRITICAL: Check if we're still active FIRST
        if (!this.ezGmailSettingsActive) {
          console.log('Ez Gmail: Protection observer fired but settings inactive - ignoring');
          return;
        }
        
        mutations.forEach(mutation => {
          // Check if Gmail is trying to show its content
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 &&
                !this.isExtensionElement(node) &&
                !node.closest('.ez-gmail-settings-panel, #ez-gmail-navigation, [data-extension-element]')) {
              console.log('Ez Gmail: Gmail trying to add content, hiding it...');
              node.style.setProperty('display', 'none', 'important');
              node.style.setProperty('height', '0', 'important');
              node.style.setProperty('min-height', '0', 'important');
              node.style.setProperty('visibility', 'hidden', 'important');
              node.style.setProperty('opacity', '0', 'important');
              node.style.setProperty('position', 'absolute', 'important');
              node.style.setProperty('z-index', '-9999', 'important');
              // Mark so restore can find and unhide this element later
              node.setAttribute('data-ez-hidden', 'true');
            }
          });
          
          // Check if our panel was removed
          if (!document.querySelector('.ez-gmail-settings-panel')) {
            console.log('Ez Gmail: Our panel was removed! Re-adding...');
            if (contentArea && settingsPanel && contentArea.isConnected) {
              contentArea.appendChild(settingsPanel);
            }
          }
          
          // Check if Gmail unhid its content
          Array.from(contentArea.children).forEach(child => {
            if (!this.isExtensionElement(child)) {
              if (child.style.display !== 'none') {
                console.log('Ez Gmail: ⚠ Gmail unhid content, re-hiding...');
                child.style.display = 'none';
                child.style.visibility = 'hidden';
                child.style.opacity = '0';
                child.style.position = 'absolute';
                child.style.zIndex = '-1';
                child.setAttribute('data-ez-hidden', 'true');
              }
            }
          });
        });
      });
      
      // Start observing
      this.protectionObserver.observe(contentArea, {
        childList: true,
        subtree: false,
        attributes: true,
        attributeFilter: ['style']
      });
      
      // Track this observer for cleanup
      this.observers.push(this.protectionObserver);
      if (window.EzGmailCleanup) {
        window.EzGmailCleanup.registerObserver(this.protectionObserver, 'SettingsIntegration - Content Protection');
      }
      
      console.log('Ez Gmail: ✓ Content protection active');
    } catch (error) {
      console.error('Ez Gmail: Error setting up content protection:', error);
    }
  }

  // Attach event listeners to settings controls
  attachSettingsListeners() {
    console.log('Ez Gmail: attachSettingsListeners() called');
    
    // If the extension was reloaded without refreshing Gmail, chrome.*
    // APIs throw "Extension context invalidated" - bail out cleanly.
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) {
      console.warn('Ez Gmail: Extension context invalidated - reload the Gmail tab');
      return;
    }
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
        try {
          chrome.runtime.sendMessage({action: 'openTemplates'});
        } catch (e) {
          console.warn('Ez Gmail: Could not open templates (context invalidated)', e);
        }
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

    // Verse picker (rotation / favorites / fixed) - reuses the modal
    const versePickerBtn = document.getElementById('ezVersePicker');
    if (versePickerBtn) {
      versePickerBtn.addEventListener('click', () => {
        if (window.EzGmailVerseQuoteManager) {
          window.EzGmailVerseQuoteManager.showVersePicker();
        }
      });
    }

    // ---- Signatures section ----
    const sigMgr = window.EzGmailSignatureManager;
    if (sigMgr) {
      sigMgr.init().then(() => {
        this.populateSignatureProfile(sigMgr);
        this.renderSignatureList(sigMgr);
      });
    }

    // Save profile button
    const saveProfileBtn = document.getElementById('ezSaveProfile');
    if (saveProfileBtn && sigMgr) {
      saveProfileBtn.addEventListener('click', async () => {
        const v = id => (document.getElementById(id)?.value || '').trim();
        const sz = v('ezProf-statezip');
        const m = sz.match(/^([A-Za-z]{2})\s+(\d{5})$/);
        await sigMgr.updateUserProfile({
          fullName: v('ezProf-fullName'),
          title: v('ezProf-title'),
          subtitle: v('ezProf-subtitle'),
          company: v('ezProf-company'),
          phone: v('ezProf-phone'),
          email: v('ezProf-email'),
          website: v('ezProf-website'),
          address: v('ezProf-address'),
          city: v('ezProf-city'),
          state: m ? m[1] : '',
          zip: m ? m[2] : ''
        });
        const status = document.getElementById('ezProfileStatus');
        if (status) {
          status.textContent = '✓ Profile saved';
          setTimeout(() => { status.textContent = ''; }, 2500);
        }
      });
    }

    // New signature button
    const newSigBtn = document.getElementById('ezNewSignature');
    if (newSigBtn && sigMgr) {
      newSigBtn.addEventListener('click', async () => {
        await sigMgr.addSignature({
          name: 'New Signature',
          html: '<div style="font-family:Arial,sans-serif;font-size:14px">{{fullName}}</div>',
          description: 'Custom signature',
          category: 'custom',
          isDefault: false
        });
        this.renderSignatureList(sigMgr);
      });
    }

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
  
  // Fill the profile inputs from the signature manager
  populateSignatureProfile(sigMgr) {
    const p = sigMgr.userProfile || {};
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };
    set('ezProf-fullName', p.fullName);
    set('ezProf-title', p.title);
    set('ezProf-subtitle', p.subtitle);
    set('ezProf-company', p.company);
    set('ezProf-phone', p.phone);
    set('ezProf-email', p.email);
    set('ezProf-website', p.website);
    set('ezProf-address', p.address);
    set('ezProf-city', p.city);
    set('ezProf-statezip', [p.state, p.zip].filter(Boolean).join(' '));
  }

  // Render the signature rows: active radio, Edit, Delete
  renderSignatureList(sigMgr) {
    const list = document.getElementById('ezSignatureList');
    if (!list) return;
    list.innerHTML = '';

    const esc = s => String(s || '').replace(/[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    sigMgr.getAllSignatures().forEach(sig => {
      const row = document.createElement('div');
      row.style.cssText = 'border:1px solid #e0e0e0;border-radius:8px;padding:10px 12px';
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px">
          <input type="radio" name="ez-active-sig" data-id="${esc(sig.id)}"
            ${sig.id === sigMgr.activeSignatureId ? 'checked' : ''} title="Set as active">
          <div style="flex:1;min-width:0">
            <input class="ez-sig-name" data-id="${esc(sig.id)}" value="${esc(sig.name)}"
              style="width:100%;font-weight:500;font-size:14px;border:none;background:transparent;color:#202124;padding:0">
            ${sig.description ? `<div style="font-size:12px;color:#5f6368">${esc(sig.description)}</div>` : ''}
          </div>
          <button class="ez-sig-edit" data-id="${esc(sig.id)}"
            style="background:none;border:1px solid #dadce0;border-radius:6px;padding:4px 12px;font-size:12px;color:#1a73e8;cursor:pointer">Edit</button>
          ${sigMgr.getAllSignatures().length > 1 ?
            `<button class="ez-sig-del" data-id="${esc(sig.id)}" title="Delete"
              style="background:none;border:none;font-size:16px;color:#d93025;cursor:pointer">✕</button>` : ''}
        </div>
        <div class="ez-sig-editor" data-id="${esc(sig.id)}" style="display:none;margin-top:10px">
          <textarea class="ez-sig-html" rows="6"
            style="width:100%;font-family:monospace;font-size:12px;border:1px solid #dadce0;border-radius:4px;padding:8px;box-sizing:border-box">${esc(sig.html)}</textarea>
          <button class="ez-sig-save" data-id="${esc(sig.id)}"
            style="margin-top:6px;background:#1a73e8;color:white;border:none;padding:6px 14px;border-radius:6px;font-size:13px;cursor:pointer">Save HTML</button>
          <span class="ez-sig-saved" style="font-size:12px;color:#34a853;margin-left:8px"></span>
        </div>`;
      list.appendChild(row);
    });

    // Wire row events
    list.querySelectorAll('input[name="ez-active-sig"]').forEach(r => {
      r.addEventListener('change', async () => {
        await sigMgr.setActiveSignature(r.dataset.id);
      });
    });
    list.querySelectorAll('.ez-sig-name').forEach(inp => {
      inp.addEventListener('change', async () => {
        await sigMgr.updateSignature(inp.dataset.id, { name: inp.value.trim() });
      });
    });
    list.querySelectorAll('.ez-sig-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const ed = list.querySelector(`.ez-sig-editor[data-id="${btn.dataset.id}"]`);
        if (ed) {
          ed.style.display = ed.style.display === 'none' ? 'block' : 'none';
          btn.textContent = ed.style.display === 'none' ? 'Edit' : 'Close';
        }
      });
    });
    list.querySelectorAll('.ez-sig-save').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ed = btn.closest('.ez-sig-editor');
        const ta = ed.querySelector('.ez-sig-html');
        await sigMgr.updateSignature(btn.dataset.id, { html: ta.value });
        const saved = ed.querySelector('.ez-sig-saved');
        saved.textContent = '✓ Saved';
        setTimeout(() => { saved.textContent = ''; }, 2000);
      });
    });
    list.querySelectorAll('.ez-sig-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sig = sigMgr.getSignature(btn.dataset.id);
        if (confirm(`Delete signature "${sig ? sig.name : ''}"?`)) {
          await sigMgr.deleteSignature(btn.dataset.id);
          this.renderSignatureList(sigMgr);
        }
      });
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
    console.log('Ez Gmail: restoreOriginalContent() called');
    
    // Mark Ez Gmail settings as inactive FIRST
    this.ezGmailSettingsActive = false;
    // Clear the ezgmail-nav stamp - a bare #settings landing that follows
    // a REAL user click to another tab must be treated as 'other settings
    // page', not as Gmail stripping our suffix.
    this._lastEzGmailNav = 0;
    console.log('Ez Gmail: ✓ Ez Gmail settings marked as INACTIVE');
    
    // Clear our tab's active styling (blue underline, blue text) so the
    // Gmail tab the user clicked owns the selected state.
    document.querySelectorAll('.ez-gmail-horizontal-tab').forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      t.style.removeProperty('box-shadow');
      t.style.removeProperty('color');
      t.style.setProperty('cursor', 'pointer'); // restore strips cursor - keep it
      t.classList.remove('aKh');
    });
    
    // Remove the inline underline suppression we applied to Gmail's own
    // tabs and their cells - otherwise the newly selected tab can't show
    // its active state.
    document.querySelectorAll('[role="tab"], .J-J5-Ji').forEach(t => {
      if (t.classList.contains('ez-gmail-horizontal-tab')) return; // keep our cursor/styles
      t.style.removeProperty('box-shadow');
      t.style.removeProperty('border-bottom-color');
      t.style.removeProperty('color');
      t.style.removeProperty('cursor');
      const cell = t.parentElement;
      if (cell) {
        cell.style.removeProperty('box-shadow');
        cell.style.removeProperty('border-bottom-color');
      }
    });
    
    // Stop enforcement interval
    if (this.enforcementInterval) {
      clearInterval(this.enforcementInterval);
      this.enforcementInterval = null;
      console.log('Ez Gmail: ✓ Stopped enforcement interval');
    }
    
    // Disconnect protection observer
    if (this.protectionObserver) {
      console.log('Ez Gmail: Disconnecting protection observer');
      try {
        this.protectionObserver.disconnect();
        this.protectionObserver = null;
      } catch (e) {
        console.warn('Ez Gmail: Error disconnecting protection observer:', e);
      }
    }
    
    // Disconnect tab state observer
    if (this.tabObserver) {
      try { this.tabObserver.disconnect(); } catch (e) { /* ignore */ }
      this.tabObserver = null;
    }
    
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
    
    // Don't restore navigation bar - it should stay hidden on ALL settings pages
    console.log('Ez Gmail: Navigation bar stays hidden (settings page)');
    
    // Restore content area styles by removing inline style properties
    contentArea.style.removeProperty('min-height');
    contentArea.style.removeProperty('padding');
    contentArea.style.removeProperty('padding-top');
    contentArea.style.removeProperty('padding-bottom');
    
    // Restore parent container styles
    const parentContainer = contentArea.closest('.nH');
    if (parentContainer) {
      parentContainer.style.removeProperty('min-height');
      parentContainer.style.removeProperty('padding');
      parentContainer.style.removeProperty('padding-top');
      parentContainer.style.removeProperty('padding-bottom');
      console.log('Ez Gmail: ✓ Restored parent container styles');
    }
    
    // If styles still persist, force remove the entire style attribute and re-add non-ez styles
    if (parentContainer && parentContainer.style.minHeight === '0px') {
      const existingStyles = parentContainer.getAttribute('style');
      if (existingStyles && existingStyles.includes('min-height')) {
        // Clear problematic styles
        parentContainer.style.cssText = existingStyles
          .replace(/min-height:\s*0px\s*!important;?/gi, '')
          .replace(/padding(-top|-bottom)?:\s*0px\s*!important;?/gi, '');
        console.log('Ez Gmail: ✓ Force-cleared persistent styles');
      }
    }
    
    // Unhide ALL Gmail content that we previously hid - at ANY depth,
    // since the protection observer can hide deeply-added nodes too.
    console.log('Ez Gmail: Restoring all hidden Gmail content...');
    const restoreHiddenElement = (el) => {
      // Never touch our own elements (panel, nav bar, etc.)
      if (this.isExtensionElement(el) || el.closest('.ez-gmail-settings-panel')) return;
      el.style.removeProperty('display');
      el.style.removeProperty('height');
      el.style.removeProperty('min-height');
      el.style.removeProperty('max-height');
      el.style.removeProperty('visibility');
      el.style.removeProperty('opacity');
      el.style.removeProperty('position');
      el.style.removeProperty('z-index');
      el.style.removeProperty('overflow');
      el.removeAttribute('data-ez-hidden');
    };
    
    // Elements explicitly marked as hidden by us
    contentArea.querySelectorAll('[data-ez-hidden]').forEach(restoreHiddenElement);
    
    // Also sweep direct children in case some lack the marker
    Array.from(contentArea.children).forEach(child => {
      if (!child.classList.contains('ez-gmail-settings-panel')) {
        restoreHiddenElement(child);
      }
    });
    
    console.log('Ez Gmail: ✓ Gmail content restored, letting Gmail handle navigation');
  }

  // Enforce our tab's active state
  enforceTabState() {
    const ezTab = document.querySelector('.ez-gmail-horizontal-tab');
    if (!ezTab) return;
    
    // Re-attach click handler in case Gmail removed it
    // Use capture phase to intercept BEFORE Gmail's handler
    if (!ezTab.hasAttribute('data-ez-click-attached')) {
      ezTab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('Ez Gmail: Tab clicked - navigating to /ezgmail');
        if (window.location.hash === '#settings/ezgmail') {
          this._lastEzGmailNav = Date.now();
          this.showEzGmailSettings();
        } else {
          window.location.hash = '#settings/ezgmail';
        }
        return false;
      }, { capture: true });
      ezTab.setAttribute('data-ez-click-attached', 'true');
      console.log('Ez Gmail: ✓ Re-attached click handler to tab (capture phase)');
    }
    
    let changed = false;
    
    // Guard against re-entrancy: our own attribute writes trigger the tab
    // MutationObserver, which would otherwise loop forever.
    this._enforcingTab = true;
    try {
      // Deactivate all other tabs AGGRESSIVELY - but only write attributes
      // when they actually differ, to avoid generating useless mutations.
      const allTabs = this.getSettingsTabs(this.findTabsContainer());
      allTabs.forEach(tab => {
        if (tab.classList.contains('ez-gmail-horizontal-tab')) {
          // Activate our tab - let aKh class handle the styling
          if (tab.getAttribute('aria-selected') !== 'true') {
            tab.setAttribute('aria-selected', 'true');
            changed = true;
          }
          if (tab.getAttribute('tabindex') !== '0') {
            tab.setAttribute('tabindex', '0');
          }
          // Gmail's new tab markup renders the active indicator as an
          // inset blue box-shadow (.v .f1 .v .f2) - apply it directly
          // since the old aKh class no longer provides it. Also keep the
          // blue text - anything that clears it leaves the tab black.
          tab.style.setProperty('box-shadow', 'inset 0 -2px 0 0 #1a73e8', 'important');
          tab.style.setProperty('color', '#1a73e8', 'important');
          // Strip aKh if Gmail slapped it on - it carries height:56px
          // which inflates the whole tab row.
          if (tab.classList.contains('aKh')) {
            tab.classList.remove('aKh');
            changed = true;
          }
          if (tab.style.height !== 'auto') {
            tab.style.setProperty('height', 'auto', 'important');
          }
        } else {
          // Deactivate other tabs FORCEFULLY
          if (tab.classList.contains('aKh')) {
            tab.classList.remove('aKh');
            changed = true;
          }
          if (tab.getAttribute('aria-selected') !== 'false') {
            tab.setAttribute('aria-selected', 'false');
            changed = true;
          }
          if (tab.getAttribute('tabindex') !== '-1') {
            tab.setAttribute('tabindex', '-1');
          }
          // Neutralize the selected look WITHOUT touching Gmail's
          // classes - inline !important overrides the .fZ-cell styles
          // (blue text, underline) while leaving Gmail's selection
          // machinery fully intact.
          tab.style.setProperty('color', '#5f6368', 'important');
          if (tab.style.cursor !== 'pointer') {
            tab.style.setProperty('cursor', 'pointer');
          }
          if (tab.style.boxShadow !== 'none') {
            tab.style.setProperty('box-shadow', 'none', 'important');
          }
          const cell = tab.parentElement;
          if (cell && cell !== document.body &&
              cell.querySelectorAll('.J-J5-Ji, [role="tab"]').length === 1) {
            if (cell.style.boxShadow !== 'none') {
              cell.style.setProperty('box-shadow', 'none', 'important');
            }
            cell.style.setProperty('border-bottom-color', 'transparent', 'important');
          }
        }
      });
    } finally {
      this._enforcingTab = false;
    }
    
    if (changed) {
      console.log('Ez Gmail: ✓ Enforced Ez Gmail tab active state');
    }
  }

  // Monitor for navigation to settings
  monitorSettingsNavigation() {
    // Simple hash monitoring - just watch URL and react
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      console.log('Ez Gmail: Hash changed to:', hash);
      
      // Add settings tab if we're on any settings page
      if (hash.includes('settings') && !this.settingsTabAdded) {
        setTimeout(() => this.waitForSettingsPage(), 500);
      }
      
      // SIMPLE LOGIC: Show our panel if hash contains 'ezgmail', hide otherwise
      if (hash.includes('ezgmail')) {
        this._lastEzGmailNav = Date.now();
        console.log('Ez Gmail: ✓ Hash contains ezgmail - showing our panel');
        setTimeout(() => this.showEzGmailSettings(), 100);
      } else if ((hash === '#settings' || hash === '#settings/') &&
                 (this.ezGmailSettingsActive ||
                  (Date.now() - (this._lastEzGmailNav || 0) < 1500))) {
        // Gmail stripped /ezgmail right after we navigated to it - this
        // bare #settings still means OUR page. Don't fight the hash and
        // DON'T restore Gmail's content (that race used to strand users
        // on another tab when they clicked back to Ez Gmail).
        console.log('Ez Gmail: ⚠ bare #settings - still our page, maintaining');
        if (this.ezGmailSettingsActive) {
          this.enforceTabState();
        } else {
          setTimeout(() => this.showEzGmailSettings(), 150);
        }
      } else if (hash.includes('settings')) {
        // On other settings pages (like #settings/general, #settings/labels) - hide our panel
        console.log('Ez Gmail: On other settings page - hiding our panel');
        this.restoreOriginalContent();
        
        // Also restore content area AND parent container styles
        const contentArea = document.querySelector('.Tm.aeJ') || 
                           document.querySelector('[role="main"]') ||
                           document.querySelector('.nH.w-asV.aiw');
        if (contentArea) {
          contentArea.style.removeProperty('min-height');
          contentArea.style.removeProperty('padding');
          
          const parentContainer = contentArea.closest('.nH');
          if (parentContainer) {
            parentContainer.style.removeProperty('min-height');
            parentContainer.style.removeProperty('padding-top');
            parentContainer.style.removeProperty('padding-bottom');
          }
          console.log('Ez Gmail: ✓ Restored content area styles for other settings page');
        }
      } else {
        // Not on settings at all - clean up
        console.log('Ez Gmail: Not on settings - cleaning up');
        this.settingsTabAdded = false; // allow re-add on next settings visit
        
        // Disconnect observer FIRST before marking inactive
        if (this.protectionObserver) {
          try {
            this.protectionObserver.disconnect();
            this.protectionObserver = null;
            console.log('Ez Gmail: ✓ Protection observer disconnected for inbox');
          } catch (e) {
            console.error('Ez Gmail: Error disconnecting observer:', e);
          }
        }
        
        // Mark as inactive AFTER disconnecting observer
        this.ezGmailSettingsActive = false;
        console.log('Ez Gmail: ✓ Marked as inactive');
        
        // Remove our panel
        const ezPanel = document.querySelector('.ez-gmail-settings-panel');
        if (ezPanel && ezPanel.parentNode) {
          ezPanel.parentNode.removeChild(ezPanel);
        }
        
        // CRITICAL: Restore content area AND parent container styles
        const contentArea = document.querySelector('.Tm.aeJ') || 
                           document.querySelector('[role="main"]') ||
                           document.querySelector('.nH.w-asV.aiw');
        if (contentArea) {
          // Force clear by manipulating cssText
          const contentStyles = contentArea.getAttribute('style') || '';
          contentArea.setAttribute('style', contentStyles
            .replace(/min-height:\s*[^;]+;?/gi, '')
            .replace(/padding(-top|-bottom)?:\s*[^;]+;?/gi, ''));
          
          const parentContainer = contentArea.closest('.nH');
          if (parentContainer) {
            const parentStyles = parentContainer.getAttribute('style') || '';
            parentContainer.setAttribute('style', parentStyles
              .replace(/min-height:\s*[^;]+;?/gi, '')
              .replace(/padding(-top|-bottom)?:\s*[^;]+;?/gi, ''));
          }
          
          // CRITICAL: Also restore all child elements that we hid
          // Search for ALL elements with !important styles (including nested)
          const allElements = contentArea.querySelectorAll('*');
          let restoredCount = 0;
          allElements.forEach(element => {
            if (!this.isExtensionElement(element)) {
              const hasEzStyles = element.hasAttribute('data-ez-hidden') || 
                                 (element.getAttribute('style') || '').includes('!important');
              
              if (hasEzStyles) {
                element.removeAttribute('style');
                element.removeAttribute('data-ez-hidden');
                restoredCount++;
              }
            }
          });
          console.log(`Ez Gmail: Removed inline styles from ${restoredCount} elements`);
          
          console.log('Ez Gmail: ✓ Force-cleared content area, parent container, and all child element styles for inbox');
        }
        
        // The nav bar was removed from the DOM while on settings - let
        // GmailNavigation re-create it now that we're on a normal page.
        if (window.ezGmailNavigation && typeof window.ezGmailNavigation.init === 'function') {
          window.ezGmailNavigation.init();
        }
      }
    });
  }

  // Cleanup
  destroy() {
    console.log('Ez Gmail: Destroying SettingsIntegration...');
    
    this.ezGmailSettingsActive = false;
    
    // Stop enforcement interval
    if (this.enforcementInterval) {
      clearInterval(this.enforcementInterval);
      this.enforcementInterval = null;
    }
    
    // Disconnect protection observer
    if (this.protectionObserver) {
      try {
        this.protectionObserver.disconnect();
      } catch (e) { /* ignore */ }
      this.protectionObserver = null;
    }
    
    // Disconnect tab state observer
    if (this.tabObserver) {
      try { this.tabObserver.disconnect(); } catch (e) { /* ignore */ }
      this.tabObserver = null;
    }
    
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
