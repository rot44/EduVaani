import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  translatedContent?: string;
  timestamp: Date;
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
  private model: any = null;
  private chatHistory: ChatMessage[] = [];
  private currentScenario: RoleplayScenario | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }
  }

  async startFreeFlowChat(): Promise<string> {
    this.currentScenario = null;
    this.chatHistory = [];
    const welcome = "Namaste! 🙏 I'm EduVaani, your AI English tutor. Let's practice English together! You can talk to me about anything — your day, your hobbies, your studies, or any topic you like. What would you like to chat about today?";
    this.addMessage('assistant', welcome);
    return welcome;
  }

  async startRoleplay(scenarioId: string): Promise<string> {
    const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) throw new Error('Scenario not found');
    this.currentScenario = scenario;
    this.chatHistory = [];
    const welcome = `Welcome to the ${scenario.title} scenario! ${scenario.emoji} ${scenario.description} Let's start practicing English. I'm ready whenever you are!`;
    this.addMessage('assistant', welcome);
    return welcome;
  }

  async sendMessage(userInput: string): Promise<string> {
    this.addMessage('user', userInput);

    if (!this.model) {
      const demo = "Great practice! (Note: Add VITE_GEMINI_API_KEY to .env for real AI responses.) Keep going — your English is improving!";
      this.addMessage('assistant', demo);
      return demo;
    }

    try {
      let prompt = '';
      if (this.currentScenario) {
        prompt = `${this.currentScenario.systemPrompt}\n\nContext: ${this.currentScenario.context}\n\n`;
      } else {
        prompt = 'You are EduVaani, a friendly AI English tutor for Indian students. Help them practice English conversation. Be encouraging, simple, and conversational. Gently correct mistakes and keep the conversation flowing. Keep responses under 100 words.\n\n';
      }

      const recentHistory = this.chatHistory.slice(-8);
      prompt += 'Conversation:\n';
      recentHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Student' : 'EduVaani'}: ${msg.content}\n`;
      });
      prompt += '\nRespond naturally as EduVaani. Keep under 100 words.';

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      this.addMessage('assistant', response);
      return response;
    } catch (error: any) {
      const errMsg = "I'm having trouble connecting right now. Please check your API key or try again in a moment! 🙏";
      this.addMessage('assistant', errMsg);
      return errMsg;
    }
  }

  private addMessage(role: 'user' | 'assistant', content: string): void {
    this.chatHistory.push({ role, content, timestamp: new Date() });
    if (this.chatHistory.length > 20) {
      this.chatHistory = this.chatHistory.slice(-20);
    }
  }

  getChatHistory(): ChatMessage[] { return [...this.chatHistory]; }
  getCurrentScenario(): RoleplayScenario | null { return this.currentScenario; }
  clearHistory(): void { this.chatHistory = []; this.currentScenario = null; }
}

export const aiService = new AIService();
