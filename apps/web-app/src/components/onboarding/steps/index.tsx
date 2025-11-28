// Placeholder components for remaining onboarding steps
// These would be fully implemented in a production app

interface StepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function CompanyVerification({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Company verification</h3>
      <p className="text-text-secondary mb-6">
        Upload documents to verify your company and build trust with teams.
      </p>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <p className="text-sm text-text-tertiary">Upload verification documents (Demo)</p>
        </div>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete verification
          </button>
        </div>
      </div>
    </div>
  );
}

export function FirstOpportunityCreation({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Create your first opportunity</h3>
      <p className="text-text-secondary mb-6">
        Post your first liftout opportunity to start attracting teams.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">This would redirect to the opportunity creation form</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Create opportunity
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamDiscoveryTutorial({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Discover teams</h3>
      <p className="text-text-secondary mb-6">
        Learn how to search and evaluate available teams for liftout.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Interactive tutorial would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip tutorial
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompanyPlatformTour({ onComplete }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Platform tour</h3>
      <p className="text-text-secondary mb-6">
        Explore key features and learn best practices for successful liftouts.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Interactive platform tour would go here</p>
        <button onClick={onComplete} className="btn-primary">
          Complete tour
        </button>
      </div>
    </div>
  );
}

export function TeamFormation({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Form or join a team</h3>
      <p className="text-text-secondary mb-6">
        Create a new team or join an existing one for liftout opportunities.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Team formation interface would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete team setup
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkillsExperience({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Skills & experience</h3>
      <p className="text-text-secondary mb-6">
        Showcase your team's expertise and track record.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Skills and experience form would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Save skills
          </button>
        </div>
      </div>
    </div>
  );
}

export function LiftoutPreferences({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Liftout preferences</h3>
      <p className="text-text-secondary mb-6">
        Set your availability and compensation expectations.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Preferences form would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip for now
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export function OpportunityDiscoveryTutorial({ onComplete, onSkip }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Explore opportunities</h3>
      <p className="text-text-secondary mb-6">
        Learn how to find and apply to liftout opportunities.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Tutorial interface would go here</p>
        <div className="flex justify-center space-x-4">
          {onSkip && (
            <button onClick={onSkip} className="text-link">
              Skip tutorial
            </button>
          )}
          <button onClick={onComplete} className="btn-primary">
            Complete tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamPlatformTour({ onComplete }: StepProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-text-primary mb-4">Platform tour</h3>
      <p className="text-text-secondary mb-6">
        Discover platform features and best practices for teams.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-tertiary">Interactive tour would go here</p>
        <button onClick={onComplete} className="btn-primary">
          Complete tour
        </button>
      </div>
    </div>
  );
}