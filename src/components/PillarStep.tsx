import { Pillar, Answers } from '../types/assessment';
import { HelpCircle } from 'lucide-react';

interface PillarStepProps {
  pillar: Pillar;
  answers: Answers;
  onChange: (answers: Answers) => void;
  highlightedField?: string | null;
  motivationalMessage?: string;
}

export function PillarStep({ pillar, answers, onChange, highlightedField, motivationalMessage }: PillarStepProps) {
  const handleAnswerChange = (questionId: string, score: number) => {
    onChange({ ...answers, [questionId]: score });
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{pillar.name}</h2>
        <h3 className="text-xl text-teal-700 mb-3">{pillar.title}</h3>
        <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
        {motivationalMessage && (
          <div className="mt-4 bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg text-slate-700">
            {motivationalMessage}
          </div>
        )}
      </div>

      {pillar.questions.map((question, index) => (
        <div key={question.id} className="bg-slate-50 rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-lg font-semibold text-slate-900 mb-2">
              Question {index + 1}: {question.text}
            </label>
            <div className="flex items-start gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{question.helperText}</p>
            </div>
          </div>

          <select
            id={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-base ${
              highlightedField === question.id ? 'border-red-500 bg-red-50' : 'border-slate-300'
            }`}
            required
          >
            <option value="">Select your answer...</option>
            {question.options.map((option) => (
              <option key={option.score} value={option.score}>
                {option.label} — {option.description}
              </option>
            ))}
          </select>
          {highlightedField === question.id && (
            <p className="mt-2 text-sm text-red-600">Please answer this question to continue.</p>
          )}
        </div>
      ))}
    </div>
  );
}
