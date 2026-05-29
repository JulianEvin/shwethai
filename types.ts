export enum ToolType {
  CONTENT_BUILDER = "Content Creator",
  TIKTOK_SCRIPT = "TikTok Script Writer",
  HEALTH_ARTICLE = "Health Article Writer",
  CONSULTATION = "Consultation",
  IMAGE_GENERATION = "Image Generator",
  SAVED_CONTENT = "Saved Content",
  CALENDAR = "Thailand Calendar",
}

export enum ContentSubType {
  EDUCATIONAL = "Educational Post",
  SALES = "Sales Post",
  AD_COPY = "Ad Copy",
  FAQ = "FAQ/Q&A",
  HOSPITAL_PROFILE = "Hospital Profile",
  TESTIMONIAL_CONTENT = "Testimonial Post",
}

export enum ScriptStyle {
  NARRATOR = "Narrator (VO)",
  PRESENTER = "Presenter (Talking Head)",
}

export enum ContentLength {
  AUTO = "Auto",
  SHORT = "Short",
  MEDIUM = "Medium",
  LONG = "Long",
}

export enum ImageAspectRatio {
  SQUARE = "1:1",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9",
}

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export type Platform = "Facebook" | "Telegram" | "TikTok" | "Viber" | "Other";

export interface GenerationRequest {
  tool: ToolType;
  subType?: ContentSubType;
  scriptStyle?: ScriptStyle;
  topic: string;
  platform?: Platform;
  audience?: string;
  tone?: string;
  additionalContext?: string;
  length?: ContentLength;
}

export interface StoredImage {
  id: string;
  data: string;
  prompt: string;
  timestamp: number;
}

export interface SavedContentItem {
  id: string;
  type: ToolType;
  subType?: ContentSubType;
  content?: string; // Generated Text
  image?: string; // Base64 Image
  prompt: string;
  timestamp: number;
}
