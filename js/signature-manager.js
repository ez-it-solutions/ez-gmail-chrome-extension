// Ez Gmail - Signature Manager
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Manage email signatures with variables and auto-insertion

class SignatureManager {
  constructor() {
    this.signatures = [];
    this.userProfile = {};
    this.activeSignatureId = null;
    this.initialized = false;
  }

  // Initialize signature manager
  async init() {
    if (this.initialized) return;
    
    console.log('Ez Gmail: Initializing signature manager...');
    
    // Load signatures and user profile from storage
    await this.loadFromStorage();
    
    // If no signatures exist, create default ones
    if (this.signatures.length === 0) {
      await this.createDefaultSignatures();
    }
    
    this.initialized = true;
    console.log('Ez Gmail: Signature manager initialized with', this.signatures.length, 'signatures');
  }

  // Load signatures and profile from storage
  async loadFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['ezSignatures', 'ezUserProfile', 'ezActiveSignature'], (result) => {
        this.signatures = result.ezSignatures || [];
        this.userProfile = result.ezUserProfile || this.getDefaultProfile();
        this.activeSignatureId = result.ezActiveSignature || null;
        resolve();
      });
    });
  }

  // Save signatures to storage
  async saveToStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.set({
        ezSignatures: this.signatures,
        ezUserProfile: this.userProfile,
        ezActiveSignature: this.activeSignatureId
      }, () => {
        console.log('Ez Gmail: Signatures saved to storage');
        resolve();
      });
    });
  }

  // Get default user profile structure
  getDefaultProfile() {
    return {
      fullName: '',
      firstName: '',
      lastName: '',
      title: '',
      subtitle: '',
      company: '',
      phone: '',
      mobile: '',
      email: '',
      website: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: ''
      },
      customFields: {}
    };
  }

  // Create default signatures
  async createDefaultSignatures() {
    console.log('Ez Gmail: Creating default signatures...');
    
    // Jacksonville College Professional Signature
    const jcProfessional = {
      id: this.generateId(),
      name: 'Jacksonville College - Professional',
      description: 'Professional signature with logo and social links',
      category: 'professional',
      isDefault: true,
      html: this.getJacksonvilleCollegeSignature(),
      variables: [
        'fullName', 'title', 'subtitle', 'company', 'phone', 'email', 
        'website', 'address', 'city', 'state', 'zip',
        'facebook', 'instagram', 'twitter', 'linkedin', 'verseOfTheDay'
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Simple Professional Signature
    const simpleProfessional = {
      id: this.generateId(),
      name: 'Simple Professional',
      description: 'Clean and simple professional signature',
      category: 'professional',
      isDefault: true,
      html: this.getSimpleProfessionalSignature(),
      variables: ['fullName', 'title', 'company', 'phone', 'email', 'website'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Minimal Signature
    const minimal = {
      id: this.generateId(),
      name: 'Minimal',
      description: 'Minimal signature with just the essentials',
      category: 'minimal',
      isDefault: true,
      html: this.getMinimalSignature(),
      variables: ['fullName', 'title', 'email', 'phone'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.signatures = [jcProfessional, simpleProfessional, minimal];
    this.activeSignatureId = jcProfessional.id;
    
    await this.saveToStorage();
    console.log('Ez Gmail: Default signatures created');
  }

  // Get Jacksonville College signature HTML
  getJacksonvilleCollegeSignature() {
    return `<div dir="ltr" style="margin-top:40px">
<table cellspacing="0" width="500" cellpadding="0" border="0">
  <tbody>
    <tr>
      <td valign="top" width="225" style="padding-right:15px">
        <img src="https://jacksonvillecollege.edu/wp-content/uploads/2022/10/Asset-41PNG.png" width="225" alt="Jacksonville College" style="width:225px;max-width:225px;padding-top:20px">
      </td>
      <td>
        <table style="line-height:1.4;font-size:14.4px;color:rgb(0,0,1)">
          <tbody>
            <tr>
              <td style="padding-bottom:1px;padding-top:10px;font-weight:600;font-stretch:normal;font-size:25px;line-height:normal;color:rgb(73,31,149)">{{fullName}}</td>
            </tr>
            <tr>
              <td style="padding-bottom:7px">
                <div style="font-weight:600;font-size:12px">
                  {{title}}<br>
                  <p style="padding-top:0px;margin-top:0px;color:rgb(120,120,120);margin-bottom:5px!important">
                    {{subtitle}}
                  </p><br>
                  {{company}}
                </div>
              </td>
            </tr>
            <tr>
              <td style="margin:0.1px;padding:1px 0px">
                <a href="tel:{{phone}}" style="color:rgb(0,0,0)" target="_blank">{{phone}}</a>
              </td>
            </tr>
            <tr style="margin-top:10px">
              <td style="padding-right:0px;padding-bottom:1px;padding-left:0px;padding-top:10px!important">
                <a href="mailto:{{email}}" style="color:rgb(0,0,0)" target="_blank">{{email}}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:1px 0px">
                <a href="{{website}}" style="color:rgb(0,0,0)" target="_blank">{{website}}</a>
              </td>
            </tr>
            <tr style="padding-bottom:0px!important">
              <td style="margin-top:0.1px;margin-right:0.1px;margin-left:0.1px;padding:1px 0px">
                <a href="https://goo.gl/maps/j6YgQ5gCivUZeG4x9" style="color:rgb(17,85,204)" target="_blank">
                  <p style="padding-top:10px;color:rgb(0,0,0);margin-bottom:5px!important">
                    {{address}}<br>
                    {{city}}, {{state}} {{zip}}
                  </p>
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <table style="padding-top:10px">
                  <tbody>
                    <tr>
                      <td style="padding-right:4px">
                        <a href="{{facebook}}" style="color:rgb(17,85,204);display:block;border-radius:15%;width:22px;height:22px;text-align:center;background-color:rgb(73,31,149);font-size:12px" target="_blank">
                          <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png" height="22">
                        </a>
                      </td>
                      <td style="padding-right:4px">
                        <a href="{{instagram}}" style="color:rgb(17,85,204);display:block;border-radius:15%;width:22px;height:22px;text-align:center;background-color:rgb(73,31,149);font-size:12px" target="_blank">
                          <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png" height="22">
                        </a>
                      </td>
                      <td style="padding-right:4px">
                        <a href="{{twitter}}" style="color:rgb(17,85,204);display:block;border-radius:15%;width:22px;height:22px;text-align:center;background-color:rgb(73,31,149);font-size:12px" target="_blank">
                          <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/twitter-icon-2x.png" height="22">
                        </a>
                      </td>
                      <td style="padding-right:4px">
                        <a href="{{linkedin}}" style="color:rgb(17,85,204);display:block;border-radius:15%;width:22px;height:22px;text-align:center;background-color:rgb(73,31,149);font-size:12px" target="_blank">
                          <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/linkedin-icon-2x.png" height="22">
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

<table style="color:gray;line-height:1.3;width:500px;margin-top:15px">
  <tbody>
    <tr>
      <td style="font-size:12px;font-style:italic;color:rgb(73,31,149);padding-bottom:10px">
        {{verseOfTheDay}}
      </td>
    </tr>
    <tr>
      <td style="font-size:12px">
        IMPORTANT: The contents of this email and any attachments are confidential. It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.
      </td>
    </tr>
  </tbody>
</table>
</div>`;
  }

  // Get simple professional signature HTML
  getSimpleProfessionalSignature() {
    return `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; margin-top: 20px;">
  <div style="font-weight: bold; font-size: 16px; color: #2c3e50;">{{fullName}}</div>
  <div style="color: #7f8c8d; margin-top: 5px;">{{title}}</div>
  <div style="color: #7f8c8d;">{{company}}</div>
  <div style="margin-top: 10px;">
    <div><a href="tel:{{phone}}" style="color: #3498db; text-decoration: none;">{{phone}}</a></div>
    <div><a href="mailto:{{email}}" style="color: #3498db; text-decoration: none;">{{email}}</a></div>
    <div><a href="{{website}}" style="color: #3498db; text-decoration: none;" target="_blank">{{website}}</a></div>
  </div>
</div>`;
  }

  // Get minimal signature HTML
  getMinimalSignature() {
    return `<div style="font-family: Arial, sans-serif; font-size: 13px; color: #555; margin-top: 20px;">
  <div style="font-weight: 600;">{{fullName}}</div>
  <div style="color: #888;">{{title}}</div>
  <div style="margin-top: 8px;">
    <a href="mailto:{{email}}" style="color: #0066cc; text-decoration: none;">{{email}}</a> | 
    <a href="tel:{{phone}}" style="color: #0066cc; text-decoration: none;">{{phone}}</a>
  </div>
</div>`;
  }

  // Get signature by ID
  getSignature(id) {
    return this.signatures.find(sig => sig.id === id);
  }

  // Get active signature
  getActiveSignature() {
    if (!this.activeSignatureId) {
      return this.signatures[0] || null;
    }
    return this.getSignature(this.activeSignatureId);
  }

  // Set active signature
  async setActiveSignature(id) {
    const signature = this.getSignature(id);
    if (!signature) {
      console.error('Ez Gmail: Signature not found:', id);
      return false;
    }
    
    this.activeSignatureId = id;
    await this.saveToStorage();
    console.log('Ez Gmail: Active signature set to:', signature.name);
    return true;
  }

  // Get signature with variables replaced
  async getProcessedSignature(signatureId = null) {
    const signature = signatureId ? this.getSignature(signatureId) : this.getActiveSignature();
    if (!signature) {
      console.warn('Ez Gmail: No signature found');
      return '';
    }

    let html = signature.html;

    // Replace user profile variables
    const profileMap = {
      fullName: this.userProfile.fullName,
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      title: this.userProfile.title,
      subtitle: this.userProfile.subtitle,
      company: this.userProfile.company,
      phone: this.userProfile.phone,
      mobile: this.userProfile.mobile,
      email: this.userProfile.email,
      website: this.userProfile.website,
      address: this.userProfile.address,
      city: this.userProfile.city,
      state: this.userProfile.state,
      zip: this.userProfile.zip,
      facebook: this.userProfile.socialLinks.facebook,
      instagram: this.userProfile.socialLinks.instagram,
      twitter: this.userProfile.socialLinks.twitter,
      linkedin: this.userProfile.socialLinks.linkedin,
      youtube: this.userProfile.socialLinks.youtube
    };

    // Replace profile variables
    Object.keys(profileMap).forEach(key => {
      const value = profileMap[key] || '';
      html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });

    // Process special variables (verse of the day, etc.)
    if (window.EzGmailVerseQuoteManager && html.includes('{{verseOfTheDay}}')) {
      html = await window.EzGmailVerseQuoteManager.processSpecialVariables(html);
    }

    return html;
  }

  // Update user profile
  async updateUserProfile(updates) {
    this.userProfile = {
      ...this.userProfile,
      ...updates
    };
    await this.saveToStorage();
    console.log('Ez Gmail: User profile updated');
  }

  // Add new signature
  async addSignature(signature) {
    const newSignature = {
      id: this.generateId(),
      name: signature.name || 'New Signature',
      description: signature.description || '',
      category: signature.category || 'custom',
      isDefault: false,
      html: signature.html || '',
      variables: signature.variables || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.signatures.push(newSignature);
    await this.saveToStorage();
    console.log('Ez Gmail: Signature added:', newSignature.name);
    return newSignature;
  }

  // Update signature
  async updateSignature(id, updates) {
    const signature = this.getSignature(id);
    if (!signature) {
      console.error('Ez Gmail: Signature not found:', id);
      return false;
    }

    Object.assign(signature, updates, { updatedAt: Date.now() });
    await this.saveToStorage();
    console.log('Ez Gmail: Signature updated:', signature.name);
    return true;
  }

  // Delete signature
  async deleteSignature(id) {
    const index = this.signatures.findIndex(sig => sig.id === id);
    if (index === -1) {
      console.error('Ez Gmail: Signature not found:', id);
      return false;
    }

    // Don't allow deleting the last signature
    if (this.signatures.length === 1) {
      console.error('Ez Gmail: Cannot delete the last signature');
      return false;
    }

    // If deleting active signature, set another as active
    if (this.activeSignatureId === id) {
      this.activeSignatureId = this.signatures[0].id === id ? 
        this.signatures[1].id : this.signatures[0].id;
    }

    this.signatures.splice(index, 1);
    await this.saveToStorage();
    console.log('Ez Gmail: Signature deleted');
    return true;
  }

  // Get all signatures
  getAllSignatures() {
    return this.signatures;
  }

  // Get signatures by category
  getSignaturesByCategory(category) {
    return this.signatures.filter(sig => sig.category === category);
  }

  // Generate unique ID
  generateId() {
    return 'sig_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Export signatures
  exportSignatures() {
    return {
      signatures: this.signatures,
      userProfile: this.userProfile,
      exportedAt: Date.now(),
      version: '2.0.0'
    };
  }

  // Import signatures
  async importSignatures(data) {
    if (!data.signatures || !Array.isArray(data.signatures)) {
      console.error('Ez Gmail: Invalid import data');
      return false;
    }

    // Merge with existing signatures (avoid duplicates by name)
    data.signatures.forEach(importedSig => {
      const exists = this.signatures.find(sig => sig.name === importedSig.name);
      if (!exists) {
        this.signatures.push({
          ...importedSig,
          id: this.generateId(), // Generate new ID
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    });

    await this.saveToStorage();
    console.log('Ez Gmail: Signatures imported');
    return true;
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.EzGmailSignatureManager = window.EzGmailSignatureManager || new SignatureManager();
}

console.log('Ez Gmail: Signature manager script loaded');
