import {
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  MapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Team Discovery',
    description: 'Browse verified high-performing teams filtered by industry, skills, location, and availability. Find the perfect match for your strategic needs.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Due Diligence Tools',
    description: 'Access comprehensive reference checks, performance verification, and cultural fit assessments before making your decision.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Confidential Process',
    description: 'Discrete exploration and negotiation that protects sensitive information and maintains professional relationships.',
    icon: LockClosedIcon,
  },
  {
    name: 'Integration Planning',
    description: 'Structured onboarding roadmaps, success metrics, and milestone tracking to ensure seamless team transitions.',
    icon: MapIcon,
  },
  {
    name: 'Market Intelligence',
    description: 'Industry-specific compensation benchmarks, talent flow trends, and competitive landscape insights.',
    icon: ChartBarIcon,
  },
  {
    name: 'Success Analytics',
    description: 'Track ROI on team acquisitions, monitor integration outcomes, and measure long-term business impact.',
    icon: ArrowTrendingUpIcon,
  },
];

export function CompanyFeatures() {
  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <p className="text-gold-600 font-semibold tracking-wider uppercase text-xs mb-4">
            Platform Features
          </p>
          <h2
            id="features-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            Everything you need to acquire proven teams
          </h2>
          <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed">
            Our platform streamlines the entire team acquisition process, from discovery through
            successful integration.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <article
              key={feature.name}
              className="group relative bg-bg-surface rounded-xl p-8 border border-border hover:border-navy/40 transition-all duration-base ease-out-quart hover:shadow-lg"
            >
              {/* Icon container */}
              <div className="w-14 h-14 rounded-lg bg-navy flex items-center justify-center mb-6 transition-all duration-base ease-out-quart group-hover:bg-navy-600 group-hover:shadow-navy">
                <feature.icon className="w-7 h-7 text-gold" aria-hidden="true" />
              </div>

              {/* Feature title */}
              <h3 className="font-heading text-xl font-bold text-text-primary leading-snug mb-3">
                {feature.name}
              </h3>

              {/* Feature description */}
              <p className="font-body text-text-secondary leading-relaxed text-base">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-navy/0 via-navy/60 to-navy/0 opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* How it works section */}
        <div className="mt-20 lg:mt-28">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-4">
              How Team Acquisition Works
            </h3>
            <p className="font-body text-text-secondary leading-relaxed">
              A streamlined process designed for strategic, confidential talent acquisition.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Define Your Needs',
                description: 'Specify the team profile, skills, and strategic objectives for your acquisition.',
              },
              {
                step: '02',
                title: 'Discover Teams',
                description: 'Browse verified teams that match your criteria, all with documented track records.',
              },
              {
                step: '03',
                title: 'Due Diligence',
                description: 'Conduct reference checks, cultural assessments, and performance verification.',
              },
              {
                step: '04',
                title: 'Integrate & Succeed',
                description: 'Execute a structured transition with onboarding support and success tracking.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                {/* Step number */}
                <div className="w-16 h-16 rounded-full bg-navy mx-auto mb-4 flex items-center justify-center shadow-navy">
                  <span className="font-heading text-xl font-bold text-gold">{item.step}</span>
                </div>
                {/* Title */}
                <h4 className="font-heading text-lg font-bold text-text-primary mb-2">
                  {item.title}
                </h4>
                {/* Description */}
                <p className="font-body text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
