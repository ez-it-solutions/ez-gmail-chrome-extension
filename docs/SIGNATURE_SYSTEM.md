# Ez Gmail - Signature System Documentation

## Overview

The Ez Gmail Signature System provides a comprehensive solution for managing email signatures with variable replacement, multiple signature templates, and automatic insertion into compose windows.

## Architecture

### Core Components

1. **SignatureManager** (`signature-manager.js`)
   - Manages signature storage and retrieval
   - Handles user profile data
   - Processes variable replacement
   - Supports import/export

2. **User Profile System**
   - Stores personal information
   - Manages social media links
   - Supports custom fields
   - Persistent storage in Chrome

3. **Signature Templates**
   - Pre-built professional templates
   - Variable-based customization
   - HTML-based formatting
   - Category organization

## Data Structure

### Signature Object
```javascript
{
  id: 'sig_1234567890_abc123',
  name: 'Jacksonville College - Professional',
  description: 'Professional signature with logo and social links',
  category: 'professional', // professional, minimal, custom
  isDefault: true,
  html: '<div>...</div>', // HTML template with {{variables}}
  variables: ['fullName', 'title', 'email', ...],
  createdAt: 1705512000000,
  updatedAt: 1705512000000
}
```

### User Profile Object
```javascript
{
  fullName: 'Chris Hultberg',
  firstName: 'Chris',
  lastName: 'Hultberg',
  title: 'Director of Systems and Technology',
  subtitle: 'Chief Information Officer',
  company: 'Jacksonville College',
  phone: '(903) 589-7101',
  mobile: '',
  email: 'chultberg@jacksonville-college.edu',
  website: 'www.jacksonville-college.edu',
  address: '105 B.J. Albritton',
  city: 'Jacksonville',
  state: 'TX',
  zip: '75766',
  socialLinks: {
    facebook: 'https://www.facebook.com/jacksonvillecollege',
    instagram: 'https://www.instagram.com/jvillecollege/',
    twitter: 'https://twitter.com/jvillecollege',
    linkedin: 'https://www.linkedin.com/in/chris-hultberg/',
    youtube: ''
  },
  customFields: {}
}
```

## Available Variables

### Standard Variables
- `{{fullName}}` - Full name
- `{{firstName}}` - First name
- `{{lastName}}` - Last name
- `{{title}}` - Job title
- `{{subtitle}}` - Secondary title
- `{{company}}` - Company name
- `{{phone}}` - Office phone
- `{{mobile}}` - Mobile phone
- `{{email}}` - Email address
- `{{website}}` - Website URL
- `{{address}}` - Street address
- `{{city}}` - City
- `{{state}}` - State
- `{{zip}}` - ZIP code

### Social Media Variables
- `{{facebook}}` - Facebook URL
- `{{instagram}}` - Instagram URL
- `{{twitter}}` - Twitter URL
- `{{linkedin}}` - LinkedIn URL
- `{{youtube}}` - YouTube URL

### Special Variables
- `{{verseOfTheDay}}` - Dynamic Bible verse (fetched from API)
- `{{quoteOfTheDay}}` - Dynamic inspirational quote
- `{{randomQuote}}` - Random quote

## Default Signatures

### 1. Jacksonville College - Professional
**Features:**
- Company logo
- Full contact information
- Social media icons
- Verse of the day
- Legal disclaimer
- Professional purple color scheme

**Variables Used:**
fullName, title, subtitle, company, phone, email, website, address, city, state, zip, facebook, instagram, twitter, linkedin, verseOfTheDay

### 2. Simple Professional
**Features:**
- Clean layout
- Essential contact info
- No images
- Fast loading

**Variables Used:**
fullName, title, company, phone, email, website

### 3. Minimal
**Features:**
- Ultra-compact
- Name, title, email, phone only
- Single line format

**Variables Used:**
fullName, title, email, phone

## API Methods

### Initialization
```javascript
await window.EzGmailSignatureManager.init();
```

### Get Active Signature
```javascript
const signature = window.EzGmailSignatureManager.getActiveSignature();
```

### Get Processed Signature (with variables replaced)
```javascript
const html = await window.EzGmailSignatureManager.getProcessedSignature();
// Returns HTML with all variables replaced
```

### Set Active Signature
```javascript
await window.EzGmailSignatureManager.setActiveSignature(signatureId);
```

### Update User Profile
```javascript
await window.EzGmailSignatureManager.updateUserProfile({
  fullName: 'Chris Hultberg',
  title: 'Director of Systems and Technology',
  email: 'chultberg@jacksonville-college.edu'
});
```

### Add New Signature
```javascript
const newSig = await window.EzGmailSignatureManager.addSignature({
  name: 'My Custom Signature',
  description: 'Custom signature for special occasions',
  category: 'custom',
  html: '<div>{{fullName}}<br>{{email}}</div>',
  variables: ['fullName', 'email']
});
```

### Update Signature
```javascript
await window.EzGmailSignatureManager.updateSignature(signatureId, {
  name: 'Updated Name',
  html: '<div>New HTML</div>'
});
```

### Delete Signature
```javascript
await window.EzGmailSignatureManager.deleteSignature(signatureId);
```

### Export Signatures
```javascript
const exportData = window.EzGmailSignatureManager.exportSignatures();
// Save to file or send to API
```

### Import Signatures
```javascript
await window.EzGmailSignatureManager.importSignatures(importData);
```

## Storage

All data is stored in Chrome's local storage:

```javascript
{
  ezSignatures: [...], // Array of signature objects
  ezUserProfile: {...}, // User profile object
  ezActiveSignature: 'sig_123...' // Active signature ID
}
```

## Future Enhancements

### Phase 2: UI Components
- [ ] Signature picker modal
- [ ] User profile editor
- [ ] Signature preview
- [ ] Quick switch menu

### Phase 3: Auto-Insertion
- [ ] Detect compose windows
- [ ] Detect reply windows
- [ ] Auto-insert active signature
- [ ] Smart signature selection based on recipient

### Phase 4: Advanced Editor
- [ ] Drag-and-drop signature builder
- [ ] Visual variable insertion
- [ ] Template gallery
- [ ] Real-time preview

### Phase 5: Cloud Integration
- [ ] API for signature storage
- [ ] Team signature management
- [ ] Organization-wide templates
- [ ] Centralized legal disclaimers
- [ ] Email domain verification
- [ ] Role-based signature assignment

### Phase 6: Smart Features
- [ ] Conditional variables (show/hide based on context)
- [ ] Recipient-based signatures
- [ ] Time-based signatures (holidays, events)
- [ ] A/B testing for signatures
- [ ] Analytics (signature views, clicks)

## Usage Examples

### Example 1: Initialize and Get Signature
```javascript
// Initialize
await window.EzGmailSignatureManager.init();

// Get processed signature
const signatureHTML = await window.EzGmailSignatureManager.getProcessedSignature();

// Insert into compose window
bodyField.innerHTML += signatureHTML;
```

### Example 2: Switch Signatures
```javascript
// Get all signatures
const signatures = window.EzGmailSignatureManager.getAllSignatures();

// Show picker to user
// ... UI code ...

// Set selected signature as active
await window.EzGmailSignatureManager.setActiveSignature(selectedId);
```

### Example 3: Update Profile
```javascript
// Update user profile
await window.EzGmailSignatureManager.updateUserProfile({
  phone: '(903) 589-7102', // Updated phone
  mobile: '(555) 123-4567' // Added mobile
});

// Signature will automatically use new values
```

### Example 4: Create Custom Signature
```javascript
const customSig = await window.EzGmailSignatureManager.addSignature({
  name: 'Holiday Signature',
  description: 'Special signature for holiday season',
  category: 'custom',
  html: `
    <div style="font-family: Arial; color: #c41e3a;">
      <h3>🎄 Happy Holidays! 🎄</h3>
      <p>{{fullName}}</p>
      <p>{{title}} at {{company}}</p>
      <p>{{email}} | {{phone}}</p>
    </div>
  `,
  variables: ['fullName', 'title', 'company', 'email', 'phone']
});
```

## Integration Points

### With Template System
Signatures can be used as templates and vice versa. The variable system is compatible.

### With Verse/Quote System
Signatures can include `{{verseOfTheDay}}` and other special variables that are processed by the VerseQuoteManager.

### With Compose Integration
Signatures will be automatically inserted into new compose windows and replies based on user preferences.

## Best Practices

1. **Keep Variables Consistent**: Use the same variable names across all signatures
2. **Test HTML**: Ensure signature HTML renders correctly in Gmail
3. **Optimize Images**: Use optimized images for faster loading
4. **Mobile-Friendly**: Design signatures that work on mobile devices
5. **Legal Compliance**: Include required legal disclaimers
6. **Accessibility**: Use proper alt text for images
7. **Backup Regularly**: Export signatures periodically

## Troubleshooting

### Signature Not Showing
- Check if signature manager is initialized
- Verify user profile has required fields filled
- Check console for errors

### Variables Not Replacing
- Ensure variable names match exactly (case-sensitive)
- Check if user profile has values for those variables
- Verify signature HTML uses correct `{{variable}}` syntax

### Formatting Issues
- Gmail may strip some CSS styles
- Use inline styles instead of CSS classes
- Test signature in Gmail before deploying

## Support

For issues or questions:
- Check console logs for errors
- Verify Chrome storage data
- Review signature HTML for syntax errors
- Contact Ez IT Solutions support

---

**Version:** 2.0.0  
**Last Updated:** January 17, 2026  
**Author:** Ez IT Solutions
