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
            A totally free, strictly no-sales scorecard to benchmark your engineering processes, find bottlenecks, and get an honest action plan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Engineering Leaders</h3>
            <p className="text-slate-600 text-sm">Benchmark your org, identify systemic bottlenecks, and justify infrastructure investments.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Platform Teams</h3>
            <p className="text-slate-600 text-sm">Find out exactly where developers are getting stuck to prioritise your internal tooling roadmap.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Consultants &amp; Freelancers</h3>
            <p className="text-slate-600 text-sm">Run this on day one of a new client engagement to instantly map their maturity and propose quick wins.</p>
          </div>
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
            <h3 className="text-xl font-semibold text-slate-900">About the Author</h3>
          </div>

          <div className="text-slate-700 space-y-4 leading-relaxed">
            <p>Hey, I'm Nikhil. Lead DevOps Engineer, been in the trenches long enough to have seen what good looks like and what it doesn't.</p>
            <p>One thing I kept seeing across teams I worked with and interviewed at: nobody could clearly answer whether their problems came from an immature DevOps practice or from simply not having the right person in the role. Those are two completely different problems. One needs a roadmap. The other needs a hire. And confusing them wastes months and a lot of money.</p>
            <p>This tool gives you a clear, honest answer to that question in 10 minutes. Free, no strings, no sales pitch at the end.</p>
            <p>If the results raise questions you want to talk through, my contact is in the footer.</p>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm font-medium">
                <a
                  href="https://nikhilpatil.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  nikhilpatil.me
                </a>
                <span className="hidden sm:inline text-slate-300">|</span>
                <a
                  href="https://linkedin.com/in/nikhil-s-patil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  linkedin.com/in/nikhil-s-patil
                </a>
                <span className="hidden sm:inline text-slate-300">|</span>
                <a
                  href="mailto:nikhilpatil0507@gmail.com"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  nikhilpatil0507@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
