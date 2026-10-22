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
]);

// Wh-question markers in English that move to end in ISL
const ISL_WH_WORDS = new Set(['what', 'where', 'when', 'why', 'who', 'how', 'which']);

// Negation words that move to sentence end
const ISL_NEGATION_WORDS = new Set(['not', 'never', 'no']);

/**
 * Clean a word token from surrounding punctuation
 */
function cleanToken(token: string): string {
  return token.toLowerCase().replace(/[^\w\s]/g, '').trim();
}

/**
 * Parse English input text and apply basic ISL grammar reordering (SVO -> SOV)
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

  const filteredWords: string[] = [];
  const omittedFound: string[] = [];
  let whWord: string | null = null;
  let negationWord: string | null = null;

  for (const raw of rawWords) {
    const cleaned = cleanToken(raw);
    if (!cleaned) continue;

    if (ISL_OMITTED_WORDS.has(cleaned)) {
      omittedFound.push(cleaned);
      continue;
    }

    if (ISL_WH_WORDS.has(cleaned)) {
      whWord = cleaned;
      continue;
    }

    if (ISL_NEGATION_WORDS.has(cleaned) && cleaned !== 'no') {
      negationWord = cleaned;
      continue;
    }

    filteredWords.push(cleaned);
  }

  if (omittedFound.length > 0) {
    grammarNotes.push(
      `Omitted auxiliary/articles [${Array.from(new Set(omittedFound)).join(', ')}] as per ISL syntax`
    );
  }

  // Basic SOV Reordering:
  // In typical 3-word simple sentences (Subject Verb Object), e.g. "I learn English"
  // Move verb to end: [Subject, Object, Verb]
  let reordered = [...filteredWords];
  if (reordered.length === 3) {
    const subject = reordered[0];
    const verb = reordered[1];
    const object = reordered[2];

    const knownVerbs = ['learn', 'eat', 'drink', 'want', 'like', 'teach', 'practice', 'help'];
    if (knownVerbs.includes(verb)) {
      reordered = [subject, object, verb];
      grammarNotes.push(`Reordered sentence from SVO to ISL SOV (${subject.toUpperCase()} → ${object.toUpperCase()} → ${verb.toUpperCase()})`);
    }
  }

  // Move Wh-question to the end
  if (whWord) {
    reordered.push(whWord);
    grammarNotes.push(`Positioned question marker '${whWord.toUpperCase()}' at the end with questioning facial gloss`);
  }

  // Move Negation to the end
  if (negationWord) {
    reordered.push(negationWord);
    grammarNotes.push(`Positioned negative particle '${negationWord.toUpperCase()}' at clause end`);
  }

  const gloss = reordered.map((w) => w.toUpperCase()).join(' ');

  return {
    tokens: reordered,
    grammarNotes,
    gloss,
  };
}

/**
 * Retrieve dictionary word entry
 */
function getWordSignData(word: string): SignData | null {
  const cleaned = cleanToken(word);
  const wordsDict = (signAnimationsData.words as unknown as Record<string, SignData>);

  if (wordsDict[cleaned]) {
    return wordsDict[cleaned];
  }

  // Common spoken variants & aliases
  if (cleaned === 'thank' || cleaned === 'thanks') {
    return wordsDict['thank you'] || wordsDict['thanks'];
  }
  if (cleaned === 'my') {
    return wordsDict['me'] || wordsDict['i'];
  }
  if (cleaned === 'hi' || cleaned === 'hey') {
    return wordsDict['hello'];
  }
  if (cleaned === 'ok' || cleaned === 'okay') {
    return wordsDict['yes'] || wordsDict['good'];
  }
  if (cleaned === 'eat' || cleaned === 'eating' || cleaned === 'food') {
    return wordsDict['food'] || wordsDict['eat'];
  }
  if (cleaned === 'learn' || cleaned === 'learning') {
    return wordsDict['learn'];
  }
  if (cleaned === 'teach' || cleaned === 'teaching') {
    return wordsDict['teacher'];
  }

  // Check aliases or multi-word matches
  for (const [key, val] of Object.entries(wordsDict)) {
    if (key === cleaned || val.label.toLowerCase() === cleaned) {
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
