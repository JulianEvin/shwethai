
import { GoogleGenAI, Chat } from "@google/genai";
import { ToolType, ContentSubType, GenerationRequest, Message, ContentLength, ScriptStyle } from "../types";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const SYSTEM_INSTRUCTION_TEXT = `
You are the Chief Marketing Officer (CMO) and Strategic Consultant for "Shwe Thai" (shwethai.com).

**Brand Identity:**
- **Brand Category:** We are NOT a Medical Tourism Agency. We are a **Premium Cross-Border Medical Concierge**.
- **Elevator Pitch:** "ShweThai is Myanmar’s premier medical concierge. We eliminate the language barriers, logistical stress, and clinical confusion of seeking healthcare in Thailand. Guided by our M.B.,B.S. qualified Medical Coordinators, we provide a VIP, hand-held experience from your first teleconsultation to your safe return home."
- **Positioning:** Premium, VIP, Clinically-Driven, Frictionless.

**Knowledge Base (What we do):**
- **Clinical Triage over Sales:** M.B.,B.S. doctors review records and create a "Clinical Dossier" for Thai specialists.
- **Absolute Zero Language Barrier:** M.B.,B.S. coordinators provide "first-person" translation in the room. No random hospital translators.
- **End-to-End Frictionless Logistics:** Secure Kyat-to-Baht exchange, VIP airport pickups, hotel/visa management.
- **Network:** Direct connection with 20+ top specialists in Thailand.

**Detailed Burmese Services:**
ရွှေထိုင်း (ShweThai) ဆိုတာ ဘာလဲ။
ရွှေထိုင်းသည် သာမန် ကျန်းမာရေးခရီးသွား အေဂျင်စီတစ်ခု (Medical Tourism Agency) မဟုတ်ပါ။ မြန်မာလူနာများအတွက် ဘာသာစကား၊ ခရီးစဉ်စီစဉ်မှုနှင့် ဆေးဘက်ဆိုင်ရာ ရှုပ်ထွေးမှုများကို ဖြေရှင်းပေးမည့် အဆင့်မြင့် VIP Medical Concierge ဝန်ဆောင်မှု ဖြစ်ပါသည်။
ကျွန်ုပ်တို့၏ အဓိကလုပ်ဆောင်ချက်များ-
- သင့်လျော်သော ဆေးရုံနှင့် အထူးကုဆရာဝန်များကို ရွေးချယ်ချိတ်ဆက်ပေးခြင်း
- ကုန်ကျစရိတ်များကို ပွင့်လင်းမြင်သာစွာ ဆွေးနွေးအကြံပြုပေးခြင်း
- လူနာ၏ ရောဂါရာဇဝင်နှင့် ဆေးမှတ်တမ်းများကို Clinical Dossier အဖြစ် စနစ်တကျ ပြင်ဆင်ပေးခြင်း
- ထိုင်းနိုင်ငံရှိ ဆရာဝန်ကြီးများနှင့် Teleconsultation တိုင်ပင်ဆွေးနွေးရာတွင် ကူညီခြင်း
- ဆေးဘက်ဆိုင်ရာ အဖြေများကို နားလည်လွယ်ကူစွာ ရှင်းပြပေးခြင်း
- ဗီဇာ၊ ဟိုတယ်နှင့် ငွေလဲလှယ်ရေး (Kyat to Baht) ဆိုင်ရာများကို စနစ်တကျ စီစဉ်ပေးခြင်း
- လေဆိပ် VIP ကြိုပို့၊ ဟိုတယ်စီစဉ်ပေးခြင်းနှင့် KPay အစရှိသည့် လွယ်ကူသော ငွေပေးချေမှုစနစ်များအထိ အစစအရာရာ စီစဉ်ဆောင်ရွက်ပေးပါသည်။

**Consultation & Content Guidelines:**
- **Strategy & Topic:** Use the user-provided Topic and Extra Details (Strategy/Goal) as your primary compass.
- **Clinical Focus:** Only include the **M.B.,B.S. Doctor-led Medical Coordinator team** USP when it is absolutely essential to build clinical trust or when the specific topic strictly requires medical expertise. Do not use it as a generic filler.
- **Conditional USP (Language Barrier):** DO NOT include translation or language barrier info unless the Topic or Strategic Goal explicitly mentions "language", "translation", "interpreter", or "communication".
- **Creative Content:** Focus on emotional connection and "Clinical Trust". Don't just list features. Show empathy for the patient's stress.
- **Asset Generation:** Contrast ShweThai against "Regular Agencies" or "Going alone".
- **Formatting Rules (FOR FACEBOOK & ADS):**
  - Use relevant emojis strategically throughout the content to enhance engagement and emotional connection.
  - ALWAYS include #hashtags at the very end of the post.
  - **MANDATORY Call to Action (CTA) at the very bottom:** 
    www.shwethai.com
    Phone: +66 97 210 0341
- **IMPORTANT:** DO NOT repeat the Knowledge Base word-for-word. Ground your creative writing in these facts.
- **Script Restriction:** ONLY generate scripts if explicitly asked for a "script". Do not produce script formats for general consultation.
- **Hashtag Placement:** #hashtags MUST be placed at the very bottom of the content, following the main body and CTA.

**Content & Script Styles:**
- **Narrator Tone (Voice-over):** Atmospheric, rhythmic Burmese. Use [VO Cues].
- **Presenter Tone (Talking Head):** Conversational, "Spoken" Burmese (e.g., "...ပါနော်", "...မလား"). Use [Performance Cues].

**CRITICAL RESTRICTIONS:**
- **NO HTML TAGS.**
- **NO DOUBLE ASTERISKS (**).**
- Language: Professional, Warm, and High-End Burmese.
`;

export interface KeyState {
  name: string;
  key: string;
  status: 'healthy' | 'exhausted';
  exhaustedUntil: number;
  consecutiveFailures: number;
}

class GeminiService {
  private currentKeyIndex = 0;
  private keyStates: KeyState[] = [];

  private getKeysWithNames() {
    const rawKeys = [
      { name: 'GEMINI_API_KEY_1', val: process.env.GEMINI_API_KEY_1 },
      { name: 'GEMINI_API_KEY_2', val: process.env.GEMINI_API_KEY_2 },
      { name: 'GEMINI_API_KEY_3', val: process.env.GEMINI_API_KEY_3 },
      { name: 'GEMINI_API_KEY', val: process.env.GEMINI_API_KEY },
      { name: 'API_KEY', val: process.env.API_KEY },
    ];
    
    const valid = rawKeys.filter(k => typeof k.val === 'string' && k.val.trim().length > 10);
    const unique: typeof valid = [];
    const seen = new Set<string>();
    for (const item of valid) {
      if (!seen.has(item.val!)) {
        seen.add(item.val!);
        unique.push(item);
      }
    }
    return unique;
  }

  private initializeKeyStates() {
    const rawKeys = this.getKeysWithNames();
    const newStates: KeyState[] = [];
    for (const item of rawKeys) {
      const existing = this.keyStates.find(s => s.key === item.val);
      if (existing) {
        newStates.push(existing);
      } else {
        newStates.push({
          name: item.name,
          key: item.val!,
          status: 'healthy',
          exhaustedUntil: 0,
          consecutiveFailures: 0
        });
      }
    }
    this.keyStates = newStates;
  }

  public getKeyStates() {
    this.initializeKeyStates();
    return this.keyStates.map(s => ({
      name: s.name,
      status: s.status,
      exhaustedUntil: s.exhaustedUntil,
      consecutiveFailures: s.consecutiveFailures,
      isCurrentlyExhausted: s.exhaustedUntil > Date.now(),
      maskedKey: s.key.substring(0, 6) + "..." + s.key.substring(s.key.length - 4),
    }));
  }

  private getKeys() {
    return this.getKeysWithNames().map(k => k.val!);
  }

  private getActiveKey(): string | null {
    this.initializeKeyStates();
    if (this.keyStates.length === 0) return null;
    const now = Date.now();
    let availableKeys = this.keyStates.filter(s => s.status === 'healthy' || s.exhaustedUntil <= now);
    if (availableKeys.length === 0) {
      availableKeys = [...this.keyStates].sort((a, b) => a.exhaustedUntil - b.exhaustedUntil);
    }
    const selectedState = availableKeys[this.currentKeyIndex % availableKeys.length];
    return selectedState ? selectedState.key : null;
  }

  private getActiveKeyState(): KeyState | null {
    this.initializeKeyStates();
    if (this.keyStates.length === 0) return null;
    const now = Date.now();
    let availableKeys = this.keyStates.filter(s => s.status === 'healthy' || s.exhaustedUntil <= now);
    if (availableKeys.length === 0) {
      availableKeys = [...this.keyStates].sort((a, b) => a.exhaustedUntil - b.exhaustedUntil);
    }
    return availableKeys[this.currentKeyIndex % availableKeys.length] || null;
  }

  private getAIInstance() {
    const activeKey = this.getActiveKey();
    if (!activeKey) {
      console.error("[Gemini Service] No API keys found in environment variables.");
      return new GoogleGenAI({ apiKey: "" });
    }
    return new GoogleGenAI({ apiKey: activeKey });
  }

  private getModel(tool?: ToolType) {
    // GUIDELINE: Use Flash for script and content tools to mitigate 429 quota errors.
    // Use Pro only for high-complexity Chat.
    if (tool === ToolType.CONSULTATION) {
      return 'gemini-3.1-pro-preview';
    }
    return 'gemini-3.5-flash';
  }

  private getLengthInstruction(length: ContentLength = ContentLength.AUTO, tool: ToolType): string {
    if (length === ContentLength.AUTO) return "";
    switch (length) {
      case ContentLength.SHORT: return tool === ToolType.TIKTOK_SCRIPT ? "LENGTH: 15-20 seconds." : "LENGTH: Under 150 words.";
      case ContentLength.MEDIUM: return tool === ToolType.TIKTOK_SCRIPT ? "LENGTH: 45-60 seconds." : "LENGTH: Approx 300 words.";
      case ContentLength.LONG: return tool === ToolType.TIKTOK_SCRIPT ? "LENGTH: 90+ seconds." : "LENGTH: Over 500 words.";
      default: return "";
    }
  }

  private async retryOperation<T>(
    operation: () => Promise<T>, 
    maxRetries: number = 12, 
    initialDelay: number = 1500, 
    onRetry?: (attempt: number, nextKeyIndex: number) => void
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      this.initializeKeyStates();
      
      try {
        const result = await operation();
        // If successful, reset consecutive failures of the active key
        const activeInstanceKey = this.getActiveKey();
        if (activeInstanceKey) {
          const state = this.keyStates.find(s => s.key === activeInstanceKey);
          if (state) {
            state.status = 'healthy';
            state.consecutiveFailures = 0;
            state.exhaustedUntil = 0;
          }
        }
        return result;
      } catch (error: any) {
        lastError = error;
        const message = (error.message || '').toLowerCase();
        
        // Safety block is final, don't retry or rotate keys as it's content-specific
        const isSafety = message.includes('safety') || message.includes('blocked');
        if (isSafety) {
           throw new Error("The prompt was blocked by safety filters. Please try a different description.");
        }
        
        const isRateLimit = message.includes('429') || 
                           message.includes('quota') || 
                           message.includes('resource_exhausted') ||
                           message.includes('limit') ||
                           message.includes('exceeded') ||
                           message.includes('exhausted');
        
        if (isRateLimit) {
          const activeInstanceKey = this.getActiveKey();
          if (activeInstanceKey) {
            const state = this.keyStates.find(s => s.key === activeInstanceKey);
            if (state) {
              state.consecutiveFailures += 1;
              state.status = 'exhausted';
              // Mark as exhausted for 5 minutes (300,000 ms)
              state.exhaustedUntil = Date.now() + 300000;
              
              console.warn(`[Gemini Rotation] Key ${state.name} marked as EXHAUSTED for 5 min due to quota/rate limit.`);
            }
          }
          
          if (attempt < maxRetries - 1) {
            this.currentKeyIndex += 1;
            const nextActiveState = this.getActiveKeyState();
            
            if (onRetry) {
              onRetry(attempt + 1, this.currentKeyIndex % Math.max(1, this.keyStates.length));
            }
            
            // Smaller delay if we rotated to a potential backup key, otherwise exponential backoff
            const hasMultipleKeys = this.keyStates.length > 1;
            const delay = hasMultipleKeys ? 500 : (initialDelay * Math.pow(1.5, attempt));
            
            console.warn(`[Gemini Rotation] Attempt ${attempt + 1} failed. Next key: ${nextActiveState?.name || 'unknown'}. Retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        throw error;
      }
    }
    
    throw new Error(`All available rotating API keys are currently exhausted or rate-limited. Please try again in 5 minutes. (Last error: ${lastError?.message})`);
  }

  async generateContent(request: GenerationRequest, onRetry?: (attempt: number) => void): Promise<string> {
    let model = this.getModel(request.tool);
    const lengthInstruction = this.getLengthInstruction(request.length, request.tool);
    const style = request.scriptStyle || ScriptStyle.NARRATOR;
    
    let prompt = "";
    switch (request.tool) {
      case ToolType.TIKTOK_SCRIPT:
        prompt = `Write a PROFESSIONAL TikTok Script in ${style} style for Shwe Thai.
        Subject: "${request.topic}".
        Strategy/Goal: "${request.additionalContext || 'Engagement'}".
        Target Audience: ${request.audience || 'General patients'}.
        
        *GUIDELINES:*
        - Include the M.B.,B.S. Doctor-led Medical Coordinator team ONLY if it is strictly necessary to establish clinical trust for the specific subject.
        - DO NOT mention translation or language barriers unless the Subject or Strategy explicitly mentions it.
        - Only mention specific hospital locations if directly relevant.
        
        Style Requirements for ${style}:
        ${style === ScriptStyle.NARRATOR ? 
          '- Use [VO Cues] for tone and pauses.\n- Focus on cinematic descriptions of Thailand medical care.\n- Dialogue should be professional.' :
          '- Use [Performance Cues] for hand gestures and eye contact.\n- Focus on the presenter building a personal connection.\n- Dialogue should be conversational and friendly.'
        }
        
        ${lengthInstruction}
        CTA: Must direct users to shwethai.com and mention Phone: +66 97 210 0341.
        NO **. NO HTML.`;
        break;
      case ToolType.CONTENT_BUILDER:
        prompt = `Write a high-end Facebook post for Shwe Thai.
        Post Type: ${request.subType}
        Subject/Topic: "${request.topic}"
        Strategic Goal: "${request.additionalContext || 'Build trust and clinical authority'}"
        Target Audience: ${request.audience || 'Patients and families seeking care in Thailand'}
        
        *GUIDELINES:*
        - Mention the M.B.,B.S. Doctor-led team ONLY if relevant to building critical clinical trust for this specific topic.
        - DO NOT include language barrier/translation info unless the Topic or Strategic Goal explicitly targets it.
        - Only mention specific hospital locations if directly relevant.
        - Focus on empathy and clinical excellence.
        
        FORMATTING:
        - Include relevant emojis naturally within the main text to increase engagement.
        - Place the main content first.
        - Then place the MANDATORY CTA: www.shwethai.com | Phone: +66 97 210 0341
        - Place #hashtags at the very end.
        
        ${lengthInstruction}. NO **.`;
        break;
      case ToolType.HEALTH_ARTICLE:
        prompt = `Write a high-authority, informative, and educational health article in professional Burmese.
        Article Topic: "${request.topic}"
        Audience: ${request.audience || 'General public seeking health information'}
        Length: ${lengthInstruction || 'Over 400 words'}
        Tone: ${request.tone ? request.tone : 'informative and empathetic'}
        Strategic/Additional Context: "${request.additionalContext || 'Accurate health education'}"

        *CRITICAL GUIDELINES FROM USER (Do NOT mix with Shwe Thai logo, CRM, specific staff mentions, or heavy marketing):*
        - This is a PURE health education or medical knowledge article.
        - DO NOT talk about cross-border medical concierge, hotel booking, air tickers, currency exchange, visa assistance, airport pickup, or clinical dossier translation.
        - DO NOT include phone numbers like "+66 97 210 0341" in this educational format.
        - Focus solely and purely on medically accurate, clinical-grade medical/health knowledge, guidelines, disease awareness, symptoms, and self-care tips.
        - Use professional, warm, yet highly clear academic-friendly and public-friendly Burmese language.
        
        FORMATTING:
        - Organize the article neatly with subtitles, section breaks, or bullet points to ensure excellent readability.
        - Use only extremely subtle, clean medical-related emojis sparingly if helpful, but prioritize a pristine, textbook-trusted editorial aesthetic.
        - Place a standard medical disclaimer at the bottom: "ဤဆောင်းပါးသည် ကျန်းမာရေးဗဟုသုတ ဝေမျှရန်သာ ဖြစ်ပါသည်။ ရောဂါရှာဖွေကုသမှုများအတွက် သက်ဆိုင်ရာ အထူးကုဆရာဝန်ကြီးများနှင့် တိုင်ပင်ဆွေးနွေးပါရန် အကြံပြုအပ်ပါသည်။"
        - Underneath the disclaimer, display the official website: "www.shwethai.com" clearly at the very bottom.
        
        ${lengthInstruction}. NO **. NO HTML.`;
        break;
      default:
        prompt = request.topic;
    }

    return this.retryOperation(async () => {
      const ai = this.getAIInstance();
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { systemInstruction: SYSTEM_INSTRUCTION_TEXT },
        });
        return response.text || "No response.";
      } catch (error: any) {
        const msg = (error.message || '').toLowerCase();
        const isQuotaOrModelError = msg.includes('429') || 
                                    msg.includes('quota') || 
                                    msg.includes('exhausted') || 
                                    msg.includes('not found') || 
                                    msg.includes('not_found') ||
                                    msg.includes('permission') ||
                                    msg.includes('unauthorized');
                                    
        if (isQuotaOrModelError && model !== 'gemini-3.5-flash') {
          console.warn(`[Gemini Fallback] Content generation model ${model} failed. Falling back to gemini-3.5-flash.`);
          model = 'gemini-3.5-flash';
        }
        throw error;
      }
    }, 12, 1500, onRetry);
  }

  async enhanceContent(originalContent: string): Promise<string> {
    const prompt = `Rewrite and polish this content for Shwe Thai. Focus on natural spoken-word flow for Burmese. NO **. Original: ${originalContent}`;
    return this.retryOperation(async () => {
      const ai = this.getAIInstance();
      const response = await ai.models.generateContent({
        model: this.getModel(),
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION_TEXT },
      });
      return response.text || originalContent;
    });
  }

  async generateImage(prompt: string, aspectRatio: any = '1:1', negativePrompt?: string, stylePreset?: string, mood?: string, context?: string, isHighQuality: boolean = false, onRetry?: (attempt: number) => void): Promise<string> {
    const model = isHighQuality ? 'gemini-3.1-flash-image-preview' : 'gemini-2.5-flash-image';
    
    // Construct sophisticated visual instructions based on mood
    let moodInstructions = "professional lighting";
    if (mood === 'calm') moodInstructions = "peaceful atmosphere, soft pastel colors, morning light, relaxed environment";
    if (mood === 'professional') moodInstructions = "corporate excellence, sharp focus, clean modern architecture, formal professional attire, high-end commercial look";
    if (mood === 'hopeful') moodInstructions = "optimistic sunlight, warm golden hour tones, smiling expressions, bright and airy composition";
    if (mood === 'luxurious') moodInstructions = "premium high-end aesthetics, 5-star hotel environment, gold and neutral color palette, cinematic depth of field, elegant textures";
    if (mood === 'clinical-bright') moodInstructions = "bright clinical precision, hospital-clean aesthetics, white and blue medical tones, modern medical equipment";

    // Handle Shwethai uniform keyword
    const uniformDescription = "a professional white polo shirt with a navy blue collar, a vibrant red button placket, and red sleeve cuffs. The shirt is clean, plain white without any logos or branding on the chest. The entire look is crisp, modern, and medical-professional.";
    const processedPrompt = prompt.replace(/Shwethai uniform/gi, uniformDescription);

    const finalPrompt = `Elite Global Art Director's Vision for Shwe Thai Medical Service. 
    Graphic Design Mockup for Social Media. 
    Subject: ${processedPrompt.trim()}. 
    Style: ${stylePreset || 'photorealistic'}. 
    Lighting and Atmosphere: ${moodInstructions}. 
    Scene Context: ${context || 'Bangkok, Thailand'}. 
    High-end commercial production quality, clean composition, studio lighting, high-end aesthetic. 
    STRICTLY NO TEXT, NO LOGOS, NO BRANDING, NO TYPOGRAPHY, NO WRITTEN CHARACTERS. The image must be purely visual without any text or symbols unless explicitly requested in the subject. Realistic human features.
    ${negativePrompt ? `Negative constraints: Avoid ${negativePrompt}.` : ''}`;
    
    return this.retryOperation(async () => {
      const ai = this.getAIInstance();
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
        config: { 
          imageConfig: { 
            aspectRatio: aspectRatio, 
            ...(isHighQuality ? { imageSize: "1K" } : {}) 
          } 
        }
      });
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data. Please check if your API key has image generation permissions.");
    }, 5, 2000, onRetry);
  }

  async sendMessage(message: string, history: Message[] = []): Promise<string> {
    const contents = history.map(m => ({ role: m.role === 'model' ? 'model' : 'user' as any, parts: [{ text: m.text }] }));
    contents.push({ role: 'user', parts: [{ text: message }] });
    
    let model = this.getModel(ToolType.CONSULTATION);
    
    return this.retryOperation(async () => {
      const ai = this.getAIInstance();
      try {
        const response = await ai.models.generateContent({
          model,
          contents: contents,
          config: { systemInstruction: SYSTEM_INSTRUCTION_TEXT },
        });
        return response.text || "";
      } catch (error: any) {
        const msg = (error.message || '').toLowerCase();
        const isQuotaOrModelError = msg.includes('429') || 
                                    msg.includes('quota') || 
                                    msg.includes('exhausted') || 
                                    msg.includes('not found') || 
                                    msg.includes('not_found') ||
                                    msg.includes('permission') ||
                                    msg.includes('unauthorized');
                                    
        if (isQuotaOrModelError && model !== 'gemini-3.5-flash') {
          console.warn(`[Gemini Fallback] Chat model ${model} failed. Falling back to gemini-3.5-flash.`);
          model = 'gemini-3.5-flash';
        }
        throw error;
      }
    });
  }
}

export const geminiService = new GeminiService();
