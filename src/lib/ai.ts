import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CoachingTip {
  original: string;
  improved: string;
  explanationHindi: string;
  fluencyScore: number;
  rule: string;
  islGloss?: string;
  islGrammarTip?: string;
  islHandshapeTip?: string;
}

export type TutorMode = 'spoken' | 'isl';
export type ISLWorkflowPhase = 'warmup' | 'teach' | 'practice' | 'review';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  translatedContent?: string;
  timestamp: Date;
  coachingTip?: CoachingTip;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  context: string;
  systemPrompt: string;
  gradient: string;
  suggestedPhrases: string[];
  mode?: TutorMode;
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'isl-daily',
    title: 'दैनिक सांकेतिक भाषा (Daily ISL Essentials)',
    description: 'Learn everyday ISL signs — greetings, polite phrases, numbers 1-20, colors, and needs!',
    emoji: '🤟',
    mode: 'isl',
    context: 'Interactive ISL classroom practicing daily conversation and essential signs',
    gradient: 'from-amber-500 to-teal-600',
    systemPrompt: `You are EduVaani's master Indian Sign Language (ISL) tutor certified under ISLRTC standards.
Teach daily essential signs: Namaste, Hello, Thank you, Please, Yes, No, Good, Water, Food, Numbers 1 to 20, and Colors.
Structure your turn according to the current pedagogical phase (Warm-up -> Teach -> Practice -> Review).
Coach authentic ISL Subject-Object-Verb (SOV) order and Time-First syntax. Keep responses under 45 words using words from our 300+ ISL vocabulary.`,
    suggestedPhrases: [
      'Namaste! Good morning',
      'Please give me water',
      'I want two apples today',
      'Thank you very much',
    ],
  },
  {
    id: 'isl-family',
    title: 'परिवार और रिश्ते (ISL Family & Relations)',
    description: 'Master ISL signs for family members — mother, father, brother, sister, and home life.',
    emoji: '👨‍👩‍👧‍👦',
    mode: 'isl',
    context: 'Practicing ISL signs for family members, emotions, and household moments',
    gradient: 'from-rose-500 to-purple-600',
    systemPrompt: `You are EduVaani's ISL tutor teaching Indian Sign Language family and emotion signs.
Cover: Mother, Father, Brother, Sister, Son, Daughter, Baby, Family, Happy, Sad, Love, Home.
Always guide the student on two-handed conventions and SOV order (e.g. "I love my family" -> MY FAMILY I LOVE). Keep responses under 45 words.`,
    suggestedPhrases: [
      'This is my mother and father',
      'I have one brother and one sister',
      'My family is very happy',
      'I love my mother',
    ],
  },
  {
    id: 'isl-food',
    title: 'खान-पान और बाज़ार (Food, Drinks & Market)',
    description: 'Sign with confidence at restaurants and markets — tea, roti, fruits, prices, and hunger.',
    emoji: '🍛',
    mode: 'isl',
    context: 'At an Indian eatery or bazaar communicating through Indian Sign Language',
    gradient: 'from-orange-500 to-amber-600',
    systemPrompt: `You are an ISL tutor guiding a student to sign in dining and market situations.
Vocabulary: Water, Tea, Milk, Rice, Roti, Dal, Bread, Apple, Banana, Eat, Drink, Hungry, Thirsty, How much, One to twenty.
Coach the omission of copulas ('is') and Wh-movement to the end ("How much is tea?" -> TEA HOW MUCH). Keep responses under 45 words.`,
    suggestedPhrases: [
      'I am very hungry today',
      'Please give me hot tea and milk',
      'How much for two kilos mangoes?',
      'Food is delicious thank you',
    ],
  },
  {
    id: 'isl-emergency',
    title: 'मदद और सुरक्षा (Help & Safety ISL)',
    description: 'Crucial emergency signs — help, doctor, medicine, police, stop, and pain.',
    emoji: '🚨',
    mode: 'isl',
    context: 'Learning vital safety, health, and emergency communication in ISL',
    gradient: 'from-red-500 to-rose-700',
    systemPrompt: `You are EduVaani's compassionate ISL tutor teaching critical emergency signs.
Vocabulary: Help, Doctor, Police, Hospital, Pain, Stomach, Head, Stop, Wait, Medicine, Call.
Demonstrate two-handed help (fist on flat palm) and clear, expressive facial non-manual markers. Keep responses under 40 words.`,
    suggestedPhrases: [
      'Please help me quickly',
      'Where is the doctor hospital?',
      'I have head pain',
      'Please call police now',
    ],
  },
  {
    id: 'bazaar',
    title: 'भारतीय बाज़ार (Indian Bazaar)',
    description: 'Practice shopping at a vibrant Indian market — vegetables, clothes, and bargaining!',
    emoji: '🛒',
    context: 'You are at a colorful Indian bazaar/market',
    gradient: 'from-orange-500 to-red-500',
    systemPrompt: 'You are a friendly shopkeeper named Ramji at a busy Indian bazaar. Help the student practice English by: discussing vegetables, fruits, clothes, prices, bargaining politely, and everyday market conversations. Use simple English, be warm and encouraging. Occasionally mix in Hindi words like "namaste", "kitna", "theek hai" for cultural context. Keep responses under 80 words and conversational.',
    suggestedPhrases: [
      'How much are these fresh tomatoes?',
      'Can you give me a discount if I buy 2 kilos?',
      'Are these mangoes sweet?',
      'Please pack them in a paper bag.',
    ],
  },
  {
    id: 'school',
    title: 'स्कूल में (At School)',
    description: 'Talk to teachers, classmates, and navigate school life in English!',
    emoji: '🏫',
    context: 'You are in an Indian school setting',
    gradient: 'from-blue-500 to-indigo-600',
    systemPrompt: 'You are a friendly English teacher named Ms. Sharma at an Indian school. Help the student practice English conversations about: classes, homework, exams, friends, school activities, asking questions in class, and school events. Be patient, encouraging, and age-appropriate. Correct mistakes gently. Keep responses under 80 words.',
    suggestedPhrases: [
      'Excuse me ma\'am, may I ask a question?',
      'I completed my English homework yesterday.',
      'Could you explain this chapter once more?',
      'When will our exam results be announced?',
    ],
  },
  {
    id: 'doctor',
    title: 'डॉक्टर के पास (At the Doctor)',
    description: 'Practice explaining health issues and understanding medical advice in English.',
    emoji: '🏥',
    context: 'You are at a doctor\'s clinic in India',
    gradient: 'from-teal-500 to-emerald-600',
    systemPrompt: 'You are a friendly doctor named Dr. Patel at an Indian clinic. Help the patient practice medical English: describing symptoms, asking about medicines, understanding prescriptions, health advice. Use simple vocabulary, be compassionate and clear. Keep responses under 80 words and reassuring.',
    suggestedPhrases: [
      'Doctor, I have a headache and mild fever since yesterday.',
      'How many times a day should I take this syrup?',
      'Should I take this medicine before or after meals?',
      'Do I need to come back for a check-up?',
    ],
  },
  {
    id: 'airport',
    title: 'हवाई अड्डा (Airport)',
    description: 'Navigate check-in, security, and boarding — all in English!',
    emoji: '✈️',
    context: 'You are at an Indian international airport',
    gradient: 'from-sky-500 to-blue-600',
    systemPrompt: 'You are a helpful airport staff member at an Indian international airport. Help the traveler practice English: check-in process, security questions, boarding announcements, passport control, and asking for help navigating the airport. Use clear, formal English. Keep responses under 80 words.',
    suggestedPhrases: [
      'Good morning, I would like to check in for my flight.',
      'Could I please have a window seat?',
      'Where is security gate number 4?',
      'What time does boarding start for Mumbai?',
    ],
  },
  {
    id: 'restaurant',
    title: 'रेस्टोरेंट (Restaurant)',
    description: 'Order food, ask about menu items, and handle dining situations in English.',
    emoji: '🍛',
    context: 'You are at an Indian restaurant',
    gradient: 'from-amber-500 to-orange-600',
    systemPrompt: 'You are a helpful waiter at a nice Indian restaurant. Help the customer practice dining English: reading menus, ordering food, asking about ingredients, dietary preferences, requesting the bill. Mention popular Indian dishes. Be professional and friendly. Keep responses under 80 words.',
    suggestedPhrases: [
      'Table for two please, near the window.',
      'What do you recommend for dinner today?',
      'Is this curry very spicy?',
      'Could we please get the bill?',
    ],
  },
  {
    id: 'interview',
    title: 'नौकरी इंटरव्यू (Job Interview)',
    description: 'Practice professional English for job interviews and workplace situations.',
    emoji: '💼',
    context: 'You are in a professional job interview',
    gradient: 'from-purple-500 to-violet-600',
    systemPrompt: 'You are an interviewer at a reputable company in India conducting a job interview in English. Ask common interview questions: tell me about yourself, your strengths/weaknesses, career goals, experience. Give constructive feedback on English usage. Be professional but encouraging. Keep responses under 80 words.',
    suggestedPhrases: [
      'Good morning sir, thank you for this opportunity.',
      'I have two years of experience in customer support.',
      'My greatest strength is my problem-solving ability.',
      'I am eager to learn and grow with your company.',
    ],
  },
  {
    id: 'story-kingdom',
    title: 'कहानियों का संसार (Storybook Kingdom)',
    description: 'Practice creative English by telling stories, folk tales, and sharing adventures!',
    emoji: '📚',
    context: 'You are in a magical storybook kingdom filled with Indian fables and folk tales',
    gradient: 'from-cyan-500 to-blue-600',
    systemPrompt: 'You are a warm, imaginative storyteller named Dadi Ma / Story Weaver. Help the learner practice narrative English: starting stories ("Once upon a time..."), describing characters, emotions, moral lessons, and plot twists. Encourage creativity and gentle vocabulary expansion. Keep responses under 80 words and captivating.',
    suggestedPhrases: [
      'Once upon a time in a small village...',
      'Can you tell me a story about a brave king?',
      'What was the moral of this tale?',
      'Let me tell you what happened next!',
    ],
  },
  {
    id: 'home',
    title: 'घर और परिवार (Family & Festivals)',
    description: 'Talk about Indian festivals, Diwali, Eid, weddings, and daily family moments.',
    emoji: '🏡',
    context: 'You are at an Indian family celebration during festival season',
    gradient: 'from-rose-500 to-pink-600',
    systemPrompt: 'You are an affectionate and lively cousin visiting for a festival celebration. Help the student practice warm, informal social English: talking about holiday preparations, sweets, relatives, family memories, gifts, and plans. Be upbeat, culturally relatable, and conversational. Keep responses under 80 words.',
    suggestedPhrases: [
      'How are the festival preparations going at your house?',
      'My mother made delicious sweets today.',
      'All our relatives are arriving tomorrow evening.',
      'What is your favorite festival tradition?',
    ],
  },
  {
    id: 'cricket',
    title: 'क्रिकेट मैदान (Cricket & Sports Talk)',
    description: 'Discuss live matches, favorite Indian players, bowling, and commentary!',
    emoji: '🏏',
    context: 'You are at a lively cricket match stadium or sports cafe in India',
    gradient: 'from-emerald-500 to-green-600',
    systemPrompt: 'You are an enthusiastic cricket commentator and sports analyst friend. Help the student practice energetic English: discussing batting shots, bowling tactics, match highlights, favorite Indian cricketers (Kohli, Rohit, Dhoni), and tournament predictions. Keep responses punchy, exciting, and under 80 words.',
    suggestedPhrases: [
      'What an incredible six over long-on!',
      'India needs twenty runs off the last two overs.',
      'Who is your all-time favorite Indian cricketer?',
      'The pitch seems great for fast bowlers today.',
    ],
  },
];

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private chatHistory: ChatMessage[] = [];
  private currentScenario: RoleplayScenario | null = null;
  private tutorMode: TutorMode = 'spoken';
  private islPhase: ISLWorkflowPhase = 'warmup';
  private candidateModels: string[] = [
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
  ];

  constructor() {
    const apiKey =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
      (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.VITE_GEMINI_API_KEY);
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  setTutorMode(mode: TutorMode): void {
    this.tutorMode = mode;
  }

  getTutorMode(): TutorMode {
    return this.tutorMode;
  }

  setISLPhase(phase: ISLWorkflowPhase): void {
    this.islPhase = phase;
  }

  getISLPhase(): ISLWorkflowPhase {
    return this.islPhase;
  }

  advanceISLPhase(): ISLWorkflowPhase {
    const order: ISLWorkflowPhase[] = ['warmup', 'teach', 'practice', 'review'];
    const idx = order.indexOf(this.islPhase);
    const next = order[(idx + 1) % order.length];
    this.islPhase = next;
    return next;
  }

  async startFreeFlowChat(): Promise<string> {
    this.tutorMode = 'spoken';
    this.currentScenario = null;
    this.chatHistory = [];
    const welcome = "Namaste! 🙏 I'm EduVaani, your personal AI English tutor. I'm here to help you speak English naturally and fearlessly. Tell me, how was your day today, or what would you like to talk about?";
    this.addMessage('assistant', welcome);
    return welcome;
  }

  async startISLTutor(initialPhase: ISLWorkflowPhase = 'warmup'): Promise<string> {
    this.tutorMode = 'isl';
    this.islPhase = initialPhase;
    this.currentScenario = null;
    this.chatHistory = [];
    const welcome = "Namaste! 🙏 I am your Indian Sign Language (ISL) AI tutor. Today we will practice authentic signs and Subject-Object-Verb (SOV) sentence structure. Let us start our warm-up — how are you feeling today?";
    this.addMessage('assistant', welcome, {
      original: 'Namaste',
      improved: 'Namaste! Welcome to ISL practice.',
      explanationHindi: 'भारतीय सांकेतिक भाषा (ISL) में आपका स्वागत है। चलिए अभ्यास शुरू करते हैं।',
      fluencyScore: 100,
      rule: 'Warm-up Greeting',
      islGloss: 'NAMASTE WELCOME',
      islGrammarTip: 'Namaste is signed with both palms pressed flat at chest center (prayer posture).',
      islHandshapeTip: 'Two-handed midline prayer handshape with gentle head nod.',
    });
    return welcome;
  }

  async startRoleplay(scenarioId: string): Promise<string> {
    const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) throw new Error('Scenario not found');
    this.currentScenario = scenario;
    this.tutorMode = scenario.mode || 'spoken';
    this.chatHistory = [];
    const welcome = `Namaste! Welcome to ${scenario.title} ${scenario.emoji}. ${scenario.description} Speak in English or sign whenever you're ready — I am listening!`;
    this.addMessage('assistant', welcome);
    return welcome;
  }

  async sendMessage(userInput: string): Promise<string> {
    this.addMessage('user', userInput);

    const isISL = this.tutorMode === 'isl' || (this.currentScenario?.mode === 'isl');

    let prompt = '';

    if (isISL) {
      prompt = `You are EduVaani's master Indian Sign Language (ISL) AI Tutor, strictly aligned with ISLRTC (Indian Sign Language Research and Training Centre) standards.
Current Pedagogical Phase: [${this.islPhase.toUpperCase()}]
- WARMUP: Greet warmly, build confidence, establish the topic (e.g. daily essentials, family, food, numbers 1-20, colors).
- TEACH: Introduce 1-2 target vocabulary signs from our 300+ word database. Detail two-handed conventions, handshape, touch point, and facial expression.
- PRACTICE: Ask the student to sign or structure a sentence using authentic ISL grammar.
- REVIEW: Praise progress, highlight the Subject-Object-Verb (SOV) order, and summarize signs.

CRITICAL ISL LINGUISTIC RULES TO COACH:
1. Sentence Word Order is strictly Subject-Object-Verb (SOV). Example: "I learn English" -> I ENGLISH LEARN.
2. Time-First Rule: Temporal markers (Today, Tomorrow, Yesterday, Morning, Now) MUST appear at the very beginning of the clause. Example: "I eat apples today" -> TODAY I APPLES EAT.
3. Wh-Movement: Wh-question words (What, Where, Why, How, Who) move to the very end of the sentence with raised/furrowed brows. Example: "What is your name?" -> YOUR NAME WHAT.
4. Omission of English copulas & articles: Words like 'is', 'am', 'are', 'was', 'were', 'a', 'an', 'the' do NOT exist in ISL and are omitted.
5. Vocabulary: Restrict conversational reply to simple, highly signable English words from our 300+ ISL dictionary so the avatar can animate them smoothly without excessive fingerspelling.

`;
      if (this.currentScenario) {
        prompt += `Scenario Context: ${this.currentScenario.context}\n${this.currentScenario.systemPrompt}\n\n`;
      }
    } else {
      if (this.currentScenario) {
        prompt = `${this.currentScenario.systemPrompt}\n\nContext: ${this.currentScenario.context}\n\n`;
      } else {
        prompt = 'You are EduVaani, a warm, patient, and encouraging AI English tutor for Indian students. Help them practice spoken English. Keep your conversational response under 50 words, simple, and friendly.\n\n';
      }
    }

    const recentHistory = this.chatHistory.slice(-8);
    prompt += 'Conversation History:\n';
    recentHistory.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'Student' : 'EduVaani'}: ${msg.content}\n`;
    });

    if (isISL) {
      prompt += `
Instruction:
1. Respond as EduVaani ISL Tutor in character for Phase [${this.islPhase.toUpperCase()}]. Keep conversational reply under 45 words using signable vocabulary.
2. Provide precise ISL grammatical transformation & handshape coaching for Student's input ("${userInput}").

Format your response EXACTLY as:
[REPLY]
<Conversational response here>

[COACH]
Improved: <A natural English sentence equivalent>
ISLGloss: <Authentic ISL sentence gloss in Time-First + SOV order, e.g. TODAY I TWO APPLES EAT>
ISLGrammarTip: <1 sentence explaining why words are ordered in SOV or Time-First, or omitted copulas>
ISLHandshape: <1 sentence describing key handshape, two-handed touch point, or facial non-manual marker>
HindiTip: <1 short sentence in Hindi explaining the sign nuance or cheering them on>
Score: <Score from 75 to 100>
Rule: <Short 3-6 word grammar or sign description rule>
`;
    } else {
      prompt += `
Instruction:
1. Respond naturally as ${this.currentScenario ? 'the character' : 'EduVaani'}. Keep answer conversational, relatable, and under 50 words.
2. Provide gentle grammar & fluency coaching on the Student's message ("${userInput}").

Format your response EXACTLY as:
[REPLY]
<Conversational response here>

[COACH]
Improved: <A natural, grammatically correct English version of what student said>
HindiTip: <1 short sentence in Hindi explaining the nuance or cheering them on>
Score: <Score from 70 to 100>
Rule: <Short 3-6 word grammar or phrasing tip>
`;
    }

    // 1. Try Google Gemini candidate models
    if (this.genAI) {
      for (const modelName of this.candidateModels) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const rawText = result.response.text();
          if (rawText && rawText.trim().length > 0) {
            const { reply, coachingTip } = this.parseResponse(rawText, userInput, isISL);
            this.addMessage('assistant', reply, coachingTip);
            return reply;
          }
        } catch (modelErr: unknown) {
          console.warn(`Model ${modelName} unavailable, falling back to next model...`, modelErr);
        }
      }
    }

    // 2. Resilient contextual response generator (Guarantees zero downtime)
    const { reply, coachingTip } = this.generateSmartFallback(userInput, this.currentScenario, isISL);
    this.addMessage('assistant', reply, coachingTip);
    return reply;
  }

  private parseResponse(
    raw: string,
    originalInput: string,
    isISL: boolean = false
  ): { reply: string; coachingTip?: CoachingTip } {
    let reply = raw.trim();
    let coachingTip: CoachingTip | undefined = undefined;

    if (raw.includes('[REPLY]') && raw.includes('[COACH]')) {
      const parts = raw.split('[COACH]');
      reply = parts[0].replace('[REPLY]', '').trim();
      const coachSection = parts[1] || '';

      const improvedMatch = coachSection.match(/Improved:\s*(.+)/i);
      const hindiMatch = coachSection.match(/HindiTip:\s*(.+)/i);
      const scoreMatch = coachSection.match(/Score:\s*(\d+)/i);
      const ruleMatch = coachSection.match(/Rule:\s*(.+)/i);
      const islGlossMatch = coachSection.match(/ISLGloss:\s*(.+)/i);
      const islGrammarMatch = coachSection.match(/ISLGrammarTip:\s*(.+)/i);
      const islHandshapeMatch = coachSection.match(/ISLHandshape:\s*(.+)/i);

      if (improvedMatch && hindiMatch) {
        coachingTip = {
          original: originalInput,
          improved: improvedMatch[1].trim(),
          explanationHindi: hindiMatch[1].trim(),
          fluencyScore: scoreMatch ? parseInt(scoreMatch[1], 10) : 85,
          rule: ruleMatch ? ruleMatch[1].trim() : (isISL ? 'ISL Grammar Syntax' : 'Natural Conversation'),
          islGloss: islGlossMatch ? islGlossMatch[1].trim() : undefined,
          islGrammarTip: islGrammarMatch ? islGrammarMatch[1].trim() : undefined,
          islHandshapeTip: islHandshapeMatch ? islHandshapeMatch[1].trim() : undefined,
        };
      }
    } else if (raw.includes('[REPLY]')) {
      reply = raw.replace('[REPLY]', '').trim();
    }

    return { reply, coachingTip };
  }

  private generateSmartFallback(
    input: string,
    scenario: RoleplayScenario | null,
    isISL: boolean = false
  ): { reply: string; coachingTip: CoachingTip } {
    const text = input.toLowerCase();

    // ISL Smart Fallback with authentic ISLRTC glosses & SOV structure
    if (isISL || scenario?.mode === 'isl') {
      if (text.includes('water') || text.includes('drink') || text.includes('tea')) {
        return {
          reply: "Very good! For water, make a W-handshape with three fingers and tap near your chin. What would you like to drink?",
          coachingTip: {
            original: input,
            improved: "Please give me a glass of drinking water.",
            explanationHindi: "पानी का संकेत देने के लिए 'W' आकार बनाकर होंठों के पास स्पर्श करें।",
            fluencyScore: 92,
            rule: "Drink & Need ISL Signs",
            islGloss: "PLEASE WATER GIVE ME",
            islGrammarTip: "In ISL SOV syntax: Object (Water) comes before the action verb (Give).",
            islHandshapeTip: "Three fingers extended (W) touching chin, followed by palm open giving gesture.",
          },
        };
      } else if (text.includes('apple') || text.includes('food') || text.includes('eat') || text.includes('fruit')) {
        return {
          reply: "Wonderful signing! Remember in ISL, Time comes first: 'Today I two apples eat'. Let us practice eating fruits!",
          coachingTip: {
            original: input,
            improved: "I want to eat fresh apples today.",
            explanationHindi: "समय (Today) हमेशा वाक्य के शुरू में आता है, और क्रिया (Eat) सबसे अंत में।",
            fluencyScore: 90,
            rule: "Time-First SOV Syntax",
            islGloss: "TODAY I APPLE EAT WANT",
            islGrammarTip: "Time marker 'TODAY' is positioned first to set temporal reference in ISL.",
            islHandshapeTip: "Curved index knuckle twists against cheek for Apple, hand to mouth for Eat.",
          },
        };
      } else if (text.includes('family') || text.includes('mother') || text.includes('father') || text.includes('brother')) {
        return {
          reply: "Excellent family sign! Two-handed gestures are core to ISLRTC standards. Tell me about your brother or sister!",
          coachingTip: {
            original: input,
            improved: "My family is very loving and happy.",
            explanationHindi: "परिवार के संकेतों में माता (कान की बाली) और पिता (मूंछ) के संकेत बहुत सुंदर हैं।",
            fluencyScore: 89,
            rule: "Family Two-Handed Conventions",
            islGloss: "MY FAMILY HAPPY ALL LOVE",
            islGrammarTip: "Adjectives and emotions (HAPPY) precede or accompany the final verb.",
            islHandshapeTip: "Both curved hands circle together clasping in unity for Family.",
          },
        };
      } else {
        return {
          reply: "Namaste! Welcome to our ISL lesson. Let us warm up with everyday signs. What sign would you like to practice?",
          coachingTip: {
            original: input,
            improved: "Namaste, I want to learn Indian Sign Language today.",
            explanationHindi: "नमस्ते संकेत दोनों हथेलियों को छाती के बीच जोड़कर सम्मान से किया जाता है।",
            fluencyScore: 88,
            rule: "Warm-Up ISL Foundation",
            islGloss: "NAMASTE ISL I LEARN WANT",
            islGrammarTip: "Subject (I) and Object (ISL) precede the main verb (LEARN WANT).",
            islHandshapeTip: "Two flat palms pressed together upright at chest midline.",
          },
        };
      }
    }

    // Spoken English Fallbacks
    let reply = "That's wonderful! You expressed yourself very clearly. Tell me more about that!";
    let improved = input.trim();
    let explanationHindi = "बहुत बढ़िया प्रयास! बात करते समय स्पष्ट उच्चारण पर ध्यान दें।";
    let score = 86;
    let rule = "Spoken Clarity & Fluency";

    if (scenario?.id === 'bazaar') {
      if (text.includes('mango') || text.includes('fruit') || text.includes('price') || text.includes('kilo') || text.includes('cost')) {
        reply = "These Alfonso mangoes are ₹120 per kilo! They are very sweet, just arrived from the farm. How many kilos would you like?";
        improved = "How much are these mangoes per kilo? Can you pack two kilos for me?";
        explanationHindi = "कीमत पूछने के लिए 'How much are these per kilo?' कहना सबसे प्राकृतिक है।";
        score = 88;
        rule = "Market Inquiries";
      } else {
        reply = "Namaste! Everything in my stall is fresh today. Would you like fresh vegetables, spices, or seasonal fruits?";
        improved = "Namaste! I would like to check the vegetables and fruits you have today.";
        explanationHindi = "नमस्ते के बाद अपनी जरूरत सीधे 'I would like to...' से बताना बहुत विनम्र लगता है।";
        score = 84;
        rule = "Polite Requests";
      }
    } else if (scenario?.id === 'school') {
      reply = "Very good question! Keep practicing like this in class every day. What subject do you enjoy studying the most?";
      improved = "Excuse me teacher, could you please explain this topic once more?";
      explanationHindi = "क्लास में सवाल पूछते समय 'Could you please explain...' का इस्तेमाल सबसे सम्मानजनक होता है।";
      score = 85;
      rule = "Polite Classroom Phrases";
    } else if (scenario?.id === 'interview') {
      reply = "That is a strong response. Clear communication and honesty stand out in job interviews. Could you tell me about your biggest strength?";
      improved = "My greatest strength is my problem-solving ability and dedication to teamwork.";
      explanationHindi = "इंटरव्यू में अपनी खूबियां बताते समय 'My greatest strength is...' से शुरुआत करें।";
      score = 87;
      rule = "Professional Workplace Phrasing";
    } else if (scenario?.id === 'cricket') {
      reply = "What a sensational shot! That was hit cleanly over long-on for a maximum! Who is your all-time favorite Indian cricketer?";
      improved = "That was an unbelievable six! India played exceptionally well today.";
      explanationHindi = "खेलों की बात करते समय 'unbelievable', 'clean hit' जैसे रोमांचक शब्दों का प्रयोग करें।";
      score = 89;
      rule = "Sports Commentary Vocabulary";
    } else {
      if (text.includes('hello') || text.includes('hi') || text.includes('namaste')) {
        reply = "Hello! It's so nice to practice with you today. What topic would you like to explore together?";
        improved = "Hello EduVaani, I am eager to practice my spoken English with you today!";
        explanationHindi = "'I am eager to practice' कहने से आपका उत्साह झलकता है।";
        score = 90;
        rule = "Warm Greetings";
      }
    }

    return {
      reply,
      coachingTip: {
        original: input,
        improved,
        explanationHindi,
        fluencyScore: score,
        rule
      }
    };
  }

  private addMessage(role: 'user' | 'assistant', content: string, coachingTip?: CoachingTip): void {
    this.chatHistory.push({ role, content, coachingTip, timestamp: new Date() });
    if (this.chatHistory.length > 20) {
      this.chatHistory = this.chatHistory.slice(-20);
    }
  }

  getChatHistory(): ChatMessage[] { return [...this.chatHistory]; }
  getCurrentScenario(): RoleplayScenario | null { return this.currentScenario; }
  clearHistory(): void { this.chatHistory = []; this.currentScenario = null; }
}

export const aiService = new AIService();
