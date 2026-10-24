/**
 * ============================================================================
 * EduVaani Text-to-Indian Sign Language (ISL) Generation Engine
 * ============================================================================
 * 
 * CORE RESPONSIBILITIES:
 * 1. ISL Linguistic Transformation:
 *    - Reorders English Subject-Verb-Object (SVO) sentences into authentic
 *      Indian Sign Language Subject-Object-Verb (SOV) order.
 *    - Omits English grammatical function words not signed in ISL (articles:
 *      'a', 'an', 'the'; copulas: 'is', 'am', 'are', 'was', 'were').
 *    - Moves Wh-question words (What, Where, Why, How, Who) to the end of
 *      the sentence as per standard ISL syntax.
 *    - Moves negation particles ('not', 'no') to clause-final positions.
 * 
 * 2. Sign Mapping & Dynamic Fingerspelling Fallback:
 *    - Validates words against curated ISL vocabulary.
 *    - Words without direct sign glosses are systematically decomposed into
 *      two-handed ISL fingerspelling sequence (A-Z).
 *    - Retains original sentence references so UI highlights corresponding words.
 * 
 * 3. Standard & Authority:
 *    - Indian Sign Language Research and Training Centre (ISLRTC)
 *    - Two-handed British/Commonwealth legacy fingerspelling system used across India.
 * ============================================================================
 */

import signAnimationsData from '../data/isl-sign-animations.json';

export type SignType = 'word' | 'fingerspell' | 'unsupported';

export interface SignData {
  label: string;
  hindi?: string;
  hands: 'one-handed' | 'two-handed';
  emoji: string;
  duration: number; // in milliseconds
  description: string;
  animation?: string;
  svgIcon?: string;
  touchPoint?: string;
}

export interface SignSequence {
  id: string;
  word: string;
  displayWord: string;
  signType: SignType;
  signData: SignData;
  duration: number;
  originalIndex: number;
  isFingerspelledLetter?: boolean;
  letterIndex?: number;
  totalLettersInWord?: number;
}

// Backward-compatible alias
export type SignSequenceItem = SignSequence;

export interface SignGenerationMetadata {
  originalText: string;
  islGloss: string;
  grammarTransformationNotes: string[];
  sequence: SignSequence[];
  totalDuration: number;
  supportedWordsCount: number;
  fingerspelledWordsCount: number;
}

export type SignGenerationResult = SignSequence[] & SignGenerationMetadata;

// Words omitted in authentic ISL sentence structure (Articles, Copulas, Auxiliary particles)
const ISL_OMITTED_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'am',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'do',
  'does',
  'did',
  'to',
  'of',
  'for',
]);

// Wh-question markers in English that move to end in ISL
const ISL_WH_WORDS = new Set(['what', 'where', 'when', 'why', 'who', 'how', 'which', 'whom', 'whose']);

// Negation words that move to sentence end
const ISL_NEGATION_WORDS = new Set(['not', 'never', 'no', 'dont', 'doesnt', 'didnt', 'cannot', 'cant']);

// Time markers that authentic ISL places at the very start of the sentence (Time-First syntax)
const ISL_TIME_MARKERS = new Set([
  'today',
  'tomorrow',
  'yesterday',
  'morning',
  'night',
  'evening',
  'afternoon',
  'now',
  'later',
  'before',
  'always',
  'holiday',
  'day',
  'week',
  'month',
  'year',
  'daily',
  'tonight',
  'soon',
]);

// Conversational greetings that ISL preserves at discourse opening
const ISL_GREETING_TOKENS = new Set([
  'namaste',
  'hello',
  'hi',
  'hey',
  'welcome',
  'pranam',
  'vanakkam',
]);

const ISL_GREETING_MODIFIERS = new Set([
  'morning',
  'night',
  'evening',
  'afternoon',
]);

// Comprehensive ISL verbs dictionary for Subject-Object-Verb (SOV) reordering
const ISL_KNOWN_VERBS = new Set([
  'learn',
  'teach',
  'eat',
  'drink',
  'want',
  'like',
  'love',
  'hate',
  'practice',
  'help',
  'meet',
  'read',
  'write',
  'play',
  'sleep',
  'work',
  'walk',
  'run',
  'sit',
  'stand',
  'come',
  'go',
  'give',
  'take',
  'see',
  'look',
  'hear',
  'listen',
  'speak',
  'talk',
  'buy',
  'sell',
  'stop',
  'start',
  'finish',
  'wait',
  'share',
  'try',
  'think',
  'know',
  'understand',
  'clean',
  'wash',
  'dance',
  'sing',
  'swim',
  'call',
  'remember',
  'forget',
  'open',
  'close',
  'cook',
  'drive',
  'study',
  'need',
  'make',
]);

/**
 * Clean a word token from surrounding punctuation
 */
function cleanToken(token: string): string {
  return token.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

/**
 * Common canonical mappings: converts inflected words, past/continuous verbs,
 * plurals, and digit numbers to dictionary entries.
 */
function getCanonicalWord(rawWord: string): string {
  const w = cleanToken(rawWord);

  // Digits to word numbers 1 - 20
  const numberMap: Record<string, string> = {
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten',
    '11': 'eleven', '12': 'twelve', '13': 'thirteen', '14': 'fourteen', '15': 'fifteen',
    '16': 'sixteen', '17': 'seventeen', '18': 'eighteen', '19': 'nineteen', '20': 'twenty',
  };
  if (numberMap[w]) return numberMap[w];

  // Common verb inflections
  const verbMap: Record<string, string> = {
    eating: 'eat', ate: 'eat', eats: 'eat',
    drinking: 'drink', drank: 'drink', drinks: 'drink',
    learning: 'learn', learned: 'learn', learnt: 'learn', learns: 'learn',
    teaching: 'teach', taught: 'teach', teaches: 'teach',
    reading: 'read', reads: 'read',
    writing: 'write', wrote: 'write', written: 'write', writes: 'write',
    sleeping: 'sleep', slept: 'sleep', sleeps: 'sleep',
    walking: 'walk', walked: 'walk', walks: 'walk',
    running: 'run', ran: 'run', runs: 'run',
    speaking: 'speak', spoke: 'speak', spoken: 'speak', speaks: 'speak',
    talking: 'speak', talked: 'speak', talks: 'speak',
    helping: 'help', helped: 'help', helps: 'help',
    giving: 'give', gave: 'give', given: 'give', gives: 'give',
    taking: 'take', took: 'take', taken: 'take', takes: 'take',
    going: 'go', went: 'go', gone: 'go', goes: 'go',
    coming: 'come', came: 'come', comes: 'come',
    seeing: 'see', saw: 'see', seen: 'see', sees: 'see',
    looking: 'see', looked: 'see', looks: 'see',
    hearing: 'hear', heard: 'hear', hears: 'hear',
    listening: 'hear', listened: 'hear', listens: 'hear',
    buying: 'buy', bought: 'buy', buys: 'buy',
    selling: 'sell', sold: 'sell', sells: 'sell',
    dancing: 'dance', danced: 'dance', dances: 'dance',
    singing: 'sing', sang: 'sing', sung: 'sing', sings: 'sing',
    swimming: 'swim', swam: 'swim', swims: 'swim',
    cleaning: 'clean', cleaned: 'clean', cleans: 'clean',
    washing: 'wash', washed: 'wash', washes: 'wash',
    cooking: 'cook', cooked: 'cook', cooks: 'cook',
    driving: 'drive', drove: 'drive', drives: 'drive',
    meeting: 'meet', met: 'meet', meets: 'meet',
    calling: 'call', called: 'call', calls: 'call',
    remembering: 'remember', remembered: 'remember', remembers: 'remember',
    forgetting: 'forget', forgot: 'forget', forgotten: 'forget', forgets: 'forget',
    stopping: 'stop', stopped: 'stop', stops: 'stop',
    starting: 'start', started: 'start', starts: 'start',
    waiting: 'wait', waited: 'wait', waits: 'wait',
    thinking: 'think', thought: 'think', thinks: 'think',
    knowing: 'know', knew: 'know', known: 'know', knows: 'know',
    understanding: 'understand', understood: 'understand', understands: 'understand',
    playing: 'play', played: 'play', plays: 'play',
    working: 'work', worked: 'work', works: 'work',
    sitting: 'sit', sat: 'sit', sits: 'sit',
    standing: 'stand', stood: 'stand', stands: 'stand',
  };
  if (verbMap[w]) return verbMap[w];

  // Common noun plurals
  const pluralMap: Record<string, string> = {
    apples: 'apple', bananas: 'banana', fruits: 'fruit',
    vegetables: 'vegetable', books: 'book', students: 'student',
    teachers: 'teacher', doctors: 'doctor', friends: 'friend',
    brothers: 'brother', sisters: 'sister', sons: 'son',
    daughters: 'daughter', cars: 'car', buses: 'bus',
    trains: 'train', days: 'day', weeks: 'week',
    months: 'month', years: 'year', dogs: 'dog',
    cats: 'cat', birds: 'bird', cows: 'cow',
    elephants: 'elephant', horses: 'horse',
  };
  if (pluralMap[w]) return pluralMap[w];

  // Common pronoun & colloquial aliases
  const aliasMap: Record<string, string> = {
    my: 'me', mine: 'me', im: 'i',
    your: 'you', yours: 'you',
    our: 'we', ours: 'we',
    their: 'they', theirs: 'they',
    hi: 'hello', hey: 'hello',
    thanks: 'thank you',
    ok: 'good', okay: 'good', alright: 'good',
    kids: 'baby', child: 'baby', children: 'baby',
  };
  if (aliasMap[w]) return aliasMap[w];

  return w;
}

/**
 * Parse English input text and apply authentic ISL grammar reordering:
 * 1. Time-First: Temporal markers (Today, Yesterday, Morning) move to sentence start.
 * 2. Omit functional words: Articles ('a', 'the') and copulas ('is', 'are') omitted.
 * 3. SOV Order: Verbs move after objects (Subject -> Object -> Verb).
 * 4. Wh-Movement: Question words move to sentence end.
 * 5. Clause Negation: Negation particles move to sentence end.
 */
export function convertEnglishToISLGrammar(text: string): {
  tokens: string[];
  grammarNotes: string[];
  gloss: string;
} {
  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  const grammarNotes: string[] = [];

  if (rawWords.length <= 1) {
    const cleaned = cleanToken(rawWords[0] || '');
    return {
      tokens: cleaned ? [cleaned] : [],
      grammarNotes: ['Single token direct mapping'],
      gloss: (rawWords[0] || '').toUpperCase(),
    };
  }

  const greetingsFound: string[] = [];
  const coreWords: string[] = [];
  const omittedFound: string[] = [];
  const timeMarkersFound: string[] = [];
  let whWord: string | null = null;
  let negationWord: string | null = null;

  for (let idx = 0; idx < rawWords.length; idx++) {
    const raw = rawWords[idx];
    const cleaned = cleanToken(raw);
    if (!cleaned) continue;

    const prevRaw = idx > 0 ? rawWords[idx - 1] : '';
    const prevCleaned = cleanToken(prevRaw);
    const nextRaw = idx < rawWords.length - 1 ? rawWords[idx + 1] : '';
    const nextCleaned = cleanToken(nextRaw);

    // 1. Discourse Opening Greetings & Politeness (Namaste, Hello, Good Morning, Thank You, etc.)
    if ((cleaned === 'thank' || cleaned === 'thanks') && nextCleaned === 'you') {
      greetingsFound.push('thank you');
      idx++;
      continue;
    }
    if (cleaned === 'thanks') {
      greetingsFound.push('thank you');
      continue;
    }

    if (ISL_GREETING_TOKENS.has(cleaned)) {
      greetingsFound.push(cleaned);
      continue;
    }

    if (cleaned === 'good' && ISL_GREETING_MODIFIERS.has(nextCleaned)) {
      greetingsFound.push('good');
      continue;
    }

    if (ISL_GREETING_MODIFIERS.has(cleaned) && prevCleaned === 'good') {
      greetingsFound.push(cleaned);
      continue;
    }

    // 2. Functional words omitted in ISL syntax
    if (ISL_OMITTED_WORDS.has(cleaned)) {
      omittedFound.push(cleaned);
      continue;
    }

    // 3. True temporal adverbial clauses (Time-First syntax)
    if (ISL_TIME_MARKERS.has(cleaned)) {
      timeMarkersFound.push(cleaned);
      continue;
    }

    // 4. Interrogative wh-question markers
    if (ISL_WH_WORDS.has(cleaned)) {
      whWord = cleaned;
      continue;
    }

    // 5. Clause negation
    if (ISL_NEGATION_WORDS.has(cleaned)) {
      negationWord = cleaned === 'dont' || cleaned === 'doesnt' || cleaned === 'didnt' ? 'not' : cleaned;
      continue;
    }

    coreWords.push(cleaned);
  }

  if (omittedFound.length > 0) {
    grammarNotes.push(
      `Omitted English auxiliary/articles [${Array.from(new Set(omittedFound)).join(', ')}] per ISL syntax`
    );
  }

  // SOV Reordering: Look for verb followed by objects in core words
  let reorderedCore = [...coreWords];
  let verbIndex = -1;

  for (let i = 0; i < reorderedCore.length; i++) {
    const token = reorderedCore[i];
    const canonical = getCanonicalWord(token);
    if (ISL_KNOWN_VERBS.has(token) || ISL_KNOWN_VERBS.has(canonical)) {
      verbIndex = i;
      break;
    }
  }

  // If verb is found and there are object words following it (e.g. SVO or VO)
  if (verbIndex !== -1 && verbIndex < reorderedCore.length - 1) {
    const verbToken = reorderedCore[verbIndex];
    const beforeVerb = reorderedCore.slice(0, verbIndex);
    const afterVerb = reorderedCore.slice(verbIndex + 1);

    // Subject + Object(s) + Verb
    reorderedCore = [...beforeVerb, ...afterVerb, verbToken];
    grammarNotes.push(
      `Reordered sentence to ISL SOV (${beforeVerb.join(' ') || 'Subject'} → ${afterVerb.join(' ')} → ${verbToken.toUpperCase()})`
    );
  }

  // Construct final token list following authentic ISL syntax:
  // [Greetings] + [Time Markers] + [Subject / Object / Verb] + [Wh-Question] + [Negation]
  const finalTokens: string[] = [];

  if (greetingsFound.length > 0) {
    finalTokens.push(...greetingsFound);
    grammarNotes.push(
      `Preserved conversational greeting sequence [${greetingsFound.map((w) => w.toUpperCase()).join(' ')}] at discourse start`
    );
  }

  if (timeMarkersFound.length > 0) {
    finalTokens.push(...timeMarkersFound);
    grammarNotes.push(
      `Positioned temporal marker(s) [${timeMarkersFound.join(', ').toUpperCase()}] at sentence start (Time-First syntax)`
    );
  }

  finalTokens.push(...reorderedCore);

  if (whWord) {
    finalTokens.push(whWord);
    grammarNotes.push(`Positioned question marker '${whWord.toUpperCase()}' at sentence end with questioning facial gloss`);
  }

  if (negationWord) {
    finalTokens.push(negationWord);
    grammarNotes.push(`Positioned negative particle '${negationWord.toUpperCase()}' at clause end`);
  }

  const gloss = finalTokens.map((w) => w.toUpperCase()).join(' ');

  return {
    tokens: finalTokens,
    grammarNotes,
    gloss,
  };
}

/**
 * Retrieve dictionary word entry from expanded 200+ ISL vocabulary
 */
function getWordSignData(word: string): SignData | null {
  const cleaned = cleanToken(word);
  const canonical = getCanonicalWord(cleaned);
  const wordsDict = (signAnimationsData.words as unknown as Record<string, SignData>);

  if (wordsDict[cleaned]) {
    return wordsDict[cleaned];
  }

  if (wordsDict[canonical]) {
    return wordsDict[canonical];
  }

  // Check aliases or label matches
  for (const [key, val] of Object.entries(wordsDict)) {
    if (
      key === cleaned ||
      key === canonical ||
      val.label.toLowerCase() === cleaned ||
      val.label.toLowerCase() === canonical
    ) {
      return val;
    }
  }

  return null;
}

/**
 * Retrieve two-handed ISL alphabet entry
 */
function getAlphabetSignData(letter: string): SignData | null {
  const upper = letter.toUpperCase();
  const alphabetsDict = (signAnimationsData.alphabet as unknown as Record<
    string,
    { letter: string; hands: 'one-handed' | 'two-handed'; emoji: string; description: string; duration: number }
  >);

  const entry = alphabetsDict[upper] as (typeof alphabetsDict[string] & { touchPoint?: string });
  if (entry) {
    return {
      label: `Letter ${entry.letter}`,
      hindi: `अक्षर ${entry.letter}`,
      hands: entry.hands,
      emoji: entry.emoji,
      duration: entry.duration || 950,
      description: entry.description,
      animation: 'alphabet-pose',
      svgIcon: `isl-letter-${entry.letter.toLowerCase()}`,
      touchPoint: entry.touchPoint,
    };
  }

  return null;
}

/**
 * Primary Text to Sign Language Sequence Engine
 */
export function textToSignSequence(text: string): SignGenerationResult {
  const trimmed = text.trim();
  if (!trimmed) {
    const emptyMeta: SignGenerationMetadata = {
      originalText: '',
      islGloss: '',
      grammarTransformationNotes: [],
      sequence: [],
      totalDuration: 0,
      supportedWordsCount: 0,
      fingerspelledWordsCount: 0,
    };
    return Object.assign([], emptyMeta) as SignGenerationResult;
  }

  const { tokens, grammarNotes, gloss } = convertEnglishToISLGrammar(trimmed);
  const sequence: SignSequence[] = [];
  let supportedCount = 0;
  let fingerspelledCount = 0;
  let totalDuration = 0;

  tokens.forEach((token, tokenIdx) => {
    // 1. Check for whole-word direct ISL sign
    const directSign = getWordSignData(token);

    if (directSign) {
      supportedCount++;
      totalDuration += directSign.duration;
      sequence.push({
        id: `seq-${tokenIdx}-${token}`,
        word: token,
        displayWord: directSign.label,
        signType: 'word',
        signData: directSign,
        duration: directSign.duration,
        originalIndex: tokenIdx,
      });
    } else {
      // 2. Fall back to Two-Handed ISL Alphabet Fingerspelling
      fingerspelledCount++;
      const letters = token.split('').filter((ch) => /[a-zA-Z]/.test(ch));

      if (letters.length > 0) {
        letters.forEach((letter, letterIdx) => {
          const letterSign = getAlphabetSignData(letter);
          if (letterSign) {
            totalDuration += letterSign.duration;
            sequence.push({
              id: `seq-${tokenIdx}-letter-${letterIdx}-${letter}`,
              word: token,
              displayWord: `${token.toUpperCase()} [${letter.toUpperCase()}]`,
              signType: 'fingerspell',
              signData: letterSign,
              duration: letterSign.duration,
              originalIndex: tokenIdx,
              isFingerspelledLetter: true,
              letterIndex: letterIdx,
              totalLettersInWord: letters.length,
            });
          }
        });
      } else {
        // Punctuation or numeric fallback
        const fallbackSign: SignData = {
          label: token,
          hands: 'one-handed',
          emoji: '❓',
          duration: 900,
          description: `No direct ISL sign mapping for symbol "${token}". Displayed as written text.`,
        };
        totalDuration += fallbackSign.duration;
        sequence.push({
          id: `seq-${tokenIdx}-unsupported`,
          word: token,
          displayWord: token,
          signType: 'unsupported',
          signData: fallbackSign,
          duration: fallbackSign.duration,
          originalIndex: tokenIdx,
        });
      }
    }
  });

  const metadata: SignGenerationMetadata = {
    originalText: trimmed,
    islGloss: gloss,
    grammarTransformationNotes: grammarNotes,
    sequence,
    totalDuration,
    supportedWordsCount: supportedCount,
    fingerspelledWordsCount: fingerspelledCount,
  };

  return Object.assign([...sequence], metadata) as SignGenerationResult;
}

/**
 * Return list of all words with direct sign mappings
 */
export function getSupportedWords(): string[] {
  return Object.keys(signAnimationsData.words);
}

/**
 * Check if a word has a direct ISL sign mapping
 */
export function isWordSupported(word: string): boolean {
  return Boolean(getWordSignData(word));
}

/**
 * Quick gloss helper
 */
export function getISLGrammarGloss(text: string): string {
  const { gloss } = convertEnglishToISLGrammar(text);
  return gloss;
}
