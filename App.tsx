import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layout } from "./components/Layout";
import {
  ToolType,
  ContentSubType,
  ScriptStyle,
  GenerationRequest,
  Message,
  StoredImage,
  ImageAspectRatio,
  SavedContentItem,
  Platform,
  ContentLength,
} from "./types";
import { geminiService } from "./services/geminiService";
import FormattedText from "./components/MarkdownRenderer";
import { SavedContentRepo } from "./components/SavedContentRepo";
import { HolidayCalendar } from "./components/HolidayCalendar";
import { LandingPage } from "./components/LandingPage";

const SAVED_CONTENT_KEY = "SHWETHAI_SAVED_CONTENT";
const CHAT_KEY = "SHWETHAI_CHAT_HISTORY";
const TOOL_STATES_KEY = "SHWETHAI_TOOL_STATES";
const PREFS_KEY = "SHWETHAI_PREFS";

const STYLE_PRESETS = [
  { id: "none", label: "Auto (Default)" },
  { id: "photorealistic", label: "Photorealistic" },
  { id: "commercial-advertising", label: "Commercial Ad" },
  { id: "minimalist-modern", label: "Minimalist" },
  { id: "studio-portrait", label: "Studio Portrait" },
];

const MOOD_PRESETS = [
  { id: "none", label: "Auto (Default)" },
  { id: "calm", label: "Calm & Peaceful" },
  { id: "professional", label: "Professional & Elite" },
  { id: "hopeful", label: "Hopeful & Warm" },
  { id: "luxurious", label: "Luxurious & Premium" },
  { id: "clinical-bright", label: "Clinical & Bright" },
];

const TONE_PRESETS = [
  { id: "professional", label: "Professional" },
  { id: "empathetic", label: "Empathetic & Warm" },
  { id: "authoritative", label: "Authoritative" },
  { id: "conversational", label: "Conversational" },
  { id: "urgent", label: "Urgent/Important" },
];

interface ToolState {
  topic: string;
  audience: string;
  context: string;
  platform: Platform;
  subType: ContentSubType;
  scriptStyle: ScriptStyle;
  generatedContent: string | null;
  generatedImage: string | null;
  negativePrompt: string;
  stylePreset: string;
  length: ContentLength;
  mood: string;
  tone: string;
}

const INITIAL_TOOL_STATE: ToolState = {
  topic: "",
  audience: "Myanmar patients seeking healthcare in Thailand",
  context: "",
  platform: "Facebook",
  subType: ContentSubType.EDUCATIONAL,
  scriptStyle: ScriptStyle.NARRATOR,
  generatedContent: null,
  generatedImage: null,
  negativePrompt: "",
  stylePreset: "none",
  length: ContentLength.AUTO,
  mood: "none",
  tone: "professional",
};

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTool, setActiveTool] = useState<ToolType>(
    ToolType.CONTENT_BUILDER,
  );
  const [toolStates, setToolStates] = useState<Record<string, ToolState>>({});
  const [aspectRatio, setAspectRatio] = useState<string>(
    ImageAspectRatio.SQUARE,
  );
  const [imageQuality, setImageQuality] = useState<string>("Standard");
  const [showSettings, setShowSettings] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedContent, setSavedContent] = useState<SavedContentItem[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiKeyStatuses, setApiKeyStatuses] = useState<any[]>([]);

  const refreshApiKeys = () => {
    try {
      setApiKeyStatuses(geminiService.getKeyStates());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshApiKeys();
    // Periodically refresh states in case cooldown expires
    const interval = setInterval(refreshApiKeys, 10000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const getCurrentToolState = () =>
    toolStates[activeTool] || INITIAL_TOOL_STATE;

  const updateCurrentToolState = (updates: Partial<ToolState>) => {
    setToolStates((prev) => ({
      ...prev,
      [activeTool]: { ...(prev[activeTool] || INITIAL_TOOL_STATE), ...updates },
    }));
  };

  const {
    topic,
    audience,
    context,
    platform,
    subType,
    scriptStyle,
    generatedContent,
    generatedImage,
    length,
    mood,
    stylePreset,
    negativePrompt,
    tone,
  } = getCurrentToolState();

  useEffect(() => {
    try {
      const savedContentData = localStorage.getItem(SAVED_CONTENT_KEY);
      if (savedContentData) setSavedContent(JSON.parse(savedContentData));
      const savedChat = localStorage.getItem(CHAT_KEY);
      if (savedChat) setChatMessages(JSON.parse(savedChat));
      const savedToolStates = localStorage.getItem(TOOL_STATES_KEY);
      if (savedToolStates) setToolStates(JSON.parse(savedToolStates));

      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.activeTool) setActiveTool(prefs.activeTool);
        if (prefs.showLanding !== undefined) setShowLanding(prefs.showLanding);
        if (prefs.aspectRatio) setAspectRatio(prefs.aspectRatio);
        if (prefs.imageQuality) setImageQuality(prefs.imageQuality);
        if (prefs.showSettings !== undefined)
          setShowSettings(prefs.showSettings);
      }
    } catch (e) {
      console.error("Load failed", e);
    }
  }, []);

  const saveToStorage = (key: string, data: any) =>
    localStorage.setItem(key, JSON.stringify(data));

  useEffect(() => {
    saveToStorage(CHAT_KEY, chatMessages);
  }, [chatMessages]);
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage(TOOL_STATES_KEY, toolStates);
    }, 1000);
    return () => clearTimeout(timer);
  }, [toolStates]);

  useEffect(() => {
    const prefs = {
      activeTool,
      showLanding,
      aspectRatio,
      imageQuality,
      showSettings,
    };
    saveToStorage(PREFS_KEY, prefs);
  }, [activeTool, showLanding, aspectRatio, imageQuality, showSettings]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const [loadingMessage, setLoadingMessage] = useState<string>("Generating...");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setErrorFeedback(null);
    setLoadingMessage("Initializing generation...");

    setIsGenerating(true);
    setLoadingProgress(0);
    updateCurrentToolState({ generatedContent: null, generatedImage: null });
    const progressInterval = setInterval(
      () => setLoadingProgress((p) => (p >= 90 ? p : p + 5)),
      500,
    );

    const onRetry = (attempt: number) => {
      setLoadingMessage(
        `Rate limit hit. Switching API key (Attempt ${attempt})...`,
      );
      refreshApiKeys();
    };

    try {
      let contentResult: string | null = null;
      let imageResult: string | null = null;

      if (activeTool === ToolType.IMAGE_GENERATION) {
        setLoadingMessage("Crafting visual masterpiece...");
        if (imageQuality === "High") {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
            const confirmKey = window.confirm(
              "High-quality image generation requires a paid Gemini API key. Would you like to select one now? (You will need to enable billing at ai.google.dev/gemini-api/docs/billing)",
            );
            if (confirmKey) {
              await window.aistudio.openSelectKey();
            } else {
              setIsGenerating(false);
              return;
            }
          }
        }
        try {
          imageResult = await geminiService.generateImage(
            topic,
            aspectRatio,
            negativePrompt,
            stylePreset,
            mood,
            context,
            imageQuality === "High",
            onRetry,
          );
        } catch (err: any) {
          if (err.message?.includes("Requested entity was not found")) {
            setErrorFeedback(
              "Your API key might be invalid or from a non-paid project. Please select a valid paid API key.",
            );
            await window.aistudio.openSelectKey();
          }
          throw err;
        }
      } else {
        setLoadingMessage("Generating professional content...");
        const request: GenerationRequest = {
          tool: activeTool,
          subType,
          scriptStyle,
          topic,
          audience,
          platform,
          additionalContext: context,
          length,
          tone,
        };
        contentResult = await geminiService.generateContent(request, onRetry);
      }
      updateCurrentToolState({
        generatedContent: contentResult,
        generatedImage: imageResult,
      });
    } catch (error: any) {
      const msg = error.message || "";
      if (
        msg.includes("429") ||
        msg.includes("Quota") ||
        msg.includes("exhausted")
      ) {
        setErrorFeedback(
          "Daily limit reached. We are attempting high-quota fallback. Please wait a moment or try again shortly.",
        );
      } else {
        setErrorFeedback("Generation failed. Please check connection.");
      }
    } finally {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setIsGenerating(false);
      setLoadingMessage("Generating...");
      refreshApiKeys();
    }
  };

  const handleSaveToGallery = (imgData?: string, textData?: string) => {
    const content = textData || generatedContent;
    const image = imgData || generatedImage;
    if (!content && !image) return;

    const newItem: SavedContentItem = {
      id: Date.now().toString(),
      type: activeTool,
      subType,
      content: content || undefined,
      image: image || undefined,
      prompt: topic,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...savedContent];
    setSavedContent(updated);
    saveToStorage(SAVED_CONTENT_KEY, updated);
    showToast("Saved ✓");
  };

  const handleUpdateSaved = (id: string, newContent: string) => {
    const updated = savedContent.map((item) =>
      item.id === id ? { ...item, content: newContent } : item,
    );
    setSavedContent(updated);
    saveToStorage(SAVED_CONTENT_KEY, updated);
    showToast("Saved ✓");
  };

  const handleDeleteSaved = (ids: string[]) => {
    const updated = savedContent.filter((item) => !ids.includes(item.id));
    setSavedContent(updated);
    saveToStorage(SAVED_CONTENT_KEY, updated);
  };



  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg: Message = {
      role: "user",
      text: chatInput,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);
    try {
      const response = await geminiService.sendMessage(
        userMsg.text,
        chatMessages,
      );
      setChatMessages((prev) => [
        ...prev,
        { role: "model", text: response, timestamp: new Date() },
      ]);
    } catch (error: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Service error. Try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
      refreshApiKeys();
    }
  };

  const renderChat = () => (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            CMO Strategic Consultant
          </h2>
          <p className="text-xs text-gray-500">
            Ask about brand strategy or market trends.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Clear chat?")) setChatMessages([]);
          }}
          className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user" ? "bg-thai-600 text-white shadow-md" : "bg-gray-100 text-gray-800"}`}
            >
              {msg.role === "model" ? (
                <FormattedText text={msg.text} />
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <p className="text-xs text-gray-400 italic">Thinking...</p>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t flex gap-3">
        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-thai-500/20 outline-none resize-none"
          rows={1}
        />
        <button
          onClick={handleSendChatMessage}
          className="bg-thai-600 text-white p-3 rounded-xl hover:bg-thai-700 shadow-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth={2} />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderGenerator = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-6 overflow-hidden">
        <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{activeTool}</h2>
        </div>
        <div className="p-6 space-y-6">
          {activeTool === ToolType.CONTENT_BUILDER && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">
                  Content Pillar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(ContentSubType).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateCurrentToolState({ subType: t })}
                      className={`py-2 px-3 text-[10px] font-bold rounded-xl transition-all border ${subType === t ? "bg-thai-600 text-white border-thai-600 shadow-md" : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">
                  Social Platform
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["Facebook", "Viber", "Telegram"].map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        updateCurrentToolState({ platform: p as Platform })
                      }
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${platform === p ? "bg-white text-thai-600 shadow-sm" : "text-gray-500"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Topic / Subject
            </label>
            <textarea
              value={topic}
              onChange={(e) =>
                updateCurrentToolState({ topic: e.target.value })
              }
              placeholder={
                activeTool === ToolType.IMAGE_GENERATION
                  ? "Describe the image..."
                  : activeTool === ToolType.HEALTH_ARTICLE
                    ? "Enter the medical topic or healthcare subject (e.g., Hypertension Care, Heart-healthy diet, Diabetes lifestyle tips)..."
                    : "Enter the core message or topic for the post..."
              }
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-thai-500/20"
            />
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-4 py-4 bg-gray-50 flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-widest"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    strokeWidth={2}
                  />
                </svg>
                <span>Refinement Settings</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${showSettings ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" strokeWidth={2} />
              </svg>
            </button>
            {showSettings && (
              <div className="p-5 bg-white space-y-5">
                {activeTool === ToolType.IMAGE_GENERATION ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                          Format
                        </label>
                        <select
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                        >
                          {Object.entries(ImageAspectRatio).map(([k, v]) => (
                            <option key={k} value={v}>
                              {k.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                          Quality
                        </label>
                        <select
                          value={imageQuality}
                          onChange={(e) => setImageQuality(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                        >
                          <option value="Standard">Standard (Fast)</option>
                          <option value="High">HD (Paid Tier)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                          Style
                        </label>
                        <select
                          value={stylePreset}
                          onChange={(e) =>
                            updateCurrentToolState({
                              stylePreset: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                        >
                          {STYLE_PRESETS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                          Mood
                        </label>
                        <select
                          value={mood}
                          onChange={(e) =>
                            updateCurrentToolState({ mood: e.target.value })
                          }
                          className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                        >
                          {MOOD_PRESETS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                        {activeTool === ToolType.HEALTH_ARTICLE
                          ? "Article Tone"
                          : "Brand Tone"}
                      </label>
                      <select
                        value={tone}
                        onChange={(e) =>
                          updateCurrentToolState({ tone: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                      >
                        {TONE_PRESETS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                        Target Audience
                      </label>
                      <input
                        type="text"
                        value={audience}
                        onChange={(e) =>
                          updateCurrentToolState({ audience: e.target.value })
                        }
                        placeholder={
                          activeTool === ToolType.HEALTH_ARTICLE
                            ? "e.g. General public, elderly patients"
                            : "e.g. Patients with chronic illness"
                        }
                        className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                        {activeTool === ToolType.HEALTH_ARTICLE
                          ? "Article Length"
                          : "Post Length"}
                      </label>
                      <select
                        value={length}
                        onChange={(e) =>
                          updateCurrentToolState({
                            length: e.target.value as ContentLength,
                          })
                        }
                        className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl"
                      >
                        {Object.values(ContentLength).map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                    {activeTool === ToolType.HEALTH_ARTICLE
                      ? "Extra Details / Medical Context"
                      : "Strategic Context (Goal)"}
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) =>
                      updateCurrentToolState({ context: e.target.value })
                    }
                    rows={2}
                    placeholder={
                      activeTool === ToolType.HEALTH_ARTICLE
                        ? "e.g., Focus on high blood pressure symptoms, mention dietary avoidances, keep explanations simple..."
                        : "e.g., Build trust for cancer treatment at Samitivej..."
                    }
                    className="w-full px-3 py-2.5 bg-gray-50 text-xs border border-gray-200 rounded-xl resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {errorFeedback && (
            <div className="p-3 bg-red-50 text-red-700 text-[11px] font-medium rounded-lg border border-red-100">
              {errorFeedback}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="w-full py-4 bg-thai-600 text-white rounded-xl font-bold hover:bg-thai-700 transition-all disabled:bg-gray-300 shadow-lg shadow-thai-500/20"
          >
            {isGenerating ? "AI is Processing..." : "Generate Assets"}
          </button>

          {/* Key Rotation Live Monitor Widget */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                API Key Rotation (လည်ပတ်မှုအခြေအနေ)
              </span>
              <button 
                onClick={refreshApiKeys}
                className="text-[9px] text-thai-600 hover:underline font-bold font-sans"
              >
                မွမ်းမံရန် (Refresh)
              </button>
            </div>
            
            {apiKeyStatuses.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-800 text-[11px] font-semibold rounded-xl border border-amber-100/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                <span>Default Core AI Route is active.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {apiKeyStatuses.map((k, i) => {
                  // Resolve user-friendly status names instead of leaking GEMINI_API_KEY_1 environment variables
                  let friendlyRouteName = `AI Routing Channel ${i + 1}`;
                  if (k.name === 'GEMINI_API_KEY') {
                    friendlyRouteName = "Main AI Channel";
                  } else if (k.name === 'API_KEY') {
                    friendlyRouteName = "System Backup Route";
                  } else if (k.name.includes('_1')) {
                    friendlyRouteName = "AI Routing Channel 1";
                  } else if (k.name.includes('_2')) {
                    friendlyRouteName = "AI Routing Channel 2";
                  } else if (k.name.includes('_3')) {
                    friendlyRouteName = "AI Routing Channel 3";
                  }

                  return (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-sans">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${k.isCurrentlyExhausted ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                        <span className="text-gray-700 font-bold">{friendlyRouteName}</span>
                      </div>
                      {k.isCurrentlyExhausted ? (
                        <span className="text-amber-700 font-extrabold text-[9px] bg-amber-50/70 px-2 py-0.5 rounded-lg border border-amber-100 uppercase tracking-wider">
                          Temporary Cooldown
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-50/70 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-wider">
                          Ready & Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full min-h-[600px] overflow-hidden">
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-thai-100 border-t-thai-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">
              {loadingMessage}
            </p>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-thai-600"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        ) : generatedContent ? (
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {activeTool} Draft
              </span>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setIsGenerating(true);
                    const enhanced =
                      await geminiService.enhanceContent(generatedContent);
                    updateCurrentToolState({ generatedContent: enhanced });
                    setIsGenerating(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-purple-600 border border-purple-200 rounded-lg hover:bg-white"
                >
                  Re-Narrate
                </button>
                <button
                  onClick={() => handleSaveToGallery()}
                  className="px-3 py-1.5 text-xs font-bold text-emerald-600 border border-emerald-200 rounded-lg bg-emerald-50/20 hover:bg-emerald-50 flex items-center gap-1.5 transition-all"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent!);
                    setCopiedId("main");
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-thai-600 border border-thai-200 rounded-lg hover:bg-white"
                >
                  {copiedId === "main" ? "Copied!" : "Copy Text"}
                </button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto">
              <FormattedText text={generatedContent} />
            </div>
          </div>
        ) : generatedImage ? (
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase">
                IMAGE PREVIEW
              </span>
              <button
                onClick={() => handleSaveToGallery()}
                className="px-3 py-1.5 text-xs font-bold text-thai-600 border border-thai-200 rounded-lg hover:bg-white"
              >
                Save to Gallery
              </button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-gray-100/50 overflow-hidden">
              <img
                src={generatedImage}
                alt="Generated"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full rounded-xl shadow-2xl object-contain transition-all duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-12 text-center opacity-60">
            <svg
              className="w-20 h-20 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                strokeWidth={1}
              />
            </svg>
            <p className="font-bold uppercase tracking-widest text-sm">
              Preview Studio Empty
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {showLanding ? (
        <LandingPage
          onStart={(tool, sub) => {
            if (tool) setActiveTool(tool);
            if (sub) updateCurrentToolState({ subType: sub });
            setShowLanding(false);
          }}
        />
      ) : (
        <Layout
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onBackHome={() => setShowLanding(true)}
        >
          {activeTool === ToolType.CONSULTATION ? (
            renderChat()
          ) : activeTool === ToolType.SAVED_CONTENT ? (
            <SavedContentRepo
              items={savedContent}
              onDelete={handleDeleteSaved}
              onViewImage={() => {}}
              onUpdate={handleUpdateSaved}
            />
          ) : activeTool === ToolType.CALENDAR ? (
            <HolidayCalendar />
          ) : (
            renderGenerator()
          )}
        </Layout>
      )}

      {/* Elegant Toast Message Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm sm:max-w-md"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wide font-sans whitespace-nowrap">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Messenger Icon for Health Help */}
      <motion.a
        id="health-assistant-messenger-btn"
        href="https://healthypocket.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-gradient-to-tr from-[#006AFF] via-[#3B82F6] to-[#A855F7] text-white p-3.5 md:p-4 rounded-full shadow-[0_8px_30px_rgba(59,130,246,0.35)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        title="ကျန်းမာရေး အကူအညီ (Health Assistant)"
      >
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold items-center justify-center text-white">
            1
          </span>
        </span>

        {/* Action text that expands on hover */}
        <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out flex flex-col items-start leading-none pl-0 group-hover:pl-1">
          <span className="text-[12px] font-semibold whitespace-nowrap text-white/95">
            ကျန်းမာရေး အကူအညီ
          </span>
          <span className="text-[9px] font-bold text-blue-100/80 whitespace-nowrap tracking-wider uppercase">
            Health Assistant
          </span>
        </div>

        {/* Help Icon vector path */}
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-sm"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          {/* Outer Ring */}
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Question Mark Shape */}
          <path 
            d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5}
          />
          
          {/* Info/Help Dot */}
          <line 
            x1="12" 
            y1="17" 
            x2="12.01" 
            y2="17" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3}
          />
        </svg>
      </motion.a>
    </>
  );
};

export default App;
