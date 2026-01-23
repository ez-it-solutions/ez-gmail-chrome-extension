// Ez Gmail - Bible Verses and Quotes System
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Dynamic verse lookup and quote rotation

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
      'CSB': 'web',      // Web English Bible (closest to CSB available)
      'ESV': 'web',      // ESV not available, use WEB
      'NIV': 'web',      // NIV not available, use WEB
      'NKJV': 'kjv',     // KJV is closest to NKJV
      'KJV': 'kjv',
      'NLT': 'web',      // NLT not available, use WEB
      'NASB': 'web',     // NASB not available, use WEB
      'AMP': 'web',      // AMP not available, use WEB
      'MSG': 'web'       // MSG not available, use WEB
    };
    return translationMap[translation] || 'web';
  }

  // Get verse of the day (changes daily)
  async getVerseOfTheDay() {
    const verseKeys = Object.keys(this.verses);
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % verseKeys.length;
    const key = verseKeys[index];
    const defaultVerse = this.verses[key];
    
    // Get selected translation from storage
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
