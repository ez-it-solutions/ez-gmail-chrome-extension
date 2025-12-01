# Changelog

All notable changes to Ez Gmail will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-01

### Added
- **Initial release of Ez Gmail Chrome Extension**
- Quick compose functionality with keyboard shortcut (Ctrl+Shift+C)
- Email templates system for saving and reusing common email content
- Enhanced search with keyboard shortcut (Ctrl+Shift+F)
- Mark all emails as read with one click
- Context menu integration for Gmail:
  - Compose email with selected text
  - Search emails for selected text
- Content script for Gmail integration
- Gmail-specific enhancements CSS
- Comprehensive theme system with 5 pre-built themes:
  - Ez IT Solutions Light (default)
  - Ez IT Solutions Dark
  - Purple Gradient
  - Tech Blue (Nvidia-inspired)
  - Tech Orange (Nvidia-inspired)
- Light/Dark mode toggle button with sun/moon icons
- Theme persistence via Chrome sync storage
- Beautiful, modern UI with gradient backgrounds
- About page with Ez IT Solutions branding
- Complete documentation (README.md, THEME_SYSTEM.md)
- Git repository initialization
- Modular code structure for reusability

### Features
- **Manifest V3 compliance**
- Gmail-only permissions for enhanced security
- Content script injection for seamless Gmail integration
- CSS variables for dynamic theming
- SVG-based icons throughout
- Real-time notifications for user feedback
- Smooth animations and transitions
- Backdrop blur effects for modern look
- Keyboard shortcuts for productivity
- Context menu actions for quick access

### Technical Details
- Background service worker for context menus and message handling
- Content script for Gmail DOM manipulation
- Chrome storage API for templates and preferences
- Non-intrusive Gmail enhancements
- Privacy-focused: no data collection or external API calls

---

## Version History

- **1.0.0** - Initial release with Gmail productivity features
