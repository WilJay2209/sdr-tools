import React, { useState, useRef } from 'react';
import { Send, Copy, Mail, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function RedditScanner() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const subredditsList = [
    { name: 'r/StartupNinjas', category: 'Startup Growth' },
    { name: 'r/SalesEngineers', category: 'Sales' },
    { name: 'r/B2Bsales', category: 'Sales' },
    { name: 'r/Startups', category: 'Startup Growth' },
    { name: 'r/SaaS', category: 'SaaS' },
    { name: 'r/salesops', category: 'Sales Ops' },
    { name: 'r/LeadGeneration', category: 'Lead Gen' },
    { name: 'r/ABM', category: 'ABM' },
  ];

  const pillars = [
    {
      id: 1,
      name: 'Foundation',
      description: 'ICP, Sourcing, Tech Stack, Onboarding',
      color: '#FF6B6B',
      textColor: '#fff',
    },
    {
      id: 2,
      name: 'Input Control',
      description: 'Filter 2 & 3 - Problem Likelihood & Accessibility',
      color: '#4ECDC4',
      textColor: '#fff',
    },
    {
      id: 3,
      name: 'Execution Standard',
      description: 'Sequence, Qualification, CRM, Consistency',
      color: '#FFD93D',
      textColor: '#1a1a1a',
    },
    {
      id: 4,
      name: 'Operating Rhythm',
      description: 'Five-Day Diagnostic Cadence',
      color: '#9D4EDD',
      textColor: '#fff',
    },
    {
      id: 5,
      name: 'Signal Management',
      description: 'Re-Entry, Abandonment, Composition, MTG Rate',
      color: '#3A86FF',
      textColor: '#fff',
    },
  ];

  const analyzePost = async () => {
    if (!postContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Analyze this Reddit post and categorize it against the SDR Operating System framework. 

The five pillars are:
1. Foundation - ICP Definition, Account Sourcing with ABM layer, Tech Stack, Rep Onboarding
2. Input Control - Filter 2 Problem Likelihood, Filter 3 Role Accessibility
3. Execution Standard - Sequence Adherence, Qualification Consistency, CRM Discipline, Ad-Hoc Decisions
4. Operating Rhythm - Five-day diagnostic cadence Monday through Friday
5. Signal Management - Re-Entry Rate, Abandonment Rate, Composition Score, Meeting-to-Opp Rate

Post:
"${postContent}"

Respond in JSON format ONLY (no markdown, no backticks):
{
  "primaryPillar": <1-5>,
  "secondaryPillars": [<1-5>, <1-5>],
  "confidence": <0-100>,
  "coreProblem": "<one sentence summary of the problem>",
  "positioning": "<2-3 sentences explaining how the SDR OS framework solves this, positioned as insight, not sales>"
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const responseText = data.content[0].text;
      
      try {
        const parsed = JSON.parse(responseText);
        setAnalysis(parsed);
      } catch (e) {
        console.error('Parse error:', e);
        setAnalysis({
          primaryPillar: 1,
          secondaryPillars: [],
          confidence: 0,
          coreProblem: 'Could not analyze post',
          positioning: 'Please try with a clearer SDR-related problem statement.',
        });
      }
    } catch (error) {
      console.error('API Error:', error);
    }
    setLoading(false);
  };

  const getPillarInfo = (id) => pillars.find((p) => p.id === id);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis.positioning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailCapture = async (e) => {
    e.preventDefault();
    setShowEmailModal(false);
    setEmailInput('');
    alert('Thanks! Weekly digest signup would be processed here.');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#2a2a3e', background: 'rgba(15, 15, 30, 0.8)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#4ECDC4', fontFamily: 'Poppins, sans-serif' }}>
                Reddit Scanner
              </h1>
              <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
                Identify SDR Operating System opportunities in real-time
              </p>
            </div>
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
                color: '#1a1a1a',
              }}
            >
              <Mail size={18} />
              Weekly Digest
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input */}
          <div className="lg:col-span-2">
            <div
              className="rounded-lg p-6 border"
              style={{
                background: 'rgba(42, 42, 62, 0.4)',
                borderColor: '#3a3a4e',
              }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                Paste Reddit Post
              </h2>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Paste the Reddit post content here... (title + body)"
                className="w-full h-48 p-4 rounded-lg mb-4 bg-opacity-50 border text-white placeholder-opacity-60"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: '#4ECDC4',
                  borderWidth: '2px',
                  fontFamily: 'Menlo, monospace',
                  fontSize: '14px',
                }}
              />

              <button
                onClick={analyzePost}
                disabled={loading || !postContent.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #4ECDC4 0%, #3A86FF 100%)'
                    : 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
                  color: loading ? '#fff' : '#1a1a1a',
                  transform: loading ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                <Send size={18} />
                {loading ? 'Analyzing...' : 'Analyze Post'}
              </button>
            </div>

            {/* Subreddits Reference */}
            <div
              className="rounded-lg p-6 border mt-6"
              style={{
                background: 'rgba(42, 42, 62, 0.4)',
                borderColor: '#3a3a4e',
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#4ECDC4', fontFamily: 'Poppins, sans-serif' }}>
                Target Subreddits
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {subredditsList.map((sub) => (
                  <div
                    key={sub.name}
                    className="p-3 rounded-lg text-sm border"
                    style={{
                      background: 'rgba(78, 205, 196, 0.1)',
                      borderColor: '#4ECDC4',
                      color: '#a0c0d0',
                    }}
                  >
                    <div className="font-semibold" style={{ color: '#4ECDC4' }}>
                      {sub.name}
                    </div>
                    <div style={{ color: '#70808c', fontSize: '12px' }}>{sub.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Analysis Results */}
          <div>
            {analysis ? (
              <div
                className="rounded-lg p-6 border sticky top-8"
                style={{
                  background: 'rgba(42, 42, 62, 0.6)',
                  borderColor: '#3a3a4e',
                }}
              >
                <h3 className="text-lg font-bold mb-6" style={{ color: '#4ECDC4', fontFamily: 'Poppins, sans-serif' }}>
                  Analysis Result
                </h3>

                {/* Primary Pillar */}
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#70808c' }}>
                    Primary Pillar
                  </div>
                  {(() => {
                    const pillar = getPillarInfo(analysis.primaryPillar);
                    return (
                      <div
                        className="p-4 rounded-lg border-l-4"
                        style={{
                          background: `rgba(${parseInt(pillar.color.slice(1, 3), 16)}, ${parseInt(
                            pillar.color.slice(3, 5),
                            16
                          )}, ${parseInt(pillar.color.slice(5, 7), 16)}, 0.15)`,
                          borderColor: pillar.color,
                          color: '#fff',
                        }}
                      >
                        <div className="font-bold text-lg" style={{ color: pillar.color }}>
                          {pillar.name}
                        </div>
                        <div className="text-sm mt-1" style={{ color: '#b0b0c0' }}>
                          {pillar.description}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Confidence */}
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#70808c' }}>
                    Confidence Match
                  </div>
                  <div className="flex items-end gap-2">
                    <TrendingUp size={18} style={{ color: '#4ECDC4' }} />
                    <div className="text-3xl font-bold" style={{ color: '#4ECDC4' }}>
                      {analysis.confidence}%
                    </div>
                  </div>
                </div>

                {/* Core Problem */}
                <div className="mb-6 pb-6 border-b" style={{ borderColor: '#3a3a4e' }}>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#70808c' }}>
                    Core Problem
                  </div>
                  <p style={{ color: '#fff', lineHeight: '1.6', fontSize: '14px' }}>
                    {analysis.coreProblem}
                  </p>
                </div>

                {/* Positioning */}
                <div>
                  <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#70808c' }}>
                    Suggested Positioning
                  </div>
                  <div
                    className="p-4 rounded-lg mb-4 border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: '#4ECDC4',
                      color: '#d0d0e0',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      fontStyle: 'italic',
                    }}
                  >
                    "{analysis.positioning}"
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: copied ? 'rgba(76, 205, 128, 0.2)' : 'rgba(78, 205, 196, 0.2)',
                      color: copied ? '#4cd580' : '#4ECDC4',
                      borderColor: copied ? '#4cd580' : '#4ECDC4',
                      border: '1px solid',
                    }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={16} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy Positioning
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg p-6 border sticky top-8 text-center"
                style={{
                  background: 'rgba(42, 42, 62, 0.4)',
                  borderColor: '#3a3a4e',
                }}
              >
                <AlertCircle size={32} style={{ color: '#FFD93D', margin: '0 auto 16px' }} />
                <p style={{ color: '#a0a0b0', lineHeight: '1.6' }}>
                  Paste a Reddit post to see which Pillar of the SDR Operating System it relates to, confidence level, and positioning language you can use.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Pillars (if applicable) */}
        {analysis && analysis.secondaryPillars.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#4ECDC4', fontFamily: 'Poppins, sans-serif' }}>
              Also Related To
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {analysis.secondaryPillars.map((pillarId) => {
                const pillar = getPillarInfo(pillarId);
                return (
                  <div
                    key={pillarId}
                    className="p-4 rounded-lg border text-center opacity-75 hover:opacity-100 transition-opacity"
                    style={{
                      background: `rgba(${parseInt(pillar.color.slice(1, 3), 16)}, ${parseInt(
                        pillar.color.slice(3, 5),
                        16
                      )}, ${parseInt(pillar.color.slice(5, 7), 16)}, 0.1)`,
                      borderColor: pillar.color,
                    }}
                  >
                    <div className="font-semibold text-sm" style={{ color: pillar.color }}>
                      {pillar.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="rounded-lg p-8 w-full max-w-md"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 100%)',
              border: '2px solid #4ECDC4',
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#4ECDC4', fontFamily: 'Poppins, sans-serif' }}>
              Weekly Digest
            </h2>
            <p className="text-sm mb-6" style={{ color: '#a0a0b0' }}>
              Get the top 5 SDR Operating System opportunities from Reddit, categorized and positioned weekly.
            </p>

            <form onSubmit={handleEmailCapture}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg mb-4 text-white placeholder-opacity-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: '#4ECDC4',
                  border: '2px solid',
                }}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
                    color: '#1a1a1a',
                  }}
                >
                  Subscribe
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-3 rounded-lg font-semibold border"
                  style={{
                    borderColor: '#4ECDC4',
                    color: '#4ECDC4',
                    background: 'transparent',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
    }
