import React, { useState, useRef } from 'react';
import { analyzeSecurityContent } from './services/geminiService';
import { AnalysisState, SecurityModule, RiskLevel, FraudTypeGuide } from './types';
import AnalysisView from './components/AnalysisView';
import { 
  Heart, Newspaper, Mail, Link as LinkIcon, CreditCard, 
  MessageSquare, ShieldCheck, ChevronLeft, Upload, Loader2,
  PhoneCall, ExternalLink, Globe, AlertTriangle, ShieldAlert,
  ArrowRight, Info, Eye, BookOpen, AlertOctagon, UserX,
  Smartphone, Wallet, Lock, HelpCircle, Video, Briefcase,
  Users, Siren, CheckCircle, HelpCircle as HelpIcon,
  Menu, X, Book, Sparkles, Key, Cpu, Shield, Award, Landmark, Gavel,
  Radio, Flame, Megaphone
} from 'lucide-react';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<SecurityModule>(SecurityModule.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scamAlerts = [
    {
      title: "🚨 The 'Digital Arrest' Scam",
      desc: "Scammers pose as CBI or Police on Video Calls, claiming you are under 'Digital Arrest' for a package containing illegal items.",
      danger: "HIGH",
      action: "Hang up! Police never conduct arrests over Skype or WhatsApp."
    },
    {
      title: "📦 Fedex/Courier Phishing",
      desc: "You get a call saying your package is seized by customs and you must pay 'clearance fees' immediately.",
      danger: "MEDIUM",
      action: "Check official tracking. Never pay customs via UPI to individuals."
    },
    {
      title: "⚡ Electricity Bill Threat",
      desc: "SMS warning that your power will be cut tonight unless you call a specific mobile number to update your bill.",
      danger: "HIGH",
      action: "Always use official apps like Tata Power, BSES, or your state board app for payments."
    }
  ];

  const officialGovLinks = [
    { name: "Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in", desc: "Official GOI portal to file cyber complaints." },
    { name: "RBI Kehta Hai", url: "https://rbikehtahai.rbi.org.in", desc: "RBI's official digital safety awareness site." },
    { name: "CERT-In (Cyber Emergency)", url: "https://www.cert-in.org.in", desc: "National nodal agency for cyber security." },
    { name: "NPCI Safety Portal", url: "https://www.npci.org.in", desc: "Official guidelines for UPI and card safety." }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!inputText && !selectedImage) {
      setAnalysisState(prev => ({ ...prev, error: "Please provide the details you wish to verify." }));
      return;
    }
    setAnalysisState({ isAnalyzing: true, result: null, error: null });
    try {
      const result = await analyzeSecurityContent(currentModule, inputText, selectedImage || undefined);
      setAnalysisState({ isAnalyzing: false, result, error: null });
    } catch (err) {
      setAnalysisState({ isAnalyzing: false, result: null, error: "Sorry, I had trouble checking that. Let's try again." });
    }
  };

  const resetAll = () => {
    setInputText('');
    setSelectedImage(null);
    setAnalysisState({ isAnalyzing: false, result: null, error: null });
    setIsMenuOpen(false);
  };

  const goHome = () => {
    resetAll();
    setCurrentModule(SecurityModule.HOME);
  };

  const analysisButtons = [
    { id: SecurityModule.NEWS, label: "Verify News", icon: <Newspaper className="w-10 h-10" />, color: "bg-red-600", desc: "Is this viral news real?" },
    { id: SecurityModule.PAYMENT, label: "Scan QR/Bill", icon: <CreditCard className="w-10 h-10" />, color: "bg-rose-600", desc: "Is this payment safe?" },
    { id: SecurityModule.MEETING_LINK, label: "Meeting Link", icon: <Video className="w-10 h-10" />, color: "bg-red-800", desc: "Check Zoom/Meet safety" },
    { id: SecurityModule.JOB_FRAUD, label: "Job Offer", icon: <Briefcase className="w-10 h-10" />, color: "bg-slate-700", desc: "Verify work offers" },
  ];

  return (
    <div className="min-h-screen pb-32">
      <nav className="glass-card sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
          <div className="bg-red-600 p-2 rounded-xl shadow-md">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Raksha Sutra</h1>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none">Security Suite</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-red-50 rounded-full text-red-600 hover:bg-red-100 transition-all border border-red-100"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-12">
            <h2 className="text-5xl font-black text-slate-700 text-center mb-12">Navigation Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <button 
                onClick={() => { setCurrentModule(SecurityModule.ABOUT_US); setIsMenuOpen(false); }}
                className="flex flex-col items-center p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm hover:border-red-500 hover:-translate-y-1 transition-all group"
              >
                <div className="p-6 bg-red-50 rounded-3xl text-red-600 mb-6 group-hover:scale-105 transition-transform">
                  <Users className="w-12 h-12" />
                </div>
                <span className="text-3xl font-black text-slate-700">About Us</span>
              </button>
              <button 
                onClick={() => { setCurrentModule(SecurityModule.WHY_US); setIsMenuOpen(false); }}
                className="flex flex-col items-center p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm hover:border-red-500 hover:-translate-y-1 transition-all group"
              >
                <div className="p-6 bg-amber-50 rounded-3xl text-amber-600 mb-6 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-12 h-12" />
                </div>
                <span className="text-3xl font-black text-slate-700">Why Us</span>
              </button>
              <button 
                onClick={() => { setCurrentModule(SecurityModule.GUIDELINES); setIsMenuOpen(false); }}
                className="flex flex-col items-center p-10 bg-white border border-slate-200 rounded-[3rem] shadow-sm hover:border-red-500 hover:-translate-y-1 transition-all group"
              >
                <div className="p-6 bg-blue-50 rounded-3xl text-blue-600 mb-6 group-hover:scale-105 transition-transform">
                  <Book className="w-12 h-12" />
                </div>
                <span className="text-3xl font-black text-slate-700">Playbook</span>
              </button>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black text-2xl shadow-lg hover:bg-red-700 transition-colors"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {currentModule === SecurityModule.HOME ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            <header className="relative overflow-hidden rounded-[2.5rem] hero-gradient text-white p-10 md:p-14 shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full inline-block mb-4 text-xs font-bold uppercase tracking-wider">
                  ELDER PROTECTION NETWORK
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Safety in Every Tap.</h2>
                <p className="text-lg md:text-xl text-white/90 font-medium mb-8">
                  Protect your digital life from threats. Use Raksha Sutra to verify messages, videos, and links with ease.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setCurrentModule(SecurityModule.VICTIM_HELP)} className="bg-white text-red-700 px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:bg-slate-50 transition-all flex items-center gap-2">
                    <Siren className="w-6 h-6" />
                    Emergency Support
                  </button>
                  <button onClick={() => setCurrentModule(SecurityModule.AWARENESS_HUB)} className="bg-red-950/20 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Latest Alerts
                  </button>
                </div>
              </div>
              <ShieldAlert className="absolute -bottom-16 -right-16 w-80 h-80 text-white/5 rotate-12" />
            </header>

            {/* Quick Awareness Section */}
            <section className="bg-red-50 border border-red-100 p-8 rounded-[2rem]">
               <div className="flex items-center gap-3 mb-6">
                 <Megaphone className="text-red-600 w-8 h-8" />
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">Breaking Scam Alerts</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {scamAlerts.slice(0, 3).map((alert, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all">
                       <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold mb-3 inline-block">{alert.danger} RISK</span>
                       <h4 className="font-bold text-slate-800 mb-2">{alert.title}</h4>
                       <p className="text-sm text-slate-500 mb-4">{alert.desc}</p>
                       <p className="text-sm text-red-700 font-bold bg-red-50 p-2 rounded-lg italic">" {alert.action} "</p>
                    </div>
                  ))}
               </div>
               <button onClick={() => setCurrentModule(SecurityModule.AWARENESS_HUB)} className="mt-6 text-red-600 font-bold flex items-center gap-2 hover:underline">
                 View All Latest Scam News <ArrowRight className="w-4 h-4" />
               </button>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Protective Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysisButtons.map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => setCurrentModule(btn.id)}
                    className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-3xl hover:border-red-400 hover:shadow-lg transition-all active:scale-[0.98] group text-left"
                  >
                    <div className={`${btn.color} p-4 rounded-xl text-white mb-4 shadow-sm`}>
                      {btn.icon}
                    </div>
                    <span className="text-xl font-bold text-slate-800">{btn.label}</span>
                    <span className="text-sm text-slate-500">{btn.desc}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : currentModule === SecurityModule.ABOUT_US ? (
          <div className="animate-in slide-in-from-bottom-10 duration-500 space-y-10">
            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-lg border border-slate-100 relative overflow-hidden">
               <button onClick={goHome} className="absolute top-8 right-8 bg-slate-50 p-4 rounded-full text-slate-400 hover:text-red-700 transition-all active:scale-90 border border-slate-100">
                 <ChevronLeft className="w-8 h-8" />
               </button>
               <h3 className="text-4xl font-black text-slate-700 mb-8">About the Creators</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                    <div>
                       <h4 className="text-4xl font-black text-red-700">Madhav Nauriyal & Aarav Sharma</h4>
                       <p className="text-2xl font-bold text-slate-600">1st Year B.Tech Undergraduates</p>
                       <p className="text-xl font-bold text-slate-400 uppercase tracking-widest mt-2">Graphic Era Deemed to be University, Dehradun</p>
                    </div>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                      Raksha Sutra is an initiative founded by Madhav and Aarav, two passionate engineering students who saw the urgent need for a digital safety net for Indian elders.
                    </p>
                    <div className="bg-red-50/50 p-8 rounded-[2.5rem] border-l-8 border-red-700">
                      <p className="text-red-900 font-bold italic text-lg leading-relaxed">
                        "Engineering is most powerful when it serves those who are most vulnerable. This is our contribution to a safer Bharat."
                      </p>
                    </div>
                 </div>
                 <div className="relative">
                   <div className="rounded-[4rem] overflow-hidden shadow-xl border-4 border-white bg-slate-50 aspect-square">
                      <img 
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=800&fit=crop" 
                        alt="Creators collaborating" 
                        className="w-full h-full object-cover grayscale-[15%] opacity-90"
                      />
                   </div>
                 </div>
               </div>
            </div>
          </div>
        ) : currentModule === SecurityModule.WHY_US ? (
          <div className="animate-in slide-in-from-bottom-10 duration-500 space-y-10">
            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-lg border border-slate-100 relative overflow-hidden">
               <button onClick={goHome} className="absolute top-8 right-8 bg-slate-50 p-4 rounded-full text-slate-400 hover:text-red-700 transition-all border border-slate-100">
                 <ChevronLeft className="w-8 h-8" />
               </button>
               <h3 className="text-4xl font-black text-slate-700 mb-8 text-center">Unmatched Digital Guardianship</h3>
               <div className="max-w-4xl mx-auto mb-16">
                 <div className="bg-red-50/30 p-12 rounded-[3.5rem] border border-red-100 relative text-center">
                   <p className="text-2xl text-slate-700 leading-relaxed font-semibold italic">
                     "While generic security tools provide broad protection, Raksha Sutra is surgically precise—engineered specifically for the Indian elder. We don't just detect threats; we decode the triggers used by local scammers."
                   </p>
                   <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-amber-500" />
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:border-red-300 transition-all text-center">
                    <Shield className="w-12 h-12 text-red-600 mx-auto mb-6" />
                    <h4 className="text-2xl font-black text-slate-700 mb-4">India-Nuance AI</h4>
                    <p className="text-slate-500 font-medium">Trained on local scams like KBC lottery and 'Digital Arrest'.</p>
                  </div>
                  <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:border-red-300 transition-all text-center">
                    <Eye className="w-12 h-12 text-rose-600 mx-auto mb-6" />
                    <h4 className="text-2xl font-black text-slate-700 mb-4">High Legibility</h4>
                    <p className="text-slate-500 font-medium">Interface specifically tuned for elder vision health and high readability.</p>
                  </div>
                  <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:border-red-300 transition-all text-center">
                    <Landmark className="w-12 h-12 text-red-800 mx-auto mb-6" />
                    <h4 className="text-2xl font-black text-slate-700 mb-4">Govt Pathways</h4>
                    <p className="text-slate-500 font-medium">Seamless integration with official Indian reporting portals like 1930.</p>
                  </div>
               </div>
            </div>
          </div>
        ) : currentModule === SecurityModule.GUIDELINES ? (
          <div className="animate-in slide-in-from-bottom-10 duration-500 space-y-12 pb-24">
            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-lg border border-slate-100 relative overflow-hidden">
               <button onClick={goHome} className="absolute top-8 right-8 bg-slate-50 p-4 rounded-full text-slate-400 hover:text-red-700 transition-all border border-slate-100">
                 <ChevronLeft className="w-8 h-8" />
               </button>
               <div className="text-center mb-16">
                 <span className="bg-red-50 text-red-700 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-6 inline-block">Official Literacy Playbook</span>
                 <h3 className="text-5xl font-black text-slate-700">Digital Safety Protocol</h3>
               </div>
               <div className="space-y-20">
                  <section className="bg-red-50/20 rounded-[4rem] p-12 border border-red-100">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      <div className="md:w-1/3">
                        <div className="bg-red-700 text-white p-8 rounded-[3rem] shadow-md mb-6">
                          <Smartphone className="w-16 h-16 mb-4" />
                          <h4 className="text-3xl font-black">UPI Safety</h4>
                        </div>
                      </div>
                      <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                          <h5 className="text-2xl font-black text-slate-700 underline decoration-red-500 underline-offset-8">The Golden Rule</h5>
                          <p className="text-xl text-slate-600 font-medium">Entering your <span className="text-red-700 font-black">UPI PIN</span> always means money is leaving your account. Receiving money NEVER requires a PIN.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-slate-700 text-white rounded-3xl shadow-md">
                        <Gavel className="w-10 h-10" />
                      </div>
                      <h4 className="text-4xl font-black text-slate-700">Official Channels</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {officialGovLinks.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-red-500 hover:shadow-lg transition-all group">
                           <div className="space-y-2 pr-4">
                             <h5 className="text-2xl font-black text-slate-700 group-hover:text-red-700 transition-colors">{link.name}</h5>
                             <p className="text-slate-500 font-medium text-lg">{link.desc}</p>
                           </div>
                           <ExternalLink className="w-8 h-8 text-slate-300 group-hover:text-red-700 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </section>
               </div>
            </div>
          </div>
        ) : currentModule === SecurityModule.AWARENESS_HUB ? (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
             <div className="flex items-center justify-between">
                <button onClick={goHome} className="flex items-center gap-2 text-red-600 font-bold hover:underline">
                  <ChevronLeft className="w-5 h-5" /> Back to Home
                </button>
                <h2 className="text-3xl font-black text-slate-800">Scam Awareness Hub</h2>
             </div>
             <div className="space-y-8">
               {scamAlerts.map((alert, idx) => (
                 <div key={idx} className="bg-white rounded-[2rem] border-2 border-slate-100 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:border-red-200 transition-all">
                    <div className="bg-red-50 p-6 rounded-[2rem] text-red-600 flex-shrink-0">
                      <Flame className="w-12 h-12" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <h3 className="text-2xl font-black text-slate-800">{alert.title}</h3>
                         <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded-full uppercase tracking-tighter">Verified Threat</span>
                       </div>
                       <p className="text-xl text-slate-600 leading-relaxed font-medium">{alert.desc}</p>
                       <div className="bg-red-600/5 p-6 rounded-2xl border-l-4 border-red-600">
                          <p className="text-slate-700 font-black mb-2">Safety Tip:</p>
                          <p className="text-lg text-red-800 font-bold">{alert.action}</p>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        ) : analysisState.result ? (
          <AnalysisView result={analysisState.result} onReset={resetAll} />
        ) : (
          <div className="animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200 relative overflow-hidden">
              <button onClick={goHome} className="absolute top-8 right-8 bg-slate-100 p-2 rounded-lg text-slate-400 hover:text-red-600 transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${analysisButtons.find(b => b.id === currentModule)?.color || 'bg-red-600'} p-4 rounded-xl text-white shadow-sm`}>
                    {analysisButtons.find(b => b.id === currentModule)?.icon || <ShieldCheck className="w-8 h-8" />}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">
                    {analysisButtons.find(b => b.id === currentModule)?.label || "Analyzing" }
                  </h3>
                </div>
                <p className="text-lg text-slate-500 font-medium">Please share the details you want me to check for you.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Paste the content here:</label>
                  <textarea
                    className="w-full h-48 p-6 rounded-2xl border border-slate-200 bg-slate-50 text-xl focus:border-red-500 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="Paste message, link, or description..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Attach a photo (Optional):</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-40 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-red-50 hover:border-red-400 ${selectedImage ? 'bg-red-50 border-red-500' : 'bg-slate-50'}`}
                  >
                    {selectedImage ? (
                      <img src={selectedImage} alt="Preview" className="h-full object-contain p-2 rounded-xl" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-slate-400 mb-2" />
                        <p className="text-sm font-bold text-slate-400">Add Image / Screenshot</p>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                </div>

                {analysisState.error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    {analysisState.error}
                  </div>
                )}

                <button
                  onClick={runAnalysis}
                  disabled={analysisState.isAnalyzing || (!inputText && !selectedImage)}
                  className="w-full py-6 rounded-2xl bg-red-600 text-white font-bold text-xl flex items-center justify-center gap-4 shadow-lg hover:bg-red-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {analysisState.isAnalyzing ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Checking Carefully...</>
                  ) : (
                    <>Analyze Safety Now <ArrowRight className="w-6 h-6" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
        <div className="glass-card rounded-2xl px-8 py-4 flex items-center justify-around shadow-lg border border-red-100">
           <button onClick={goHome} className={`p-2 rounded-lg transition-all ${currentModule === SecurityModule.HOME ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-red-50'}`}>
             <ShieldCheck className="w-7 h-7" />
           </button>
           <button onClick={() => setCurrentModule(SecurityModule.AWARENESS_HUB)} className={`p-2 rounded-lg transition-all ${currentModule === SecurityModule.AWARENESS_HUB ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-red-50'}`}>
             <Radio className="w-7 h-7" />
           </button>
           <button onClick={() => setCurrentModule(SecurityModule.VICTIM_HELP)} className={`p-2 rounded-lg transition-all ${currentModule === SecurityModule.VICTIM_HELP ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-red-50'}`}>
             <HelpCircle className="w-7 h-7" />
           </button>
           <button onClick={() => setCurrentModule(SecurityModule.GUIDELINES)} className={`p-2 rounded-lg transition-all ${currentModule === SecurityModule.GUIDELINES ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-red-50'}`}>
             <BookOpen className="w-7 h-7" />
           </button>
        </div>
      </footer>
    </div>
  );
};

export default App;