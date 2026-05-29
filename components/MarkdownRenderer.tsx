
import React from 'react';

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const paragraphs = cleanText.split('\n');

  return (
    <div className="font-burmese text-gray-800 leading-relaxed tracking-wide text-lg">
      {paragraphs.map((paragraph, idx) => {
        const trimmed = paragraph.trim();
        
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-thai-600 mt-6 mb-2 border-l-4 border-thai-600 pl-3 bg-thai-50/50 py-1">{trimmed.replace('### ', '')}</h3>
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-3 border-b-2 border-gray-100 pb-2">{trimmed.replace('## ', '')}</h2>
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-extrabold text-gray-900 mt-10 mb-4 bg-gradient-to-r from-thai-50 to-transparent p-2 rounded">{trimmed.replace('# ', '')}</h1>
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
           return <li key={idx} className="ml-6 list-disc my-1 pl-2 text-gray-700">{formatLine(trimmed.substring(2))}</li>
        }
        
        if (trimmed === '') return <div key={idx} className="h-2" />;

        // Enhanced Script/Narration Cues Detection
        if (trimmed.includes('[') && trimmed.includes(']')) {
           return (
             <div key={idx} className="bg-shwe-50 border-l-4 border-shwe-gold p-3 my-4 rounded-r-lg italic text-shwe-900 text-base shadow-sm font-medium">
               {formatLine(trimmed)}
             </div>
           );
        }

        return <p key={idx} className="mb-3 text-gray-800">{formatLine(paragraph)}</p>;
      })}
    </div>
  );
};

const formatLine = (line: string) => {
  // Support for narration cues highlighting inside text lines
  const parts = line.split(/(\[.*?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return <span key={i} className="text-thai-600 font-bold bg-thai-50 px-1 rounded mx-1">{part}</span>;
    }
    return part;
  });
};

export default FormattedText;
