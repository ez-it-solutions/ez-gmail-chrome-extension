// Ez Incognito - Theme Switcher Component
// Ez IT Solutions - http://www.Ez-IT-Solutions.com

// Create theme switcher UI
function createThemeSwitcher() {
  const container = document.createElement("div");
  container.className = "theme-switcher-container";
  container.innerHTML = `
    <div class="theme-controls">
      <button id="lightDarkToggle" class="light-dark-toggle-btn" title="Toggle Light/Dark Mode">
        <svg id="lightDarkIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>
      <button id="themeSwitcherBtn" class="theme-switcher-btn" title="Change Theme">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      </button>
    </div>
    <div id="themeMenu" class="theme-menu hidden">
      <div class="theme-menu-header">
        <h3>Choose Theme</h3>
        <button id="closeThemeMenu" class="close-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div id="themeOptions" class="theme-options"></div>
    </div>
  `;
  return container;
}

// Create theme option card
function createThemeOption(themeId, theme, isActive) {
  const option = document.createElement("div");
  option.className = `theme-option ${isActive ? "active" : ""}`;
  option.dataset.themeId = themeId;
  
  // Create preview gradient
  const preview = document.createElement("div");
  preview.className = "theme-preview";
  preview.style.background = theme.colors.background;
  
  // Create theme info
  const info = document.createElement("div");
  info.className = "theme-info";
  info.innerHTML = `
    <span class="theme-name">${theme.name}</span>
    ${isActive ? '<span class="theme-active-badge">Active</span>' : ""}
  `;
  
  option.appendChild(preview);
  option.appendChild(info);
  
  return option;
}

// Update light/dark icon based on current theme
function updateLightDarkIcon(themeManager) {
  const icon = document.getElementById("lightDarkIcon");
  if (!icon) return;
  
  if (themeManager.isDarkMode()) {
    // Show moon icon for dark mode
    icon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  } else {
    // Show sun icon for light mode
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  }
}

// Initialize theme switcher
async function initThemeSwitcher(themeManager) {
  // Add theme switcher to page
  const switcher = createThemeSwitcher();
  document.body.appendChild(switcher);

  const lightDarkToggle = document.getElementById("lightDarkToggle");
  const btn = document.getElementById("themeSwitcherBtn");
  const menu = document.getElementById("themeMenu");
  const closeBtn = document.getElementById("closeThemeMenu");
  const optionsContainer = document.getElementById("themeOptions");
  
  // Update icon on init
  updateLightDarkIcon(themeManager);

  // Populate theme options
  function populateThemes() {
    optionsContainer.innerHTML = "";
    const themes = themeManager.getAllThemes();
    const currentTheme = themeManager.getCurrentTheme();

    Object.entries(themes).forEach(([themeId, theme]) => {
      // Skip custom theme if not configured
      if (themeId === "custom") return;

      const option = createThemeOption(themeId, theme, themeId === currentTheme);
      option.addEventListener("click", () => {
        themeManager.applyTheme(themeId);
        populateThemes(); // Refresh to update active state
        menu.classList.add("hidden");
      });
      optionsContainer.appendChild(option);
    });
  }

  // Light/Dark mode toggle
  lightDarkToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    themeManager.toggleLightDark();
    updateLightDarkIcon(themeManager);
  });

  // Toggle menu
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
    if (!menu.classList.contains("hidden")) {
      populateThemes();
    }
  });

  // Close menu
  closeBtn.addEventListener("click", () => {
    menu.classList.add("hidden");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

  // Listen for theme changes
  window.addEventListener("themeChanged", () => {
    populateThemes();
    updateLightDarkIcon(themeManager);
  });

  // Initial population
  populateThemes();
}
