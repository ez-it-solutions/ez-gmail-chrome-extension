// Ez Gmail - Bible Verses and Quotes System
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Dynamic verse lookup and quote rotation

class VerseQuoteManager {
  constructor() {
    this.verses = this.initializeVerses();
    this.quotes = this.initializeQuotes();
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

  // Get verse of the day (changes daily)
  getVerseOfTheDay() {
    const verseKeys = Object.keys(this.verses);
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % verseKeys.length;
    const key = verseKeys[index];
    return this.verses[key];
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

  // Process special variables in text
  processSpecialVariables(text) {
    let result = text;

    // Replace {{verseOfTheDay}}
    const verseOfDay = this.getVerseOfTheDay();
    result = result.replace(/\{\{verseOfTheDay\}\}/g, this.formatVerse(verseOfDay));

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
