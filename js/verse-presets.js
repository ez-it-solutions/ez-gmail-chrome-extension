// Ez Gmail - Verse Translation Presets
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Pre-loaded verse translations (CSB, ESV, NKJV)

class VersePresets {
  constructor() {
    this.presets = this.initializePresets();
  }

  // Initialize all verse presets
  initializePresets() {
    return {
      // NKJV - New King James Version (already in system)
      'NKJV': this.getNKJVVerses(),
      
      // CSB - Christian Standard Bible
      'CSB': this.getCSBVerses(),
      
      // ESV - English Standard Version
      'ESV': this.getESVVerses()
    };
  }

  // Get NKJV verses (existing)
  getNKJVVerses() {
    return {
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
      'jer-29:11': {
        text: 'For I know the thoughts that I think toward you, says the LORD, thoughts of peace and not of evil, to give you a future and a hope.',
        reference: 'Jeremiah 29:11',
        version: 'NKJV'
      },
      'matt-28:19-20': {
        text: 'Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you; and lo, I am with you always, even to the end of the age.',
        reference: 'Matthew 28:19-20',
        version: 'NKJV'
      },
      '1thess-5:16-18': {
        text: 'Rejoice always, pray without ceasing, in everything give thanks; for this is the will of God in Christ Jesus for you.',
        reference: '1 Thessalonians 5:16-18',
        version: 'NKJV'
      }
    };
  }

  // Get CSB verses (Christian Standard Bible)
  getCSBVerses() {
    return {
      '1cor-3:23': {
        text: 'You belong to Christ, and Christ belongs to God.',
        reference: '1 Corinthians 3:23',
        version: 'CSB'
      },
      '1cor-10:31': {
        text: 'So, whether you eat or drink, or whatever you do, do everything for the glory of God.',
        reference: '1 Corinthians 10:31',
        version: 'CSB'
      },
      '1cor-13:4-7': {
        text: 'Love is patient, love is kind. Love does not envy, is not boastful, is not arrogant, is not rude, is not self-seeking, is not irritable, and does not keep a record of wrongs. Love finds no joy in unrighteousness but rejoices in the truth. It bears all things, believes all things, hopes all things, endures all things.',
        reference: '1 Corinthians 13:4-7',
        version: 'CSB'
      },
      'phil-4:13': {
        text: 'I am able to do all things through him who strengthens me.',
        reference: 'Philippians 4:13',
        version: 'CSB'
      },
      'phil-4:6-7': {
        text: 'Don\'t worry about anything, but in everything, through prayer and petition with thanksgiving, present your requests to God. And the peace of God, which surpasses all understanding, will guard your hearts and minds in Christ Jesus.',
        reference: 'Philippians 4:6-7',
        version: 'CSB'
      },
      'prov-3:5-6': {
        text: 'Trust in the LORD with all your heart, and do not rely on your own understanding; in all your ways know him, and he will make your paths straight.',
        reference: 'Proverbs 3:5-6',
        version: 'CSB'
      },
      'prov-16:3': {
        text: 'Commit your activities to the LORD, and your plans will be established.',
        reference: 'Proverbs 16:3',
        version: 'CSB'
      },
      'prov-18:10': {
        text: 'The name of the LORD is a strong tower; the righteous run to it and are protected.',
        reference: 'Proverbs 18:10',
        version: 'CSB'
      },
      'ps-23:1': {
        text: 'The LORD is my shepherd; I have what I need.',
        reference: 'Psalm 23:1',
        version: 'CSB'
      },
      'ps-46:1': {
        text: 'God is our refuge and strength, a helper who is always found in times of trouble.',
        reference: 'Psalm 46:1',
        version: 'CSB'
      },
      'ps-119:105': {
        text: 'Your word is a lamp for my feet and a light on my path.',
        reference: 'Psalm 119:105',
        version: 'CSB'
      },
      'john-3:16': {
        text: 'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
        reference: 'John 3:16',
        version: 'CSB'
      },
      'john-14:6': {
        text: 'Jesus told him, "I am the way, the truth, and the life. No one comes to the Father except through me."',
        reference: 'John 14:6',
        version: 'CSB'
      },
      'rom-8:28': {
        text: 'We know that all things work together for the good of those who love God, who are called according to his purpose.',
        reference: 'Romans 8:28',
        version: 'CSB'
      },
      'rom-12:2': {
        text: 'Do not be conformed to this age, but be transformed by the renewing of your mind, so that you may discern what is the good, pleasing, and perfect will of God.',
        reference: 'Romans 12:2',
        version: 'CSB'
      },
      'jer-29:11': {
        text: 'For I know the plans I have for you—this is the LORD\'s declaration—plans for your well-being, not for disaster, to give you a future and a hope.',
        reference: 'Jeremiah 29:11',
        version: 'CSB'
      },
      'matt-28:19-20': {
        text: 'Go, therefore, and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe everything I have commanded you. And remember, I am with you always, to the end of the age.',
        reference: 'Matthew 28:19-20',
        version: 'CSB'
      },
      '1thess-5:16-18': {
        text: 'Rejoice always, pray constantly, give thanks in everything; for this is God\'s will for you in Christ Jesus.',
        reference: '1 Thessalonians 5:16-18',
        version: 'CSB'
      }
    };
  }

  // Get ESV verses (English Standard Version)
  getESVVerses() {
    return {
      '1cor-3:23': {
        text: 'And you are Christ\'s, and Christ is God\'s.',
        reference: '1 Corinthians 3:23',
        version: 'ESV'
      },
      '1cor-10:31': {
        text: 'So, whether you eat or drink, or whatever you do, do all to the glory of God.',
        reference: '1 Corinthians 10:31',
        version: 'ESV'
      },
      '1cor-13:4-7': {
        text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way; it is not irritable or resentful; it does not rejoice at wrongdoing, but rejoices with the truth. Love bears all things, believes all things, hopes all things, endures all things.',
        reference: '1 Corinthians 13:4-7',
        version: 'ESV'
      },
      'phil-4:13': {
        text: 'I can do all things through him who strengthens me.',
        reference: 'Philippians 4:13',
        version: 'ESV'
      },
      'phil-4:6-7': {
        text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
        reference: 'Philippians 4:6-7',
        version: 'ESV'
      },
      'prov-3:5-6': {
        text: 'Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
        reference: 'Proverbs 3:5-6',
        version: 'ESV'
      },
      'prov-16:3': {
        text: 'Commit your work to the LORD, and your plans will be established.',
        reference: 'Proverbs 16:3',
        version: 'ESV'
      },
      'prov-18:10': {
        text: 'The name of the LORD is a strong tower; the righteous man runs into it and is safe.',
        reference: 'Proverbs 18:10',
        version: 'ESV'
      },
      'ps-23:1': {
        text: 'The LORD is my shepherd; I shall not want.',
        reference: 'Psalm 23:1',
        version: 'ESV'
      },
      'ps-46:1': {
        text: 'God is our refuge and strength, a very present help in trouble.',
        reference: 'Psalm 46:1',
        version: 'ESV'
      },
      'ps-119:105': {
        text: 'Your word is a lamp to my feet and a light to my path.',
        reference: 'Psalm 119:105',
        version: 'ESV'
      },
      'john-3:16': {
        text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
        reference: 'John 3:16',
        version: 'ESV'
      },
      'john-14:6': {
        text: 'Jesus said to him, "I am the way, and the truth, and the life. No one comes to the Father except through me."',
        reference: 'John 14:6',
        version: 'ESV'
      },
      'rom-8:28': {
        text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.',
        reference: 'Romans 8:28',
        version: 'ESV'
      },
      'rom-12:2': {
        text: 'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.',
        reference: 'Romans 12:2',
        version: 'ESV'
      },
      'jer-29:11': {
        text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.',
        reference: 'Jeremiah 29:11',
        version: 'ESV'
      },
      'matt-28:19-20': {
        text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.',
        reference: 'Matthew 28:19-20',
        version: 'ESV'
      },
      '1thess-5:16-18': {
        text: 'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.',
        reference: '1 Thessalonians 5:16-18',
        version: 'ESV'
      }
    };
  }

  // Get verses for a specific translation
  getVersesByTranslation(translation) {
    return this.presets[translation] || {};
  }

  // Get all available translations
  getAvailableTranslations() {
    return Object.keys(this.presets);
  }

  // Download preset as JSON file
  downloadPreset(translation) {
    const verses = this.getVersesByTranslation(translation);
    if (!verses || Object.keys(verses).length === 0) {
      console.error('Ez Gmail: No verses found for translation:', translation);
      return false;
    }

    const dataStr = JSON.stringify(verses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ez-gmail-verses-${translation.toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Ez Gmail: Downloaded ${translation} verse preset`);
    return true;
  }

  // Import custom verses from JSON
  async importCustomVerses(jsonData) {
    try {
      let verses;
      if (typeof jsonData === 'string') {
        verses = JSON.parse(jsonData);
      } else {
        verses = jsonData;
      }

      // Validate format
      if (typeof verses !== 'object') {
        throw new Error('Invalid format: Expected object');
      }

      // Save to storage
      return new Promise((resolve) => {
        chrome.storage.local.get(['ezCustomVerses'], (result) => {
          const customVerses = result.ezCustomVerses || {};
          
          // Merge with existing custom verses
          Object.assign(customVerses, verses);
          
          chrome.storage.local.set({ ezCustomVerses: customVerses }, () => {
            console.log('Ez Gmail: Custom verses imported:', Object.keys(verses).length);
            resolve(true);
          });
        });
      });
    } catch (error) {
      console.error('Ez Gmail: Error importing custom verses:', error);
      return false;
    }
  }

  // Get custom verses from storage
  async getCustomVerses() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['ezCustomVerses'], (result) => {
        resolve(result.ezCustomVerses || {});
      });
    });
  }

  // Add single custom verse
  async addCustomVerse(key, verse) {
    const customVerses = await this.getCustomVerses();
    customVerses[key] = verse;
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ ezCustomVerses: customVerses }, () => {
        console.log('Ez Gmail: Custom verse added:', key);
        resolve(true);
      });
    });
  }

  // Delete custom verse
  async deleteCustomVerse(key) {
    const customVerses = await this.getCustomVerses();
    delete customVerses[key];
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ ezCustomVerses: customVerses }, () => {
        console.log('Ez Gmail: Custom verse deleted:', key);
        resolve(true);
      });
    });
  }

  // Export all custom verses
  async exportCustomVerses() {
    const customVerses = await this.getCustomVerses();
    
    if (Object.keys(customVerses).length === 0) {
      console.warn('Ez Gmail: No custom verses to export');
      return false;
    }

    const dataStr = JSON.stringify(customVerses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ez-gmail-custom-verses.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Ez Gmail: Exported custom verses:', Object.keys(customVerses).length);
    return true;
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.EzGmailVersePresets = window.EzGmailVersePresets || new VersePresets();
}

console.log('Ez Gmail: Verse presets loaded');
