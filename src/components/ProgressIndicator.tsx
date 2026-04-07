import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">
          Section {currentStep} of {totalSteps} &middot; {Math.round((currentStep / totalSteps) * 100)}% complete
        </span>
        <span className="text-sm text-slate-600">
          {stepLabels[currentStep - 1]}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                index + 1 < currentStep
                  ? 'bg-teal-600 text-white'
                  : index + 1 === currentStep
                  ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </div>
            <span className="text-xs text-slate-600 mt-2 text-center hidden md:block">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
