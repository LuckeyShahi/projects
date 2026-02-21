import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('repositories');

  const tabs = [
    { id: 'repositories', label: 'Repositories', count: 42 },
    { id: 'packages', label: 'Packages', count: 3 },
    { id: 'projects', label: 'Projects', count: 8 }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-12">
      {/* Header Profile Section */}
      <div className="border-b border-[#30363d] pt-12 pb-8 px-6 lg:px-24 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 h-48 rounded-full border border-[#30363d] overflow-hidden bg-[#161b22] flex-shrink-0 shadow-xl">
          <img 
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
            alt="Profile Avatar" 
            className="w-full h-full object-cover p-4 opacity-50"
          />
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-white"> Luckey shahi</h1>
            <p className="text-xl text-[#8b949e]">Luckeydev-code</p>
          </div>
          <p className="max-w-2xl text-[#8b949e]">
            Full-stack engineer focusing on high-performance React applications, system architecture, and open-source tooling.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <button className="px-4 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-sm font-medium hover:bg-[#30363d] transition-colors">
              Follow
            </button>
            <button className="px-4 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-sm font-medium hover:bg-[#30363d] transition-colors">
              Sponsor
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tab Navigation */}
      <div className="border-b border-[#30363d] px-6 lg:px-24 mt-8 flex gap-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-[#f78166] text-white' 
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            {tab.label}
            <span className="bg-[#161b22] text-[#8b949e] py-0.5 px-2 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="px-6 lg:px-24 mt-8">
        {activeTab === 'repositories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(repo => (
              <div key={repo} className="p-4 border border-[#30363d] rounded-lg bg-[#0d1117] hover:bg-[#161b22] transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <h3 className="text-[#58a6ff] font-semibold text-lg hover:underline">
                    nextjs-advanced-starter-{repo}
                  </h3>
                  <span className="text-xs border border-[#30363d] rounded-full px-2 py-0.5 text-[#8b949e]">
                    Public
                  </span>
                </div>
                <p className="text-[#8b949e] text-sm mt-2 mb-4">
                  A comprehensive boilerplate for Next.js applications featuring TypeScript, Tailwind CSS, and Prisma.
                </p>
                <div className="flex gap-4 text-xs text-[#8b949e] items-center">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#3178c6]"></div>
                    TypeScript
                  </span>
                  <span>⭐ 1.2k</span>
                  <span>Updated 2 days ago</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'repositories' && (
          <div className="text-center py-20 text-[#8b949e]">
            <p>Content for {tabs.find(t => t.id === activeTab).label} will go here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;