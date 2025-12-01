// Background service worker for Ez Gmail
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Ez Gmail extension installed");
    // Open about page on first install
    chrome.tabs.create({ url: "pages/about.html" });
  } else if (details.reason === "update") {
    console.log("Ez Gmail extension updated");
  }
  
  // Create context menus
  createContextMenus();
});

// Create context menu items
function createContextMenus() {
  // Remove existing menus first
  chrome.contextMenus.removeAll(() => {
    // Parent menu for all actions
    chrome.contextMenus.create({
      id: "ezGmailParent",
      title: "Ez Gmail",
      contexts: ["selection"],
      documentUrlPatterns: ["https://mail.google.com/*"]
    });
    
    // Quick compose with selected text
    chrome.contextMenus.create({
      id: "composeWithText",
      parentId: "ezGmailParent",
      title: "Compose Email with Selected Text",
      contexts: ["selection"],
      documentUrlPatterns: ["https://mail.google.com/*"]
    });
    
    // Search emails with selected text
    chrome.contextMenus.create({
      id: "searchEmails",
      parentId: "ezGmailParent",
      title: "Search Emails for '%s'",
      contexts: ["selection"],
      documentUrlPatterns: ["https://mail.google.com/*"]
    });
  });
}

// Handle context menu clicks
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    try {
      switch (info.menuItemId) {
        case "composeWithText":
          // Send message to content script to compose email with selected text
          await chrome.tabs.sendMessage(tab.id, {
            action: "composeWithText",
            text: info.selectionText
          });
          break;
          
        case "searchEmails":
          // Send message to content script to search for selected text
          await chrome.tabs.sendMessage(tab.id, {
            action: "searchEmails",
            text: info.selectionText
          });
          break;
      }
    } catch (error) {
      console.error("Context menu action error:", error);
    }
  });
}

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTemplates") {
    // Retrieve email templates from storage
    chrome.storage.sync.get(["emailTemplates"], (result) => {
      sendResponse({ templates: result.emailTemplates || [] });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === "saveTemplate") {
    // Save email template to storage
    chrome.storage.sync.get(["emailTemplates"], (result) => {
      const templates = result.emailTemplates || [];
      templates.push(request.template);
      chrome.storage.sync.set({ emailTemplates: templates }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
