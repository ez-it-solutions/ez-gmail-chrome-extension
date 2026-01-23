# Ez Incognito - Theme System Documentation

## Overview

The Ez Incognito extension features a comprehensive, modular theme system that can be easily reused across future Chrome extensions. The system supports multiple pre-defined themes and allows for custom theme creation.

## Architecture

### Core Components

1. **themes.js** - Theme configuration and management
2. **theme-switcher.js** - UI component for theme selection
3. **CSS Variables** - Dynamic styling through CSS custom properties

### Theme Structure

Each theme consists of the following color properties:

```javascript
{
  name: "Theme Name",
  id: "themeId",
  colors: {
    primary: "#color",           // Main brand color
    secondary: "#color",         // Secondary brand color
    accent: "#color",            // Accent/highlight color
    background: "gradient",      // Background gradient
    text: "#color",              // Main text color
    cardBg: "rgba()",           // Card background
    cardText: "#color",          // Card text color
    buttonPrimary: "#color",     // Primary button color
    buttonSecondary: "#color",   // Secondary button color
    success: "#color",           // Success message color
    error: "#color"              // Error message color
  }
}
```

## Available Themes

### 1. Ez IT Solutions Light
- **ID**: `ezITLight`
- **Colors**: White background with dark green accents (#166534, #15803d)
- **Use Case**: Light mode, professional, clean look
- **Brand**: Ez IT Solutions branding

### 2. Ez IT Solutions Dark
- **ID**: `ezITDark`
- **Colors**: Dark green background with lime accents (#84cc16, #65a30d)
- **Use Case**: Dark mode, modern, high contrast
- **Brand**: Ez IT Solutions branding

### 3. Tech Blue
- **ID**: `techBlue`
- **Colors**: Dark background with cobalt blue accents (#2563eb, #1e40af)
- **Use Case**: Tech-focused, Nvidia-inspired design
- **Style**: Dark theme with blue highlights

### 4. Tech Orange
- **ID**: `techOrange`
- **Colors**: Dark background with orange accents (#ea580c, #c2410c)
- **Use Case**: Tech-focused, Nvidia-inspired design
- **Style**: Dark theme with orange highlights

### 5. Purple Gradient (Default)
- **ID**: `purple`
- **Colors**: Purple to violet gradient (#667eea to #764ba2)
- **Use Case**: Original design, general purpose

### 6. Custom Theme
- **ID**: `custom`
- **Colors**: User-configurable
- **Use Case**: Personalization, future feature

## Usage

### Basic Implementation

```javascript
// Initialize theme manager
const themeManager = new ThemeManager();
await themeManager.init();

// Apply a theme
themeManager.applyTheme('techBlue');

// Get current theme
const currentTheme = themeManager.getCurrentTheme();

// Get all available themes
const allThemes = themeManager.getAllThemes();
```

### Adding Theme Switcher to UI

```javascript
// Initialize theme switcher component
initThemeSwitcher(themeManager);
```

### CSS Integration

Themes use CSS custom properties (variables) for dynamic styling:

```css
:root {
  --theme-primary: #667eea;
  --theme-secondary: #764ba2;
  --theme-background: linear-gradient(...);
  /* ... other variables */
}

/* Use in your styles */
.button {
  background: var(--theme-primary);
  color: var(--theme-text);
}
```

## Persistence

Themes are automatically saved to Chrome's sync storage and persist across:
- Browser sessions
- Extension updates
- Multiple devices (via Chrome sync)

## Extending the System

### Adding a New Theme

1. Open `js/themes.js`
2. Add your theme to the `THEMES` object:

```javascript
newTheme: {
  name: "New Theme Name",
  id: "newTheme",
  colors: {
    primary: "#yourcolor",
    secondary: "#yourcolor",
    // ... all required color properties
  }
}
```

3. The theme will automatically appear in the theme switcher

### Creating a Custom Theme Editor

To allow users to create custom themes:

```javascript
// Update custom theme colors
themeManager.updateCustomTheme({
  primary: "#ff0000",
  secondary: "#00ff00",
  // ... other colors
});

// Apply the custom theme
themeManager.applyTheme('custom');
```

## Reusability for Future Extensions

This theme system is designed to be modular and reusable:

### To Use in Another Extension:

1. **Copy Core Files**:
   - `js/themes.js`
   - `js/theme-switcher.js`
   - Theme-related CSS from `css/popup.css`

2. **Modify Theme Definitions**:
   - Update the `THEMES` object with your brand colors
   - Keep the same structure for consistency

3. **Initialize in Your Extension**:
   ```javascript
   const themeManager = new ThemeManager();
   themeManager.init();
   initThemeSwitcher(themeManager);
   ```

4. **Update CSS Variables**:
   - Ensure your CSS uses the same variable names
   - Or update variable names in `themes.js`

### Template Structure

```
extension/
├── js/
│   ├── themes.js           # Copy as-is
│   ├── theme-switcher.js   # Copy as-is
│   └── your-script.js      # Initialize themes here
├── css/
│   └── styles.css          # Use CSS variables
└── popup.html              # Include theme scripts
```

## Best Practices

1. **Consistency**: Use the same variable names across all extensions
2. **Accessibility**: Ensure sufficient contrast in all themes
3. **Testing**: Test all themes for readability and usability
4. **Documentation**: Document any custom themes you create
5. **Performance**: Themes are lightweight and don't impact performance

## Brand Guidelines

### Optional Colors
- Primary: Purple gradient (#667eea to #764ba2)
- Use for: General purpose extensions

### Ez IT Solutions Colors
- Light Mode: White with dark green (#166534)
- Dark Mode: Dark green with lime (#84cc16)
- Use for: Ez IT Solutions branding

### Tech Colors
- Blue: Cobalt blue (#2563eb) on dark background
- Orange: Tech orange (#ea580c) on dark background
- Use for: Technical, developer-focused tools

## Future Enhancements

Planned features for the theme system:

- [ ] Custom theme editor UI
- [ ] Theme import/export functionality
- [ ] More pre-defined themes
- [ ] Theme scheduling (auto-switch based on time)
- [ ] Per-site theme preferences
- [ ] Theme marketplace/sharing

## Support

For questions about the theme system:
- **Email**: chrishultberg@ez-it-solutions.com
- **Phone**: 877-411-GEEK (4335)

---

**Ez IT Solutions** - Making technology easy for everyone
