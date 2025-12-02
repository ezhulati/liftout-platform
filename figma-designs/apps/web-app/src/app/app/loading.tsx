'use client';

export default function AppLoading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-navy/20" />
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-navy border-t-transparent animate-spin" />
        </div>
        <p className="text-text-secondary text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );
}
