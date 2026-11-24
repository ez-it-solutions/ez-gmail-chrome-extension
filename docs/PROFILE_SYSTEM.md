# Profile System for Template Variables

## Overview
The Profile System allows users to save their personal information (name, title, email, etc.) and automatically fill template variables without re-entering data every time.

---

## Features

### 1. Profile Management
- **Create Profiles** - Save variable values with a name (e.g., "Work", "Personal")
- **Multiple Profiles** - Switch between different profiles
- **Default Profile** - Set a profile as default for auto-fill
- **Active Profile** - Currently selected profile
- **Delete Profiles** - Remove profiles you no longer need

### 2. Auto-Fill Variables
- **Automatic** - Variables fill automatically from active profile
- **Profile Selector** - Choose profile from dropdown in variable modal
- **Smart Matching** - Only fills variables that exist in profile
- **Manual Override** - Can still edit auto-filled values

### 3. Save as Profile
- **Quick Save** - Save current variable values as new profile
- **Update Existing** - Modify existing profile variables
- **Set Default** - Mark profile as default during creation

---

## User Workflow

### First Time Use

1. **Use a Template** - Click Templates button, select template
2. **Fill Variables** - Enter your name, email, title, etc.
3. **Click "Save as Profile"** - Bottom left of modal
4. **Name Your Profile** - e.g., "Work Profile"
5. **Set as Default** (optional) - Check the box
6. **Save** - Profile created!

### Subsequent Uses

1. **Use a Template** - Variables auto-fill from active profile!
2. **Or Select Profile** - Choose different profile from dropdown
3. **Edit if Needed** - Modify any auto-filled values
4. **Insert Template** - Done!

---

## Profile Components

### Profile Selector
Located at top of variable input modal:
- **Dropdown** - Lists all profiles
- **"None"** option - Enter manually
- **Active indicator** - Shows current profile
- **Manage button** (👤 icon) - Opens profile management

### Save as Profile Button
Located at bottom left of variable modal:
- **💾 Icon** - Save disk icon
- **"Save as Profile"** text
- **Opens modal** - Enter profile name

### Profile Management Modal
Access via manage button (👤):
- **List all profiles**
- **Shows default** - "(Default)" label
- **Shows active** - Green dot (●)
- **Variable count** - How many variables stored
- **"Use" button** - Set as active profile
- **"Delete" button** - Remove profile

---

## Technical Implementation

### ProfileManager Class

**Storage**:
```javascript
// Stored in chrome.storage.local
{
  ezgmail_profiles: [
    {
      id: "unique_id",
      name: "Work Profile",
      variables: {
        yourName: "John Doe",
        email: "john@company.com",
        phone: "555-1234",
        ...
      },
      isDefault: true,
      created: "2026-01-16T...",
      modified: "2026-01-16T..."
    }
  ],
  ezgmail_active_profile: "unique_id"
}
```

**Key Methods**:
- `createProfile(data)` - Create new profile
- `updateProfile(id, updates)` - Update existing
- `deleteProfile(id)` - Delete profile
- `getActiveProfile()` - Get currently active profile
- `setActiveProfile(id)` - Set active profile
- `getVariableValues(names)` - Get values for variables

### Integration with TemplateUI

**Auto-Fill on Load**:
```javascript
const activeProfile = this.profileManager.getActiveProfile();
if (activeProfile) {
  this.fillVariablesFromProfile(modal, activeProfile.id);
}
```

**Profile Selector Change**:
```javascript
profileSelect.addEventListener('change', (e) => {
  const profileId = e.target.value;
  if (profileId) {
    this.fillVariablesFromProfile(modal, profileId);
  }
});
```

**Save as Profile**:
```javascript
saveProfileBtn.addEventListener('click', () => {
  const values = this.getVariableValues(modal);
  this.showSaveProfileModal(values);
});
```

---

## Use Cases

### 1. Work vs Personal
**Work Profile**:
- Name: "John Doe"
- Title: "Senior Developer"
- Email: "john.doe@company.com"
- Phone: "555-1234 ext. 100"
- Company: "Acme Corp"

**Personal Profile**:
- Name: "John"
- Email: "john.personal@gmail.com"
- Phone: "555-5678"

### 2. Multiple Roles
**Consultant Profile**:
- Name: "Dr. Jane Smith, PhD"
- Title: "IT Consultant"
- Credentials: "PhD, CISSP, PMP"
- Website: "janesmith.consulting"

**Employee Profile**:
- Name: "Jane Smith"
- Title: "IT Director"
- Company: "Tech Solutions Inc"

### 3. Team Sharing
**Support Team**:
- Support Team: "Customer Success"
- Support Email: "support@company.com"
- Support Phone: "1-800-SUPPORT"
- Chat Link: "company.com/chat"

---

## Benefits

### For Users
1. **Save Time** - No re-entering information
2. **Consistency** - Same info every time
3. **Multiple Identities** - Switch between roles
4. **Easy Updates** - Change once, use everywhere
5. **No Typos** - Stored correctly once

### For Organizations
1. **Brand Consistency** - Everyone uses correct info
2. **Easy Onboarding** - New employees import profile
3. **Compliance** - Ensure required fields filled
4. **Professional** - Consistent signatures/info

---

## Storage & Limits

**Storage Location**: `chrome.storage.local`

**Capacity**:
- Profiles: Unlimited (within 5MB total)
- Variables per profile: Unlimited
- Typical profile size: ~500 bytes
- Capacity: 10,000+ profiles easily

**No Sync**:
- Profiles stored locally only
- Export/Import for manual sync
- Future: Cloud sync feature

---

## UI Components

### Profile Selector Styling
```css
.ez-profile-selector-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.ez-profile-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dadce0;
  border-radius: 6px;
}
```

### Save as Profile Button
```css
.ez-variable-btn-save-profile {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 36px;
  background: white;
  color: #1a73e8;
  border: 1px solid #dadce0;
  border-radius: 18px;
}
```

### Dark Mode Support
- All components have dark mode variants
- Consistent with Gmail's dark theme
- Proper contrast ratios

---

## Future Enhancements

### Phase 2
1. **Profile Import/Export** - Share profiles as JSON
2. **Profile Templates** - Pre-built profile templates
3. **Variable Suggestions** - Smart variable detection
4. **Profile Groups** - Organize profiles by category

### Phase 3
1. **Cloud Sync** - Sync profiles across devices
2. **Team Profiles** - Share with organization
3. **Profile Permissions** - Control who can edit
4. **Version History** - Track profile changes

### Phase 4
1. **Smart Profiles** - AI-suggested values
2. **Context Switching** - Auto-select profile by context
3. **Profile Marketplace** - Download community profiles
4. **Integration** - Connect to HR systems

---

## Files Created/Modified

### New Files
1. **js/profile-manager.js** - ProfileManager class (350+ lines)
2. **PROFILE_SYSTEM.md** - This documentation

### Modified Files
1. **js/template-ui.js** - Profile integration
   - Profile selector in variable modal
   - Save as Profile button
   - Profile management modal
   - Auto-fill functionality

2. **js/content.js** - Initialize profile manager
3. **manifest.json** - Added profile-manager.js
4. **css/templates.css** - Profile styling (~150 lines)

---

## Testing Checklist

- [ ] Create profile with variables
- [ ] Set profile as default
- [ ] Auto-fill works on template use
- [ ] Profile selector changes values
- [ ] Save as Profile creates new profile
- [ ] Manage Profiles modal opens
- [ ] Set active profile works
- [ ] Delete profile works
- [ ] Multiple profiles work
- [ ] Dark mode styling correct
- [ ] Profile persists after reload

---

## Examples

### Creating Work Profile
1. Use "Professional Signature" template
2. Fill in:
   - Your Name: "Chris Hultberg"
   - Your Title: "Director of IT"
   - Company Name: "Ez IT Solutions"
   - Email: "chris@ez-it-solutions.com"
   - Phone: "877-411-GEEK"
   - Website: "www.Ez-IT-Solutions.com"
3. Click "Save as Profile"
4. Name: "Work"
5. Check "Set as default"
6. Save!

### Using Profile
1. Click Templates button
2. Select any template with variables
3. **Variables auto-fill from "Work" profile!**
4. Edit if needed
5. Insert template

### Switching Profiles
1. Open template with variables
2. Click profile dropdown
3. Select "Personal" profile
4. Variables update automatically
5. Insert template

---

## Support

For questions about profiles:
- **Email**: chrishultberg@ez-it-solutions.com
- **Phone**: 877-411-GEEK (4335)

---

**Making templates personal and efficient!** 👤✨
