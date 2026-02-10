import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import Gauge from './Gauge';
import { Heart, AlertCircle, CheckCircle2, ExternalLink, RefreshCw, Info, ShieldAlert, ShieldCheck, Globe } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  const getHeaderStyle = () => {
    switch (result.riskFactor) {
      case RiskLevel.LOW: return { icon: <CheckCircle2 className="w-16 h-16 text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case RiskLevel.MEDIUM: return { icon: <AlertCircle className="w-16 h-16 text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-100' };
      case RiskLevel.HIGH: return { icon: <ShieldAlert className="w-16 h-16 text-red-600" />, bg: 'bg-red-50', border: 'border-red-100' };
      default: return { icon: <Info className="w-16 h-16 text-slate-500" />, bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  const { icon, bg, border } = getHeaderStyle();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Care Message */}
      {result.riskFactor !== RiskLevel.LOW && (
        <div className="bg-red-700 p-8 rounded-3xl shadow-lg text-white flex gap-6 items-start relative overflow-hidden">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl flex-shrink-0 z-10">
            <Heart className="w-8 h-8 fill-white text-white" />
          </div>
          <div className="z-10">
            <h3 className="text-xl font-bold mb-1 tracking-tight">Expert Protective Advice</h3>
            <p className="text-lg leading-relaxed font-bold opacity-90 italic">
              "{result.careMessage}"
            </p>
          </div>
          <Heart className="absolute -bottom-10 -right-10 w-40 h-40 text-white/10" />
        </div>
      )}

      {/* Main Verdict Card */}
      <div className={`p-8 lg:p-12 ${bg} border-2 ${border} rounded-[2.5rem] shadow-md text-center`}>
        <div className="flex justify-center mb-4">{icon}</div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">{result.headline}</h2>
        <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
          {result.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Gauge */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col items-center">
          <Gauge score={result.riskScore} level={result.riskFactor} />
          <div className={`mt-6 w-full p-4 rounded-xl text-center border-2 font-black text-lg ${
            result.riskFactor === RiskLevel.LOW ? 'bg-emerald-700 border-emerald-600 text-white' : 
            result.riskFactor === RiskLevel.MEDIUM ? 'bg-amber-600 border-amber-500 text-white' : 
            'bg-red-700 border-red-600 text-white'
          }`}>
            {result.verdict}
          </div>
        </div>

        {/* Detailed Points */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            Security Findings
          </h3>
          <ul className="space-y-4">
            {result.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-2 w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                <p className="text-slate-600 font-bold">{reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grounding Sources */}
      {result.sources.length > 0 && (
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-red-500" />
            Verified Evidence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <span className="text-sm font-bold text-white/90 line-clamp-1 group-hover:underline">{source.title}</span>
                <ExternalLink className="w-4 h-4 text-red-500 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-6 bg-red-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-red-800 shadow-lg transition-all active:scale-[0.98]"
      >
        <RefreshCw className="w-6 h-6" />
        Analyze Something Else
      </button>
    </div>
  );
};

export default AnalysisView;