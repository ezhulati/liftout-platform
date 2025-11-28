import { MatchingInsights } from '@/components/matching/MatchingInsights';

export default function MatchingPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          AI-Powered Team Matching
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Advanced compatibility analysis for strategic team acquisition
        </p>
        <div className="mt-4 bg-navy-50 border border-navy-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-navy-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-navy-700">
                <strong>Demo Scenario:</strong> Goldman Sachs analytics team considering Healthcare AI opportunity at MedTech Innovations
              </p>
            </div>
          </div>
        </div>
      </div>

      <MatchingInsights />
    </div>
  );
}