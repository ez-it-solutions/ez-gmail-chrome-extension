// Ez Gmail - Bible Verses and Quotes System
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Dynamic verse lookup and quote rotation

// Polyfill for replaceAll (for older browsers or external code)
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search, replacement) {
    console.log('Ez Gmail: Using replaceAll polyfill');
    if (search instanceof RegExp) {
      return this.replace(search, replacement);
    }
    return this.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
  };
}

class VerseQuoteManager {
  constructor() {
    this.verses = this.initializeVerses();
    this.quotes = this.initializeQuotes();
    this.religion = null;
    this.theology = null;
    this.loadReligionSettings();
  }

  // Load religion and theology settings
  async loadReligionSettings() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['ezReligion', 'ezTheology'], (result) => {
          this.religion = result.ezReligion || 'Christianity';
          this.theology = result.ezTheology || 'Southern Baptist';
          console.log(`Ez Gmail: Religion set to ${this.religion}, Theology: ${this.theology}`);
          resolve();
        });
      } else {
        this.religion = 'Christianity';
        this.theology = 'Southern Baptist';
        resolve();
      }
    });
  }

  // Save religion and theology settings
  async saveReligionSettings(religion, theology) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          ezReligion: religion,
          ezTheology: theology
        }, () => {
          this.religion = religion;
          this.theology = theology;
          console.log(`Ez Gmail: Religion updated to ${religion}, Theology: ${theology}`);
          resolve();
        });
      } else {
        this.religion = religion;
        this.theology = theology;
        resolve();
      }
    });
  }

  // Get available theologies based on religion
  getTheologies(religion = 'Christianity') {
    const theologies = {
      'Christianity': [
        'Southern Baptist',
        'Independent Baptist',
        'Reformed Baptist',
        'Methodist',
        'Presbyterian',
        'Lutheran',
        'Pentecostal',
        'Non-Denominational',
        'Catholic',
        'Orthodox',
        'Anglican/Episcopal',
        'Assemblies of God',
        'Church of Christ',
        'Nazarene',
        'Evangelical Free'
      ],
      'Judaism': [
        'Orthodox',
        'Conservative',
        'Reform',
        'Reconstructionist'
      ],
      'Islam': [
        'Sunni',
        'Shia',
        'Sufi'
      ],
      'Other': [
        'Secular',
        'Spiritual',
        'Interfaith'
      ]
    };
    return theologies[religion] || [];
  }

  // Initialize Bible verses database
  initializeVerses() {
    return {
      // 1 Corinthians
      '1cor-3:23': {
        text: 'And you are of Christ, and Christ is of God.',
        reference: '1 Corinthians 3:23',
        version: 'NKJV'
      },
      '1cor-10:31': {
        text: 'Therefore, whether you eat or drink, or whatever you do, do all to the glory of God.',
        reference: '1 Corinthians 10:31',
        version: 'NKJV'
      },
      '1cor-13:4-7': {
        text: 'Love suffers long and is kind; love does not envy; love does not parade itself, is not puffed up; does not behave rudely, does not seek its own, is not provoked, thinks no evil; does not rejoice in iniquity, but rejoices in the truth; bears all things, believes all things, hopes all things, endures all things.',
        reference: '1 Corinthians 13:4-7',
        version: 'NKJV'
      },
      
      // Philippians
      'phil-4:13': {
        text: 'I can do all things through Christ who strengthens me.',
        reference: 'Philippians 4:13',
        version: 'NKJV'
      },
      'phil-4:6-7': {
        text: 'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.',
        reference: 'Philippians 4:6-7',
        version: 'NKJV'
      },
      
      // Proverbs
      'prov-3:5-6': {
        text: 'Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.',
        reference: 'Proverbs 3:5-6',
        version: 'NKJV'
      },
      'prov-16:3': {
        text: 'Commit your works to the LORD, and your thoughts will be established.',
        reference: 'Proverbs 16:3',
        version: 'NKJV'
      },
      'prov-18:10': {
        text: 'The name of the LORD is a strong tower; the righteous run to it and are safe.',
        reference: 'Proverbs 18:10',
        version: 'NKJV'
      },
      
      // Psalms
      'ps-23:1': {
        text: 'The LORD is my shepherd; I shall not want.',
        reference: 'Psalm 23:1',
        version: 'NKJV'
      },
      'ps-46:1': {
        text: 'God is our refuge and strength, a very present help in trouble.',
        reference: 'Psalm 46:1',
        version: 'NKJV'
      },
      'ps-119:105': {
        text: 'Your word is a lamp to my feet and a light to my path.',
        reference: 'Psalm 119:105',
        version: 'NKJV'
      },
      
      // John
      'john-3:16': {
        text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.',
        reference: 'John 3:16',
        version: 'NKJV'
      },
      'john-14:6': {
        text: 'Jesus said to him, "I am the way, the truth, and the life. No one comes to the Father except through Me."',
        reference: 'John 14:6',
        version: 'NKJV'
      },
      
      // Romans
      'rom-8:28': {
        text: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.',
        reference: 'Romans 8:28',
        version: 'NKJV'
      },
      'rom-12:2': {
        text: 'And do not be conformed to this world, but be transformed by the renewing of your mind, that you may prove what is that good and acceptable and perfect will of God.',
        reference: 'Romans 12:2',
        version: 'NKJV'
      },
      
      // Jeremiah
      'jer-29:11': {
        text: 'For I know the thoughts that I think toward you, says the LORD, thoughts of peace and not of evil, to give you a future and a hope.',
        reference: 'Jeremiah 29:11',
        version: 'NKJV'
      },
      
      // Matthew
      'matt-28:19-20': {
        text: 'Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age.',
        reference: 'Matthew 28:19-20',
        version: 'NKJV'
      },
      
      // 1 Thessalonians
      '1thess-5:16-18': {
        text: 'Rejoice always, pray without ceasing, in everything give thanks; for this is the will of God in Christ Jesus for you.',
        reference: '1 Thessalonians 5:16-18',
        version: 'NKJV',
        theology: 'Southern Baptist',
        theme: 'prayer, thanksgiving, joy'
      }
    };
  }

  // Initialize inspirational quotes
  initializeQuotes() {
    return [
      {
        text: 'Education is the most powerful weapon which you can use to change the world.',
        author: 'Nelson Mandela'
      },
      {
        text: 'The beautiful thing about learning is that no one can take it away from you.',
        author: 'B.B. King'
      },
      {
        text: 'Education is not preparation for life; education is life itself.',
        author: 'John Dewey'
      },
      {
        text: 'The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education.',
        author: 'Martin Luther King Jr.'
      },
      {
        text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
        author: 'Mahatma Gandhi'
      },
      {
        text: 'The only person who is educated is the one who has learned how to learn and change.',
        author: 'Carl Rogers'
      },
      {
        text: 'Excellence is not a skill. It is an attitude.',
        author: 'Ralph Marston'
      },
      {
        text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill'
      },
      {
        text: 'The expert in anything was once a beginner.',
        author: 'Helen Hayes'
      },
      {
        text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
        author: 'Ralph Waldo Emerson'
      }
    ];
  }

  // Get verse by reference (e.g., "1cor-3:23" or "john-3:16")
  getVerse(reference) {
    const normalized = reference.toLowerCase().trim();
    return this.verses[normalized] || null;
  }

  // Map our verse keys to API-compatible references
  getApiReference(key) {
    const referenceMap = {
      '1cor-3:23': '1 Corinthians 3:23',
      '1cor-10:31': '1 Corinthians 10:31',
      '1cor-13:4-7': '1 Corinthians 13:4-7',
      'phil-4:13': 'Philippians 4:13',
      'phil-4:6-7': 'Philippians 4:6-7',
      'prov-3:5-6': 'Proverbs 3:5-6',
      'prov-16:3': 'Proverbs 16:3',
      'prov-18:10': 'Proverbs 18:10',
      'ps-23:1': 'Psalm 23:1',
      'ps-46:1': 'Psalm 46:1',
      'ps-119:105': 'Psalm 119:105',
      'john-3:16': 'John 3:16',
      'john-14:6': 'John 14:6',
      'rom-8:28': 'Romans 8:28',
      'rom-12:2': 'Romans 12:2',
      'jer-29:11': 'Jeremiah 29:11',
      'matt-28:19-20': 'Matthew 28:19-20',
      '1thess-5:16-18': '1 Thessalonians 5:16-18'
    };
    return referenceMap[key] || key;
  }

  // Map translation codes to API-compatible versions
  getApiTranslation(translation) {
    const translationMap = {
      // Local presets (offline) - these never reach the API anyway
      'CSB': 'web',
      'ESV': 'web',
      'NKJV': 'kjv',
      // bible-api.com translations
      'KJV': 'kjv',
      'WEB': 'web',
      'ASV': 'asv',
      'DARBY': 'darby',
      'BBE': 'bbe',
      // Unsupported translations -> closest free API match
      'NIV': 'web',
      'NLT': 'web',
      'NASB': 'web',
      'AMP': 'web',
      'MSG': 'web'
    };
    return translationMap[translation] || 'web';
  }

  // Read the user's verse configuration from storage
  getVerseConfig() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(
          ['ezVerseMode', 'ezFavoriteVerses', 'ezFixedVerse',
           'ezVerseOffset', 'ezBibleTranslation',
           'ezCustomVerses', 'ezHiddenVerses'],
          result => resolve({
            mode: result.ezVerseMode || 'all',
            favorites: result.ezFavoriteVerses || [],
            fixedVerse: result.ezFixedVerse || null,
            offset: result.ezVerseOffset || 0,
            translation: result.ezBibleTranslation || 'CSB',
            customs: result.ezCustomVerses || {},
            hidden: result.ezHiddenVerses || []
          }));
      } else {
        resolve({ mode: 'all', favorites: [], fixedVerse: null,
                  offset: 0, translation: 'CSB', customs: {}, hidden: [] });
      }
    });
  }

  // Merged verse pool: built-ins + user-added customs (each custom is
  // keyed by its reference so bible-api.com can fetch it for other
  // translations too).
  getAllVerseEntries(customs = {}) {
    const merged = { ...this.verses };
    Object.keys(customs).forEach(key => {
      const c = customs[key];
      if (c && c.reference) {
        merged[key] = {
          text: c.text || c.reference,
          reference: c.reference,
          version: c.version || 'custom',
          custom: true
        };
      }
    });
    return merged;
  }

  // Get verse for a specific date
  async getVerseForSpecificDate(date = null) {
    const cfg = await this.getVerseConfig();

    const all = this.getAllVerseEntries(cfg.customs);

    // Fixed verse mode - always the same verse
    if (cfg.mode === 'fixed' && cfg.fixedVerse && all[cfg.fixedVerse]) {
      console.log('Ez Gmail: Using fixed verse:', cfg.fixedVerse);
      return this._fetchVerseWithTranslation(cfg.fixedVerse,
        all[cfg.fixedVerse]);
    }

    // Rotation list: favorites-only, or all verses (minus hidden ones)
    const notHidden = k => !cfg.hidden.includes(k);
    let verseKeys;
    if (cfg.mode === 'favorites' && cfg.favorites.length) {
      verseKeys = cfg.favorites.filter(k => all[k] && notHidden(k));
    }
    if (!verseKeys || !verseKeys.length) {
      verseKeys = Object.keys(all).filter(notHidden);
      // 1 Thess 5:16-18 first (it's protected from hiding anyway)
      if (verseKeys.includes('1thess-5:16-18')) {
        verseKeys = ['1thess-5:16-18',
          ...verseKeys.filter(k => k !== '1thess-5:16-18')];
      }
    }

    const targetDate = date ? new Date(date) : new Date();
    const dayOfYear = Math.floor((targetDate - new Date(targetDate.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = (dayOfYear + cfg.offset) % verseKeys.length;
    const key = verseKeys[index];
    const defaultVerse = all[key];

    console.log(`Ez Gmail: Verse for date ${targetDate.toDateString()}: ${key} (mode ${cfg.mode}, index ${index}/${verseKeys.length})`);

    return this._fetchVerseWithTranslation(key, defaultVerse);
  }

  // Get verse of the day (changes daily) - uses current date
  async getVerseOfTheDay() {
    return this.getVerseForSpecificDate();
  }

  // Helper method to fetch verse with translation
  _fetchVerseWithTranslation(key, defaultVerse) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['ezBibleTranslation', 'ezCachedVerses', 'ezCustomVerses'], async (result) => {
          const translation = result.ezBibleTranslation || 'CSB';
          const cachedVerses = result.ezCachedVerses || {};
          const customVerses = result.ezCustomVerses || {};
          
          // Create cache key
          const cacheKey = `${key}_${translation}`;
          
          // Check custom verses first
          if (customVerses[key] && customVerses[key].version === translation) {
            console.log('Ez Gmail: Using custom verse:', key);
            resolve(customVerses[key]);
            return;
          }
          
          // Check presets for CSB, ESV, NKJV
          if (window.EzGmailVersePresets && ['CSB', 'ESV', 'NKJV'].includes(translation)) {
            const presetVerses = window.EzGmailVersePresets.getVersesByTranslation(translation);
            if (presetVerses[key]) {
              console.log('Ez Gmail: Using preset verse:', key, translation);
              resolve(presetVerses[key]);
              return;
            }
          }
          
          // Check cache
          if (cachedVerses[cacheKey]) {
            console.log('Ez Gmail: Using cached verse:', cacheKey);
            resolve(cachedVerses[cacheKey]);
            return;
          }
          
          // Try to fetch from API
          try {
            const apiReference = this.getApiReference(key);
            const apiTranslation = this.getApiTranslation(translation);
            const url = `https://bible-api.com/${encodeURIComponent(apiReference)}?translation=${apiTranslation}`;
            
            console.log('Ez Gmail: Fetching verse from API:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            // Extract verse text and clean it up
            let verseText = data.text.trim();
            // Remove verse numbers like [1], [2], etc.
            verseText = verseText.replace(/\[\d+\]/g, '').trim();
            // Remove extra whitespace
            verseText = verseText.replace(/\s+/g, ' ').trim();
            
            const fetchedVerse = {
              text: verseText,
              reference: defaultVerse.reference,
              version: translation,
              cachedAt: Date.now()
            };
            
            // Cache the verse
            cachedVerses[cacheKey] = fetchedVerse;
            chrome.storage.local.set({ ezCachedVerses: cachedVerses });
            console.log('Ez Gmail: Verse cached:', cacheKey);
            
            resolve(fetchedVerse);
          } catch (error) {
            console.error('Ez Gmail: Error fetching verse from API:', error);
            
            // Try to find any cached version of this verse (any translation)
            const anyCachedVersion = Object.keys(cachedVerses).find(k => k.startsWith(key + '_'));
            if (anyCachedVersion) {
              console.log('Ez Gmail: Using cached verse from different translation as fallback');
              resolve({
                ...cachedVerses[anyCachedVersion],
                version: translation + ' (cached)'
              });
              return;
            }
            
            // Final fallback to stored verse with updated version label
            resolve({
              ...defaultVerse,
              version: translation + ' (offline)'
            });
          }
        });
      } else {
        // Fallback if chrome.storage is not available
        resolve(defaultVerse);
      }
    });
  }

  // Get random quote
  getRandomQuote() {
    const index = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[index];
  }

  // Get quote of the day (changes daily)
  getQuoteOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % this.quotes.length;
    return this.quotes[index];
  }

  // Format verse for display
  formatVerse(verse) {
    if (!verse) return '';
    return `"${verse.text}"\n— ${verse.reference} (${verse.version})`;
  }

  // Format quote for display
  formatQuote(quote) {
    if (!quote) return '';
    return `"${quote.text}"\n— ${quote.author}`;
  }

  // Get cache statistics
  async getCacheStats() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['ezCachedVerses'], (result) => {
          const cachedVerses = result.ezCachedVerses || {};
          const count = Object.keys(cachedVerses).length;
          const verses = Object.entries(cachedVerses).map(([key, verse]) => ({
            key,
            reference: verse.reference,
            version: verse.version,
            cachedAt: new Date(verse.cachedAt).toLocaleString()
          }));
          
          resolve({
            count,
            verses
          });
        });
      } else {
        resolve({ count: 0, verses: [] });
      }
    });
  }

  // Clear verse cache
  async clearCache() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ ezCachedVerses: {} }, () => {
          console.log('Ez Gmail: Verse cache cleared');
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  }

  // Persist verse configuration
  saveVerseConfig(updates) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const map = {
          mode: 'ezVerseMode',
          favorites: 'ezFavoriteVerses',
          fixedVerse: 'ezFixedVerse',
          offset: 'ezVerseOffset',
          translation: 'ezBibleTranslation',
          hidden: 'ezHiddenVerses'
        };
        const payload = {};
        Object.keys(updates).forEach(k => {
          if (map[k]) payload[map[k]] = updates[k];
        });
        chrome.storage.local.set(payload, resolve);
      } else resolve();
    });
  }

  // Verse settings modal - mode, translation, favorites, fixed verse
  async showVersePicker() {
    const cfg = await this.getVerseConfig();
    document.getElementById('ez-verse-picker-modal')?.remove();

    const esc = s => String(s || '').replace(/[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const translations = [
      { id: 'CSB',  label: 'CSB - Christian Standard (preset)' },
      { id: 'ESV',  label: 'ESV - English Standard (preset)' },
      { id: 'NKJV', label: 'NKJV - New King James (preset)' },
      { id: 'KJV',  label: 'KJV - King James (bible-api.com)' },
      { id: 'WEB',  label: 'WEB - World English Bible (api)' },
      { id: 'ASV',  label: 'ASV - American Standard (api)' },
      { id: 'DARBY', label: 'Darby (api)' },
      { id: 'BBE',  label: 'BBE - Bible in Basic English (api)' }
    ];

    const all = this.getAllVerseEntries(cfg.customs);
    const PROTECTED = '1thess-5:16-18'; // default verse - cannot remove

    const verseRows = Object.keys(all)
      .filter(key => !cfg.hidden.includes(key))
      .map(key => {
        const v = all[key];
        const isFav = cfg.favorites.includes(key);
        const isFixed = cfg.mode === 'fixed' && cfg.fixedVerse === key;
        const removable = key !== PROTECTED;
        return `
          <div class="ez-verse-row" data-key="${key}" style="display:flex;align-items:center;gap:8px;padding:8px 4px;border-bottom:1px solid #f1f3f4">
            <button class="ez-verse-fav" data-key="${key}" title="Favorite"
              style="background:none;border:none;cursor:pointer;font-size:18px;color:${isFav ? '#f9ab00' : '#dadce0'};padding:0 2px">${isFav ? '★' : '☆'}</button>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:500;color:#202124">${esc(v.reference)}${v.custom ? ' <span style="color:#34a853;font-size:11px">(custom)</span>' : ''}${isFixed ? ' <span style="color:#1a73e8;font-size:11px">(current)</span>' : ''}</div>
              <div style="font-size:12px;color:#5f6368;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(v.text)}</div>
            </div>
            <button class="ez-verse-use" data-key="${key}" title="Always use this verse"
              style="background:none;border:1px solid #dadce0;border-radius:12px;padding:4px 10px;font-size:12px;color:#1a73e8;cursor:pointer;white-space:nowrap">Use</button>
            ${removable ? `
            <button class="ez-verse-del" data-key="${key}" title="${v.custom ? 'Delete this verse' : 'Remove from rotation'}"
              style="background:none;border:none;font-size:15px;color:#d93025;cursor:pointer;padding:0 4px">✕</button>` : ''}
          </div>`;
      }).join('');

    const modal = document.createElement('div');
    modal.id = 'ez-verse-picker-modal';
    modal.className = 'ez-modal';
    modal.innerHTML = `
      <div class="ez-modal-content" style="max-width: 480px">
        <div class="ez-modal-header">
          <h3>Signature Verse</h3>
          <button class="ez-modal-close">&times;</button>
        </div>
        <div class="ez-modal-body" style="padding-top: 8px">
          <label style="font-size:13px;font-weight:500;color:#5f6368">Translation</label>
          <select id="ez-verse-translation" style="width:100%;height:40px;margin:6px 0 16px;padding:0 10px;border:1px solid #747775;border-radius:4px;font-size:14px">
            ${translations.map(t =>
              `<option value="${t.id}" ${t.id === cfg.translation ? 'selected' : ''}>${t.label}</option>`).join('')}
          </select>

          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
            <label style="display:flex;align-items:center;gap:8px;font-size:14px;color:#202124;cursor:pointer">
              <input type="radio" name="ez-verse-mode" value="all" ${cfg.mode === 'all' ? 'checked' : ''}>
              Rotate daily through all verses
            </label>
            <label style="display:flex;align-items:center;gap:8px;font-size:14px;color:#202124;cursor:pointer">
              <input type="radio" name="ez-verse-mode" value="favorites" ${cfg.mode === 'favorites' ? 'checked' : ''}>
              Rotate daily through favorites only <span style="color:#5f6368;font-size:12px">(${cfg.favorites.length})</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;font-size:14px;color:#202124;cursor:pointer">
              <input type="radio" name="ez-verse-mode" value="fixed" ${cfg.mode === 'fixed' ? 'checked' : ''}>
              Always use the pinned verse
            </label>
          </div>

          <button id="ez-verse-next" class="ez-date-btn" style="width:100%;margin-bottom:14px;border-radius:12px">
            ⟳ Show next verse in rotation
          </button>

          <div style="max-height:280px;overflow-y:auto;border:1px solid #e8eaed;border-radius:8px;padding:0 10px">
            ${verseRows}
          </div>

          <div id="ez-add-verse-form" style="display:none;margin-top:12px;padding:12px;border:1px solid #e8eaed;border-radius:8px">
            <input id="ez-new-verse-ref" placeholder="Reference (e.g. John 15:12)"
              style="width:100%;height:36px;margin-bottom:8px;padding:0 10px;border:1px solid #747775;border-radius:4px;font-size:14px;box-sizing:border-box">
            <textarea id="ez-new-verse-text" rows="2" placeholder="Verse text (optional - fetched from bible-api.com if blank)"
              style="width:100%;padding:8px 10px;border:1px solid #747775;border-radius:4px;font-size:13px;box-sizing:border-box;resize:vertical"></textarea>
            <button id="ez-add-verse-save" class="ez-date-btn" style="width:100%;margin-top:8px;border-radius:12px">Add verse</button>
          </div>
          <button id="ez-add-verse-toggle" style="background:none;border:none;color:#1a73e8;font-size:13px;cursor:pointer;padding:10px 0 0">+ Add a verse</button>
          ${cfg.hidden.length ? `<button id="ez-verse-restore" style="background:none;border:none;color:#5f6368;font-size:12px;cursor:pointer;padding:10px 0 0 12px">Restore ${cfg.hidden.length} hidden</button>` : ''}
        </div>
      </div>`;

    document.body.appendChild(modal);

    modal.querySelector('.ez-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // Translation change
    modal.querySelector('#ez-verse-translation').addEventListener('change', e => {
      this.saveVerseConfig({ translation: e.target.value });
    });

    // Mode radios
    modal.querySelectorAll('input[name="ez-verse-mode"]').forEach(r => {
      r.addEventListener('change', () => {
        this.saveVerseConfig({ mode: r.value });
      });
    });

    // Manual rotate - bump offset and re-open to show new state
    modal.querySelector('#ez-verse-next').addEventListener('click', async () => {
      await this.saveVerseConfig({ offset: cfg.offset + 1 });
      this.showVersePicker();
    });

    // Favorite toggles
    modal.querySelectorAll('.ez-verse-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const favs = cfg.favorites.includes(key)
          ? cfg.favorites.filter(k => k !== key)
          : [...cfg.favorites, key];
        cfg.favorites = favs;
        const isFav = favs.includes(key);
        btn.textContent = isFav ? '★' : '☆';
        btn.style.color = isFav ? '#f9ab00' : '#dadce0';
        this.saveVerseConfig({ favorites: favs });
      });
    });

    // Remove buttons - customs deleted, built-ins hidden from rotation
    modal.querySelectorAll('.ez-verse-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.key;
        if (cfg.customs[key]) {
          // User-added verse: delete entirely
          if (window.EzGmailVersePresets) {
            await window.EzGmailVersePresets.deleteCustomVerse(key);
          }
        } else {
          // Built-in: hide from rotation (restorable)
          await this.saveVerseConfig({ hidden: [...cfg.hidden, key] });
        }
        this.showVersePicker();
      });
    });

    // Restore hidden built-ins
    const restoreBtn = modal.querySelector('#ez-verse-restore');
    if (restoreBtn) {
      restoreBtn.addEventListener('click', async () => {
        await this.saveVerseConfig({ hidden: [] });
        this.showVersePicker();
      });
    }

    // Add-verse form
    const addToggle = modal.querySelector('#ez-add-verse-toggle');
    const addForm = modal.querySelector('#ez-add-verse-form');
    if (addToggle && addForm) {
      addToggle.addEventListener('click', () => {
        addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
      });
    }
    const addSave = modal.querySelector('#ez-add-verse-save');
    if (addSave) {
      addSave.addEventListener('click', async () => {
        const ref = (modal.querySelector('#ez-new-verse-ref').value || '').trim();
        const text = (modal.querySelector('#ez-new-verse-text').value || '').trim();
        if (!ref) return;
        if (window.EzGmailVersePresets) {
          // Keyed by the reference itself so bible-api.com can fetch it
          await window.EzGmailVersePresets.addCustomVerse(ref, {
            text: text || ref,
            reference: ref,
            version: cfg.translation
          });
          this.showVersePicker();
        }
      });
    }

    // Pin a fixed verse (also switches to fixed mode)
    modal.querySelectorAll('.ez-verse-use').forEach(btn => {
      btn.addEventListener('click', async () => {
        await this.saveVerseConfig({ mode: 'fixed', fixedVerse: btn.dataset.key });
        modal.remove();
        // Refresh the signature in the open compose, if any
        const mgr = window.EzGmailSignatureManager;
        if (mgr && mgr.activeSignatureId) {
          mgr.applySignature(mgr.activeSignatureId);
        }
      });
    });
  }

  // Process special variables in text
  async processSpecialVariables(text) {
    let result = text;

    // Replace {{verseOfTheDay}}
    if (result.includes('{{verseOfTheDay}}')) {
      const verseOfDay = await this.getVerseOfTheDay();
      result = result.replace(/\{\{verseOfTheDay\}\}/g, this.formatVerse(verseOfDay));
    }

    // Replace {{quoteOfTheDay}}
    const quoteOfDay = this.getQuoteOfTheDay();
    result = result.replace(/\{\{quoteOfTheDay\}\}/g, this.formatQuote(quoteOfDay));

    // Replace {{randomQuote}}
    const randomQuote = this.getRandomQuote();
    result = result.replace(/\{\{randomQuote\}\}/g, this.formatQuote(randomQuote));

    // Replace specific verse references {{verse:reference}}
    const versePattern = /\{\{verse:([^}]+)\}\}/g;
    result = result.replace(versePattern, (match, reference) => {
      const verse = this.getVerse(reference);
      return verse ? this.formatVerse(verse) : match;
    });

    return result;
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.EzGmailVerseQuoteManager = window.EzGmailVerseQuoteManager || new VerseQuoteManager();
}
