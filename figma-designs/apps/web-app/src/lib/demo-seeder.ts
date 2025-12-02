// Demo seeder stub - Firebase has been removed from this project
// Database seeding is now done via /api/seed endpoint with Prisma

export const DemoSeeder = {
  async seedAllDemoData(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Firebase demo seeder has been removed. Use /api/seed endpoint instead.',
    };
  },

  async clearDemoData(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Firebase demo seeder has been removed. Use database directly.',
    };
  },
};
