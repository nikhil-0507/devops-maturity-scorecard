import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultsPage } from './components/ResultsPage';
import { TeamInfo, Answers, Assessment, Scores, AIAnalysis } from './types/assessment';
import { pillars } from './data/questions';
import { calculateScores } from './utils/scoring';
import { generateDynamicInsights } from './utils/dynamicInsights';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

type AppState = 'landing' | 'assessment' | 'analyzing' | 'results';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);

  const handleStart = () => {
    setState('assessment');
  };

  const handleAssessmentComplete = async (teamInfo: TeamInfo, answers: Answers) => {
    setState('analyzing');

    const calculatedScores = calculateScores(answers);
    setScores(calculatedScores);

    // Save to scorecard_results without blocking or alerting the user
    (async () => {
      try {
        const { error } = await supabase
          .from('scorecard_results')
          .insert({
            team_name: teamInfo.teamName,
            user_name: teamInfo.assessorName,
            user_role: teamInfo.assessorRole,
            team_size: teamInfo.teamSize,
            overall_score: calculatedScores.overall,
            maturity_level: calculatedScores.maturityLevel,
            dora_score: calculatedScores.pillars.find(p => p.pillar === 'DORA METRICS')?.percentage || 0,
            cicd_score: calculatedScores.pillars.find(p => p.pillar === 'CI/CD PIPELINE')?.percentage || 0,
            security_score: calculatedScores.pillars.find(p => p.pillar === 'SECURITY POSTURE')?.percentage || 0,
            observability_score: calculatedScores.pillars.find(p => p.pillar === 'OBSERVABILITY')?.percentage || 0,
            culture_score: calculatedScores.pillars.find(p => p.pillar === 'TEAM CULTURE')?.percentage || 0,
            cloud_security_score: calculatedScores.pillars.find(p => p.pillar === 'CLOUD SECURITY')?.percentage || 0,
            strongest_pillar: [...calculatedScores.pillars].sort((a, b) => b.percentage - a.percentage)[0]?.pillar,
            weakest_pillar: [...calculatedScores.pillars].sort((a, b) => a.percentage - b.percentage)[0]?.pillar,
            raw_answers: answers
          });

        if (error) {
          console.error('Failed to log scorecard_results:', error);
        }
      } catch (error: any) {
        console.error('Exception logging scorecard_results:', error);
      }
    })();

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-assessment`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          answers,
          scores: calculatedScores,
          pillars: pillars.map(p => ({
            id: p.id,
            name: p.name,
            questions: p.questions.map(q => ({ id: q.id, text: q.text }))
          }))
        })
      });

      let aiAnalysis: AIAnalysis | undefined;

      if (response.ok) {
        aiAnalysis = await response.json();
      } else {
        console.error('AI analysis failed, continuing without it');
        aiAnalysis = {
          pillarAnalyses: [],
          topActions: [],
          quickWin: "Focus on the lowest-scored areas first for maximum impact.",
          doraComparison: "Compare your DORA metrics to industry benchmarks."
        };
      }

      if (aiAnalysis) {
        aiAnalysis.pillarAnalyses = generateDynamicInsights(answers);
      }

      const newAssessment: Assessment = {
        teamInfo,
        answers,
        scores: calculatedScores,
        aiAnalysis
      };

      const { data: savedAssessment, error } = await supabase
        .from('assessments')
        .insert({
          team_name: teamInfo.teamName,
          assessor_name: teamInfo.assessorName,
          team_size: teamInfo.teamSize,
          assessor_role: teamInfo.assessorRole,
          answers,
          scores: calculatedScores,
          ai_analysis: aiAnalysis
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Failed to save assessment:', error);
      } else if (savedAssessment) {
        newAssessment.id = savedAssessment.id;
        newAssessment.createdAt = savedAssessment.created_at;
      }

      setAssessment(newAssessment);
      setState('results');
    } catch (error) {
      console.error('Error processing assessment:', error);

      const fallbackAssessment: Assessment = {
        teamInfo,
        answers,
        scores: calculatedScores,
        aiAnalysis: {
          pillarAnalyses: generateDynamicInsights(answers),
          topActions: [],
          quickWin: "Focus on the lowest-scored areas first for maximum impact.",
          doraComparison: "Compare your DORA metrics to industry benchmarks."
        }
      };
      setAssessment(fallbackAssessment);
      setState('results');
    }
  };

  if (state === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  if (state === 'assessment') {
    return <AssessmentForm onComplete={handleAssessmentComplete} />;
  }

  if (state === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <Loader2 className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Analyzing Your Results</h2>
          <p className="text-slate-600">
            We're calculating your maturity scores and generating personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (state === 'results' && assessment && scores) {
    return <ResultsPage assessment={assessment} scores={scores} />;
  }

  return null;
}

export default App;
