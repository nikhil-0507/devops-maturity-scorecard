import { User } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            DevOps Maturity Scorecard
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Benchmark your engineering team against Elite DevOps standards — built from real-world experience, not theory.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How mature is your DevOps practice? Find out in 10 minutes.
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Answer 24 honest questions across 6 pillars. Get an AI-powered maturity score, a visual breakdown, and a personalised action plan — completely free.
          </p>

          <button
            onClick={onStart}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Start Assessment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border-l-4 border-teal-500 p-8">
          <div className="flex items-start gap-4 mb-4">
            <User className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
            <h3 className="text-xl font-semibold text-slate-900">About this tool</h3>
          </div>

          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>
              I built this scorecard as a Lead DevOps Engineer with 6+ years of experience designing and scaling production cloud platforms on AWS.
            </p>

            <p>
              The questions, scoring framework, and benchmarks in this tool are not academic — they come directly from real engineering work, including:
            </p>

            <ul className="space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">→</span>
                <span>Reducing AWS cloud spend from $300,000 to $130,000 per year (a 60% saving) through infrastructure optimisation, rightsizing, and cost governance</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">→</span>
                <span>Scaling deployment frequency from 150 releases per month to over 200 releases per week across 60+ microservices — without increasing failure rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">→</span>
                <span>Cutting MTTR (the time it takes to fix a live incident) from over 6 hours down to under 15 minutes using observability tooling and structured on-call processes</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">→</span>
                <span>Achieving 99.99% uptime with zero SLA breaches across 10+ production environments over 4 years</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">→</span>
                <span>Growing and leading an engineering team from 6 to 55 people, introducing sprint ceremonies, SLA/SLO frameworks, and blameless postmortem culture</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">→</span>
                <span>Maintaining full ISO 27001 and GDPR compliance across a multi-account AWS platform serving 100,000+ active users in the UK market</span>
              </li>
            </ul>

            <p>
              The scoring framework is aligned to Google's DORA research — the most widely cited study on software delivery performance in the industry.
            </p>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <p className="font-semibold text-slate-900 mb-2">Connect with Nikhil:</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href="https://nikhilpatil.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Website: nikhilpatil.me
                </a>
                <a
                  href="https://linkedin.com/in/nikhil-s-patil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  LinkedIn: linkedin.com/in/nikhil-s-patil
                </a>
                <a
                  href="mailto:nikhilpatil0507@gmail.com"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Email: nikhilpatil0507@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
