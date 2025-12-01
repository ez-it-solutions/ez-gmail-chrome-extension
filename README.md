# Ez Gmail - Chrome Extension

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow.svg)

A powerful and beautiful Chrome extension that enhances your Gmail experience with productivity tools, quick actions, email templates, and keyboard shortcuts. Streamline your email workflow and save time with Ez Gmail.

## 🚀 Features

### 🚀 **Advanced Page Navigation** (NEW!)
Gmail's biggest limitation solved! Navigate through thousands of emails effortlessly.

- **Direct Page Jump**: Click page numbers to jump instantly (1, 2, 3 ... 50, 51, 52)
- **Quick Jump Input**: Type any page number and go directly there
- **First/Last Page**: Jump to beginning or end with one click
- **Smart Pagination**: Choose from Full, Compact, or Minimal display styles
- **Keyboard Shortcut**: Ctrl+Shift+P for quick page jump

**Problem Solved**: With 10,000+ emails at 50 per page, that's 200 pages. Traditional Gmail requires 200 clicks to reach the end. Ez Gmail gets you there in seconds!

### 📅 **Date Jump** (NEW!)
Jump to emails from any specific date instantly.

- **Calendar Picker**: Visual date selection interface
- **Quick Dates**: Today, Yesterday, Last Week, Last Month, Last Year
- **Custom Dates**: Select any date from the calendar
- **Smart Search**: Uses Gmail's advanced search operators automatically
- **Keyboard Shortcut**: Ctrl+Shift+D opens date picker

**Use Case**: Need an email from 6 months ago? Click "Jump to Date", select the date, and you're there in 2 seconds instead of clicking through hundreds of pages.

### ⚙️ **Comprehensive Settings Panel** (NEW!)
Customize every aspect of Ez Gmail with a beautiful tabbed interface.

- **8 Setting Categories**: Navigation, Date Jump, Sidebar, Quick Actions, Templates, Shortcuts, UI/UX, Advanced
- **Import/Export**: Backup and share your settings
- **Auto-Save**: Changes save automatically (optional)
- **Sync Across Devices**: Settings sync via Chrome
- **Reset to Defaults**: One-click factory reset

### ✉️ Quick Compose
Open Gmail's compose window instantly with a single click or keyboard shortcut (Ctrl+Shift+C). Perfect for rapid email responses and maintaining productivity flow.

### 📝 Email Templates
- **Save Templates**: Create and save frequently used email templates
- **Quick Access**: Insert templates with one click
- **Customizable**: Edit and manage your template library
- **Sync Across Devices**: Templates sync via Chrome storage

### 🔍 Enhanced Search
- **Quick Search**: Focus the Gmail search box instantly (Ctrl+Shift+F)
- **Context Menu Search**: Right-click selected text to search your emails
- **Fast Navigation**: Jump to search without mouse movement

### ⚡ Bulk Actions
- **Mark All as Read**: Clear your inbox with one click
- **Batch Operations**: Perform actions on multiple emails efficiently
- **Time-Saving**: Reduce repetitive tasks

### 🖱️ Context Menu Integration
- **Right-click on selected text**: Compose Email with Selected Text
- **Right-click on selected text**: Search Emails for selected text
- Quick access to all features without opening the popup

### 🎨 Beautiful UI/UX with Theme System
- **Light/Dark Mode Toggle**: Quick switch between Ez IT Solutions light and dark themes
- **5 Pre-built Themes**: Ez IT Solutions Light (default), Ez IT Solutions Dark, Purple Gradient, Tech Blue, Tech Orange
- **Dynamic Theme Switching**: Change themes on-the-fly with visual previews
- **Theme Persistence**: Your theme choice syncs across devices
- Modern, gradient-based designs
- Smooth animations and transitions
- Intuitive icon-based interface
- Real-time notifications for user feedback

## 📦 Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `v1.0` directory containing the extension files
6. The Ez Gmail icon will appear in your Chrome toolbar
7. Navigate to Gmail (mail.google.com) to start using the extension

### From Chrome Web Store
*Coming soon*

### Requirements
- Google Chrome browser (version 88 or higher)
- Active Gmail account
- Internet connection for Gmail access

## 🎯 Usage

### Quick Compose
1. Click the Ez Gmail icon in your toolbar
2. Click "Quick Compose"
3. Gmail's compose window will open instantly
4. **Keyboard Shortcut**: Press Ctrl+Shift+C anywhere on Gmail

### Managing Email Templates
1. Click the Ez Gmail icon
2. Click "Email Templates"
3. Create, edit, or delete your saved templates
4. Templates sync across all your devices via Chrome storage

### Quick Search
1. Click the Ez Gmail icon
2. Click "Quick Search" to focus the search box
3. **Keyboard Shortcut**: Press Ctrl+Shift+F anywhere on Gmail
4. **Context Menu**: Right-click selected text → "Search Emails for [text]"

### Mark All as Read
1. Click the Ez Gmail icon
2. Click "Mark All as Read"
3. All visible emails in your current view will be marked as read

### Changing Themes
1. **Quick Toggle**: Click the sun/moon icon to switch between light and dark mode
2. **Full Theme Menu**: Click the palette icon to open the theme selector
3. Browse available themes with live previews
4. Click any theme to apply it instantly
5. Your choice is automatically saved and synced

### Using Context Menus (on Gmail)
1. **Select text** → Right-click → "Compose Email with Selected Text"
2. **Select text** → Right-click → "Search Emails for [text]"
3. Quick access to all features without opening the popup

### Advanced Page Navigation
1. Look for the navigation bar below Gmail's toolbar
2. **Click Page Numbers**: Jump to any page instantly
3. **Quick Jump**: Type page number in input box, press Enter
4. **First/Last**: Use double arrow buttons
5. **Keyboard Shortcut**: Press Ctrl+Shift+P, type page number

### Date Jump
1. Click the "Jump to Date" button in navigation bar
2. **Quick Dates**: Click Today, Yesterday, Last Week, etc.
3. **Custom Date**: Select any date from calendar picker
4. **Keyboard Shortcut**: Press Ctrl+Shift+D to open picker

### Settings Configuration
1. Click Ez Gmail extension icon
2. Click "Settings" button
3. Navigate through 8 tabbed categories:
   - Navigation, Date Jump, Sidebar, Quick Actions
   - Templates, Shortcuts, UI/UX, Advanced
4. Adjust settings as needed
5. Click "Save Settings"
6. **Import/Export**: Backup or restore settings
7. **Reset**: Restore factory defaults

### Keyboard Shortcuts
- **Ctrl+Shift+C**: Quick compose email
- **Ctrl+Shift+F**: Focus search box
- **Ctrl+Shift+D**: Open date jump picker
- **Ctrl+Shift+P**: Open quick page jump
- **Ctrl+Shift+S**: Toggle sidebar (coming soon)

## 🛠️ Technical Details

### Permissions Required
- **storage**: Store user preferences, theme settings, and email templates
- **contextMenus**: Add right-click menu options for Gmail
- **scripting**: Inject content scripts to enhance Gmail functionality
- **host_permissions**: Access to mail.google.com for Gmail integration

### Technology Stack
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No dependencies, lightweight and fast
- **CSS3**: Modern styling with gradients and animations
- **SVG Icons**: Scalable, crisp icons for all screen sizes

### File Structure
```
v1.0/
├── manifest.json                # Extension configuration
├── background.js                # Service worker for background tasks
├── popup.html                   # Main popup interface
├── css/
│   ├── popup.css               # Popup styling with theme support
│   ├── about.css               # About page styling with theme support
│   └── gmail-enhancements.css  # Gmail interface enhancements
├── js/
│   ├── popup.js                # Popup functionality
│   ├── content.js              # Content script for Gmail integration
│   ├── themes.js               # Theme system core
│   ├── theme-switcher.js       # Theme switcher UI component
│   └── about.js                # About page functionality
├── pages/
│   └── about.html              # About page with company info
├── icons/
│   ├── icon16.png              # 16x16 toolbar icon
│   ├── icon32.png              # 32x32 toolbar icon
│   ├── icon48.png              # 48x48 extension icon
│   └── icon128.png             # 128x128 store icon
├── README.md                   # This file
├── CHANGELOG.md                # Version history
├── THEME_SYSTEM.md             # Theme system documentation
└── .gitignore                  # Git ignore rules
```

## 🎨 Design Philosophy

Ez Gmail is designed to be:
- **Fast**: Minimal code, maximum performance
- **Intuitive**: Clear icons and labels for every action
- **Non-Intrusive**: Enhances Gmail without disrupting your workflow
- **Productive**: Saves time with keyboard shortcuts and quick actions
- **Beautiful**: Modern UI that fits seamlessly with Gmail's interface
- **Modular**: Reusable components for future extensions
- **Themeable**: Comprehensive theme system for brand consistency

This extension demonstrates best practices in:
- Clean, maintainable code structure
- Modern UI/UX design patterns
- Proper use of Chrome Extension APIs (Manifest V3)
- Content script integration with Gmail
- User-friendly error handling and notifications
- **Modular theme system** for easy reusability across projects

### Theme System

The extension includes a powerful, reusable theme system featuring:
- **5 Pre-built Themes**: Including Ez IT Solutions branding and tech-inspired designs
- **CSS Variables**: Dynamic theming without page reloads
- **Sync Storage**: Theme preferences sync across devices
- **Easy Integration**: Drop-in solution for future extensions
- **Full Documentation**: See `THEME_SYSTEM.md` for implementation details

**Available Themes:**
1. **Ez IT Solutions Light** - Clean white background with dark green accents (default)
2. **Ez IT Solutions Dark** - Dark green background with lime accents
3. **Purple Gradient** - Original purple to violet gradient
4. **Tech Blue** - Dark theme with cobalt blue (Nvidia-inspired)
5. **Tech Orange** - Dark theme with tech orange (Nvidia-inspired)

## 🔒 Privacy & Security

Ez Gmail respects your privacy:
- **No Data Collection**: We don't collect, store, or transmit any of your email data
- **No External API Calls**: All operations happen locally in your browser
- **No Analytics or Tracking**: Your usage data stays private
- **Secure Storage**: Templates and preferences stored locally via Chrome's secure storage API
- **Gmail-Only Access**: Extension only runs on mail.google.com
- **Transparent Code**: All code is available for review in this repository

### What We Store
- **Theme Preferences**: Your selected theme (synced via Chrome)
- **Email Templates**: Templates you create (synced via Chrome)
- **No Email Content**: We never access or store your actual emails

## 🤝 About Ez IT Solutions

**Ez IT Solutions** is committed to making technology easy for everyone. We provide IT support, custom software development, and innovative solutions for businesses and individuals.

### Contact Information
- **Phone**: 877-411-GEEK (4335)
- **Website**: [www.Ez-IT-Solutions.com](http://www.Ez-IT-Solutions.com)

### Developer
**Chris Hultberg**
- **Email**: chrishultberg@ez-it-solutions.com

## 📝 License

Copyright © 2025 Ez IT Solutions. All rights reserved.

## 🚧 Future Enhancements

Planned features for future versions:
- **Advanced Templates**: Variables and placeholders in templates (e.g., {name}, {date})
- **Template Categories**: Organize templates by category or tag
- **Signature Management**: Quick signature insertion
- **Email Scheduling**: Schedule emails to send later
- **Canned Responses**: Quick reply templates
- **Custom Keyboard Shortcuts**: User-defined shortcuts
- **Email Tracking**: Read receipts and tracking (optional)
- **Attachment Templates**: Save frequently attached files
- **Multi-Account Support**: Different templates per Gmail account
- **Import/Export**: Backup and share templates

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please contact us:
- Email: chrishultberg@ez-it-solutions.com
- Phone: 877-411-GEEK (4335)

## 🙏 Acknowledgments

Built with ❤️ by Ez IT Solutions

---

**Making technology easy for everyone**
