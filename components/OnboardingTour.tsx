import React, { useState, useEffect } from 'react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome to Shwe Thai Marketing",
    content: "Your AI-powered marketing strategist for Medical Tourism. Let's take a quick tour to get you started.",
    position: "center"
  },
  {
    title: "Choose Your Tool",
    content: "Select from Strategy, Educational Posts, Sales Copy, or Visual Generators here. Switch tools anytime.",
    position: "sidebar-top"
  },
  {
    title: "Input Your Topic",
    content: "Enter the medical condition, package name, or campaign idea here. The AI is trained on Shwe Thai's brand voice.",
    position: "input-area"
  },
  {
    title: "View & Save",
    content: "Your generated content appears here. You can copy text, download images, or enhance drafts instantly.",
    position: "output-area"
  },
  {
    title: "Your Gallery",
    content: "Generated images are automatically saved to your local Gallery for easy access later.",
    position: "sidebar-bottom"
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPositionClasses = (position: string) => {
    // Mobile is always centered
    const baseClasses = "fixed z-50 w-[90%] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-shwe-gold p-6 transition-all duration-500 ease-in-out";
    
    // Desktop positioning
    switch (position) {
      case 'sidebar-top':
        return `${baseClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-24 md:left-80`;
      case 'input-area':
        return `${baseClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-40 md:left-[35%]`;
      case 'output-area':
         return `${baseClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-40 md:right-20`;
      case 'sidebar-bottom':
        return `${baseClasses} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:bottom-20 md:left-80`;
      case 'center':
      default:
        return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`;
    }
  };

  const stepData = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* Card */}
      <div className={getPositionClasses(stepData.position)}>
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-gradient-to-br from-shwe-gold to-shwe-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
               {currentStep + 1}
             </div>
             <h3 className="font-bold text-lg text-thai-700">{stepData.title}</h3>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {stepData.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-thai-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
             {currentStep > 0 && (
               <button 
                 onClick={handlePrev}
                 className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-thai-600 transition-colors"
               >
                 Back
               </button>
             )}
             <button 
               onClick={handleNext}
               className="px-5 py-2 text-sm font-bold text-white bg-thai-600 rounded-lg hover:bg-thai-700 shadow-md transition-all transform hover:-translate-y-0.5"
             >
               {currentStep === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}
             </button>
          </div>
        </div>

        {/* Pointer Arrow (Desktop Only visual cue) */}
        {stepData.position !== 'center' && (
          <div className={`hidden md:block absolute w-4 h-4 bg-white border-l border-t border-shwe-gold transform rotate-45 
            ${stepData.position === 'sidebar-top' ? 'left-[-9px] top-8' : ''}
            ${stepData.position === 'sidebar-bottom' ? 'left-[-9px] bottom-8' : ''}
            ${stepData.position === 'input-area' ? 'left-[-9px] top-8' : ''}
            ${stepData.position === 'output-area' ? 'right-[-9px] top-8 border-l-0 border-t border-r border-shwe-gold' : ''}
          `}></div>
        )}
      </div>
    </div>
  );
};