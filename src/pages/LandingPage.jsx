import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className={`relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Text Content */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm font-semibold text-blue-400">
            🚀 Version 2.0 is now live
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Build Faster With <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Intelligent Tools
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Deploy your GitHub projects with our advanced frontend scaffolding. Engineered for scale, designed for speed.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
              Get Started
            </button>
            <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              View Documentation
            </button>
          </div>
        </div>

        {/* Floating Glassmorphism UI Mockup */}
        <div className="relative mx-auto w-full max-w-lg perspective-1000">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl transform rotate-y-[-10deg] rotate-x-[10deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-500 ease-out">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-slate-400 font-mono">Terminal</div>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <p className="text-green-400">~ $ npm install complex-frontend-core</p>
              <p className="text-slate-300">Fetching packages...</p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full w-3/4"></div>
              </div>
              <p className="text-blue-400 pt-2">Installation complete in 2.4s.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;