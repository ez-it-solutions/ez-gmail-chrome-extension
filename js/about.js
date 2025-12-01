// Ez Gmail - About Page Script
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

// Load version from manifest
try {
  const manifest = chrome.runtime.getManifest();
  const versionElement = document.getElementById("versionNumber");
  if (versionElement && manifest && manifest.version) {
    versionElement.textContent = `Version ${manifest.version}`;
    console.log("Version loaded:", manifest.version);
  } else {
    console.error("Failed to load version - element or manifest missing");
  }
} catch (error) {
  console.error("Error loading version:", error);
}

// Initialize theme system on About page
const themeManager = new ThemeManager();
themeManager.init().then(() => {
  initThemeSwitcher(themeManager);
});
