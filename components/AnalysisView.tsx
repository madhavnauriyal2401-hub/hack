
import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import Gauge from './Gauge';
import { Heart, AlertCircle, CheckCircle2, ExternalLink, RefreshCw, Info } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  const getHeaderStyle = () => {
    switch (result.riskFactor) {
      case RiskLevel.LOW: return { icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" />, bg: 'bg-emerald-50' };
      case RiskLevel.MEDIUM: return { icon: <AlertCircle className="w-16 h-16 text-amber-500" />, bg: 'bg-amber-50' };
      case RiskLevel.HIGH: return { icon: <Heart className="w-16 h-16 text-rose-500" />, bg: 'bg-rose-50' };
      default: return { icon: <Info className="w-16 h-16 text-slate-500" />, bg: 'bg-slate-50' };
    }
  };

  const { icon, bg } = getHeaderStyle();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      {/* Care Message - Prominent for High Risk */}
      {result.riskFactor !== RiskLevel.LOW && (
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-[2.5rem] shadow-sm flex gap-4 items-start">
          <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
            <Heart className="w-8 h-8 text-orange-600 fill-orange-200" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-900 mb-1">A Word of Care</h3>
            <p className="text-lg text-orange-800 leading-relaxed font-medium italic">
              "{result.careMessage}"
            </p>
          </div>
        </div>
      )}

      {/* Main Analysis Header */}
      <div className={`flex flex-col items-center text-center p-8 ${bg} rounded-[2.5rem] border border-white/50 shadow-sm`}>
        {icon}
        <h2 className="mt-4 text-3xl font-extrabold text-slate-800 leading-tight">{result.headline}</h2>
        <div className="mt-4 h-1 w-20 bg-slate-200 rounded-full"></div>
        <p className="mt-6 text-xl text-slate-700 leading-relaxed font-medium">
          {result.summary}
        </p>
      </div>

      {/* Safety Gauge */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-hidden">
        <Gauge score={result.riskScore} level={result.riskFactor} />
        
        <div className={`mt-8 p-6 rounded-3xl text-center border-2 ${
          result.riskFactor === RiskLevel.LOW ? 'bg-emerald-500 border-emerald-400 text-white' : 
          result.riskFactor === RiskLevel.MEDIUM ? 'bg-amber-500 border-amber-400 text-white' : 
          'bg-rose-500 border-rose-400 text-white'
        } shadow-lg shadow-black/5`}>
          <span className="text-2xl font-bold">{result.verdict}</span>
        </div>
      </div>

      {/* Reasons List */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-500" />
          What I found:
        </h3>
        <ul className="space-y-5">
          {result.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <div className="mt-2 w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-400 flex-shrink-0" />
              <p className="text-xl text-slate-700 leading-snug">{reason}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources */}
      {result.sources.length > 0 && (
        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Trusted Websites to Read More:</h3>
          <div className="space-y-4">
            {result.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <span className="text-lg font-bold text-slate-700 line-clamp-1">{source.title}</span>
                <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-bold text-2xl flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-95 shadow-xl"
      >
        <RefreshCw className="w-7 h-7" />
        Check Another One
      </button>
    </div>
  );
};

export default AnalysisView;
