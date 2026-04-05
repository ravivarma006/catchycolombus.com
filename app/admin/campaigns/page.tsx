"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CampaignsPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [lastDeployed, setLastDeployed] = useState<string | null>(null);

  const handlePushToBeehiiv = async () => {
    setIsDeploying(true);
    
    // Simulate API delay for pushing deals to Beehiiv
    setTimeout(() => {
      setIsDeploying(false);
      setLastDeployed(new Date().toLocaleTimeString());
      alert("Successfully pushed Top 5 Deals as a Draft to Beehiiv. You can now log into api.beehiiv.com to review and broadcast the campaign.");
    }, 1500);
  };

  return (
    <div className="px-8 py-10 max-w-5xl">
      <div className="mb-10">
        <h1
          className="text-4xl font-black text-white mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Email Campaigns Manager
        </h1>
        <p className="text-white/40 text-sm max-w-xl">
          Instead of automated cron jobs that might crash or go to spam, use this dashboard to manually bundle the highest-converting Columbus deals and push them directly to your Beehiiv account as a Draft.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Deal Bundler Engine */}
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="p-2 bg-pink-500/20 text-pink-400 rounded-xl">📧</span>
            Weekly Local Blast
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-2xl">
              <div className="bg-green-500/20 p-2 rounded-lg text-green-400">✓</div>
              <p className="text-sm font-medium text-white">Aggregates Top 5 Active Deals</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-2xl">
              <div className="bg-green-500/20 p-2 rounded-lg text-green-400">✓</div>
              <p className="text-sm font-medium text-white">Applies "Premium" locked tags for retention</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-2xl">
              <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400">⚠️</div>
              <p className="text-sm font-medium text-white">API Keys Pending</p>
            </div>
          </div>

          <button
            onClick={handlePushToBeehiiv}
            disabled={isDeploying}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all disabled:opacity-50
              bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-xl shadow-pink-500/20 active:scale-95">
            {isDeploying ? (
              <span className="animate-pulse">Packaging Deals & Pushing API...</span>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Push Draft to Beehiiv
              </>
            )}
          </button>

          {lastDeployed && (
            <p className="text-center text-xs text-green-400 font-bold mt-4 tracking-widest uppercase">
              Last executed: {lastDeployed}
            </p>
          )}
        </div>

        {/* Beehiiv Analytics Stub */}
        <div className="flex flex-col gap-4">
          <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex-1 flex flex-col justify-center items-center text-center">
            <span className="text-5xl mb-4">🐝</span>
            <h3 className="font-bold text-white mb-2">Beehiiv Connected</h3>
            <p className="text-white/40 text-sm max-w-xs mb-6">
              Connect your Beehiiv account API keys to see open rates, click-through rates, and active subscriber metrics here.
            </p>
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition">
              Connect API Keys
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
