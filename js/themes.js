// Ez Incognito - Theme System
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Modular theming system for Chrome extensions

const THEMES = {

  // Ez IT Solutions Light Mode - White and Dark Green
  ezITSolutionsLight: {
    name: "Ez IT Solutions Light",
    id: "ezITSolutionsLight",
    colors: {
      primary: "#166534",
      secondary: "#15803d",
      accent: "#22c55e",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      text: "#166534",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardText: "#166534",
      buttonPrimary: "#166534",
      buttonSecondary: "#15803d",
      success: "#22c55e",
      error: "#dc2626"
    }
  },

  // Ez IT Solutions Dark Mode - Dark Green and Lime
  ezITSolutionsDark: {
    name: "Ez IT Solutions Dark",
    id: "ezITSolutionsDark",
    colors: {
      primary: "#84cc16",
      secondary: "#65a30d",
      accent: "#a3e635",
      background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
      text: "#ffffff",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardText: "#166534",
      buttonPrimary: "#84cc16",
      buttonSecondary: "#4a5568",
      success: "#84cc16",
      error: "#ef4444"
    }
  },

  // Tech Blue - Nvidia-inspired with Blue
  techBlue: {
    name: "Tech Blue",
    id: "techBlue",
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      text: "#ffffff",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardText: "#1e293b",
      buttonPrimary: "#2563eb",
      buttonSecondary: "#475569",
      success: "#3b82f6",
      error: "#ef4444"
    }
  },

  // Tech Orange - Nvidia-inspired with Orange
  techOrange: {
    name: "Tech Orange",
    id: "techOrange",
    colors: {
      primary: "#ea580c",
      secondary: "#c2410c",
      accent: "#f97316",
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      text: "#ffffff",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardText: "#1e293b",
      buttonPrimary: "#ea580c",
      buttonSecondary: "#475569",
      success: "#f97316",
      error: "#ef4444"
    }
  },

  // Purple gradient theme
  purple: {
    name: "Purple Gradient",
    id: "purple",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#5a67d8",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardText: "#4a5568",
      buttonPrimary: "#667eea",
      buttonSecondary: "#4a5568",
      success: "#10b981",
      error: "#ef4444"
    }
  },

  // Custom theme placeholder - can be configured by user
  custom: {
    name: "Custom Theme",
    id: "custom",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#5a67d8",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      text: "#ffffff",
      cardBg: "rgba(255, 255, 255, 0.95)",
      cardText: "#4a5568",
      buttonPrimary: "#667eea",
      buttonSecondary: "#4a5568",
      success: "#10b981",
      error: "#ef4444"
    }
  }
};

// Theme Manager Class
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.storageKey = "ezIncognito_theme";
  }

  // Initialize theme system
  async init() {
    const savedTheme = await this.loadTheme();
    this.applyTheme(savedTheme || "techBlue");
  }

  // Load theme from storage
  async loadTheme() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([this.storageKey], (result) => {
        resolve(result[this.storageKey]);
      });
    });
  }

  // Save theme to storage
  async saveTheme(themeId) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [this.storageKey]: themeId }, () => {
        resolve();
      });
    });
  }

  // Apply theme to the page
  applyTheme(themeId) {
    const theme = THEMES[themeId] || THEMES.techBlue;
    this.currentTheme = themeId;

    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", theme.colors.primary);
    root.style.setProperty("--theme-secondary", theme.colors.secondary);
    root.style.setProperty("--theme-accent", theme.colors.accent);
    root.style.setProperty("--theme-background", theme.colors.background);
    root.style.setProperty("--theme-text", theme.colors.text);
    root.style.setProperty("--theme-card-bg", theme.colors.cardBg);
    root.style.setProperty("--theme-card-text", theme.colors.cardText);
    root.style.setProperty("--theme-button-primary", theme.colors.buttonPrimary);
    root.style.setProperty("--theme-button-secondary", theme.colors.buttonSecondary);
    root.style.setProperty("--theme-success", theme.colors.success);
    root.style.setProperty("--theme-error", theme.colors.error);

    // Set data attribute for theme-specific styling
    document.body.setAttribute("data-theme", themeId);

    // Save theme preference
    this.saveTheme(themeId);

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { themeId, theme } }));
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Get theme by ID
  getTheme(themeId) {
    return THEMES[themeId];
  }

  // Get all available themes
  getAllThemes() {
    return THEMES;
  }

  // Update custom theme colors
  updateCustomTheme(colors) {
    THEMES.custom.colors = { ...THEMES.custom.colors, ...colors };
    if (this.currentTheme === "custom") {
      this.applyTheme("custom");
    }
  }

  // Toggle between light and dark mode (Ez IT Solutions themes)
  toggleLightDark() {
    const currentTheme = this.getCurrentTheme();
    
    // If currently on light mode, switch to dark
    if (currentTheme === "ezITSolutionsLight") {
      this.applyTheme("ezITSolutionsDark");
    } 
    // If currently on dark mode, switch to light
    else if (currentTheme === "ezITSolutionsDark") {
      this.applyTheme("ezITSolutionsLight");
    }
    // If on any other theme, switch to light mode
    else {
      this.applyTheme("ezITSolutionsLight");
    }
  }

  // Check if current theme is a light/dark mode theme
  isLightDarkTheme() {
    const currentTheme = this.getCurrentTheme();
    return currentTheme === "ezITSolutionsLight" || currentTheme === "ezITSolutionsDark";
  }

  // Check if current theme is light mode
  isLightMode() {
    return this.getCurrentTheme() === "ezITSolutionsLight";
  }

  // Check if current theme is dark mode
  isDarkMode() {
    return this.getCurrentTheme() === "ezITSolutionsDark";
  }
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ThemeManager, THEMES };
}
