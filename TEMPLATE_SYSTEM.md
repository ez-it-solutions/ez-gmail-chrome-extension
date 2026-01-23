// File is too large to display in full. Showing first 300 lines.
# Ez Gmail Template System - Complete Documentation

## Overview

The Ez Gmail Template System allows users to create, manage, and quickly insert email templates into Gmail compose windows. It features variable replacement, category organization, search functionality, and seamless Gmail integration.

## Features

### Core Features
- ✅ Create, edit, and delete email templates
- ✅ Variable system with `{{variable}}` syntax
- ✅ Automatic variable detection and replacement
- ✅ Category organization (Work, Personal, Support, Sales, Follow-up, Other)
- ✅ Search templates by name, subject, body, or category
- ✅ Usage tracking and statistics
- ✅ Import/Export templates (JSON)
- ✅ Template duplication
- ✅ Chrome sync storage (syncs across devices)

### UI Features
- ✅ Beautiful template picker modal
- ✅ Variable input modal for dynamic content
- ✅ Search and filter bar
- ✅ Card-based template list
- ✅ Category badges and usage statistics
- ✅ Dark mode support
- ✅ Smooth animations and transitions
- ✅ Empty states with helpful messages

### Gmail Integration
- ✅ "Templates" button in compose window toolbar
- ✅ Automatic detection of compose windows
- ✅ Support for multiple compose windows
- ✅ Insert into subject and body fields
- ✅ Works with Gmail's contenteditable fields

---

## Architecture

### Component Structure

```
Template System
├── template-manager.js (Core Logic)
│   ├── Storage Management
│   ├── CRUD Operations
│   ├── Variable System
│   └── Search & Filter
│
├── template-ui.js (UI Components)
│   ├── Template Picker Modal
│   ├── Variable Input Modal
│   ├── Template List Rendering
│   └── Event Handling
│
├── compose-integration.js (Gmail Integration)
│   ├── Compose Window Detection
│   ├── Button Injection
│   ├── Field Detection
│   └── Template Insertion
│
└── templates.css (Styling)
    ├── Modal Styles
    ├── Button Styles
    ├── Dark Mode
    └── Animations
```

### Data Flow

```
User clicks "Templates" button
    ↓
Template Picker Modal opens
    ↓
User searches/filters templates
    ↓
User selects a template
    ↓
If template has variables:
    ├─> Variable Input Modal opens
    ├─> User fills in variables
    └─> Variables replaced in template
    ↓
Template inserted into compose window
    ↓
Usage count incremented
    ↓
Success notification shown
```

---

## Template Data Structure

### Template Object

```javascript
{
  id: 'tpl_1705428000_abc123xyz',      // Unique ID
  name: 'Meeting Follow-up',            // Template name
  subject: 'Re: Meeting with {{name}}', // Email subject (with variables)
  body: 'Hi {{name}},\n\nThank you...', // Email body (with variables)
  category: 'Work',                     // Category
  variables: ['name'],                  // Auto-extracted variables
  created: '2026-01-16T10:30:00.000Z', // Creation timestamp
  modified: '2026-01-16T10:30:00.000Z',// Last modified timestamp
  usageCount: 5                         // Number of times used
}
```

### Storage Format

**Storage Key**: `ezgmail_templates`  
**Storage Type**: Chrome Sync Storage  
**Format**: JSON array of template objects  
**Size Limit**: 100KB (≈50-100 templates)

---

## Variable System

### Variable Syntax

Variables use double curly braces: `{{variableName}}`

**Examples**:
- `{{name}}` - Recipient name
- `{{company}}` - Company name
- `{{date}}` - Date
- `{{orderNumber}}` - Order number
- `{{customField}}` - Any custom field

### Variable Detection

Variables are automatically detected using regex:
```javascript
const variablePattern = /\{\{(\w+)\}\}/g;
```

**Matches**:
- `{{name}}` ✓
- `{{firstName}}` ✓
- `{{order_number}}` ✓

**Doesn't Match**:
- `{name}` ✗ (single braces)
- `{{ name }}` ✗ (spaces)
- `{{first-name}}` ✗ (hyphens)

### Variable Replacement

When inserting a template, variables are replaced with user-provided values:

**Template**:
```
Subject: Re: Meeting with {{name}}
Body: Hi {{name}},

Thank you for meeting with us on {{date}}.
```

**User Input**:
```javascript
{
  name: "John Smith",
  date: "January 15th"
}
```

**Result**:
```
Subject: Re: Meeting with John Smith
Body: Hi John Smith,

Thank you for meeting with us on January 15th.
```

---

## API Reference

### TemplateManager Class

#### Constructor
```javascript
const manager = new TemplateManager();
```

#### Methods

**init()**
```javascript
await manager.init();
```
Initialize the template manager and load templates from storage.

**createTemplate(templateData)**
```javascript
const template = await manager.createTemplate({
  name: 'Welcome Email',
  subject: 'Welcome to {{company}}!',
  body: 'Hi {{name}},\n\nWelcome...',
  category: 'Sales'
});
```
Create a new template.

**updateTemplate(id, updates)**
```javascript
const updated = await manager.updateTemplate('tpl_123', {
  name: 'Updated Name',
  subject: 'New Subject'
});
```
Update an existing template.

**deleteTemplate(id)**
```javascript
const success = await manager.deleteTemplate('tpl_123');
```
Delete a template.

**getTemplate(id)**
```javascript
const template = manager.getTemplate('tpl_123');
```
Get a single template by ID.

**getAllTemplates()**
```javascript
const templates = manager.getAllTemplates();
```
Get all templates.

**searchTemplates(query)**
```javascript
const results = manager.searchTemplates('meeting');
```
Search templates by name, subject, body, or category.

**getTemplatesByCategory(category)**
```javascript
const workTemplates = manager.getTemplatesByCategory('Work');
```
Get templates in a specific category.

**getMostUsed(limit)**
```javascript
const popular = manager.getMostUsed(5);
```
Get most frequently used templates.

**getTemplateWithValues(id, values)**
```javascript
const processed = manager.getTemplateWithValues('tpl_123', {
  name: 'John',
  company: 'Acme Corp'
});
```
Get template with variables replaced.

**exportTemplates()**
```javascript
const json = manager.exportTemplates();
// Download or save JSON string
```
Export all templates to JSON.

**importTemplates(jsonString, merge)**
```javascript
const success = await manager.importTemplates(jsonString, true);
```
Import templates from JSON. Set `merge=true` to add to existing templates.

**duplicateTemplate(id)**
```javascript
const duplicate = await manager.duplicateTemplate('tpl_123');
```
Create a copy of a template.

**getStatistics()**
```javascript
const stats = manager.getStatistics();
// Returns: { total, byCategory, totalUsage, mostUsed }
```
Get template usage statistics.

---

### TemplateUI Class

#### Constructor
```javascript
const ui = new TemplateUI(templateManager);
```

#### Methods

**showTemplatePicker(onInsert)**
```javascript
ui.showTemplatePicker((template) => {
  console.log('Template selected:', template);
});
```
Show the template picker modal with a callback for when a template is selected.

**showNotification(message, type)**
```javascript
ui.showNotification('Template inserted!', 'success');
ui.showNotification('Error occurred', 'error');
```
Show a temporary notification.

---

### ComposeIntegration Class

#### Constructor
```javascript
const integration = new ComposeIntegration(templateUI);
```

#### Methods

**init()**
```javascript
integration.init();
```
Initialize compose window integration and start observing for compose windows.

**destroy()**
```javascript
integration.destroy();
```
Clean up observers and event listeners.

---

## Usage Examples

### Creating a Template Programmatically

```javascript
// Get template manager instance
const manager = window.ezGmailTemplateManager;

// Initialize if needed
await manager.init();

// Create template
const template = await manager.createTemplate({
  name: 'Project Update',
  subject: 'Project {{projectName}} - Status Update',
  body: `Hi {{clientName}},

I wanted to give you a quick update on {{projectName}}.

Current Status: {{status}}
Next Steps: {{nextSteps}}

Let me know if you have any questions!

Best regards,
{{yourName}}`,
  category: 'Work'
});

console.log('Template created:', template.id);
```

### Searching Templates

```javascript
const manager = window.ezGmailTemplateManager;

// Search by keyword
const results = manager.searchTemplates('meeting');

// Filter by category
const workTemplates = manager.getTemplatesByCategory('Work');

// Get most used
const popular = manager.getMostUsed(3);

console.log('Found templates:', results.length);
```

### Exporting and Importing

```javascript
const manager = window.ezGmailTemplateManager;

// Export templates
const json = manager.exportTemplates();
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);

// Create download link
const a = document.createElement('a');
a.href = url;
a.download = 'gmail-templates.json';
a.click();

// Import templates
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  const text = await file.text();
  const success = await manager.importTemplates(text, true);
  console.log('Import success:', success);
};
fileInput.click();
```

---

## Gmail Integration Details

### Compose Window Detection

The system detects Gmail compose windows using multiple selectors:

```javascript
const composeSelectors = [
  '.AD',              // Main compose window class
  '[role="dialog"]',  // Dialog role
  '.dw'              // Alternative compose class
];
```

### Button Injection

The "Templates" button is injected into the compose toolbar:

**Button HTML**:
```html
<button class="ez-template-insert-btn" type="button">
  <svg>...</svg>
  <span>Templates</span>
</button>
```

**Injection Point**: Beginning of compose toolbar (`.btC`, `[role="toolbar"]`)

### Field Detection

**Subject Field Selectors**:
```javascript
[
  '[name="subjectbox"]',
  'input[aria-label*="Subject"]',
  '.aoT'
]
```

**Body Field Selectors**:
```javascript
[
  '[role="textbox"][aria-label*="Message"]',
  '[contenteditable="true"][role="textbox"]',
  '.Am.Al.editable'
]
```

### Template Insertion

**For Input Fields**:
```javascript
field.value = templateText;
field.dispatchEvent(new Event('input', { bubbles: true }));
```

**For ContentEditable Fields**:
```javascript
field.innerHTML = templateText.replace(/\n/g, '<br>');
field.dispatchEvent(new Event('input', { bubbles: true }));
```

---

## Styling

### CSS Classes

**Modal Classes**:
- `.ez-template-modal` - Modal overlay
- `.ez-template-modal-content` - Modal container
- `.ez-template-modal-header` - Modal header with title
- `.ez-template-modal-close` - Close button

**Template List Classes**:
- `.ez-template-list` - Template list container
- `.ez-template-item` - Individual template card
- `.ez-template-item-name` - Template name
- `.ez-template-item-category` - Category badge
- `.ez-template-item-subject` - Subject preview
- `.ez-template-item-body` - Body preview
- `.ez-template-item-meta` - Metadata (variables, usage)

**Search/Filter Classes**:
- `.ez-template-search-bar` - Search bar container
- `.ez-template-search-input` - Search input field
- `.ez-template-category-filter` - Category dropdown

**Variable Modal Classes**:
- `.ez-variable-modal` - Variable modal overlay
- `.ez-variable-modal-content` - Variable modal container
- `.ez-variable-input-group` - Input group
- `.ez-variable-label` - Variable label
- `.ez-variable-input` - Variable input field

### Dark Mode

All components support dark mode automatically when Gmail is in dark mode:

```css
body.darkmode .ez-template-modal-content {
  background: #2d2e30 !important;
  color: #e8eaed !important;
}
```

---

## Best Practices

### Template Creation

1. **Use Descriptive Names**: Make template names clear and searchable
2. **Organize with Categories**: Use categories to group related templates
3. **Keep Variables Simple**: Use clear, single-word variable names
4. **Test Before Saving**: Preview templates before using them
5. **Update Regularly**: Keep templates current and relevant

### Variable Usage

1. **Use Consistent Naming**: Stick to camelCase or snake_case
2. **Document Variables**: Include variable descriptions in template name
3. **Provide Defaults**: Consider what happens if variable is empty
4. **Limit Variables**: Too many variables make templates cumbersome
5. **Use Meaningful Names**: `{{clientName}}` not `{{x}}`

### Performance

1. **Limit Template Count**: Keep under 100 templates for best performance
2. **Clean Up Unused**: Delete templates you no longer use
3. **Use Search**: Don't scroll through long lists
4. **Export Regularly**: Backup templates to avoid data loss

---

## Troubleshooting

### Template Button Not Appearing

**Possible Causes**:
1. Compose window not detected
2. Toolbar not found
3. Button already injected

**Solutions**:
1. Refresh Gmail
2. Reload extension
3. Check console for errors
4. Verify compose window is open

### Templates Not Saving

**Possible Causes**:
1. Chrome sync storage full
2. Network issues
3. Storage permissions

**Solutions**:
1. Delete unused templates
2. Check Chrome sync status
3. Verify storage permission in manifest

### Variables Not Replacing

**Possible Causes**:
1. Incorrect variable syntax
2. Variable name mismatch
3. Empty variable value

**Solutions**:
1. Use `{{variableName}}` format
2. Check variable names match exactly
3. Provide values for all variables

### Template Not Inserting

**Possible Causes**:
1. Compose fields not detected
2. Gmail DOM changed
3. Permissions issue

**Solutions**:
1. Check field selectors
2. Update selectors if Gmail changed
3. Verify host permissions

---

## Future Enhancements

### Planned Features
- Rich text formatting in templates
- Template folders/nested categories
- Template sharing with team
- Template marketplace
- Smart variable suggestions
- Conditional content blocks
- Template versioning
- Scheduled template sending
- Template analytics
- CRM integration

---

## Support

For issues, questions, or feature requests:
- **Email**: chrishultberg@ez-it-solutions.com
- **Phone**: 877-411-GEEK (4335)
- **Website**: www.Ez-IT-Solutions.com

---

**Ez Gmail Template System** - Making email composition fast and easy!
