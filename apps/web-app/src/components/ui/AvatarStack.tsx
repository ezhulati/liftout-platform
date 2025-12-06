'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Member {
  id: string;
  userId?: string;
  name: string;
  role?: string;
  avatar?: string | null;
}

interface AvatarStackProps {
  members: Member[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  linkToProfile?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    avatar: 'w-7 h-7',
    overlap: '-ml-2',
    overflow: 'w-7 h-7 text-xs',
    fontSize: 'text-[10px]',
  },
  md: {
    avatar: 'w-9 h-9',
    overlap: '-ml-2.5',
    overflow: 'w-9 h-9 text-sm',
    fontSize: 'text-xs',
  },
  lg: {
    avatar: 'w-11 h-11',
    overlap: '-ml-3',
    overflow: 'w-11 h-11 text-base',
    fontSize: 'text-sm',
  },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function AvatarStack({
  members,
  maxVisible = 4,
  size = 'md',
  showTooltip = true,
  linkToProfile = false,
  className = '',
}: AvatarStackProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const config = sizeConfig[size];

  const visibleMembers = members.slice(0, maxVisible);
  const overflowCount = members.length - maxVisible;
  const overflowMembers = members.slice(maxVisible);

  const renderAvatar = (member: Member, index: number) => {
    const avatarContent = member.avatar ? (
      <img
        src={member.avatar}
        alt={member.name}
        className={`${config.avatar} rounded-full border-2 border-white object-cover`}
      />
    ) : (
      <div
        className={`${config.avatar} rounded-full border-2 border-white flex items-center justify-center text-white font-medium ${config.fontSize} ${getAvatarColor(member.name)}`}
      >
        {getInitials(member.name)}
      </div>
    );

    const wrapper = (
      <div
        key={member.id}
        className={`relative ${index > 0 ? config.overlap : ''} hover:z-20 transition-transform hover:scale-110`}
        style={{ zIndex: members.length - index }}
        title={showTooltip ? `${member.name}${member.role ? ` - ${member.role}` : ''}` : undefined}
      >
        {avatarContent}
      </div>
    );

    if (linkToProfile && member.userId) {
      return (
        <Link key={member.id} href={`/app/profile/${member.userId}`}>
          {wrapper}
        </Link>
      );
    }

    return wrapper;
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {visibleMembers.map((member, index) => renderAvatar(member, index))}

      {overflowCount > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className={`${config.overflow} ${config.overlap} rounded-full border-2 border-white bg-gray-200 text-gray-600 font-medium flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer`}
            style={{ zIndex: 0 }}
          >
            +{overflowCount}
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
              {overflowMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-3 py-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAvatarColor(member.name)}`}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    {member.role && (
                      <p className="text-xs text-gray-500 truncate">{member.role}</p>
                    )}
                  </div>
                  {/* Online indicator */}
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
