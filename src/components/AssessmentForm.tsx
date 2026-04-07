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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />

          <div className="mt-8">
            {currentStep === 1 ? (
              <TeamInfoStep teamInfo={teamInfo} onChange={setTeamInfo} />
            ) : (
              <PillarStep
                pillar={pillars[currentStep - 2]}
                answers={answers}
                onChange={setAnswers}
              />
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
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
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                !canProceed()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {currentStep === totalSteps ? 'View Results' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
