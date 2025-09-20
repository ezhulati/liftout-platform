// Placeholder components for remaining onboarding steps
// These would be fully implemented in a production app

interface StepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function CompanyVerification({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Company Verification</h3>
      <p className="text-gray-600 mb-6">
        Upload documents to verify your company and build trust with teams.
      </p>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <p className="text-sm text-gray-500">Upload verification documents (Demo)</p>
        </div>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete Verification
          </button>
        </div>
      </div>
    </div>
  );
}

export function FirstOpportunityCreation({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create Your First Opportunity</h3>
      <p className="text-gray-600 mb-6">
        Post your first liftout opportunity to start attracting teams.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">This would redirect to the opportunity creation form</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Create Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamDiscoveryTutorial({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Discover Teams</h3>
      <p className="text-gray-600 mb-6">
        Learn how to search and evaluate available teams for liftout.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Interactive tutorial would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip Tutorial
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompanyPlatformTour({ onComplete }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Tour</h3>
      <p className="text-gray-600 mb-6">
        Explore key features and learn best practices for successful liftouts.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Interactive platform tour would go here</p>
        <button onClick={onComplete} className="btn-primary">
          Complete Tour
        </button>
      </div>
    </div>
  );
}

export function TeamFormation({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Form or Join a Team</h3>
      <p className="text-gray-600 mb-6">
        Create a new team or join an existing one for liftout opportunities.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Team formation interface would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete Team Setup
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkillsExperience({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Experience</h3>
      <p className="text-gray-600 mb-6">
        Showcase your team's expertise and track record.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Skills and experience form would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Save Skills
          </button>
        </div>
      </div>
    </div>
  );
}

export function LiftoutPreferences({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Liftout Preferences</h3>
      <p className="text-gray-600 mb-6">
        Set your availability and compensation expectations.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Preferences form would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export function OpportunityDiscoveryTutorial({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Explore Opportunities</h3>
      <p className="text-gray-600 mb-6">
        Learn how to find and apply to liftout opportunities.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Tutorial interface would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="btn-secondary">
              Skip Tutorial
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamPlatformTour({ onComplete }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Tour</h3>
      <p className="text-gray-600 mb-6">
        Discover platform features and best practices for teams.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Interactive tour would go here</p>
        <button onClick={onComplete} className="btn-primary">
          Complete Tour
        </button>
      </div>
    </div>
  );
}