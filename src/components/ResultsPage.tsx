import { useState, useRef, useEffect } from 'react';
import { Assessment, Scores } from '../types/assessment';
import { pillars } from '../data/questions';
import { getMaturityDescription, getScoreColor, getTextColor } from '../utils/scoring';
import { Copy, Check, Award, TrendingUp, Zap, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ResultsPageProps {
  assessment: Assessment;
  scores: Scores;
}

export function ResultsPage({ assessment, scores }: ResultsPageProps) {
  const [copied, setCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [emailError, setEmailError] = useState('');
  const linkedInPostRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const targetScore = scores.overall;
    const duration = 1500;
    const fps = 60;
    const steps = duration / (1000 / fps);
    const increment = targetScore / steps;
    let currentScore = 0;

    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(currentScore));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [scores.overall]);

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

  // Confidence score text calculation
  let confidenceScoreText = "";
  if (assessment.answers) {
    const scoresArray = Object.values(assessment.answers);
    const countD = scoresArray.filter(s => s === 4).length;
    const countA = scoresArray.filter(s => s === 1).length;
    const countBC = scoresArray.filter(s => s === 2 || s === 3).length;

    if (countD >= 5) {
      confidenceScoreText = "Confidence level: High — your answers show clear self-awareness of your team's strengths.";
    } else if (countA > countBC) {
      confidenceScoreText = "Confidence level: Honest — teams that score themselves low are usually the ones that improve fastest.";
    } else {
      confidenceScoreText = "Confidence level: Good — your results reflect a realistic picture of where your team stands.";
    }
  }

  // Generate Immediate Actions dynamically
  const actionLibrary: Record<string, { title: string, effort: string, description: string, why: string }> = {
    q4: { title: "Write one runbook for your most common incident", description: "Pick the incident that wakes your team up most often. Write a simple step-by-step document for resolving it. One runbook, done properly, can cut your next MTTR in half.", effort: "This week", why: "Most slow incident recovery is caused by people having to think under pressure. Runbooks remove the thinking and leave only the doing." },
    q1: { title: "Identify what is blocking your next release", description: "List every manual step between code review and production. You do not need to automate anything yet — just make the blockers visible. Visibility is the first step to removing them.", effort: "This afternoon", why: "You cannot optimise what you cannot see. A 30-minute mapping exercise usually reveals 2 or 3 quick wins hiding in plain sight." },
    q5: { title: "Write one automated test for your most fragile feature", description: "Pick the part of your product that breaks most often and has no automated coverage. Write one test that would have caught the last bug. Just one — momentum is everything.", effort: "This week", why: "Teams that start with zero tests rarely write ten at once. The first test is the hardest. After that it becomes a habit." },
    q8: { title: "Document your rollback process right now", description: "Open a doc and write down exactly what you would do if you needed to revert the last deployment. If you cannot write it down clearly, that is the problem. If you can, now it is a runbook.", effort: "This afternoon", why: "Rollback processes that exist only in someone's head fail under pressure. Write it down and it becomes a repeatable, teachable procedure." },
    q9: { title: "Audit where your secrets actually live", description: "Search your codebase and config files for API keys, passwords, and tokens. List every one you find. Do not fix them yet — just find them. Knowing where they are is the first step to moving them somewhere safe.", effort: "This afternoon", why: "Secret sprawl is invisible until it is audited. Most teams find more exposed credentials than they expected — and that surprise is productive." },
    q13: { title: "Set up centralised logging for one service", description: "Pick your most critical service and pipe its logs to a central location — CloudWatch, Datadog, or even a shared log file. One service, properly logged, teaches your team more than ten services logged inconsistently.", effort: "This week", why: "Centralised logging turns debugging from archaeology into investigation. Even one properly instrumented service changes how your team diagnoses problems." },
    q16: { title: "Turn off your noisiest alert for one week", description: "Find the alert your team ignores most often. Disable it. Track whether anything actually breaks. Alert fatigue is killing your team's ability to respond to real incidents — removing noise is as important as adding signal.", effort: "This afternoon", why: "An alert that is always firing is worse than no alert. It trains your team to ignore the pager — including when it really matters." },
    q17: { title: "Run a 20-minute retrospective on your last incident", description: "Get the team together. Ask three questions: what happened, what slowed us down, what one thing would we do differently. Write it down. That is a blameless postmortem — no special process required.", effort: "This afternoon", why: "Teams that review failures systematically have fewer repeat incidents. The format does not matter. The habit does." },
    q20: { title: "Schedule one knowledge share session this week", description: "Pick someone on the team who knows something others do not. Give them 20 minutes to explain it. It does not need to be formal. A Zoom call with a shared screen is enough to start breaking silos.", effort: "This week", why: "Knowledge silos are a choice, even if they feel inevitable. One session a week compounds into a genuinely cross-functional team within a quarter." },
    q21: { title: "List every admin user in your cloud account", description: "Log into your AWS, GCP, or Azure console and export a list of every user with admin or owner-level permissions. Review it. Remove anyone who does not actively need it. This takes 30 minutes and meaningfully reduces your attack surface.", effort: "30 minutes", why: "Admin access granted once is rarely reviewed. A regular permission audit is the simplest high-impact security habit a team can build." }
  };

  const defaultActions = [
    { title: "Map your deployment process end to end", effort: "This afternoon", description: "List every step it takes to go from code commit to production deployment. You don't need to fix it yet, just make it visible.", why: "You cannot optimise what you cannot see. Visibility is the first step." },
    { title: "Identify your team's single biggest pain point", effort: "This afternoon", description: "Ask your engineers where they spend the most time waiting or firefighting.", why: "Starting with the team's biggest frustration builds immediate momentum." },
    { title: "Read the DORA quick check report for your band", effort: "30 minutes", description: "Look up what other teams in your current performance band are focusing on.", why: "Contextualising your performance helps set realistic next goals." }
  ];

  const immediateActions: { title: string, effort: string, description: string, why: string }[] = [];
  if (assessment.answers) {
    const eligibleQuestions = Object.entries(assessment.answers)
      .filter(([_, score]) => score <= 2)
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);

    for (const qId of eligibleQuestions) {
      if (actionLibrary[qId] && immediateActions.length < 3) {
        immediateActions.push(actionLibrary[qId]);
      }
    }
  }

  while (immediateActions.length < 3) {
    immediateActions.push(defaultActions[immediateActions.length]);
  }

  let summarySentence = "";
  if (scores.overall >= 80) {
    summarySentence = "Your team is performing at an elite level. Your focus should be on marginal gains, scaling these practices, and sharing knowledge.";
  } else if (scores.overall >= 60) {
    summarySentence = "Your team has strong fundamentals but specific bottlenecks are slowing you down. Fix the fundamentals below to reach elite performance.";
  } else {
    summarySentence = "Your team is currently blocked by structural issues. Focus entirely on the immediate tactical actions below \u2014 do not attempt to optimise until these are fixed.";
  }

  const handleSendReport = async () => {
    if (emailError) setEmailError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailStatus('loading');

    const extractPillarScore = (name: string) => {
      const p = scores.pillars.find(p => p.pillar.toUpperCase() === name.toUpperCase());
      return p ? p.percentage : 0;
    };

    const pillarScores = {
      "DORA Metrics": extractPillarScore("DORA METRICS"),
      "CI/CD Pipeline": extractPillarScore("CI/CD PIPELINE"),
      "Security Posture": extractPillarScore("SECURITY POSTURE"),
      "Observability": extractPillarScore("OBSERVABILITY"),
      "Team Culture": extractPillarScore("TEAM CULTURE"),
      "Cloud Security": extractPillarScore("CLOUD SECURITY")
    };

    let topActionsOut = assessment.aiAnalysis?.topActions?.map(a => a.action) || [];
    if (topActionsOut.length === 0) {
      topActionsOut = immediateActions.map(a => a.title);
    }
    topActionsOut = topActionsOut.slice(0, 3);

    const payload = {
      email,
      teamName: assessment.teamInfo.teamName,
      userName: assessment.teamInfo.assessorName,
      overallScore: scores.overall,
      maturityLevel: scores.maturityLevel,
      pillarScores,
      topActions: topActionsOut,
      quickWin: assessment.aiAnalysis?.quickWin || "Focus on the lowest-scored areas first for maximum impact."
    };

    try {
      const { error } = await supabase.functions.invoke('send-report', { body: payload });
      if (error) throw error;
      setEmailStatus('success');
    } catch (err) {
      console.error('Error sending report:', err);
      setEmailError('Something went wrong. Try again or email nikhilpatil0507@gmail.com directly.');
      setEmailStatus('idle');
    }
  };

  const generateLinkedInPost = () => {
    return `Just benchmarked my team using the DevOps Maturity Scorecard. Here's our honest assessment:

Overall score: ${scores.overall}% \u00B7 ${scores.maturityLevel} performer

Breakdown:
${scores.pillars.map(p => `${p.pillar}: ${p.percentage}%`).join('\n')}

Our strongest pillar: ${strongestPillar.pillar} at ${strongestPillar.percentage}%
Our biggest opportunity: ${weakestPillar.pillar} at ${weakestPillar.percentage}%

If your team wants to benchmark honestly and get a prioritised action plan \u2014 the tool is free and takes 10 minutes:
https://nikhil-0507.github.io/devops-maturity-scorecard/

Have thoughts on the results or want to talk DevOps? Reach out: nikhilpatil0507@gmail.com`;
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
              {assessment.teamInfo.teamName} &middot; assessed on {formatDate()}
            </p>
            <p className="text-sm text-slate-500">
              Scored by {assessment.teamInfo.assessorName}
            </p>
            <div className="inline-block mt-4 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-xs text-teal-700">
              Benchmarked against Elite DORA standards · Framework by Nikhil Patil, DevOps enthusiast
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 mb-8 text-center border border-teal-100">
            <div className="flex items-center justify-center mb-4">
              <Award className="w-12 h-12 text-teal-600" />
            </div>
            <div className="text-6xl font-bold text-slate-900 mb-2">
              {displayScore}%
            </div>
            <div className="text-2xl font-semibold text-teal-700 mb-3">
              {scores.maturityLevel} Performer
            </div>
            {confidenceScoreText && (
              <p className="text-sm text-slate-500 mb-4 italic">
                {confidenceScoreText}
              </p>
            )}
            <p className="text-slate-900 font-bold max-w-2xl mx-auto leading-relaxed mb-3">
              {summarySentence}
            </p>
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
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Quick Win: Start Here This Week</h2>
                        <p className="text-slate-700 leading-relaxed">{assessment.aiAnalysis.quickWin}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mb-8 break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Start here — 3 things you can do this week</h2>
            <div className="space-y-4">
              {immediateActions.map((action, idx) => (
                <div key={idx} className="bg-white border-l-4 border-l-[#1D9E75] rounded-r-lg shadow-sm p-6 break-inside-avoid" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0d9488', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight pr-4">{action.title}</h3>
                        <span className="inline-flex flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full border" style={{ backgroundColor: '#f0fdfa', color: '#115e59', borderColor: '#ccfbf1', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                          {action.effort}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3">{action.description}</p>
                      <p className="text-sm text-slate-500 italic">
                        <span className="font-semibold text-slate-600 mr-1">Why this works:</span> 
                        {action.why}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 break-inside-avoid">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">How you compare: DORA performance bands</h2>
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

            <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-300 rounded-lg p-6 break-inside-avoid">
              <h3 className="font-bold text-slate-900 mb-4">What Elite looks like in practice</h3>
              <p className="text-slate-700 mb-4">
                Elite DORA performance is not a vanity metric. It represents a fundamentally different way of operating — where engineering teams ship small, safe, and often, and where recovery from failure is measured in minutes rather than days.
              </p>
              <p className="text-slate-700 mb-4">
                In practice, Elite teams deploy to production multiple times per day. Not because they move fast and break things — the opposite. They deploy frequently because their pipelines, testing, and rollback capabilities are mature enough that each deployment carries very little risk. Small changes are safer changes.
              </p>
              <p className="text-slate-700 mb-4">
                Lead times are short. An idea moves from code to production in hours, not weeks. This means customer feedback loops are tight, bugs get fixed before they compound, and the team spends less time managing release queues and more time building.
              </p>
              <p className="text-slate-700 mb-4">
                When things do go wrong — and they always do — Elite teams recover fast. Not because they never make mistakes, but because they have the observability to detect problems immediately and the runbooks to resolve them without heroics.
              </p>
              <p className="text-slate-700 mb-4">
                Here is the important caveat: Elite performance is not the right target for every team or every business. A small startup moving fast may not need the rigour of a team running critical financial infrastructure. A team serving thousands of internal users has different reliability requirements than one serving millions of customers. The right maturity level depends on your business, your users, and the consequences of failure in your specific context.
              </p>
              <p className="text-slate-700 font-semibold mt-6">
                Use this benchmark as a direction, not a destination. The goal is to move forward — not to hit a number.
              </p>
            </div>
          </div>

          <div className="mb-8 no-print break-inside-avoid">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Get your report in your inbox</h2>
              <p className="text-sm text-slate-500 mb-4">
                Optional — enter your email and we will send a formatted copy of this report. No newsletter. No follow-up emails unless you reach out first.
              </p>

              {emailStatus === 'success' ? (
                <div className="flex items-center gap-3 bg-green-50 text-green-800 p-4 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <p className="font-medium text-sm">
                    Report sent. Check your inbox — and feel free to reply if you have questions about your results.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      disabled={emailStatus === 'loading'}
                    />
                    <button
                      onClick={handleSendReport}
                      disabled={emailStatus === 'loading'}
                      className="bg-teal-600 hover:bg-teal-700 disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg flex justify-center items-center gap-2 transition-colors w-full sm:w-auto"
                    >
                      {emailStatus === 'loading' ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send my report
                        </>
                      )}
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{emailError}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Your email is only used to send this report.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 no-print">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Share or Download your results</h2>
            <p className="text-slate-600 mb-4">Click to copy a ready-made post — personalised with your score.</p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <textarea
                ref={linkedInPostRef}
                value={generateLinkedInPost()}
                readOnly
                className="w-full h-64 p-4 bg-white border border-slate-300 rounded text-sm font-mono resize-none"
              />
              <div className="mt-3 flex flex-col md:flex-row gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
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
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Download Report (PDF)
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Tag me on LinkedIn — it would genuinely encourage me to keep building tools like this.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-600 py-8">
          <p className="mb-2">DevOps Maturity Scorecard &middot; built by Nikhil Patil, DevOps enthusiast</p>
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
