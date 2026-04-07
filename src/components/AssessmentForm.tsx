import { useState } from 'react';
import { TeamInfo, Answers } from '../types/assessment';
import { pillars } from '../data/questions';
import { ProgressIndicator } from './ProgressIndicator';
import { TeamInfoStep } from './TeamInfoStep';
import { PillarStep } from './PillarStep';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AssessmentFormProps {
  onComplete: (teamInfo: TeamInfo, answers: Answers) => void;
}

export function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    teamName: '',
    assessorName: '',
    teamSize: '',
    assessorRole: ''
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const motivationalMessages: Record<number, string> = {
    2: "Good start. These first 4 questions cover the fundamentals that Google uses to measure engineering performance globally. Be honest \u2014 the more accurate your answers, the more useful your results.",
    3: "You're 1 of 6 sections in. These questions are about your deployment pipeline \u2014 the engine that gets code from your engineers to your users. Keep going.",
    4: "Halfway there. Security questions are the ones most teams are honest about getting wrong. Don't worry \u2014 every team has gaps here. The scorecard will show you exactly where to focus.",
    5: "4 sections down. This is where a lot of teams realise they have more blind spots than they thought. That's a good thing to know.",
    6: "Almost there \u2014 just 2 sections left. These culture questions often reveal more than the technical ones. Take a moment on each one.",
    7: "Last section. You've made it this far \u2014 finish strong. Your full results and personalised action plan are waiting on the next screen."
  };

  const totalSteps = pillars.length + 1;
  const stepLabels = ['Team Info', ...pillars.map(p => p.name)];

  const isTeamInfoValid = () => {
    return (
      teamInfo.teamName.trim() !== '' &&
      teamInfo.assessorName.trim() !== '' &&
      teamInfo.teamSize !== '' &&
      teamInfo.assessorRole !== ''
    );
  };

  const isPillarComplete = (pillarIndex: number) => {
    const pillar = pillars[pillarIndex];
    return pillar.questions.every(q => answers[q.id] !== undefined);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return isTeamInfoValid();
    }
    return isPillarComplete(currentStep - 2);
  };

  const handleNext = () => {
    if (!canProceed()) {
      let missingId = '';
      if (currentStep === 1) {
        if (!teamInfo.teamName.trim()) missingId = 'teamName';
        else if (!teamInfo.assessorName.trim()) missingId = 'assessorName';
        else if (!teamInfo.teamSize) missingId = 'teamSize';
        else if (!teamInfo.assessorRole) missingId = 'assessorRole';
      } else {
        const pillar = pillars[currentStep - 2];
        const missingQuestion = pillar.questions.find(q => answers[q.id] === undefined);
        if (missingQuestion) missingId = missingQuestion.id;
      }
      
      setHighlightedField(missingId);
      
      setTimeout(() => {
        const element = document.getElementById(missingId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    setHighlightedField(null);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(teamInfo, answers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setHighlightedField(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />

          <div className="mt-8" key={currentStep}>
            <div className="animate-fade-in">
              {currentStep === 1 ? (
                <TeamInfoStep 
                  teamInfo={teamInfo} 
                  onChange={setTeamInfo} 
                  highlightedField={highlightedField}
                />
              ) : (
                <PillarStep
                  pillar={pillars[currentStep - 2]}
                  answers={answers}
                  onChange={setAnswers}
                  highlightedField={highlightedField}
                  motivationalMessage={motivationalMessages[currentStep]}
                />
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-10 md:static md:p-0 md:bg-transparent md:border-t mt-8 md:pt-6 md:border-slate-200">
            <div className="flex justify-between max-w-4xl mx-auto w-full px-4 md:px-0">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentStep === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors bg-teal-600 text-white hover:bg-teal-700"
              >
                {currentStep === totalSteps ? 'View Results' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
