# Bible Verses & Quotes System

## Overview
Dynamic Bible verse lookup and inspirational quote rotation system for email signatures and templates.

---

## Features

### 1. Verse of the Day
Automatically rotates through Bible verses daily.

**Usage**: `{{verseOfTheDay}}`

**Example Output**:
```
"I can do all things through Christ who strengthens me."
— Philippians 4:13 (NKJV)
```

### 2. Quote of the Day
Automatically rotates through inspirational quotes daily.

**Usage**: `{{quoteOfTheDay}}`

**Example Output**:
```
"Education is the most powerful weapon which you can use to change the world."
— Nelson Mandela
```

### 3. Random Quote
Displays a random quote each time.

**Usage**: `{{randomQuote}}`

### 4. Specific Verse Lookup
Reference any specific Bible verse.

**Usage**: `{{verse:reference}}`

**Supported References**:
- `{{verse:1cor-3:23}}` - 1 Corinthians 3:23
- `{{verse:phil-4:13}}` - Philippians 4:13
- `{{verse:prov-3:5-6}}` - Proverbs 3:5-6
- `{{verse:john-3:16}}` - John 3:16
- `{{verse:rom-8:28}}` - Romans 8:28
- `{{verse:jer-29:11}}` - Jeremiah 29:11
- `{{verse:ps-23:1}}` - Psalm 23:1
- And many more!

---

## Jacksonville College Signatures

### Available Templates

1. **Chris Hultberg - Full Signature**
   - Includes verse of the day
   - Full contact information
   - Confidentiality notice

2. **Chris Hultberg - With Quote**
   - Includes quote of the day
   - Full contact information
   - Confidentiality notice

3. **Chris Hultberg - Custom Verse**
   - Includes Philippians 4:13
   - Full contact information
   - Confidentiality notice

4. **Chris Hultberg - Simple**
   - Basic contact information only
   - No verse or quote

---

## How It Works

### Daily Rotation
- **Verse of the Day**: Changes based on day of year (365 verses cycle)
- **Quote of the Day**: Changes based on day of year (10 quotes cycle)
- Both update automatically at midnight

### Processing Order
1. Special variables (verses/quotes) processed first
2. User variables (name, email, etc.) processed second
3. Any remaining variables removed

### Example Template
```
Chris Hultberg
Director of Information Technology

Jacksonville College
(903) 589-7101
chultberg@jacksonville-college.edu

{{verseOfTheDay}}

Best regards
```

**Renders as**:
```
Chris Hultberg
Director of Information Technology

Jacksonville College
(903) 589-7101
chultberg@jacksonville-college.edu

"I can do all things through Christ who strengthens me."
— Philippians 4:13 (NKJV)

Best regards
```

---

## Verse Database

### Currently Included Books
- **1 Corinthians** - 3 verses
- **Philippians** - 2 verses
- **Proverbs** - 3 verses
- **Psalms** - 3 verses
- **John** - 2 verses
- **Romans** - 2 verses
- **Jeremiah** - 1 verse
- **Matthew** - 1 verse

### Total: 17 verses

All verses are from the New King James Version (NKJV).

---

## Quote Database

### Included Authors
- Nelson Mandela
- B.B. King
- John Dewey
- Martin Luther King Jr.
- Mahatma Gandhi
- Carl Rogers
- Ralph Marston
- Winston Churchill
- Helen Hayes
- Ralph Waldo Emerson

### Total: 10 inspirational quotes

All quotes focus on education, excellence, and personal growth.

---

## Adding More Verses

To add new verses, edit `js/verse-quotes.js`:

```javascript
'book-chapter:verse': {
  text: 'The verse text here.',
  reference: 'Book Chapter:Verse',
  version: 'NKJV'
}
```

**Reference Format**:
- Book abbreviation (lowercase)
- Hyphen
- Chapter number
- Colon
- Verse number(s)

**Examples**:
- `1cor-13:4-7` (1 Corinthians 13:4-7)
- `matt-5:16` (Matthew 5:16)
- `ps-119:105` (Psalm 119:105)

---

## Adding More Quotes

To add new quotes, edit `js/verse-quotes.js`:

```javascript
{
  text: 'The quote text here.',
  author: 'Author Name'
}
```

---

## Technical Implementation

### VerseQuoteManager Class

**Methods**:
- `getVerse(reference)` - Get specific verse
- `getVerseOfTheDay()` - Get daily verse
- `getQuoteOfTheDay()` - Get daily quote
- `getRandomQuote()` - Get random quote
- `formatVerse(verse)` - Format verse for display
- `formatQuote(quote)` - Format quote for display
- `processSpecialVariables(text)` - Replace all special variables

### Integration

The system integrates with `TemplateManager`:

```javascript
replaceVariables(text, values) {
  // Process special variables first
  if (window.EzGmailVerseQuoteManager) {
    result = window.EzGmailVerseQuoteManager.processSpecialVariables(result);
  }
  
  // Then process user variables
  // ...
}
```

---

## Use Cases

### 1. Daily Inspiration
Use `{{verseOfTheDay}}` or `{{quoteOfTheDay}}` in your signature to share daily inspiration with email recipients.

### 2. Themed Emails
Use specific verses for themed communications:
- Encouragement: `{{verse:phil-4:13}}`
- Guidance: `{{verse:prov-3:5-6}}`
- Love: `{{verse:1cor-13:4-7}}`

### 3. Professional Signatures
Combine contact info with inspiration:
```
[Your Name]
[Title]
[Contact Info]

{{quoteOfTheDay}}
```

### 4. Educational Context
Perfect for Jacksonville College communications - combines professionalism with faith-based values.

---

## Benefits

### For Users
1. **Automatic Updates** - No manual editing needed
2. **Variety** - Different verse/quote each day
3. **Customizable** - Choose specific verses when needed
4. **Professional** - Well-formatted output

### For Recipients
1. **Daily Inspiration** - Receive uplifting messages
2. **Consistency** - Professional presentation
3. **Variety** - Never see the same message twice in a row

---

## Future Enhancements

### Planned Features
1. **More Verses** - Expand to 100+ verses
2. **More Quotes** - Add 50+ quotes
3. **Custom Collections** - Create themed verse sets
4. **Translation Options** - Support multiple Bible versions
5. **API Integration** - Fetch verses from Bible API
6. **User Additions** - Allow users to add their own verses/quotes

### Advanced Features
1. **Contextual Verses** - Suggest verses based on email content
2. **Seasonal Rotation** - Christmas, Easter-specific verses
3. **Topic-Based** - Filter by topic (hope, faith, love, etc.)
4. **Multi-Language** - Support for Spanish, French, etc.

---

## Files

### Created
- `js/verse-quotes.js` - Main implementation (300+ lines)
- `VERSE_QUOTE_SYSTEM.md` - This documentation

### Modified
- `js/template-library.js` - Added Jacksonville College templates
- `js/template-manager.js` - Integrated verse/quote processing
- `manifest.json` - Added verse-quotes.js to scripts
- `pages/templates.html` - Added verse-quotes.js script

---

## Examples

### Example 1: Simple Signature with Verse of the Day
```
John Doe
Professor of Theology
Jacksonville College

{{verseOfTheDay}}
```

### Example 2: Signature with Specific Verse
```
Jane Smith
Dean of Students

{{verse:prov-3:5-6}}

Contact: jsmith@college.edu
```

### Example 3: Motivational Email
```
Dear Students,

As we begin this new semester, remember:

{{quoteOfTheDay}}

Let's make this a great year!

Best regards,
Administration
```

---

## Support

For questions or to request additional verses/quotes:
- **Email**: chrishultberg@ez-it-solutions.com
- **Phone**: 877-411-GEEK (4335)

---

**Inspiring communication, one email at a time!** 📖✨
