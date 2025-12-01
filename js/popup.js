// Ez Gmail - Popup Script
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

// Initialize theme system
const themeManager = new ThemeManager();
themeManager.init().then(() => {
  // Initialize theme switcher after theme is loaded
  initThemeSwitcher(themeManager);
});

// Initialize UI
async function initializeUI() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Check if we're on Gmail
  if (!tab.url.includes('mail.google.com')) {
    showNotification("Please open Gmail to use this extension", true);
  }
}

// Call initialization
initializeUI();

// Utility function to show notifications
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = isError ? "notification error" : "notification";
  
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

// Quick compose email
document.getElementById("quickCompose").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('mail.google.com')) {
      showNotification("Please open Gmail first", true);
      return;
    }
    
    await chrome.tabs.sendMessage(tab.id, { action: "quickCompose" });
    showNotification("Opening compose window...");
  } catch (error) {
    showNotification("Error opening compose window", true);
    console.error(error);
  }
});

// Manage email templates
document.getElementById("manageTemplates").addEventListener("click", async () => {
  try {
    // Open templates management page
    await chrome.tabs.create({ url: "pages/templates.html" });
  } catch (error) {
    showNotification("Error opening templates", true);
    console.error(error);
  }
});

// Quick search
document.getElementById("quickSearch").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('mail.google.com')) {
      showNotification("Please open Gmail first", true);
      return;
    }
    
    await chrome.tabs.sendMessage(tab.id, { action: "focusSearch" });
    showNotification("Search box focused");
  } catch (error) {
    showNotification("Error focusing search", true);
    console.error(error);
  }
});

// Mark all as read
document.getElementById("markAllRead").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('mail.google.com')) {
      showNotification("Please open Gmail first", true);
      return;
    }
    
    await chrome.tabs.sendMessage(tab.id, { action: "markAllRead" });
    showNotification("Marking all emails as read...");
  } catch (error) {
    showNotification("Error marking emails as read", true);
    console.error(error);
  }
});

// Open about page
document.getElementById("aboutBtn").addEventListener("click", async () => {
  try {
    await chrome.tabs.create({ url: "pages/about.html" });
  } catch (error) {
    console.error("Error opening about page:", error);
  }
});
