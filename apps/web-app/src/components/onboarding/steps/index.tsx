// Placeholder components for remaining onboarding steps
// These would be fully implemented in a production app

interface StepProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function CompanyVerification({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Company verification</h3>
        <p className="text-base text-text-secondary">
          Upload documents to verify your company and build trust with teams.
        </p>
      </div>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-xl p-8">
          <p className="text-base text-text-tertiary text-center">Upload verification documents (Demo)</p>
        </div>
        {/* Practical UI: Left-aligned button group, primary first */}
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Complete verification
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FirstOpportunityCreation({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Create your first opportunity</h3>
        <p className="text-base text-text-secondary">
          Post your first liftout opportunity to start attracting teams.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">This would redirect to the opportunity creation form</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Create opportunity
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeamDiscoveryTutorial({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Discover teams</h3>
        <p className="text-base text-text-secondary">
          Learn how to search and evaluate available teams for liftout.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Interactive tutorial would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Complete tutorial
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CompanyPlatformTour({ onComplete }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Platform tour</h3>
        <p className="text-base text-text-secondary">
          Explore key features and learn best practices for successful liftouts.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Interactive platform tour would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Complete tour
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamFormation({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Form or join a team</h3>
        <p className="text-base text-text-secondary">
          Create a new team or join an existing one for liftout opportunities.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Team formation interface would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Complete team setup
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkillsExperience({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Skills & experience</h3>
        <p className="text-base text-text-secondary">
          Showcase your team's expertise and track record.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Skills and experience form would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Save skills
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LiftoutPreferences({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Liftout preferences</h3>
        <p className="text-base text-text-secondary">
          Set your availability and compensation expectations.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Preferences form would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Save preferences
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function OpportunityDiscoveryTutorial({ onComplete, onSkip }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Explore opportunities</h3>
        <p className="text-base text-text-secondary">
          Learn how to find and apply to liftout opportunities.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Tutorial interface would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Complete tutorial
          </button>
          {onSkip && (
            <button onClick={onSkip} className="text-link min-h-12">
              Skip tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeamPlatformTour({ onComplete }: StepProps) {
  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-2">Platform tour</h3>
        <p className="text-base text-text-secondary">
          Discover platform features and best practices for teams.
        </p>
      </div>
      <div className="space-y-6">
        <p className="text-base text-text-tertiary text-center">Interactive tour would go here</p>
        <div className="flex items-center gap-4">
          <button onClick={onComplete} className="btn-primary min-h-12">
            Complete tour
          </button>
        </div>
      </div>
    </div>
  );
}