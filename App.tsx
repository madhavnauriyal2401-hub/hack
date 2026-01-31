
import React, { useState, useRef } from 'react';
import { analyzeContent } from './services/geminiService';
import { AnalysisState } from './types';
import AnalysisView from './components/AnalysisView';
import { Search, Upload, Heart, Newspaper, Video, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!inputText && !selectedImage) {
      setAnalysisState(prev => ({ ...prev, error: "Please paste a message or upload a photo first." }));
      return;
    }

    setAnalysisState({ isAnalyzing: true, result: null, error: null });

    try {
      const result = await analyzeContent(inputText, selectedImage || undefined);
      setAnalysisState({ isAnalyzing: false, result, error: null });
    } catch (err) {
      console.error(err);
      setAnalysisState({ 
        isAnalyzing: false, 
        result: null, 
        error: "My apologies, something went wrong. Could you please try once more?" 
      });
    }
  };

  const reset = () => {
    setInputText('');
    setSelectedImage(null);
    setAnalysisState({ isAnalyzing: false, result: null, error: null });
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-5 py-10 pb-20">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500 rounded-[2rem] mb-5 shadow-2xl shadow-rose-200">
          <Heart className="text-white w-10 h-10 fill-rose-300" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Raksha Sutra</h1>
        <p className="text-2xl text-slate-500 mt-3 font-semibold">Keeping You Safe & Informed</p>
      </header>

      {!analysisState.result ? (
        <div className="space-y-10 animate-in fade-in duration-700">
          {/* Instructions for Seniors */}
          <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-3">
              <Newspaper className="w-7 h-7 text-blue-500" />
              Namaste! How can I help?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              If you receive a message that worries you, or see a news video that looks strange, just share it with me. I will check if it's true or if you should be careful.
            </p>
          </div>

          {/* Text Input */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 ml-2">
              <Search className="w-6 h-6 text-slate-400" />
              <label className="text-2xl font-extrabold text-slate-700">Paste a Message</label>
            </div>
            <textarea
              className="w-full h-44 p-6 rounded-[2.5rem] border-3 border-slate-200 bg-white text-2xl focus:border-rose-400 focus:ring-8 focus:ring-rose-50 transition-all outline-none resize-none shadow-sm placeholder:text-slate-300"
              placeholder="Example: 'Click this link for free gifts!'"
              value={inputText}
              onChange={handleTextChange}
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 ml-2">
              <Video className="w-6 h-6 text-slate-400" />
              <label className="text-2xl font-extrabold text-slate-700">Or Show Me a Photo</label>
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-56 rounded-[2.5rem] border-3 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all ${selectedImage ? 'border-rose-400 bg-rose-50' : 'bg-white'}`}
            >
              {selectedImage ? (
                <div className="relative w-full h-full p-3">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                  <div className="absolute inset-0 bg-black/50 rounded-[2rem] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold text-xl">Tap to change photo</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-14 h-14 text-slate-300 mb-3" />
                  <p className="text-xl font-bold text-slate-500">Tap to pick a picture</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,video/*"
              />
            </div>
          </div>

          {/* Error Message */}
          {analysisState.error && (
            <div className="flex items-center gap-4 p-5 bg-rose-50 border-2 border-rose-100 rounded-[2rem] text-rose-700">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <p className="font-bold text-xl">{analysisState.error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={runAnalysis}
            disabled={analysisState.isAnalyzing || (!inputText && !selectedImage)}
            className={`w-full py-7 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${
              analysisState.isAnalyzing ? 'bg-slate-200 text-slate-500' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200'
            }`}
          >
            {analysisState.isAnalyzing ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin" />
                Checking Carefully...
              </>
            ) : (
              <>
                Check Now
                <ArrowRight className="w-10 h-10" />
              </>
            )}
          </button>
        </div>
      ) : (
        <AnalysisView result={analysisState.result} onReset={reset} />
      )}

      {/* Footer Info */}
      <footer className="mt-20 pt-10 border-t-2 border-slate-100 text-center text-slate-400 pb-12">
        <div className="flex justify-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-rose-300 fill-rose-100" />
          <p className="text-base font-bold uppercase tracking-widest">Built with love for our elders</p>
        </div>
        <p className="text-sm mt-2 px-12 leading-relaxed font-medium">Raksha Sutra is your guardian against digital harm. Always consult family for important decisions.</p>
      </footer>
    </div>
  );
};

export default App;
