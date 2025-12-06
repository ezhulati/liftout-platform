'use client';

import { StarIcon, MapPinIcon, UsersIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

// Sample team data for the mockup
// Teams from target industries: Investment Banking, Law, Consulting, Healthcare, PE
const mockTeams = [
  {
    name: 'Sterling TMT Group',
    tagline: 'Tech M&A advisory team',
    location: 'New York, NY',
    members: 6,
    verified: true,
    skills: ['Tech M&A', 'Valuations', 'IPO'],
    rating: 4.9,
  },
  {
    name: 'Chen Healthcare Partners',
    tagline: 'Orthopedic surgery group',
    location: 'Houston, TX',
    members: 8,
    verified: true,
    skills: ['Spine Surgery', 'Sports Medicine', 'Joint Replacement'],
    rating: 4.8,
  },
  {
    name: 'Burke Litigation Group',
    tagline: 'Commercial litigation practice',
    location: 'Washington, DC',
    members: 5,
    verified: false,
    skills: ['Securities', 'Class Actions', 'Antitrust'],
    rating: 4.7,
  },
];

// Compact team card for mobile
function TeamCardCompact({ team }: { team: typeof mockTeams[0] }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{team.name}</h4>
            {team.verified && (
              <CheckBadgeIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{team.tagline}</p>
        </div>
        <div className="flex items-center gap-0.5 text-xs text-amber-500">
          <StarIcon className="w-3 h-3" />
          <span className="font-medium">{team.rating}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <UsersIcon className="w-3 h-3" />
          {team.members}
        </span>
        <span className="flex items-center gap-1 truncate">
          <MapPinIcon className="w-3 h-3" />
          {team.location}
        </span>
      </div>
    </div>
  );
}

// Full team card for desktop
function TeamCardFull({ team }: { team: typeof mockTeams[0] }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-base">{team.name}</h4>
            {team.verified && (
              <CheckBadgeIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{team.tagline}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
          <StarIcon className="w-4 h-4" />
          <span className="font-semibold">{team.rating}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <UsersIcon className="w-4 h-4" />
          {team.members} members
        </span>
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="w-4 h-4" />
          {team.location}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {team.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProductMockup() {
  return (
    <div className="relative">
      {/* Desktop mockup - shown on lg screens */}
      <div className="hidden lg:block">
        <div className="bg-gray-100 rounded-2xl p-1.5 shadow-2xl border border-gray-200">
          {/* Browser chrome */}
          <div className="bg-gray-200 rounded-t-xl px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>

          {/* App content */}
          <div className="bg-white rounded-b-xl overflow-hidden">
            {/* Search/filter bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400">
                  Search teams by skills, location, or industry...
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">Filters</span>
                  <span className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm">Search</span>
                </div>
              </div>
            </div>

            {/* Results header */}
            <div className="px-6 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">127 teams</span> available
              </p>
              <span className="text-sm text-gray-500">Sort: Best match</span>
            </div>

            {/* Team cards */}
            <div className="px-6 pb-6 space-y-3">
              {mockTeams.map((team) => (
                <TeamCardFull key={team.name} team={team} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet mockup - shown on md screens */}
      <div className="hidden md:block lg:hidden">
        <div className="bg-gray-800 rounded-3xl p-2 shadow-2xl max-w-md mx-auto">
          {/* Tablet bezel */}
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Status bar */}
            <div className="bg-gray-100 px-4 py-1 flex justify-between items-center text-xs text-gray-500">
              <span>9:41</span>
              <span>Liftout</span>
              <span>100%</span>
            </div>

            {/* Search */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-400">
                Search teams...
              </div>
            </div>

            {/* Results */}
            <div className="px-4 py-2">
              <p className="text-xs text-gray-600 mb-3">
                <span className="font-semibold">127 teams</span> available
              </p>
              <div className="space-y-2">
                {mockTeams.map((team) => (
                  <TeamCardCompact key={team.name} team={team} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile mockup - shown on small screens */}
      <div className="block md:hidden">
        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl max-w-[280px] mx-auto">
          {/* Phone notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />

          {/* Phone screen */}
          <div className="bg-white rounded-[2rem] overflow-hidden relative">
            {/* Status bar */}
            <div className="bg-gray-100 px-6 pt-8 pb-2 flex justify-between items-center text-xs text-gray-500">
              <span>9:41</span>
              <span className="font-medium">Liftout</span>
              <span>●●●</span>
            </div>

            {/* Content */}
            <div className="px-4 pb-6">
              {/* Search */}
              <div className="bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400 mb-4">
                Search teams...
              </div>

              {/* Results */}
              <p className="text-xs text-gray-600 mb-3">
                <span className="font-semibold">127 teams</span> near you
              </p>

              <div className="space-y-2">
                {mockTeams.slice(0, 2).map((team) => (
                  <TeamCardCompact key={team.name} team={team} />
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-2">
              <div className="w-24 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
