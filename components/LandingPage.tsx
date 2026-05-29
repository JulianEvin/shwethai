import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolType, ContentSubType } from '../types';

interface LandingPageProps {
  onStart: (tool?: ToolType, subType?: ContentSubType) => void;
}

type Language = 'en' | 'mm';

const TRANSLATIONS = {
  en: {
    nav: { 
      launch: "Launch Workspace",
      consult: "CMO Consultation",
      calendar: "Thailand Calendar",
      repository: "Saved Materials"
    },
    hero: {
      badge: "Clinical Triage • Cross-Border Care • Frictionless VIP Shuttle & Escort",
      title_start: "Your Journey to Care,",
      title_end: "Redefined by Executive Doctors",
      subtitle: "We are NOT a standard medical tourism agency. We are Myanmar's elite healthcare concierge. Guided by accredited M.B.,B.S. medical coordinators, we manage your clinical triage, host hospital communications, and handle door-to-door VIP luxury transfers with absolute zero friction.",
      cta_primary: "Access Marketing Hub",
      cta_secondary: "Explore Creative Workstations",
    },
    tools_dropdown: {
      educational: "Educational Clinic Post",
      sales: "Empathetic Sales Narrative",
      ad_copy: "Ad Copy Campaign",
      hospital_profile: "Hospital/VIP Profile Builder",
      faq: "Clinical FAQ Compiler",
      image_gen: "Premium Visual Illustrator",
      health_article: "Non-Branded Medical Article",
      consultation: "Custom Brand Strategy Guide"
    },
    features: {
      label: "EXECUTIVE MEDICAL MARKETING ECOSYSTEM",
      title: "Engineered for Clinical & Marketing Distinction",
      subtitle: "Everything you need to write professional, medically accurate, and deeply persuasive cross-border medical content for high-end Burmese clientele.",
      
      consult_title: "CMO Strategic Mind",
      consult_subtitle: "Elite Brand Consulting",
      consult_desc: "Establish impeccable brand identity with expert strategies matching Shwe Thai's clinical trust standards. Zero generic marketing formulas.",
      
      content_title: "Medical Copywriting",
      content_subtitle: "Doctor-grade Precision",
      content_desc: "Convert dense clinical data, complex procedures, and hospital listings into warm, highly reassuring Burmese content approved for publication.",
      
      visual_title: "Visual Asset Studio",
      visual_subtitle: "Brand-Aligned Imaging",
      visual_desc: "Generate premium mockup designs for high-end clinics, doctor uniforms (Shwe Thai pristine white polo shirts), and high-contrast social layout plans.",
      
      calendar_title: "Cross-Border Intel",
      calendar_subtitle: "Operational Planning",
      calendar_desc: "Plan with confidence. Tap into the official Thailand National Holiday calendar integrated with Shwe Thai's concierge advice.",
    },
    workflow: {
      label: "PUBLISHING PIPELINE",
      title: "Select, Refine, and Distribute",
      subtitle: "Move from initial medical prompts to gorgeous, publication-ready layouts in three simple steps.",
      step1_title: "Pick Your Workstation",
      step1_desc: "Choose from customized content templates, clinical FAQ builders, or premium brand visualization tools.",
      step2_title: "AI-Powered Synthesis",
      step2_desc: "Generate professional copy powered by advanced Gemini models, calibrated with Shwe Thai brand keywords.",
      step3_title: "Review & Save Assets",
      step3_desc: "Save content into your secure offline repository. Quick search, update, copy, and publish variables."
    },
    hospitals: {
      title: "Primary Host Network Centers & VIP Shuttle Support",
      subtitle: "Our coordinators maintain dedicated clinical channels with top-tier hospitals across Thailand's vital cities.",
      list: [
        { name: "Bumrungrad International Hospital", city: "Bangkok" },
        { name: "Bangkok Hospital Group", city: "Bangkok" },
        { name: "Samitivej Hospital", city: "Bangkok" },
        { name: "MedPark Hospital", city: "Bangkok" },
        { name: "Chiang Mai Ram Hospital", city: "Chiang Mai" },
        { name: "Phuket International Hospital", city: "Phuket" },
      ]
    },
    hospital_regions: {
      title: "Thailand-Wide Medical Services",
      subtitle: "Ensuring you receive top-quality specialist medical care in major provinces and healthcare zones across Thailand.",
      list: ["Bangkok Medical Zone", "Chiang Mai Wellness Hub", "Phuket Treatment Center", "Hat Yai Care Hub", "Pattaya & Chonburi Zone", "Nonthaburi Specialist Center"]
    },
    footer: { 
      rights: "© 2026 Shwe Thai Health Partner. All rights reserved.", 
      privacy: "Operations Protocol", 
      terms: "Terms & Affiliations", 
      support: "24/7 VIP Concierge Hotline: +66 97 210 0341" 
    }
  },
  mm: {
    nav: { 
      launch: "မားကတ်တင်း Hub စတင်မည်",
      consult: "မဟာဗျူဟာ မေးမြန်းခြင်း",
      calendar: "ထိုင်းပိတ်ရက် ပြက္ခဒိန်",
      repository: "သိမ်းဆည်းထားသောဖိုင်များ"
    },
    hero: {
      badge: "M.B.,B.S. ဆရာဝန်များဦးဆောင်သော အဆင့်မြင့် အထူးကုကွန်ဆီးယပ်စ် ကွန်ရက်",
      title_start: "ထိုင်းနိုင်ငံ",
      title_end: "ဆေးကုသမှုခရီးစဉ်",
      subtitle: "ရွှေထိုင်းသည် သာမန် ပွဲစား သို့မဟုတ် ခရီးသွားအေဂျင်စီ မဟုတ်ပါ။ မြန်မာလူနာများအတွက် ဆေးဘက်ဆိုင်ရာစိစစ်ခြင်း (Clinical Triage)၊ ဆေးရုံအလွှဲအပြောင်း၊ ဘာသာစကားအခက်အခဲနှင့် စာရွက်စာတမ်းကိစ္စရပ်များအား ကျွမ်းကျင် M.B.,B.S. ဆရာဝန်များက ဘေးကနေ သေချာကိုင်တွယ်ပေးသည့် တရားဝင် VIP Medical Partner ဖြစ်ပါသည်။",
      cta_primary: "ဖန်တီးမည်",
      cta_secondary: "အမျိုးအစားများ",
    },
    tools_dropdown: {
      educational: "ဆေးပညာပေး ပို့စ် (Educational Clinic)",
      sales: "နှလုံးသားထိမှန်စေမည့် အရောင်းပို့စ် (Sales)",
      ad_copy: "ဖမ်းစားနိုင်မည့် ကြော်ငြာစာ (Ad Copy)",
      hospital_profile: "ဆေးရုံ/ဆေးခန်းမိတ်ဆက် (Profile)",
      faq: "လူနာများမေးလေ့ရှိသော မေးခွန်းများ (FAQ)",
      image_gen: "အဆင့်မြင့် ပုံရိပ် Ilustrator စနစ်",
      health_article: "အမှတ်တံဆိပ်မဲ့ ကျန်းမာရေးဆောင်းပါး",
      consultation: "တံဆိပ်မြှင့်တင်ရေး CMO မဟာဗျူဟာ"
    },
    features: {
      label: "အထူးကောင်းမွန်သော ဆေးဘက်ဆိုင်ရာ မားကတ်တင်း",
      title: "ဆေးဘက်ဆိုင်ရာ အရည်အသွေးနှင့် အလုပ်ဖြစ်မှုအတွက် စနစ်တကျ တည်ဆောက်ထားပါသည်",
      subtitle: "မြန်မာလူနာများ ယုံကြည်အားကိုးစေမည့်၊ ပညာရှင်ဆန်ပြီး ဆွဲဆောင်မှုအပြည့်ရှိသော အကြောင်းအရာများအား စက္ကန့်ပိုင်းအတွင်း ဖန်တီးလိုက်ပါ။",
      
      consult_title: "CMO မဟာဗျူဟာ အကြံပေး",
      consult_subtitle: "အဆင့်မြင့် တည်ဆောက်မှု",
      consult_desc: "Shwe Thai ၏ စံနှုန်းအတိုင်း သင့်ဝန်ဆောင်မှုများ၏ ယျေဘုယျ မားကတ်တင်းဗျူဟာကို စနစ်တကျရေးဆွဲရန် ကူညီပေးပါမည်။",
      
      content_title: "ဆေးဘက်ဆိုင်ရာ Copywriting",
      content_subtitle: "ဆရာဝန်အဆင့် ဆောင်းပါးများ",
      content_desc: "ရှုပ်ထွေးလှသော ကုသမှုများ၊ ဆေးရုံအချက်အလက်များနှင့် ကျန်းမာရေးဗဟုသုတများကို နားလည်လွယ်ပြီး နွေးထွေးယုံကြည်စေမည့် မြန်မာဘာသာစကားဖြင့် ပြန်ဆိုရေးသားပေးပါသည်။",
      
      visual_title: "ပုံဖန်တီးမှု အနုပညာ",
      visual_subtitle: "ပုံဖော်ခြင်း",
      visual_desc: "ထိုင်းနိုင်ငံ ဆေးရုံအတွေ့အကြုံများ၊ ယူနီဖောင်းဝတ်ဆင်ထားသော ပရော်ဖက်ရှင်နယ် ဆရာဝန်ပုံရိပ်များ (ရွှေထိုင်း white polo shirt) နှင့် အရည်အသွေးမြင့် ပို့စ်ဒီဇိုင်းများကို စိတ်ကူးပုံဖော်ပါ။",
      
      calendar_title: "ထိုင်းပိတ်ရက် ဆန်းစစ်ချက်",
      calendar_subtitle: "ပြက္ခဒိန်",
      calendar_desc: "ဆေးရုံချိန်းဆိုမှုများ လွဲချော်မှုမရှိစေရ။ ထိုင်းနိုင်ငံ၏ နိုင်ငံတော်အစိုးရနှင့် ဗုဒ္ဓဘာသာပိတ်ရက်များကို ရွှေထိုင်း၏ ကွန်ဆီးယပ်စ် သတိပေးချက်များဖြင့် တွဲဖက်လေ့လာပါ။",
    },
    workflow: {
      label: "အဆင့်မြင့် လုပ်ငန်းစဉ်",
      title: "ရွေးချယ်ပါ • ဖန်တီးပါ • အဆင်သင့်အသုံးပြုပါ",
      subtitle: "ကနဦးအချက်အလက်များမှ ထွက်ရှိလာသော တန်ဖိုးရှိစာသားများအထိ အဆင့် ၃ ဆင့်ဖြင့် လျင်မြန်စွာ ရယူနိုင်ပါသည်။",
      step1_title: "မားကတ်တင်း Workstation ရွေးချယ်ပါ",
      step1_desc: "ပညာပေးပို့စ်၊ စားသုံးသူဖမ်းစားမည့် အရောင်းစာမျက်နှာ သို့မဟုတ် အဆင့်မြင့် ဒီဇိုင်းဖန်တီးခြင်း ကိရိယာကိုရွေးချယ်ပါ။",
      step2_title: "ဉာဏ်ရည်တု စနစ်ဖြင့် ဖန်တီးပေးခြင်း",
      step2_desc: "အဆင့်မြင့် Ai မော်ဒယ်များနှင့် Shwe Thai ၏ မားကတ်တင်း သော့ချက်စကားလုံးများကို အသုံးချ၍ အရည်အသွေးအမြင့်ဆုံး ရလဒ်များထွက်ရှိစေပါသည်။",
      step3_title: "ပြန်လည်စစ်ဆေး သိမ်းဆည်းခြင်း",
      step3_desc: "ရရှိလာသော ဆောင်းပါးနှင့် ပုံများကို ကိုယ်ပိုင်သီးသန့် မော်ကွန်းတိုက်ထဲတွင် သိမ်းဆည်းပြင်ဆင်ပြီး ချက်ချင်းကော်ပီကူးယူ အသုံးပြုပါ။"
    },
    hospitals: {
      title: "အဓိက ချိတ်ဆက်ထားသော ထိပ်တန်းဆေးရုံကြီးများ",
      subtitle: "ထိုင်းနိုင်ငံ၏ ထိပ်တန်းအထူးကုဆေးရုံကြီးများနှင့် ကွန်ဆီးယပ်စ် ညှိနှိုင်းဆောင်ရွက်ပေးမှု",
      list: [
        { name: "Bumrungrad International Hospital (ဘမ်ရွန်ဂရက်)", city: "ဘန်ကောက်မြို့" },
        { name: "Bangkok Hospital Group (ဘန်ကောက်ဆေးရုံ)", city: "ဘန်ကောက်မြို့" },
        { name: "Samitivej Hospital (ဆာမီတီဝေ့)", city: "ဘန်ကောက်မြို့" },
        { name: "MedPark Hospital (မက်ဒ်ပတ်ခ်)", city: "ဘန်ကောက်မြို့" },
        { name: "Chiang Mai Ram Hospital (ချင်းမိုင်ရမ်)", city: "ချင်းမိုင်မြို့" },
        { name: "Phuket International Hospital (ဖူးခက်)", city: "ဖူးခက်" },
      ]
    },
    hospital_regions: {
      title: "ထိုင်းနိုင်ငံတစ်ဝန်း ဆေးကုသမှု",
      subtitle: "ထိုင်းနိုင်ငံအနှံ့ရှိ အဓိကမြို့ကြီးများတွင် အထူးကု ဆေးကုသမှုအမျိုးမျိုးကို စနစ်တကျ လက်ခံတွေ့ဆုံ ကုသနိုင်ရန် စီစဉ်ဆောင်ရွက်ပေးပါသည်။",
      list: ["ဘန်ကောက်ဆေးဘက်ဆိုင်ရာဇုန်", "ချင်းမိုင် ကျန်းမာရေးဗဟို", "ဖူးခက် ဆေးကုသမှုဇုန်", "ဟတ်ရိုင် ဆေးကုသရေးဗဟို", "ချွန်ဘူရီ ပတ္တယားဇုန်", "နွန်ထပူရီ အထူးကုဆေးခန်းဗဟို"]
    },
    footer: { 
      rights: "© ၂၀၂၆ ရွှေထိုင်းကျန်းမာရေးမိတ်ဖက် (Shwe Thai Health Partner)။ မူပိုင်ခွင့်အားလုံးရယူပြီးဖြစ်ပါသည်။", 
      privacy: "လုပ်ငန်းလည်ပတ်မှု စည်းမျဉ်း", 
      terms: "ဝန်ဆောင်မှုများနှင့် မိတ်ဖက်များ", 
      support: "၂၄ နာရီ VIP Hotline: +66 97 210 0341" 
    }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [lang, setLang] = useState<Language>('mm');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen bg-slate-50/70 font-sans text-slate-900 overflow-x-hidden relative ${lang === 'mm' ? 'leading-relaxed tracking-wide' : 'leading-normal'}`}>
      
      {/* Exquisite Grid Pattern & Soft Glows (Professional Editorial Art Direction) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Fine Linear Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        {/* Soft Clinical Sea-blue and Warm Gold ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-thai-100/40 to-[#e0f2fe]/30 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-shwe-100/20 to-amber-100/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-thai-100/20 rounded-full blur-[80px]"></div>
      </div>

      {/* Floating Modern Header / Glass Navigation */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo and Sub-branding */}
            <div className="flex items-center gap-3">
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhB1jpcQk1Mv4dSAMVANfT3P02RvrPWTRkco3dsyHtzwXOBNKsRYwLFlVFcvjzIAUzVJLC8nfQJES1jLUICTc7kL2R3KXhlk0A3fIedrldq4S6mPUyplGxvntW1P-MMKk2S3jY3EGDyMS1GUzgjSj63CdAG2y7wpNjO0IK5ZQy-Wcx9SYZ9jTkeGq8Z0QU" 
                alt="Shwe Thai Logo" 
                className="h-10 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#202580] block font-sans">
                  SHWE THAI
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-600 block leading-none font-sans">
                  EXECUTIVE MEDICAL MARKETING
                </span>
              </div>
            </div>

            {/* Premium Language Toggler & Start-Buttons */}
            <div className="flex items-center gap-4">
              
              {/* Refined Flag selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/70 shadow-inner">
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm scale-102' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-4 h-auto rounded-sm shadow-xs" />
                  <span>EN</span>
                </button>
                <button 
                  onClick={() => setLang('mm')} 
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all ${lang === 'mm' ? 'bg-white text-[#202580] shadow-sm scale-102' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <img src="https://flagcdn.com/w40/mm.png" alt="MM" className="w-4 h-auto rounded-sm shadow-xs" />
                  <span>မြန်မာ</span>
                </button>
              </div>

              {/* Primary Launch Action */}
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(32, 37, 128, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStart()} 
                className="hidden md:flex px-6 py-4 bg-[#202580] hover:bg-[#10138c] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm items-center gap-2 border border-blue-900/10"
              >
                <span>{t.nav.launch}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section: Hero Executive Board */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Exquisite Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-8 shadow-sm font-sans"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{t.hero.badge}</span>
          </motion.div>

          {/* Stately Hero Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className={`font-black text-slate-900 tracking-tight mb-6 font-sans ${lang === 'mm' ? 'leading-[1.4] md:leading-[1.5]' : 'text-4xl md:text-6xl leading-tight'}`}
          >
            {lang === 'mm' ? (
              <>
                <span className="text-4xl md:text-5xl font-black text-slate-900 block mb-2">{t.hero.title_start}</span>
                <span className="bg-gradient-to-r from-[#202580] via-[#4338ca] to-amber-600 bg-clip-text text-transparent italic font-serif text-2xl md:text-3xl font-bold block leading-relaxed">
                  {t.hero.title_end}
                </span>
              </>
            ) : (
              <>
                {t.hero.title_start}{' '}
                <span className="bg-gradient-to-r from-[#202580] via-[#4338ca] to-amber-600 bg-clip-text text-transparent italic font-serif">
                  {t.hero.title_end}
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle / Intro */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-slate-600 font-medium text-sm md:text-base max-w-3xl mx-auto mb-10 leading-relaxed ${lang === 'mm' ? 'leading-[2.1] text-justify md:text-center' : 'text-center'}`}
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Combined Call-to-actions & Dropdown Trigger */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
          >
            <motion.button 
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 12px 20px -3px rgba(32, 37, 128, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart()} 
              className="w-full sm:w-auto px-8 py-5 bg-[#202580] hover:bg-[#10138c] text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 font-sans border-b-4 border-blue-900"
            >
              <span>{t.hero.cta_primary}</span>
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </motion.button>

            {/* Custom Interactive Workstations Dropdown */}
            <div className="relative w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="w-full sm:w-auto px-8 py-5 bg-white text-slate-800 font-extrabold text-sm rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm font-sans"
              >
                <span>{t.hero.cta_secondary}</span>
                <svg className={`w-4 h-4 text-[#202580] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ type: "spring", damping: 18, stiffness: 200 }}
                    className="absolute top-full right-0 left-0 sm:left-auto mt-3 w-full sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3 z-50 text-left overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 mb-1.5">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                        Direct Workspace Launchpad
                      </span>
                    </div>

                    <button 
                      onClick={() => { onStart(ToolType.CONTENT_BUILDER, ContentSubType.EDUCATIONAL); setIsDropdownOpen(false); }} 
                      className="w-full px-4 py-3 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors group font-sans font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>{t.tools_dropdown.educational}</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-600 transition-colors">→</span>
                    </button>

                    <button 
                      onClick={() => { onStart(ToolType.CONTENT_BUILDER, ContentSubType.SALES); setIsDropdownOpen(false); }} 
                      className="w-full px-4 py-3 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors group font-sans font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span>{t.tools_dropdown.sales}</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-600 transition-colors">→</span>
                    </button>

                    <button 
                      onClick={() => { onStart(ToolType.CONTENT_BUILDER, ContentSubType.AD_COPY); setIsDropdownOpen(false); }} 
                      className="w-full px-4 py-3 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors group font-sans font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                        <span>{t.tools_dropdown.ad_copy}</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-600 transition-colors">→</span>
                    </button>

                    <button 
                      onClick={() => { onStart(ToolType.HEALTH_ARTICLE); setIsDropdownOpen(false); }} 
                      className="w-full px-4 py-3 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors group font-sans font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span>{t.tools_dropdown.health_article}</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-600 transition-colors">→</span>
                    </button>

                    <button 
                      onClick={() => { onStart(ToolType.IMAGE_GENERATION); setIsDropdownOpen(false); }} 
                      className="w-full px-4 py-3 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors group font-sans font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                        <span>{t.tools_dropdown.image_gen}</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-600 transition-colors">→</span>
                    </button>

                    <button 
                      onClick={() => { onStart(ToolType.CONSULTATION); setIsDropdownOpen(false); }} 
                      className="w-full px-4 py-3 text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors group font-sans font-bold border-t border-slate-100 mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                        <span>{t.tools_dropdown.consultation}</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-600 transition-colors">→</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Structured Bento Grid Features Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black text-[#202580] uppercase tracking-widest block mb-2 font-sans">
              {t.features.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 font-sans">
              {t.features.title}
            </h2>
            <p className={`text-slate-500 text-sm md:text-base ${lang === 'mm' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
              {t.features.subtitle}
            </p>
          </div>

          {/* Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Bento Card 1: Copywriting (Clinical Copy, 7 cols) */}
            <div className="lg:col-span-7 bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div>
                <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider mb-2 block font-sans">
                  {t.features.content_subtitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">
                  {t.features.content_title}
                </h3>
                <p className={`text-slate-600 text-sm mb-6 ${lang === 'mm' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
                  {t.features.content_desc}
                </p>
              </div>

              {/* Interactive Mock Clipboard Layout */}
              <div className="bg-white/70 backdrop-blur-xs border border-white/80 rounded-2xl p-4 shadow-xs font-sans flex flex-col gap-2">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-black uppercase text-slate-500">APPROVED CLINICAL DUPLICATE</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-slate-400">FB COPY • READY</span>
                </div>
                <div className={`text-[11px] font-bold text-[#202580] leading-normal italic ${lang === 'mm' ? 'leading-[1.85]' : ''}`}>
                  &quot;ထိုင်းနိုင်ငံရဲ့ ဆေးကုသမှုအဆင့်အတန်းကို တလေးတစား VIP အတွေ့အကြုံဖြင့် ရွှေထိုင်းမိတ်ဖက်ဆရာဝန်များက ပို့ဆောင်ပေးနေပါပြီ...&quot;
                </div>
              </div>
            </div>

            {/* Bento Card 2: Strategic Consulting (CMO Insights, 5 cols) */}
            <div className="lg:col-span-5 bg-slate-950/85 backdrop-blur-md text-white rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(32,37,128,0.25)] relative overflow-hidden flex flex-col justify-between group border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-[#202580]/70">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div>
                <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider mb-2 block font-sans">
                  {t.features.consult_subtitle}
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight mb-3 group-hover:text-amber-300 transition-colors font-sans">
                  {t.features.consult_title}
                </h3>
                <p className={`text-slate-300 text-sm ${lang === 'mm' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
                  {t.features.consult_desc}
                </p>
              </div>

              {/* Decorative Brand metrics mockup */}
              <div className="mt-8 grid grid-cols-2 gap-2 font-mono">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                  <div className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mb-1">Brand Trust Value</div>
                  <div className="text-base font-extrabold text-amber-400">ACC-MAX</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                  <div className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mb-1">M.B.,B.S. Verification</div>
                  <div className="text-base font-extrabold text-emerald-400">100% SECURE</div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Visual illustrator (5 cols) */}
            <div className="lg:col-span-5 bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-100/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div>
                <span className="text-[10px] uppercase font-black text-pink-600 tracking-wider mb-2 block font-sans">
                  {t.features.visual_subtitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">
                  {t.features.visual_title}
                </h3>
                <p className={`text-slate-600 text-sm ${lang === 'mm' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
                  {t.features.visual_desc}
                </p>
              </div>

              {/* Simulated medical visual prompt mockup card */}
              <div className="bg-white/70 backdrop-blur-xs border border-white/80 rounded-2xl p-4 mt-6">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Art Direction Prompt</div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-[10px] text-slate-500 font-semibold leading-relaxed">
                  &quot;A professional white polo shirt with a navy blue collar... clean, modern, and clinical medical-professional look.&quot;
                </div>
              </div>
            </div>

            {/* Bento Card 4: Operations & Calendar intel (7 cols) */}
            <div className="lg:col-span-7 bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-100/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider mb-2 block font-sans">
                  {t.features.calendar_subtitle}
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">
                  {t.features.calendar_title}
                </h3>
                <p className={`text-slate-600 text-sm mb-6 ${lang === 'mm' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
                  {t.features.calendar_desc}
                </p>
              </div>

              {/* Sample Holiday block view */}
              <div className="bg-white/70 backdrop-blur-xs border border-white/80 rounded-2xl p-3 shadow-xs flex items-center justify-between font-sans">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-lg p-2 px-3 text-center flex flex-col leading-tight shadow-xs">
                    <span>MAR</span>
                    <span className="text-sm">02</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Makha Bucha Day (วันมาฆบูชา)</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Buddhist Holiday • Alcohol Prohibition</p>
                  </div>
                </div>
                <div className="bg-slate-50 text-[10px] font-extrabold text-[#202580] border border-slate-100 px-3 py-1 rounded-lg">
                  OPD Closed
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cross-Border Operations / Logistics Network map representation */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-2 font-sans-bold">
            SHWE THAI NETWORK GATEWAY
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 font-sans">
            {t.hospitals.title}
          </h2>
          <p className="text-slate-500 mb-16 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {t.hospitals.subtitle}
          </p>

          {/* List of Leading Host Hospitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {t.hospitals.list.map((hosp: { name: string; city: string }, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-white/80 transition-all flex flex-col justify-between items-start text-left group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/50 backdrop-blur-xs text-[#202580] group-hover:bg-[#202580] group-hover:text-white transition-all mb-4 border border-blue-100/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 tracking-tight mb-1 font-sans">{hosp.name}</h4>
                  <span className="text-xs font-extrabold uppercase text-slate-400 tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    {hosp.city}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Border gate logistics indicators */}
          <div className="border-t border-slate-200/80 pt-16">
            <h3 className={`font-extrabold text-slate-900 tracking-tight mb-4 font-sans ${lang === 'mm' ? 'text-2xl md:text-3xl leading-[1.45]' : 'text-3xl md:text-4xl'}`}>
              {t.hospital_regions.title}
            </h3>
            <p className={`text-slate-500 max-w-xl mx-auto mb-10 text-sm md:text-base ${lang === 'mm' ? 'leading-[2.0]' : 'leading-relaxed'}`}>
              {t.hospital_regions.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {t.hospital_regions.list.map((cross: string, i: number) => (
                <motion.span 
                  key={i}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.9)', color: '#1e1b4b' }}
                  className="px-4 py-2.5 bg-white/40 backdrop-blur-xs text-slate-700 rounded-full text-xs font-extrabold border border-white/50 transition-all cursor-default shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{cross}</span>
                </motion.span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Workflow Sequence */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-2 font-sans-bold">
            {t.workflow.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-sans">
            {t.workflow.title}
          </h2>
          <p className={`text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-16 ${lang === 'mm' ? 'leading-[1.95]' : 'leading-relaxed'}`}>
            {t.workflow.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10 group bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]">
              <div className="h-16 w-16 rounded-2xl bg-[#202580]/10 text-[#202580] font-black text-xl flex items-center justify-center font-serif group-hover:bg-[#202580] group-hover:text-white transition-all shadow-xs mb-6 border border-blue-900/10">
                01
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 font-sans">{t.workflow.step1_title}</h3>
              <p className={`text-slate-500 text-xs max-w-xs ${lang === 'mm' ? 'leading-[1.8]' : 'leading-relaxed'}`}>{t.workflow.step1_desc}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10 group bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-800 font-black text-xl flex items-center justify-center font-serif group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs mb-6 border border-amber-500/10">
                02
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 font-sans">{t.workflow.step2_title}</h3>
              <p className={`text-slate-500 text-xs max-w-xs ${lang === 'mm' ? 'leading-[1.8]' : 'leading-relaxed'}`}>{t.workflow.step2_desc}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10 group bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 hover:border-white/80 rounded-3xl p-8 transition-all hover:shadow-[0_8px_32px_0_rgba(15,23,42,0.06)]">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-800 font-black text-xl flex items-center justify-center font-serif group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xs mb-6 border border-emerald-500/10">
                03
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 font-sans">{t.workflow.step3_title}</h3>
              <p className={`text-slate-500 text-xs max-w-xs ${lang === 'mm' ? 'leading-[1.8]' : 'leading-relaxed'}`}>{t.workflow.step3_desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer / Contact segment */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8 pb-12 border-b border-slate-800">
            
            {/* Left coordinate */}
            <div>
              <div className="flex justify-center md:justify-start items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-white text-xs font-black uppercase tracking-wider font-sans">
                  SHWE THAI CONCIERGE INFRASTRUCTURE
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                Empowered by doctor-led coordinators providing direct channel VIP medical escort and transfer support between Bangkok, immigration borders, and patients from Myanmar in executive clinical standards.
              </p>
            </div>

            {/* Right support numbers */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center min-w-[280px]">
              <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider mb-1 font-sans">
                Official VIP Hotline (Bangkok)
              </div>
              <a href="tel:+66972100341" className="text-lg font-black text-white hover:underline block mb-1">
                +66 97 210 0341
              </a>
              <span className="text-[10px] text-slate-500 tracking-wide font-sans block">www.shwethai.com • clinical@shwethai.com</span>
            </div>
            
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 pt-12">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              <span>{t.footer.rights}</span>
              <span className="hidden md:inline text-slate-800">|</span>
              <span>
                Developed with precision by{' '}
                <a 
                  href="https://julianevin.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-500 hover:text-amber-400 font-extrabold transition-colors underline decoration-dotted underline-offset-4"
                >
                  Julian Evin
                </a>
              </span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
