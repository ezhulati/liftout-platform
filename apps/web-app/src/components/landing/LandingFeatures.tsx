import {
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Intact Team Acquisition',
    description: 'Hire complete, high-performing teams with established relationships and proven collaboration patterns.',
    icon: UserGroupIcon,
  },
  {
    name: 'Verified Performance',
    description: 'Access teams with documented track records, client testimonials, and quantifiable achievements.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Immediate Productivity',
    description: 'Teams hit the ground running with existing processes, trust, and institutional knowledge intact.',
    icon: RocketLaunchIcon,
  },
  {
    name: 'Strategic Expansion',
    description: 'Rapidly enter new markets or capabilities without the risks of mergers or individual hiring.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Confidential Process',
    description: 'Discrete exploration and negotiation protecting current employment relationships and sensitive information.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Success Analytics',
    description: 'Track integration outcomes, team performance, and measure the impact of your liftout investments.',
    icon: ChartBarIcon,
  },
];

export function LandingFeatures() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            The smart alternative to mergers and individual hiring
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Liftout enables strategic team acquisition with lower risk, faster integration, and immediate impact.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}