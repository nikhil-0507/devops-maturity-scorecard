import { useState, useRef } from 'react';
import { Assessment, Scores } from '../types/assessment';
import { pillars } from '../data/questions';
import { getMaturityDescription, getScoreColor, getTextColor } from '../utils/scoring';
import { Copy, Check, Award, TrendingUp, Zap } from 'lucide-react';

interface ResultsPageProps {
  assessment: Assessment;
  scores: Scores;
}

export function ResultsPage({ assessment, scores }: ResultsPageProps) {
  const [copied, setCopied] = useState(false);
  const linkedInPostRef = useRef<HTMLTextAreaElement>(null);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const strongestPillar = [...scores.pillars].sort((a, b) => b.percentage - a.percentage)[0];
  const weakestPillar = [...scores.pillars].sort((a, b) => a.percentage - b.percentage)[0];

  const getDORABand = (percentage: number): string => {
    if (percentage >= 80) return 'Elite';
    if (percentage >= 60) return 'High';
    if (percentage >= 40) return 'Medium';
    return 'Low';
  };

  const doraPillar = scores.pillars[0];
  const doraBand = getDORABand(doraPillar.percentage);

  const generateLinkedInPost = () => {
    return `Just benchmarked my team using the DevOps Maturity Scorecard — here's our honest assessment:

Overall score: ${scores.overall}% — ${scores.maturityLevel} performer

Breakdown:
${scores.pillars.map(p => `${p.pillar}: ${p.percentage}%`).join('\n')}

Our strongest pillar: ${strongestPillar.pillar} at ${strongestPillar.percentage}%
Our biggest opportunity: ${weakestPillar.pillar} at ${weakestPillar.percentage}%

${assessment.aiAnalysis?.quickWin ? `The first thing we are fixing: ${assessment.aiAnalysis.quickWin.split('.')[0]}.` : ''}

This free tool was built by Nikhil Patil, Lead DevOps Engineer, based on 6+ years of real AWS platform engineering including Elite DORA performance and 99.99% uptime at scale.

Benchmark your own team here: ${window.location.origin}

#DevOps #SRE #PlatformEngineering #CloudNative #DORA #AWS #Kubernetes #EngineeringLeadership #TechLeadership`;
  };

  const copyToClipboard = () => {
    const text = generateLinkedInPost();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Your DevOps Maturity Report
            </h1>
            <p className="text-lg text-slate-600">
              {assessment.teamInfo.teamName} — assessed on {formatDate()}
            </p>
            <p className="text-sm text-slate-500">
              Scored by {assessment.teamInfo.assessorName}
            </p>
            <div className="inline-block mt-4 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-xs text-teal-700">
              Benchmarked against Elite DORA standards · Framework by Nikhil Patil, Lead DevOps Engineer
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 mb-8 text-center border border-teal-100">
            <div className="flex items-center justify-center mb-4">
              <Award className="w-12 h-12 text-teal-600" />
            </div>
            <div className="text-6xl font-bold text-slate-900 mb-2">
              {scores.overall}%
            </div>
            <div className="text-2xl font-semibold text-teal-700 mb-3">
              {scores.maturityLevel} Performer
            </div>
            <p className="text-slate-700 max-w-2xl mx-auto leading-relaxed">
              {getMaturityDescription(scores.maturityLevel)}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pillar Breakdown</h2>
            <div className="space-y-4">
              {scores.pillars.map((pillar, index) => (
                <div key={pillar.pillar} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{pillar.pillar}</span>
                    <span className={`font-bold ${getTextColor(pillar.percentage)}`}>
                      {pillar.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`${getScoreColor(pillar.percentage)} h-3 rounded-full transition-all`}
                      style={{ width: `${pillar.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {assessment.aiAnalysis && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  <TrendingUp className="inline w-6 h-6 mr-2 text-teal-600" />
                  Detailed Analysis
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {assessment.aiAnalysis.pillarAnalyses.map((analysis) => (
                    <div key={analysis.pillar} className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-3">{analysis.pillar}</h3>
                      <p className="text-sm text-slate-700 mb-2">
                        <span className="font-semibold text-green-700">Strength:</span> {analysis.strength}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-amber-700">Opportunity:</span> {analysis.opportunity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {assessment.aiAnalysis.topActions.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Top 3 Action Items</h2>
                  <p className="text-sm text-slate-600 mb-4">
                    These recommendations are based on the scoring patterns in your answers and reflect the same types of improvements Nikhil Patil has implemented across enterprise AWS platforms. They are ordered by impact, not effort.
                  </p>
                  <div className="space-y-4">
                    {assessment.aiAnalysis.topActions.map((action, index) => (
                      <div key={index} className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 mb-2">{action.problem}</p>
                            <p className="text-sm text-slate-700 mb-2">
                              <span className="font-semibold">Action:</span> {action.action}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <span className="px-2 py-1 bg-white rounded border border-amber-200 text-slate-700">
                                Timeline: {action.timeline}
                              </span>
                              <span className="px-2 py-1 bg-white rounded border border-amber-200 text-slate-700">
                                Impact: {action.impact}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assessment.aiAnalysis.quickWin && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-400 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Zap className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Quick Win — Start Here This Week</h2>
                        <p className="text-slate-700 leading-relaxed">{assessment.aiAnalysis.quickWin}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">How you compare — DORA performance bands</h2>
            <p className="text-slate-600 mb-4">
              Google's DORA (DevOps Research and Assessment) programme analyses thousands of engineering teams worldwide and groups them into four performance bands: Elite, High, Medium, and Low. Here is where your team sits.
            </p>
            <div className="bg-slate-50 rounded-lg p-6 mb-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  Your DORA Score: {doraPillar.percentage}%
                </div>
                <div className={`text-xl font-semibold ${getTextColor(doraPillar.percentage)}`}>
                  {doraBand} Performer
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className={`p-3 rounded ${doraBand === 'Elite' ? 'bg-green-500 text-white font-bold' : 'bg-white'}`}>
                  Elite<br />81-100%
                </div>
                <div className={`p-3 rounded ${doraBand === 'High' ? 'bg-teal-500 text-white font-bold' : 'bg-white'}`}>
                  High<br />61-80%
                </div>
                <div className={`p-3 rounded ${doraBand === 'Medium' ? 'bg-amber-500 text-white font-bold' : 'bg-white'}`}>
                  Medium<br />41-60%
                </div>
                <div className={`p-3 rounded ${doraBand === 'Low' ? 'bg-red-500 text-white font-bold' : 'bg-white'}`}>
                  Low<br />0-40%
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-300 rounded-lg p-6">
              <h3 className="font-bold text-slate-900 mb-3">What Elite looks like in practice</h3>
              <p className="text-slate-700 mb-3">
                For context, the platform built by Nikhil Patil — the creator of this tool — operates at Elite DORA performance:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span><strong>Deployment frequency:</strong> 200+ releases per week across 60+ microservices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span><strong>Lead time for changes:</strong> Same-day deployments with automated pipelines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span><strong>Change failure rate:</strong> Under 2% across all production deployments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">•</span>
                  <span><strong>MTTR:</strong> Under 15 minutes, down from 6+ hours after introducing observability and runbooks</span>
                </li>
              </ul>
              <p className="text-slate-700 mt-3 text-sm">
                These numbers were achieved on a real B2B SaaS platform serving 100,000+ users in the UK — not a side project. Use them as a concrete, real-world benchmark for what Elite performance looks like.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Share your results on LinkedIn</h2>
            <p className="text-slate-600 mb-4">Click to copy a ready-made post — personalised with your score.</p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <textarea
                ref={linkedInPostRef}
                value={generateLinkedInPost()}
                readOnly
                className="w-full h-64 p-4 bg-white border border-slate-300 rounded text-sm font-mono resize-none"
              />
              <button
                onClick={copyToClipboard}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy to Clipboard
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Tagging Nikhil on LinkedIn is always appreciated — he reads every comment.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-600 py-8">
          <p className="mb-2">DevOps Maturity Scorecard — built by Nikhil Patil, Lead DevOps Engineer</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://nikhilpatil.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 underline"
            >
              nikhilpatil.me
            </a>
            <span className="text-slate-400">·</span>
            <a
              href="https://linkedin.com/in/nikhil-s-patil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 underline"
            >
              linkedin.com/in/nikhil-s-patil
            </a>
            <span className="text-slate-400">·</span>
            <a
              href="mailto:nikhilpatil0507@gmail.com"
              className="text-teal-600 hover:text-teal-700 underline"
            >
              nikhilpatil0507@gmail.com
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Powered by Google Cloud Run + Gemini AI · Aligned to Google DORA Research · Open source on GitHub
          </p>
        </footer>
      </div>
    </div>
  );
}
