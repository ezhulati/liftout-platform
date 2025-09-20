# Liftout - Team-Based Hiring Marketplace

The first dedicated marketplace for team-based hiring, connecting companies seeking intact teams with teams looking to move together.

## 🏗️ Architecture

This is a monorepo containing multiple applications and shared packages:

```
liftout/
├── apps/
│   ├── marketing-site/     # Astro 5 marketing website (liftout.com)
│   ├── web-app/           # Next.js 14 web application (app.liftout.com)
│   └── api-server/        # Express.js API server
├── packages/
│   ├── ui/                # Shared UI components
│   ├── database/          # Prisma schema and database utilities
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utility functions
├── infrastructure/        # Terraform and deployment configs
└── docs/                  # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm 9+
- PostgreSQL 15+
- Redis 7+
- Docker (optional, for local development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ezhulati/liftout.git
   cd liftout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Marketing site: http://localhost:4321
- Web app: http://localhost:3000  
- API server: http://localhost:8000

## 📦 Applications

### Marketing Site (`apps/marketing-site`)
- **Framework**: Astro 5
- **Purpose**: SEO-optimized marketing website
- **Features**: Landing pages, blog, industry pages
- **URL**: https://liftout.com

### Web Application (`apps/web-app`)
- **Framework**: Next.js 14 with App Router
- **Purpose**: Authenticated user dashboard and marketplace
- **Features**: Team management, opportunity browsing, messaging
- **URL**: https://app.liftout.com

### API Server (`apps/api-server`)
- **Framework**: Express.js with TypeScript
- **Purpose**: Backend API and business logic
- **Features**: REST API, WebSocket, authentication, payments
- **URL**: https://api.liftout.com

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run test         # Run all tests
npm run lint         # Lint all code
npm run type-check   # Type check all TypeScript

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio

# Docker
npm run docker:build # Build Docker containers
npm run docker:up    # Start containers
npm run docker:down  # Stop containers
```

### Code Quality

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** for testing
- **Playwright** for E2E testing

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/liftout"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External Services
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
SENDGRID_API_KEY="SG...."
ELASTICSEARCH_URL="http://localhost:9200"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test --workspace=apps/web-app

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

- [Technical Specification](./TECHNICAL_SPECIFICATION.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🚢 Deployment

### Development
- Automatic deployment to staging on push to `develop` branch
- Preview deployments for pull requests

### Production
- Manual deployment to production from `main` branch
- Infrastructure managed with Terraform
- Deployed on AWS ECS with RDS and ElastiCache

## 🔒 Security

- All data encrypted in transit and at rest
- GDPR and CCPA compliant
- SOC 2 Type II certified
- Regular security audits and penetration testing

## 📄 License

This project is proprietary software. See [LICENSE](./LICENSE) for details.

## 🤝 Contributing

Please read our [Contributing Guide](./docs/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

- Email: support@liftout.com
- Documentation: https://docs.liftout.com
- Status Page: https://status.liftout.com

---

Built with ❤️ by the Liftout team