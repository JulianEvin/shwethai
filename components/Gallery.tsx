import React, { useState } from 'react';
import { StoredImage } from '../types';

interface GalleryProps {
  images: StoredImage[];
  onDelete: (id: string) => void;
  onReuse: (prompt: string) => void;
  onView: (image: StoredImage, initialFilter: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, onDelete, onReuse, onView }) => {
  const [activeFilter, setActiveFilter] = useState<string>('none');

  const filters = [
    { id: 'none', label: 'Original', class: '' },
    { id: 'grayscale', label: 'B&W', class: 'grayscale' },
    { id: 'sepia', label: 'Sepia', class: 'sepia' },
    { id: 'warm', label: 'Warm', class: 'sepia-[.5] contrast-100' },
    { id: 'cool', label: 'Cool', class: 'hue-rotate-180 saturate-50' },
    { id: 'vintage', label: 'Vintage', class: 'sepia-[.3] contrast-125 brightness-90' },
    { id: 'blur', label: 'Blur', class: 'blur-[2px]' },
  ];

  const currentFilterClass = filters.find(f => f.id === activeFilter)?.class || '';

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[400px] bg-white rounded-2xl border border-gray-200 border-dashed">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="font-medium text-gray-500">No images generated yet.</p>
        <p className="text-sm mt-1">Go to the Image Generator to create some visuals!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Image Gallery</h2>
           <p className="text-sm text-gray-500 mt-1">Stored locally in your browser</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                <span className="text-xs font-bold text-gray-400 px-2 uppercase">Filter View:</span>
                <select 
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="bg-white text-sm border-none rounded-md py-1 pl-2 pr-8 focus:ring-0 text-gray-700 font-medium cursor-pointer outline-none"
                >
                  {filters.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-semibold text-gray-700">{images.length} saved</span>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 overflow-hidden group flex flex-col">
            <div 
              className="relative aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
              onClick={() => onView(img, currentFilterClass)}
            >
              <img 
                src={img.data} 
                alt={img.prompt} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${currentFilterClass}`} 
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-2 px-4">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onView(img, currentFilterClass); }}
                  className="p-2.5 bg-white rounded-full text-gray-700 hover:text-thai-600 shadow-lg hover:scale-110 transition-all"
                  title="View in Creative Studio"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
                <a 
                  href={img.data} 
                  download={`shwethai-${img.timestamp}.png`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 bg-white rounded-full text-gray-700 hover:text-thai-600 shadow-lg hover:scale-110 transition-all"
                  title="Download Original"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReuse(img.prompt); }}
                  className="p-2.5 bg-white rounded-full text-blue-600 hover:text-blue-700 shadow-lg hover:scale-110 transition-all"
                  title="Reuse Prompt"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (window.confirm("Are you sure you want to delete this image? (ဖျက်မှာသေချာပါသလား)")) {
                        onDelete(img.id); 
                    }
                  }}
                  className="p-2.5 bg-white rounded-full text-red-500 hover:text-red-600 shadow-lg hover:scale-110 transition-all"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3 leading-relaxed" title={img.prompt}>{img.prompt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Generated</span>
                <p className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">{new Date(img.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};