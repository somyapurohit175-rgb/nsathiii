
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import RiskBadge from './components/RiskBadge';
import LawCard from './components/LawCard';
import QuizWidget from './components/QuizWidget';
import { MOCK_LAWS, LEGAL_DISCLAIMER, APP_NAME, LEGAL_FACTS } from './constants';
import { RiskLevel, AnalysisResult, QuizQuestion, LawReference } from './types';
import { analyzeLegalDocument, generateQuiz, performDeepResearch, fetchLegalNews } from './services/geminiService';

const POPULAR_SEARCHES = [
  "Murder Punishment",
  "Cheating IPC 420",
  "Theft",
  "BNS 103",
  "Defamation",
  "Stalking Law",
  "Dowry Prohibition",
  "Digital Data Privacy"
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [docText, setDocText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [factIndex, setFactIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep Research State
  const [researchQuery, setResearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<{ text: string, sources: any[] } | null>(null);

  // News State
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Lawyer Form State
  const [lawyerForm, setLawyerForm] = useState({
    name: '',
    email: '',
    phone: '',
    problem: ''
  });
  const [isSubmittingLawyer, setIsSubmittingLawyer] = useState(false);

  // Dark Mode Handler
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nyaya_theme', newMode ? 'dark' : 'light');
  };

  // Initial Theme Load
  useEffect(() => {
    const savedTheme = localStorage.getItem('nyaya_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nyaya_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch News when entering the view
  useEffect(() => {
    if (activeView === 'news' && newsArticles.length === 0) {
      handleFetchNews();
    }
  }, [activeView]);

  // Rotate Legal Facts every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % LEGAL_FACTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleFetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const news = await fetchLegalNews();
      setNewsArticles(news);
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Text-to-Speech implementation
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setDocText(''); 
    } else if (file) {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleAnalyze = async () => {
    if (!docText.trim() && !selectedFile) return;
    
    setIsAnalyzing(true);
    try {
      let result;
      if (selectedFile) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = await analyzeLegalDocument(`Summary of the uploaded document: ${selectedFile.name}. This is a simulated analysis of the PDF content.`);
      } else {
        result = await analyzeLegalDocument(docText);
      }
      
      setAnalysisResult(result);
      const quiz = await generateQuiz(result.summary);
      setQuizQuestions(quiz);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Analysis failed. Please check your API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeepResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchQuery.trim()) return;

    setIsResearching(true);
    try {
      const result = await performDeepResearch(researchQuery);
      setResearchResult(result);
    } catch (error) {
      console.error("Research failed", error);
      alert("Legal research failed. Please check your API key.");
    } finally {
      setIsResearching(false);
    }
  };

  const handleLawyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lawyerForm.problem.length < 50) {
      alert("Please describe your problem in at least 50 characters.");
      return;
    }
    
    setIsSubmittingLawyer(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmittingLawyer(false);
      alert("Your request has been submitted. A legal partner will contact you soon.");
      setLawyerForm({ name: '', email: '', phone: '', problem: '' });
      setActiveView('dashboard');
    }, 1500);
  };

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('nyaya_recent_searches', JSON.stringify(updated));
  };

  // Search Logic - Returns a flat list
  const filteredLaws = MOCK_LAWS.filter(law => 
    law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.act.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col pt-4 transition-colors duration-500">
      <Navbar onNavigate={setActiveView} activeView={activeView} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* GLOBAL DISCLAIMER */}
        {showDisclaimer && (
          <div className="glass rounded-xl border-l-2 border-amber-400 p-3 mb-6 animate-fadeIn apple-shadow dark:border-amber-500/50 flex justify-between items-start">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{LEGAL_DISCLAIMER}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors ml-4"
              aria-label="Close disclaimer"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {activeView === 'dashboard' && (
          <div className="space-y-12 animate-fadeIn">
            <header className="text-center space-y-4">
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-6xl devanagari drop-shadow-sm transition-colors duration-500">
                न्यायSAATHI
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                Democratizing Indian justice through AI.
              </p>
            </header>

            {/* Rotating Law Fact Section */}
            <div className="glass-dark rounded-3xl p-10 apple-shadow max-w-4xl mx-auto relative overflow-hidden group border border-white/60 dark:border-white/10 transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
              <div className="flex items-start space-x-8 animate-fadeIn" key={factIndex}>
                <div className="bg-indigo-600 text-white rounded-2xl p-4 flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em]">Legal Insights</h3>
                  <p className="text-2xl text-gray-800 dark:text-white font-bold leading-tight transition-colors duration-500">
                    {LEGAL_FACTS[factIndex]}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
              {[
                { title: 'Simplify Docs', desc: 'Scan contracts & notices for risks.', icon: '📄', view: 'analyze' },
                { title: 'Deep Research', desc: 'Legal precedents & scholarship.', icon: '🔍', view: 'deep-research' },
                { title: 'Search Laws', desc: 'Browse the full IPC/BNS database.', icon: '⚖️', view: 'search' },
                { title: 'Word Coach', desc: 'Master law with AI quizzes.', icon: '🎓', view: 'learn' },
              ].map((card, i) => (
                <div key={i} onClick={() => setActiveView(card.view)} className="glass p-8 rounded-3xl apple-shadow hover:scale-[1.03] transition-all cursor-pointer group border border-white/50 dark:border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="text-5xl mb-6 group-hover:rotate-12 transition-transform">{card.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fadeIn">
            <div className="space-y-8">
              <div className="glass rounded-3xl p-8 border border-white/50 dark:border-white/10 apple-shadow transition-all duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Analysis</h2>
                  <div className="bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Engine v1.2</div>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all text-center mb-8 ${
                    selectedFile 
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' 
                      : 'border-white/60 dark:border-white/10 hover:border-indigo-400 hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  <input type="file" className="hidden" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} />
                  {!selectedFile ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white/80 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-200">Drop PDF here</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Notices, Contracts, FIRs</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white/50 dark:bg-white/10 p-4 rounded-xl border border-white/40 dark:border-white/10">
                      <div className="flex items-center text-left">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mr-4 font-black text-xs">PDF</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white/80 dark:bg-white/5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative mb-8 text-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-white/40 dark:border-white/10"></div></div>
                  <div className="relative flex justify-center"><span className="px-4 bg-transparent backdrop-blur-md rounded-full border border-white/40 dark:border-white/10 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">OR PASTE</span></div>
                </div>

                <textarea
                  className="w-full h-48 p-6 glass rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 dark:focus:border-indigo-500/50 border-white/60 dark:border-white/10 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400 text-sm mb-6"
                  placeholder="Paste legal text if you don't have a PDF file..."
                  disabled={!!selectedFile}
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                />
                
                <div className="flex gap-4">
                  <button onClick={handleAnalyze} disabled={isAnalyzing || (!docText && !selectedFile)} className="flex-1 bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 disabled:opacity-50 flex justify-center items-center active:scale-95">
                    {isAnalyzing ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" /> Processing...</> : 'Analyze Risk'}
                  </button>
                  <button onClick={() => { setDocText(''); setSelectedFile(null); }} className="px-8 py-4 glass rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors">Reset</button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {!analysisResult ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-16 glass rounded-3xl border border-dashed border-white/60 dark:border-white/10 min-h-[500px] transition-all duration-500">
                  <div className="text-7xl mb-6 opacity-30 grayscale dark:invert">📄</div>
                  <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">Awaiting Data</h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs mx-auto">Upload a document to generate a real-time risk classification report.</p>
                </div>
              ) : (
                <div className="glass rounded-3xl p-8 border border-white/50 dark:border-white/10 apple-shadow animate-fadeIn transition-all duration-500">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Report</h2>
                    <RiskBadge level={analysisResult.riskLevel} />
                  </div>
                  
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Executive Summary</h4>
                      <div className="bg-white/40 dark:bg-white/5 p-6 rounded-2xl border border-white/40 dark:border-white/10 text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                        {analysisResult.summary}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Clause Logic</h4>
                      <div className="space-y-4">
                        {analysisResult.clauses.map((clause, idx) => (
                          <div key={idx} className="glass rounded-2xl p-5 border border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <RiskBadge level={clause.riskRating} />
                              <button onClick={() => speakText(clause.simplifiedText)} className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:underline">Speak</button>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-3 opacity-60">"{clause.originalText}"</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white bg-white/40 dark:bg-white/5 p-4 rounded-xl border border-white/40 dark:border-white/10">{clause.simplifiedText}</p>
                            {clause.relevantLaws && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {clause.relevantLaws.map(law => (
                                  <span key={law} className="text-[9px] bg-black/5 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">{law}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="pt-6 border-t border-white/40 dark:border-white/10">
                      <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Suggested Action</h4>
                      <p className="text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/20 p-5 rounded-2xl text-sm font-bold border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm leading-relaxed">
                        {analysisResult.suggestedAction}
                      </p>
                    </div>
                    
                    <button onClick={() => setShowQuiz(true)} className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20 flex items-center justify-center gap-3 active:scale-95">
                       <span className="text-xl">🎓</span> Verify Your Understanding
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'deep-research' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            <div className="glass rounded-[2rem] p-12 apple-shadow border border-white/50 dark:border-white/10 text-center space-y-8 transition-all duration-500">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Legal Research Studio</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Academic analysis & case precedents.</p>
              </div>
              
              <form onSubmit={handleDeepResearch} className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  className="w-full p-6 pl-16 rounded-2xl border-none glass-dark apple-shadow text-lg focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                  placeholder="Topic or judgment name..."
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button 
                  disabled={isResearching}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 disabled:opacity-50"
                >
                  {isResearching ? '...' : 'Search'}
                </button>
              </form>
            </div>

            {isResearching && (
              <div className="py-24 text-center space-y-6">
                <div className="flex justify-center space-x-2">
                   <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></div>
                   <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                   <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Synthesizing Legal Knowledge...</h3>
              </div>
            )}

            {researchResult && (
              <div className="glass rounded-[2rem] p-12 apple-shadow border border-white/50 dark:border-white/10 animate-fadeIn transition-all duration-500">
                <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed mb-12 overflow-auto max-h-[70vh] font-medium text-lg">
                  <div dangerouslySetInnerHTML={{ __html: researchResult.text.replace(/\n/g, '<br/>') }} />
                </div>

                {researchResult.sources.length > 0 && (
                  <div className="pt-10 border-t border-white/40 dark:border-white/10">
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Verified Citations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {researchResult.sources.map((source: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={source.web?.uri || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-4 glass hover:bg-white/80 dark:hover:bg-white/10 rounded-2xl border border-white/60 dark:border-white/10 transition-all group"
                        >
                          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                            {idx + 1}
                          </div>
                          <div className="truncate text-left">
                            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{source.web?.title || 'Legal Reference'}</p>
                            <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold truncate opacity-60">{source.web?.uri}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeView === 'news' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-left">
              <div className="space-y-2">
                <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors duration-500">Legal News</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Real-time legislative & judicial bulletins.</p>
              </div>
              <button 
                onClick={handleFetchNews} 
                disabled={isLoadingNews}
                className="flex items-center gap-3 px-6 py-3 glass rounded-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-white/60 dark:border-white/10 shadow-sm active:scale-95"
              >
                <svg className={`w-5 h-5 ${isLoadingNews ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Sync Updates
              </button>
            </div>

            {isLoadingNews ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass h-80 rounded-3xl animate-pulse border border-white/40 dark:border-white/10"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsArticles.map((article, idx) => (
                  <div key={idx} className="glass rounded-3xl p-8 apple-shadow hover:-translate-y-2 transition-all duration-500 flex flex-col border border-white/60 dark:border-white/10 group text-left h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full uppercase tracking-widest">{article.date}</span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 italic bg-white/40 dark:bg-white/5 px-2 py-1 rounded-lg">{article.source}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{article.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 leading-relaxed font-medium flex-grow">{article.summary}</p>
                    <div className="pt-6 border-t border-white/40 dark:border-white/10 mt-auto">
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Citizen Impact</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed bg-white/30 dark:bg-white/5 p-3 rounded-xl">{article.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'search' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                className="w-full p-8 pl-16 rounded-[2rem] border-none glass apple-shadow text-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all outline-none"
                placeholder="Search IPC/BNS..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length > 2) saveSearch(e.target.value);
                }}
              />
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {!searchTerm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn text-left">
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4 flex items-center">
                     Popular Scenarios
                   </h3>
                   <div className="flex flex-wrap gap-3">
                     {POPULAR_SEARCHES.map(term => (
                       <button 
                         key={term}
                         onClick={() => { setSearchTerm(term); saveSearch(term); }}
                         className="px-6 py-3 glass-dark border border-white/60 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95"
                       >
                         {term}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-4">
                     Recent Activity
                   </h3>
                   {recentSearches.length > 0 ? (
                     <div className="space-y-2">
                       {recentSearches.map((term, i) => (
                         <button 
                           key={`${term}-${i}`}
                           onClick={() => setSearchTerm(term)}
                           className="w-full flex items-center justify-between p-4 glass hover:bg-white/80 dark:hover:bg-white/10 rounded-2xl text-left transition-all border border-white/40 dark:border-white/10 group"
                         >
                           <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{term}</span>
                           <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                         </button>
                       ))}
                       <button 
                         onClick={() => { setRecentSearches([]); localStorage.removeItem('nyaya_recent_searches'); }}
                         className="text-[10px] font-black text-red-400 hover:text-red-500 mt-4 ml-4 uppercase tracking-widest"
                       >
                         Clear History
                       </button>
                     </div>
                   ) : (
                     <div className="p-16 glass rounded-3xl border border-dashed border-white/60 dark:border-white/10 text-center">
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium italic opacity-50">Empty history.</p>
                     </div>
                   )}
                </div>
              </div>
            )}

            {searchTerm && (
              <div className="space-y-10 animate-fadeIn text-left">
                {filteredLaws.length > 0 ? (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Search Results</h2>
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full uppercase tracking-widest">{filteredLaws.length} found</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredLaws.map(law => (
                        <LawCard key={law.id} law={law as LawReference} onListen={speakText} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-32 text-center space-y-4">
                    <div className="text-8xl mb-6 opacity-10 dark:invert">🔎</div>
                    <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500">No matching acts.</h3>
                    <p className="text-gray-400 dark:text-gray-500 font-medium">Try broader terms like "Fraud" or "Property".</p>
                    <button onClick={() => setSearchTerm('')} className="mt-8 text-indigo-600 dark:text-indigo-400 font-black hover:underline tracking-widest uppercase text-xs">Return to Search</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeView === 'learn' && (
          <div className="flex items-center justify-center min-h-[60vh] animate-fadeIn">
            {!quizQuestions ? (
              <div className="text-center glass rounded-[3rem] p-16 apple-shadow max-w-2xl border border-white/50 dark:border-white/10 space-y-8 transition-all duration-500">
                <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Interactive Word Coach</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">Master the nuances of the new BNS reforms through bite-sized, AI-generated legal modules.</p>
                </div>
                <button onClick={async () => { 
                  setIsAnalyzing(true);
                  const quiz = await generateQuiz("Common Indian Criminal Law: Theft, Murder, Cheating, and Assault."); 
                  setQuizQuestions(quiz); 
                  setShowQuiz(true);
                  setIsAnalyzing(false);
                }} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-bold shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center justify-center mx-auto group active:scale-95">
                   {isAnalyzing ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" /> : 'Begin Learning session'}
                   <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            ) : (
              <div className="w-full animate-fadeIn">
                <QuizWidget questions={quizQuestions} onComplete={() => { alert("Congratulations! You've mastered this module."); setQuizQuestions(null); setShowQuiz(false); }} />
              </div>
            )}
          </div>
        )}

        {activeView === 'lawyer' && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="glass rounded-[3rem] apple-shadow overflow-hidden border border-white/50 dark:border-white/10 transition-all duration-500">
              <div className="bg-indigo-600 px-10 py-16 text-white text-center space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tight">Request Expert Council</h2>
                <p className="text-indigo-100 font-medium text-lg">Verified legal professionals within the न्यायSAATHI network.</p>
              </div>
              <form onSubmit={handleLawyerSubmit} className="p-12 space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Full Identity</label>
                    <input required type="text" className="w-full px-5 py-4 glass-dark rounded-2xl focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white font-medium outline-none transition-all" placeholder="John Doe" value={lawyerForm.name} onChange={e => setLawyerForm({...lawyerForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Protocol</label>
                    <input required type="email" className="w-full px-5 py-4 glass-dark rounded-2xl focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white font-medium outline-none transition-all" placeholder="john@example.com" value={lawyerForm.email} onChange={e => setLawyerForm({...lawyerForm, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Contact String</label>
                  <input required type="tel" className="w-full px-5 py-4 glass-dark rounded-2xl focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white font-medium outline-none transition-all" placeholder="+91 98765 43210" value={lawyerForm.phone} onChange={e => setLawyerForm({...lawyerForm, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Circumstantial Brief</label>
                    <span className={`text-[10px] font-black tracking-widest ${lawyerForm.problem.length >= 50 ? 'text-emerald-500' : 'text-red-400'}`}>
                      {lawyerForm.problem.length}/50 Min.
                    </span>
                  </div>
                  <textarea required className="w-full h-48 px-6 py-5 glass-dark rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 dark:text-white font-medium resize-none" placeholder="Elaborate on your situation..." value={lawyerForm.problem} onChange={e => setLawyerForm({...lawyerForm, problem: e.target.value})} />
                </div>
                <button 
                  disabled={isSubmittingLawyer || lawyerForm.problem.length < 50}
                  type="submit" 
                  className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 disabled:opacity-50 active:scale-95"
                >
                  {isSubmittingLawyer ? 'Establishing link...' : 'Submit Consultation Request'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* GLOBAL MODAL OVERLAY */}
      {showQuiz && quizQuestions && activeView === 'analyze' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-2xl animate-fadeIn">
          <div className="w-full max-w-xl">
             <div className="flex justify-end mb-6">
                <button onClick={() => setShowQuiz(false)} className="text-white bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-lg transition-all active:scale-90 border border-white/10">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <QuizWidget questions={quizQuestions} onComplete={() => { setShowQuiz(false); setQuizQuestions(null); }} />
          </div>
        </div>
      )}

      <footer className="py-16 mt-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center border border-white/40 dark:border-white/10"><span className="text-indigo-600 dark:text-indigo-400 text-xs font-black">NS</span></div>
                <span className="font-bold text-gray-900 dark:text-white tracking-tight">{APP_NAME}</span>
             </div>
             <p className="text-gray-400 dark:text-gray-500 text-xs font-medium text-center md:text-left">© 2024 {APP_NAME}. For a more equitable Indian future.</p>
             <div className="flex space-x-8">
                <a href="#" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Safety</a>
                <a href="#" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Policy</a>
                <a href="#" className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
