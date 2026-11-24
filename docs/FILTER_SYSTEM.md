# Ez Gmail - Advanced Email Filter System

## Overview

A comprehensive, Thunderbird-style email filtering system that provides powerful automation and organization capabilities directly within Gmail. This system can run continuously (when browser is open) or be integrated with a desktop application for 24/7 monitoring.

## 🎯 Core Concepts

### Filter Architecture
```
Filter Engine
├── Rule Processor (evaluates conditions)
├── Action Executor (performs actions)
├── Priority Manager (orders filter execution)
├── Monitor Service (watches for new emails)
└── Sync Manager (imports/exports filters)
```

## 📋 Filter Components

### 1. Conditions (When to Apply Filter)

#### Email Properties
- **From**: Sender email address or domain
- **To**: Recipient email address
- **CC**: Carbon copy recipients
- **BCC**: Blind carbon copy (if detectable)
- **Subject**: Email subject line
- **Body**: Email body content
- **Has Attachment**: Boolean check
- **Attachment Type**: File extension (pdf, doc, jpg, etc.)
- **Attachment Name**: Specific filename pattern
- **Date Received**: Date/time ranges
- **Size**: Email size in KB/MB
- **Priority**: High/Normal/Low
- **Read Status**: Read/Unread
- **Starred**: Starred/Not starred
- **Labels**: Existing Gmail labels
- **Category**: Primary/Social/Promotions/Updates/Forums

#### Advanced Conditions
- **Header Contains**: Custom email headers
- **List-ID**: Mailing list identifier
- **Reply-To**: Reply-to address
- **In-Reply-To**: Thread identification
- **Message-ID**: Unique message identifier
- **X-Mailer**: Email client used
- **SPF/DKIM Status**: Email authentication
- **Spam Score**: Likelihood of spam

#### Logical Operators
- **AND**: All conditions must match
- **OR**: Any condition must match
- **NOT**: Condition must not match
- **Nested Groups**: Complex condition combinations

#### Pattern Matching
- **Exact Match**: Exact string match
- **Contains**: Substring match
- **Starts With**: Prefix match
- **Ends With**: Suffix match
- **Regular Expression**: Regex pattern
- **Wildcard**: * and ? wildcards
- **Case Sensitive**: Toggle case sensitivity

### 2. Actions (What to Do)

#### Organization Actions
- **Move to Label**: Apply Gmail label (folder)
- **Remove Label**: Remove existing label
- **Archive**: Remove from inbox
- **Delete**: Move to trash
- **Mark as Read**: Change read status
- **Mark as Unread**: Keep unread
- **Star**: Add star
- **Remove Star**: Remove star
- **Mark as Important**: Gmail importance marker
- **Mark as Not Important**: Remove importance

#### Forwarding Actions
- **Forward To**: Forward to email address
- **Forward as Attachment**: Forward as .eml file
- **Redirect**: Change recipient (if possible)

#### Reply Actions
- **Auto-Reply**: Send automatic response
- **Auto-Reply with Template**: Use saved template
- **Reply and Archive**: Reply then archive

#### Advanced Actions
- **Add to Calendar**: Create calendar event
- **Create Task**: Add to Google Tasks
- **Run Script**: Execute custom JavaScript
- **Webhook**: Call external URL
- **Chain Filter**: Trigger another filter

#### Notification Actions
- **Desktop Notification**: Show system notification
- **Sound Alert**: Play sound
- **Email Digest**: Add to daily/weekly digest
- **SMS Alert**: Send text message (via integration)

### 3. Priority System

#### Filter Execution Order
1. **Stop Processing**: Halt after this filter
2. **Continue Processing**: Allow subsequent filters
3. **Priority Number**: 1-1000 (1 = highest priority)
4. **Before/After Filter**: Relative positioning

#### Conflict Resolution
- Higher priority filters execute first
- Conflicting actions: Last action wins
- Label actions: Cumulative (all applied)
- Move actions: Last move wins

## 🔧 Filter Management

### Filter Creation
```javascript
{
  id: "filter-uuid",
  name: "Work Emails from Boss",
  enabled: true,
  priority: 10,
  stopProcessing: false,
  
  conditions: {
    operator: "AND",
    rules: [
      {
        field: "from",
        operator: "equals",
        value: "boss@company.com",
        caseSensitive: false
      },
      {
        field: "subject",
        operator: "contains",
        value: "urgent",
        caseSensitive: false
      }
    ]
  },
  
  actions: [
    {
      type: "addLabel",
      value: "Work/Urgent"
    },
    {
      type: "star",
      value: true
    },
    {
      type: "notification",
      value: {
        title: "Urgent Work Email",
        body: "From: {{from}}\nSubject: {{subject}}"
      }
    }
  ],
  
  statistics: {
    timesApplied: 0,
    lastApplied: null,
    created: "2025-01-01T00:00:00Z",
    modified: "2025-01-01T00:00:00Z"
  }
}
```

### Filter Templates

#### Pre-built Templates
1. **Newsletter Management**
   - Detect newsletters
   - Auto-label and archive
   - Mark as read

2. **Receipt Organization**
   - Detect receipts/invoices
   - Label by vendor
   - Extract to spreadsheet

3. **Social Media Notifications**
   - Detect social platforms
   - Batch and digest
   - Auto-archive old ones

4. **Meeting Invites**
   - Detect calendar invites
   - Auto-accept/decline
   - Add to calendar

5. **Spam Prevention**
   - Advanced spam detection
   - Auto-delete or quarantine
   - Whitelist management

6. **VIP Sender Priority**
   - Important contacts
   - Desktop notifications
   - Never archive

## 🔄 Monitoring Modes

### 1. Browser-Based Monitoring
**When**: Browser is open with Gmail tab
**How**: Content script monitors DOM changes

```javascript
{
  mode: "browser",
  enabled: true,
  checkInterval: 5000, // 5 seconds
  onNewEmail: "immediate", // or "batch"
  batchInterval: 60000, // 1 minute
  maxBatchSize: 50
}
```

**Advantages**:
- No additional software needed
- Real-time filtering
- Low resource usage

**Limitations**:
- Requires browser open
- Gmail tab must be active/background
- Limited to Gmail web interface

### 2. Desktop Application Monitoring
**When**: Desktop app runs in background
**How**: Uses Gmail API for polling

```javascript
{
  mode: "desktop",
  enabled: true,
  pollInterval: 60000, // 1 minute
  apiKey: "encrypted-api-key",
  oauth: {
    clientId: "...",
    clientSecret: "...",
    refreshToken: "..."
  }
}
```

**Advantages**:
- 24/7 monitoring
- Works when browser closed
- More reliable
- Can handle multiple accounts

**Limitations**:
- Requires desktop app
- Uses Gmail API quota
- Needs OAuth authentication

### 3. Hybrid Mode
**When**: Both browser and desktop app available
**How**: Desktop app for monitoring, browser for UI

```javascript
{
  mode: "hybrid",
  browserEnabled: true,
  desktopEnabled: true,
  preferDesktop: true, // Desktop takes priority
  syncInterval: 30000 // Sync every 30 seconds
}
```

## 💾 Storage & Sync

### Local Storage
```javascript
{
  filters: [], // All filter definitions
  statistics: {}, // Filter execution stats
  cache: {}, // Processed email cache
  settings: {} // Filter system settings
}
```

### Chrome Sync Storage
```javascript
{
  filters: [], // Synced across devices
  settings: {}, // User preferences
  templates: [] // Filter templates
}
```

### Export/Import Formats

#### JSON Format
```json
{
  "version": "1.0",
  "exported": "2025-01-01T00:00:00Z",
  "filters": [...],
  "settings": {...}
}
```

#### Thunderbird Format (Import)
```xml
<!-- msgFilterRules.dat format -->
<filters>
  <filter name="..." enabled="true">
    <condition>...</condition>
    <action>...</action>
  </filter>
</filters>
```

#### Gmail Filter Format (Import/Export)
```xml
<!-- Gmail's XML format -->
<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom'>
  <entry>
    <category term='filter'></category>
    <title>Filter Name</title>
    <content>...</content>
  </entry>
</feed>
```

## 🎨 UI Design

### Filter List View
```
┌─────────────────────────────────────────────────────┐
│ 📋 Email Filters                    [+ New Filter]  │
├─────────────────────────────────────────────────────┤
│ ☑ Work Emails from Boss          Priority: 10      │
│   From: boss@company.com → Label: Work/Urgent      │
│   Applied: 45 times | Last: 2 hours ago            │
│   [Edit] [Duplicate] [Delete] [▲] [▼]              │
├─────────────────────────────────────────────────────┤
│ ☑ Newsletter Auto-Archive        Priority: 50      │
│   Subject contains: "newsletter" → Archive          │
│   Applied: 234 times | Last: 5 minutes ago         │
│   [Edit] [Duplicate] [Delete] [▲] [▼]              │
├─────────────────────────────────────────────────────┤
│ ☐ Social Media Digest (Disabled) Priority: 100     │
│   From: @facebook.com, @twitter.com → Label: Social│
│   Applied: 0 times | Never applied                 │
│   [Edit] [Duplicate] [Delete] [▲] [▼]              │
└─────────────────────────────────────────────────────┘
```

### Filter Editor
```
┌─────────────────────────────────────────────────────┐
│ ✏️ Edit Filter: Work Emails from Boss               │
├─────────────────────────────────────────────────────┤
│ Name: [Work Emails from Boss                     ]  │
│ ☑ Enabled    Priority: [10]    ☐ Stop Processing   │
├─────────────────────────────────────────────────────┤
│ CONDITIONS (Match: ⦿ All ○ Any)                     │
│                                                     │
│ [From] [equals] [boss@company.com        ] [-]     │
│ [AND]                                               │
│ [Subject] [contains] [urgent              ] [-]     │
│                                                     │
│ [+ Add Condition] [+ Add Group]                     │
├─────────────────────────────────────────────────────┤
│ ACTIONS                                             │
│                                                     │
│ 1. [Add Label ▼] [Work/Urgent            ] [-]     │
│ 2. [Star       ▼] [Add Star              ] [-]     │
│ 3. [Notify     ▼] [Desktop Notification  ] [-]     │
│                                                     │
│ [+ Add Action]                                      │
├─────────────────────────────────────────────────────┤
│ [Test Filter] [Save] [Cancel]                       │
└─────────────────────────────────────────────────────┘
```

### Filter Statistics Dashboard
```
┌─────────────────────────────────────────────────────┐
│ 📊 Filter Statistics                                │
├─────────────────────────────────────────────────────┤
│ Total Filters: 15 (12 enabled, 3 disabled)         │
│ Emails Processed Today: 234                         │
│ Total Actions Performed: 456                        │
│                                                     │
│ Top Filters (by usage):                             │
│ 1. Newsletter Auto-Archive      234 times          │
│ 2. Work Emails from Boss         45 times          │
│ 3. Receipt Organization          23 times          │
│                                                     │
│ Recent Activity:                                    │
│ • 2 min ago: Newsletter Auto-Archive applied       │
│ • 5 min ago: Work Emails from Boss applied         │
│ • 12 min ago: Receipt Organization applied         │
│                                                     │
│ [View Full Report] [Export Stats]                  │
└─────────────────────────────────────────────────────┘
```

## 🔌 Integration Points

### Gmail API Integration
```javascript
// For desktop app monitoring
const gmail = google.gmail('v1');

// Watch for new emails
gmail.users.watch({
  userId: 'me',
  requestBody: {
    topicName: 'projects/myproject/topics/gmail',
    labelIds: ['INBOX']
  }
});

// Process new emails
gmail.users.messages.list({
  userId: 'me',
  q: 'is:unread'
});
```

### Desktop App Communication
```javascript
// Browser extension → Desktop app
chrome.runtime.sendNativeMessage(
  'com.ezitsolutions.ezgmail',
  { action: 'syncFilters', filters: [...] },
  response => console.log(response)
);

// Desktop app → Browser extension
// Via WebSocket or local HTTP server
```

### Webhook Integration
```javascript
// Call external services
fetch('https://api.example.com/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'email_filtered',
    filter: 'Work Emails from Boss',
    email: { from, subject, date }
  })
});
```

## 🚀 Implementation Phases

### Phase 1: Core Filter Engine (Week 1-2)
- [ ] Filter data structure
- [ ] Condition evaluator
- [ ] Action executor
- [ ] Priority manager
- [ ] Basic UI (list view)

### Phase 2: Advanced Features (Week 3-4)
- [ ] Filter editor UI
- [ ] Template system
- [ ] Import/Export (JSON)
- [ ] Statistics tracking
- [ ] Test mode

### Phase 3: Monitoring (Week 5-6)
- [ ] Browser-based monitoring
- [ ] DOM change detection
- [ ] Batch processing
- [ ] Performance optimization

### Phase 4: Desktop Integration (Week 7-8)
- [ ] Desktop app architecture
- [ ] Gmail API integration
- [ ] OAuth flow
- [ ] Native messaging
- [ ] Hybrid mode

### Phase 5: Advanced Integrations (Week 9-10)
- [ ] Thunderbird import
- [ ] Gmail filter import/export
- [ ] Webhook support
- [ ] Calendar integration
- [ ] Task integration

## 📖 User Guide

### Creating Your First Filter

1. **Open Filter Manager**
   - Click Ez Gmail icon
   - Click "Filters" button
   - Or press Ctrl+Shift+L

2. **Click "New Filter"**

3. **Name Your Filter**
   - Example: "Work Emails from Boss"

4. **Add Conditions**
   - Click "+ Add Condition"
   - Select "From" → "equals" → "boss@company.com"
   - Click "+ Add Condition"
   - Select "Subject" → "contains" → "urgent"
   - Choose "Match All" (AND logic)

5. **Add Actions**
   - Click "+ Add Action"
   - Select "Add Label" → "Work/Urgent"
   - Click "+ Add Action"
   - Select "Star" → "Add Star"
   - Click "+ Add Action"
   - Select "Notify" → "Desktop Notification"

6. **Set Priority**
   - Lower number = higher priority
   - Example: 10 (high priority)

7. **Test Filter** (Optional)
   - Click "Test Filter"
   - Select sample emails
   - Preview what would happen

8. **Save Filter**
   - Click "Save"
   - Filter is now active!

### Importing Thunderbird Filters

1. **Export from Thunderbird**
   - Tools → Message Filters
   - Select filters
   - Tools → Export Filters

2. **Import to Ez Gmail**
   - Open Ez Gmail Filters
   - Click "Import"
   - Select "Thunderbird Format"
   - Choose exported file
   - Review and confirm

3. **Adjust as Needed**
   - Some actions may need adjustment
   - Gmail labels vs Thunderbird folders
   - Test imported filters

## 🔐 Privacy & Security

### Data Handling
- **Filters stored locally**: Chrome sync storage
- **No cloud processing**: All filtering happens locally
- **No data collection**: We don't see your emails or filters
- **Encrypted export**: Optional password protection

### Permissions Required
- **gmail.readonly**: Read email metadata
- **gmail.modify**: Apply labels, archive, etc.
- **gmail.compose**: Auto-reply functionality
- **notifications**: Desktop notifications

### Desktop App Security
- **OAuth 2.0**: Secure Gmail API access
- **Token encryption**: Refresh tokens encrypted locally
- **No password storage**: Never stores Gmail password
- **Sandboxed execution**: Filters run in isolated context

## 💡 Best Practices

### Filter Organization
1. **Use descriptive names**: "Work - Boss Urgent" not "Filter 1"
2. **Group related filters**: Use naming conventions
3. **Set appropriate priorities**: Critical filters first
4. **Test before enabling**: Use test mode
5. **Monitor statistics**: Check what's working

### Performance Tips
1. **Limit complex regex**: Use simple patterns when possible
2. **Batch processing**: Process multiple emails at once
3. **Cache results**: Don't re-process same emails
4. **Disable unused filters**: Keep only active filters enabled
5. **Regular cleanup**: Remove obsolete filters

### Common Patterns

#### VIP Senders
```
Condition: From is in [vip-list]
Actions: Star, Add Label "VIP", Notify
Priority: 1
```

#### Newsletter Management
```
Condition: From contains "newsletter" OR Subject contains "unsubscribe"
Actions: Add Label "Newsletters", Archive, Mark as Read
Priority: 100
```

#### Receipt Tracking
```
Condition: Subject contains "receipt" OR "invoice" OR "order confirmation"
Actions: Add Label "Receipts", Star
Priority: 50
```

---

**This filter system will make Ez Gmail the most powerful Gmail productivity tool available!**
