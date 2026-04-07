import { TeamInfo } from '../types/assessment';

interface TeamInfoStepProps {
  teamInfo: TeamInfo;
  onChange: (info: TeamInfo) => void;
}

export function TeamInfoStep({ teamInfo, onChange }: TeamInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">About Your Team</h2>
        <p className="text-slate-600">Let's start with some basic information about your team.</p>
      </div>

      <div>
        <label htmlFor="teamName" className="block text-sm font-semibold text-slate-700 mb-2">
          Team or company name
        </label>
        <input
          type="text"
          id="teamName"
          value={teamInfo.teamName}
          onChange={(e) => onChange({ ...teamInfo, teamName: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="e.g., Acme Engineering"
          required
        />
      </div>

      <div>
        <label htmlFor="assessorName" className="block text-sm font-semibold text-slate-700 mb-2">
          Your name and job title
        </label>
        <input
          type="text"
          id="assessorName"
          value={teamInfo.assessorName}
          onChange={(e) => onChange({ ...teamInfo, assessorName: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="e.g., Jane Smith, Senior DevOps Engineer"
          required
        />
      </div>

      <div>
        <label htmlFor="teamSize" className="block text-sm font-semibold text-slate-700 mb-2">
          How big is your engineering team?
        </label>
        <select
          id="teamSize"
          value={teamInfo.teamSize}
          onChange={(e) => onChange({ ...teamInfo, teamSize: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
          required
        >
          <option value="">Select team size...</option>
          <option value="solo">Just me (solo)</option>
          <option value="2-10">2–10 people</option>
          <option value="11-50">11–50 people</option>
          <option value="51-200">51–200 people</option>
          <option value="200+">Over 200 people</option>
        </select>
      </div>

      <div>
        <label htmlFor="assessorRole" className="block text-sm font-semibold text-slate-700 mb-2">
          How would you describe your role?
        </label>
        <select
          id="assessorRole"
          value={teamInfo.assessorRole}
          onChange={(e) => onChange({ ...teamInfo, assessorRole: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
          required
        >
          <option value="">Select your role...</option>
          <option value="engineer">Engineer / Developer</option>
          <option value="devops">DevOps / Platform / SRE</option>
          <option value="manager">Engineering Manager</option>
          <option value="executive">CTO / VP Engineering</option>
          <option value="non-technical">Non-technical (HR, Recruiter, Product)</option>
        </select>
      </div>
    </div>
  );
}
