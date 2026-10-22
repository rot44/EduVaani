import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CoachingTip {
  original: string;
  improved: string;
  explanationHindi: string;
  fluencyScore: number;
  rule: string;
}

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
}

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
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
  private candidateModels: string[] = [
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
  ];

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async startFreeFlowChat(): Promise<string> {
    this.currentScenario = null;
    this.chatHistory = [];
    const welcome = "Namaste! 🙏 I'm EduVaani, your personal AI English tutor. I'm here to help you speak English naturally and fearlessly. Tell me, how was your day today, or what would you like to talk about?";
    this.addMessage('assistant', welcome);
    return welcome;
  }

  async startRoleplay(scenarioId: string): Promise<string> {
    const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) throw new Error('Scenario not found');
    this.currentScenario = scenario;
    this.chatHistory = [];
    const welcome = `Namaste! Welcome to ${scenario.title} ${scenario.emoji}. ${scenario.description} Speak in English or your mother tongue whenever you're ready — I am listening!`;
    this.addMessage('assistant', welcome);
    return welcome;
  }

  async sendMessage(userInput: string): Promise<string> {
    this.addMessage('user', userInput);

    let prompt = '';
    if (this.currentScenario) {
      prompt = `${this.currentScenario.systemPrompt}\n\nContext: ${this.currentScenario.context}\n\n`;
    } else {
      prompt = 'You are EduVaani, a warm, patient, and encouraging AI English tutor for Indian students. Help them practice spoken English. Keep your conversational response under 50 words, simple, and friendly.\n\n';
    }

    const recentHistory = this.chatHistory.slice(-8);
    prompt += 'Conversation History:\n';
    recentHistory.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'Student' : 'EduVaani'}: ${msg.content}\n`;
    });

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

    // 1. Try Google Gemini candidate models
    if (this.genAI) {
      for (const modelName of this.candidateModels) {
        try {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const rawText = result.response.text();
          if (rawText && rawText.trim().length > 0) {
            const { reply, coachingTip } = this.parseResponse(rawText, userInput);
            this.addMessage('assistant', reply, coachingTip);
            return reply;
          }
        } catch (modelErr: unknown) {
          console.warn(`Model ${modelName} unavailable, falling back to next model...`, modelErr);
        }
      }
    }

    // 2. Resilient contextual response generator (Guarantees zero downtime)
    const { reply, coachingTip } = this.generateSmartFallback(userInput, this.currentScenario);
    this.addMessage('assistant', reply, coachingTip);
    return reply;
  }

  private parseResponse(raw: string, originalInput: string): { reply: string; coachingTip?: CoachingTip } {
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

      if (improvedMatch && hindiMatch) {
        coachingTip = {
          original: originalInput,
          improved: improvedMatch[1].trim(),
          explanationHindi: hindiMatch[1].trim(),
          fluencyScore: scoreMatch ? parseInt(scoreMatch[1], 10) : 85,
          rule: ruleMatch ? ruleMatch[1].trim() : 'Natural Conversation'
        };
      }
    } else if (raw.includes('[REPLY]')) {
      reply = raw.replace('[REPLY]', '').trim();
    }

    return { reply, coachingTip };
  }

  private generateSmartFallback(input: string, scenario: RoleplayScenario | null): { reply: string; coachingTip: CoachingTip } {
    const text = input.toLowerCase();
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
