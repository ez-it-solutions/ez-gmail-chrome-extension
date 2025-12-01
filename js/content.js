// Ez Gmail - Content Script
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// This script runs on Gmail pages to enhance functionality

console.log("Ez Gmail content script loaded");

// Load settings and initialize
let settings = null;
let gmailNavigation = null;

async function initializeExtension() {
  // Load settings
  const settingsManager = new SettingsManager();
  await settingsManager.init();
  settings = settingsManager.getAll();
  
  console.log("Ez Gmail settings loaded:", settings);
  
  // Initialize navigation system
  if (settings.navigation.enabled) {
    // Wait for Gmail to load
    waitForGmailLoad().then(() => {
      gmailNavigation = new GmailNavigation(settings);
      gmailNavigation.init();
      console.log("Gmail navigation initialized");
      
      // Set up retry attempts with increasing delays
      // Reduced to prevent memory issues
      const retryDelays = [2000, 5000];
      retryDelays.forEach(delay => {
        setTimeout(() => {
          if (!document.getElementById('ez-gmail-navigation')) {
            console.log(`Retrying navigation initialization after ${delay}ms...`);
            gmailNavigation.init();
          }
        }, delay);
      });
    });
  }
}

// Wait for Gmail interface to load
function waitForGmailLoad() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      // Check for various Gmail elements
      const toolbar = document.querySelector('[gh="mtb"]') || 
                     document.querySelector('.aeH') ||
                     document.querySelector('[role="banner"]') ||
                     document.querySelector('.nH.bkL'); // Gmail container
      
      if (toolbar) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 500);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 10000);
  });
}

// Initialize
initializeExtension();

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  
  switch (request.action) {
    case "quickCompose":
      openComposeWindow();
      sendResponse({ success: true });
      break;
      
    case "focusSearch":
      focusSearchBox();
      sendResponse({ success: true });
      break;
      
    case "markAllRead":
      markAllAsRead();
      sendResponse({ success: true });
      break;
      
    case "composeWithText":
      openComposeWithText(request.text);
      sendResponse({ success: true });
      break;
      
    case "searchEmails":
      searchForText(request.text);
      sendResponse({ success: true });
      break;
      
    case "reloadSettings":
      // Reload settings and reinitialize
      initializeExtension();
      sendResponse({ success: true });
      break;
  }
  
  return true; // Keep channel open for async response
});

// Open Gmail compose window
function openComposeWindow() {
  try {
    // Gmail compose button selector (may need adjustment based on Gmail updates)
    const composeButton = document.querySelector('[gh="cm"]') || 
                         document.querySelector('div[role="button"][gh="cm"]') ||
                         document.querySelector('.T-I.T-I-KE.L3');
    
    if (composeButton) {
      composeButton.click();
      console.log("Compose window opened");
    } else {
      console.error("Compose button not found");
      // Fallback: try to trigger compose via keyboard shortcut
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
    }
  } catch (error) {
    console.error("Error opening compose window:", error);
  }
}

// Open compose window with pre-filled text
function openComposeWithText(text) {
  try {
    openComposeWindow();
    
    // Wait for compose window to open, then insert text
    setTimeout(() => {
      const bodyField = document.querySelector('div[aria-label*="Message Body"]') ||
                       document.querySelector('div[role="textbox"][aria-label*="Message"]');
      
      if (bodyField) {
        bodyField.focus();
        bodyField.innerHTML = text.replace(/\n/g, '<br>');
        console.log("Text inserted into compose window");
      }
    }, 500);
  } catch (error) {
    console.error("Error composing with text:", error);
  }
}

// Focus the Gmail search box
function focusSearchBox() {
  try {
    const searchBox = document.querySelector('input[aria-label*="Search"]') ||
                     document.querySelector('input[name="q"]') ||
                     document.querySelector('.gb_Zf');
    
    if (searchBox) {
      searchBox.focus();
      console.log("Search box focused");
    } else {
      console.error("Search box not found");
    }
  } catch (error) {
    console.error("Error focusing search box:", error);
  }
}

// Search for specific text
function searchForText(text) {
  try {
    const searchBox = document.querySelector('input[aria-label*="Search"]') ||
                     document.querySelector('input[name="q"]');
    
    if (searchBox) {
      searchBox.value = text;
      searchBox.focus();
      
      // Trigger search
      const searchForm = searchBox.closest('form');
      if (searchForm) {
        searchForm.submit();
      } else {
        // Fallback: press Enter
        searchBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }
      console.log("Search initiated for:", text);
    }
  } catch (error) {
    console.error("Error searching:", error);
  }
}

// Mark all emails as read
function markAllAsRead() {
  try {
    // Select all checkbox
    const selectAllCheckbox = document.querySelector('div[role="checkbox"][aria-label*="Select"]') ||
                             document.querySelector('.T-Jo.J-J5-Ji');
    
    if (selectAllCheckbox) {
      // Check if already selected
      const isSelected = selectAllCheckbox.getAttribute('aria-checked') === 'true';
      
      if (!isSelected) {
        selectAllCheckbox.click();
      }
      
      // Wait a bit, then click "Mark as read" from the menu
      setTimeout(() => {
        // Open more actions menu
        const moreButton = document.querySelector('[data-tooltip*="More"]') ||
                          document.querySelector('.T-I.J-J5-Ji.nX.T-I-Js-Gs.T-I-Js-IF');
        
        if (moreButton) {
          moreButton.click();
          
          // Wait for menu to open, then click "Mark as read"
          setTimeout(() => {
            const markReadButton = Array.from(document.querySelectorAll('div[role="menuitem"]'))
              .find(el => el.textContent.includes('Mark as read'));
            
            if (markReadButton) {
              markReadButton.click();
              console.log("Marked all as read");
            }
          }, 200);
        }
      }, 200);
    } else {
      console.error("Select all checkbox not found");
    }
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+C: Quick compose
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    openComposeWindow();
  }
  
  // Ctrl+Shift+F: Focus search
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    focusSearchBox();
  }
});

console.log("Ez Gmail keyboard shortcuts enabled (Ctrl+Shift+C for compose, Ctrl+Shift+F for search)");
