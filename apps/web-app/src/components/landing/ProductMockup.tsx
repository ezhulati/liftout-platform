'use client';

import { MapPinIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid';

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
    yearsTogether: 5,
    avatars: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/67.jpg',
      'https://randomuser.me/api/portraits/women/17.jpg',
      'https://randomuser.me/api/portraits/men/52.jpg',
      'https://randomuser.me/api/portraits/women/63.jpg',
    ],
  },
  {
    name: 'Chen Healthcare Partners',
    tagline: 'Orthopedic surgery group',
    location: 'Houston, TX',
    members: 8,
    verified: true,
    skills: ['Spine Surgery', 'Sports Medicine', 'Joint Replacement'],
    yearsTogether: 8,
    avatars: [
      'https://randomuser.me/api/portraits/men/22.jpg',
      'https://randomuser.me/api/portraits/women/28.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/55.jpg',
      'https://randomuser.me/api/portraits/men/78.jpg',
      'https://randomuser.me/api/portraits/women/82.jpg',
      'https://randomuser.me/api/portraits/men/91.jpg',
      'https://randomuser.me/api/portraits/women/33.jpg',
    ],
  },
  {
    name: 'Burke Litigation Group',
    tagline: 'Commercial litigation practice',
    location: 'Washington, DC',
    members: 5,
    verified: true,
    skills: ['Securities', 'Class Actions', 'Antitrust'],
    yearsTogether: 3,
    avatars: [
      'https://randomuser.me/api/portraits/women/24.jpg',
      'https://randomuser.me/api/portraits/men/36.jpg',
      'https://randomuser.me/api/portraits/women/47.jpg',
      'https://randomuser.me/api/portraits/men/58.jpg',
      'https://randomuser.me/api/portraits/women/71.jpg',
    ],
  },
];

// Avatar stack component
function AvatarStack({ avatars, size = 'md' }: { avatars: string[]; size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  const overlapClasses = size === 'sm' ? '-ml-2' : '-ml-2.5';

  return (
    <div className="flex items-center">
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt=""
          className={`${sizeClasses} rounded-full border-2 border-white object-cover ${index > 0 ? overlapClasses : ''}`}
          style={{ zIndex: avatars.length - index }}
        />
      ))}
    </div>
  );
}

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
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <ClockIcon className="w-3 h-3" />
          <span className="font-medium">{team.yearsTogether}y together</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <AvatarStack avatars={team.avatars.slice(0, 4)} size="sm" />
        <span className="flex items-center gap-1 text-xs text-gray-500 truncate">
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
        <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
          <ClockIcon className="w-4 h-4" />
          <span className="font-medium">{team.yearsTogether}y together</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <AvatarStack avatars={team.avatars} size="md" />
        <span className="flex items-center gap-1.5 text-sm text-gray-500">
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
        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl max-w-[280px] mx-auto relative">
          {/* Phone notch - Dynamic Island style */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full z-10" />

          {/* Phone screen - proper iPhone aspect ratio */}
          <div className="bg-white rounded-[2rem] overflow-hidden relative min-h-[520px] flex flex-col">
            {/* Status bar */}
            <div className="bg-gray-100 px-6 pt-10 pb-2 flex justify-between items-center text-xs text-gray-500">
              <span>9:41</span>
              <span className="font-medium">Liftout</span>
              <span>●●●</span>
            </div>

            {/* Content - flex-1 to fill space */}
            <div className="px-4 pb-4 flex-1">
              {/* Search */}
              <div className="bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400 mb-4">
                Search teams...
              </div>

              {/* Results */}
              <p className="text-xs text-gray-600 mb-3">
                <span className="font-semibold">127 teams</span> near you
              </p>

              <div className="space-y-2">
                {mockTeams.map((team) => (
                  <TeamCardCompact key={team.name} team={team} />
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-3 pt-2">
              <div className="w-28 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
