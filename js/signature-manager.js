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

    // Keep default templates in sync with the code - signatures are
    // persisted, so template fixes would otherwise never reach them.
    this.refreshDefaultTemplates();

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
    // Seeded from the Jacksonville College signature this extension
    // ships with - scraping (ensureProfile) refines these from the
    // live signature when it can, but nothing renders blank.
    return {
      fullName: 'Chris Hultberg',
      firstName: 'Chris',
      lastName: 'Hultberg',
      title: 'Director of Systems and Technology',
      subtitle: 'Chief Information Officer',
      company: 'Jacksonville College',
      phone: '(903) 589-7101',
      mobile: '',
      email: 'chultberg@jacksonville-college.edu',
      website: 'https://www.jacksonville-college.edu/',
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

  // Overwrite the HTML of stored DEFAULT signatures with the current
  // code templates (keyed by name) so code updates take effect for
  // existing installs. User-created signatures are untouched.
  refreshDefaultTemplates() {
    const templates = {
      'Jacksonville College - Professional': this.getJacksonvilleCollegeSignature(),
      'Simple Professional': this.getSimpleProfessionalSignature(),
      'Minimal': this.getMinimalSignature()
    };
    let changed = false;
    this.signatures.forEach(sig => {
      if (sig.isDefault && templates[sig.name] && sig.html !== templates[sig.name]) {
        sig.html = templates[sig.name];
        sig.updatedAt = Date.now();
        changed = true;
      }
    });
    if (changed) {
      this.saveToStorage();
      console.log('Ez Gmail: Default signature templates refreshed');
    }
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
    return `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; margin-top: 24px;">
  <div style="font-weight: 700; font-size: 16px; color: #2c3e50;">{{fullName}}</div>
  <div style="color: #7f8c8d; margin-top: 2px;">{{title}}</div>
  <div style="color: #7f8c8d; margin-bottom: 14px;">{{company}}</div>
  <div style="line-height: 1.7;">
    <div><a href="tel:{{phone}}" style="color: #1a73e8; text-decoration: none;">{{phone}}</a></div>
    <div><a href="mailto:{{email}}" style="color: #1a73e8; text-decoration: none;">{{email}}</a></div>
    <div><a href="{{website}}" style="color: #1a73e8; text-decoration: none;" target="_blank">{{website}}</a></div>
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

  // Find where a signature should be placed in the open compose window.
  // Prefers Gmail's own signature container (div.gmail_signature);
  // falls back to the editable compose body to append one.
  // scope lets callers restrict the search to one compose window.
  findSignatureTarget(scope = document) {
    const sigs = Array.from(
      scope.querySelectorAll('div.gmail_signature')
    ).filter(el => el.offsetParent !== null);
    if (sigs.length) return sigs[sigs.length - 1];

    const bodies = Array.from(
      scope.querySelectorAll('div[contenteditable="true"]')
    ).filter(el => el.offsetParent !== null && el.getAttribute('aria-label'));
    return bodies[bodies.length - 1] || null;
  }

  // Populate ezUserProfile by scraping the signature Gmail already
  // inserted (it contains the real name, title, phone, links, address)
  // plus the Google Account button for name/email. Only fills fields
  // that are currently empty - user-saved values always win.
  // Reject junk values - a bad scrape once wrote whole-paragraph text
  // into title/company, so treat anything overlong or multi-line as
  // empty (forces a fresh scrape).
  isCleanValue(v, maxLen = 120) {
    return typeof v === 'string' && v.trim() &&
           v.length <= maxLen && !/[\n\r]/.test(v);
  }

  async ensureProfile(existingSigEl = null) {
    const p = this.userProfile || {};
    // Discard polluted fields from earlier bad scrapes - overlong,
    // multi-line, or containing the full name mashed into other text
    // (the 'Chris HultbergDirector...' run-on bug).
    ['fullName', 'title', 'subtitle', 'company', 'address',
     'phone', 'email', 'website'].forEach(k => {
      if (p[k] && !this.isCleanValue(p[k])) p[k] = '';
    });
    if (p.title && p.fullName && p.title !== p.fullName &&
        p.title.includes(p.fullName)) {
      p.title = '';
    }
    ['title', 'subtitle', 'company'].forEach(k => {
      if (p[k] && /IMPORTANT:|confidential|disciples/i.test(p[k])) p[k] = '';
    });

    const needs = !p.fullName || !p.email || !p.phone || !p.title;
    if (!needs) return;

    const scraped = existingSigEl ? this.scrapeSignature(existingSigEl) : {};

    // "Google Account: Name (email@domain.com)" on the top-right button
    let acctName = '', acctEmail = '';
    const acctBtn = document.querySelector('a[aria-label^="Google Account"]');
    const m = (acctBtn?.getAttribute('aria-label') || '')
      .match(/:\s*(.+?)\s*\(([^)]+@[^)]+)\)/);
    if (m) { acctName = m[1].trim(); acctEmail = m[2].trim(); }

    const base = this.getDefaultProfile();
    this.userProfile = {
      ...base,
      ...p,
      fullName: p.fullName || acctName || scraped.name || base.fullName,
      email:    p.email    || acctEmail || scraped.email || base.email,
      phone:    p.phone    || scraped.phone || base.phone,
      title:    p.title    || scraped.title || base.title,
      subtitle: p.subtitle || scraped.subtitle || base.subtitle,
      company:  p.company  || scraped.company || base.company,
      website:  p.website  || scraped.website || base.website,
      address:  p.address  || scraped.address || base.address,
      city:     p.city     || scraped.city || base.city,
      state:    p.state    || scraped.state || base.state,
      zip:      p.zip      || scraped.zip || base.zip,
      socialLinks: Object.keys(base.socialLinks).reduce((acc, k) => {
        acc[k] = (p.socialLinks && p.socialLinks[k]) ||
                 (scraped.social && scraped.social[k]) ||
                 base.socialLinks[k];
        return acc;
      }, {})
    };
    await this.saveToStorage();
    console.log('Ez Gmail: Profile populated:', this.userProfile);
  }

  // Best-effort scrape of contact fields out of an existing
  // div.gmail_signature element.
  scrapeSignature(sigEl) {
    const out = {};
    try {
      const tel = sigEl.querySelector('a[href^="tel:"]');
      if (tel) out.phone = tel.textContent.trim();

      const mail = sigEl.querySelector('a[href^="mailto:"]');
      if (mail) out.email = mail.textContent.trim();

      // Website: first http link that isn't social/maps
      for (const a of sigEl.querySelectorAll('a[href^="http"]')) {
        if (/facebook|instagram|twitter|linkedin|youtube|goo\.gl|maps\./
            .test(a.href)) continue;
        out.website = a.textContent.trim() || a.href;
        break;
      }

      // Address lives inside the maps link, split on <br>
      const maps = sigEl.querySelector('a[href*="maps"], a[href*="goo.gl"]');
      if (maps) {
        const lines = maps.innerText.split('\n')
          .map(s => s.trim()).filter(Boolean);
        if (lines[0]) out.address = lines[0];
        const csz = (lines[1] || '').match(/^(.+?),\s*([A-Z]{2})\s+(\d{5})/);
        if (csz) { out.city = csz[1]; out.state = csz[2]; out.zip = csz[3]; }
      }

      // Name: text node with the largest declared font-size
      let maxFs = 0;
      sigEl.querySelectorAll('td, div, span').forEach(el => {
        const fs = parseFloat(el.style.fontSize || '');
        if (fs > maxFs && el.childElementCount === 0 &&
            el.textContent.trim()) {
          maxFs = fs;
          out.name = el.textContent.trim();
        }
      });

      // Title/company block: a div whose ONLY element child is the <p>
      // subtitle itself. Wrapper divs (dir=ltr) also have exactly one
      // child but it is a div/table, not a p - check the tag.
      const titleDiv = Array.from(sigEl.querySelectorAll('div')).find(d =>
        d.childElementCount === 1 &&
        d.children[0].tagName === 'P');
      if (titleDiv) {
        const sub = titleDiv.querySelector('p');
        if (sub) out.subtitle = sub.textContent.trim();
        const clone = titleDiv.cloneNode(true);
        clone.querySelectorAll('p').forEach(x => x.remove());
        const parts = clone.innerHTML.split(/<br\s*\/?>/i)
          .map(s => s.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        if (parts[0]) out.title = parts[0];
        if (parts.length > 1) out.company = parts[parts.length - 1];
      }

      // Never let title echo the name, and drop overlong/messy values
      if (out.title && out.name && out.title === out.name) delete out.title;
      ['name', 'title', 'subtitle', 'company', 'phone', 'email',
       'website', 'address'].forEach(k => {
        if (out[k] && (out[k].length > 120 || /[\n\r]/.test(out[k]))) {
          delete out[k];
        }
      });

      // Social profile links
      out.social = {};
      const socialMap = {
        facebook: 'a[href*="facebook.com"]',
        instagram: 'a[href*="instagram.com"]',
        twitter: 'a[href*="twitter.com"], a[href*="x.com"]',
        linkedin: 'a[href*="linkedin.com"]',
        youtube: 'a[href*="youtube.com"]'
      };
      Object.keys(socialMap).forEach(key => {
        const a = sigEl.querySelector(socialMap[key]);
        if (a) out.social[key] = a.href;
      });
    } catch (e) {
      console.warn('Ez Gmail: Signature scrape failed (non-fatal)', e);
    }
    return out;
  }

  // Replace the compose window's signature with the given signature id.
  async applySignature(signatureId, scope = document) {
    const target = this.findSignatureTarget(scope);
    if (!target) {
      console.warn('Ez Gmail: No compose window or signature found');
      return false;
    }

    // Scrape the CURRENT signature before we overwrite it - that is our
    // best source of truth for the user's contact details.
    const sigEl = target.classList.contains('gmail_signature') ? target :
                  target.querySelector('div.gmail_signature');
    await this.ensureProfile(sigEl);

    const html = await this.getProcessedSignature(signatureId);
    if (!html) return false;

    let body = null;
    if (target.classList.contains('gmail_signature')) {
      // Swap the contents of Gmail's own signature container
      target.innerHTML = html;
      body = target.closest('[contenteditable="true"]');
    } else {
      // No signature present - append one inside a proper container
      const wrap = document.createElement('div');
      wrap.className = 'gmail_signature';
      wrap.setAttribute('data-smartmail', 'gmail_signature');
      wrap.innerHTML = html;
      target.appendChild(wrap);
      body = target;
    }

    // Let Gmail's editor know the body changed
    if (body) {
      body.dispatchEvent(new Event('input', { bubbles: true }));
      body.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
    return true;
  }

  // Apply the ACTIVE signature to a newly-opened compose window.
  // Gmail inserts its own configured signature first - we replace it
  // once the gmail_signature container exists (it can render late).
  async autoApplyToCompose(composeEl) {
    try {
      await this.init();
      const sig = this.getActiveSignature();
      if (!sig || !composeEl) return;

      const tryApply = async () => {
        const target = this.findSignatureTarget(composeEl);
        if (!target) return false;
        return await this.applySignature(sig.id, composeEl);
      };

      if (!(await tryApply())) {
        setTimeout(() => tryApply(), 700);
        setTimeout(() => tryApply(), 1600);
      }
    } catch (e) {
      console.warn('Ez Gmail: Auto-apply signature failed (non-fatal)', e);
    }
  }

  // Show the signature picker modal and apply the user's choice.
  async showSignatureSwitcher() {
    await this.init();

    const signatures = this.getAllSignatures();
    if (!signatures.length) {
      console.warn('Ez Gmail: No signatures configured');
      return;
    }

    document.getElementById('ez-signature-switcher-modal')?.remove();

    const esc = s => String(s || '').replace(/[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const modal = document.createElement('div');
    modal.id = 'ez-signature-switcher-modal';
    modal.className = 'ez-modal';
    modal.innerHTML = `
      <div class="ez-modal-content" style="max-width: 420px">
        <div class="ez-modal-header">
          <h3>Switch Signature</h3>
          <button class="ez-modal-close">&times;</button>
        </div>
        <div class="ez-modal-body" style="padding-top: 8px">
          <div class="ez-sig-error" style="display:none;color:#d93025;font-size:13px;margin-bottom:8px"></div>
          ${signatures.map(s => `
            <button class="ez-date-btn ez-signature-choice" data-sig="${esc(s.id)}"
                    style="display:block;width:100%;text-align:left;margin-bottom:8px;min-width:0;border-radius:12px">
              <div style="font-weight:500">
                ${s.id === this.activeSignatureId ? '✓ ' : ''}${esc(s.name)}
              </div>
              ${s.description ? `<div style="font-size:12px;color:#80868b;font-weight:400;margin-top:2px">${esc(s.description)}</div>` : ''}
            </button>`).join('')}
        </div>
      </div>`;

    document.body.appendChild(modal);

    modal.querySelector('.ez-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll('.ez-signature-choice').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-sig');
        const ok = await this.applySignature(id);
        if (ok) {
          await this.setActiveSignature(id);
          console.log('Ez Gmail: Signature switched to', btn.textContent.trim());
          modal.remove();
        } else {
          const err = modal.querySelector('.ez-sig-error');
          err.textContent = 'No compose window found - open a new message first.';
          err.style.display = 'block';
        }
      });
    });
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
