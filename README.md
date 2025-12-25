# Backend Boilerplate

A production-ready Node.js/Express backend boilerplate with TypeScript, Prisma ORM, and comprehensive testing setup.

## Features

- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Express 5** - Modern Express with async/await support
- ✅ **Prisma ORM** - Type-safe database access with PostgreSQL
- ✅ **Authentication** - OTP-based email authentication with JWT
- ✅ **Redis** - Caching and session management
- ✅ **BullMQ** - Background job processing for emails
- ✅ **Nodemailer** - Email delivery for OTP codes
- ✅ **Jose** - Secure JWT token generation and validation
- ✅ **Zod Validation** - Runtime type validation for requests
- ✅ **Vitest** - Fast unit and integration testing
- ✅ **Docker** - Dev, test, and production environments
- ✅ **Code Generation** - Scaffold modules with consistent patterns
- ✅ **ESLint + Prettier** - Code quality and formatting
- ✅ **Husky** - Pre-commit hooks for code quality
- ✅ **Bull Board** - Queue monitoring dashboard

## Architecture

```
src/
├── app/              # Express app configuration
├── config/           # Environment configuration with Zod validation
├── controllers/      # Request handlers
├── services/         # Business logic layer
├── repositories/     # Data access layer (Prisma + Redis)
├── routes/           # Route definitions
├── middleware/       # Custom middleware (validation, errors, auth)
├── validation/       # Zod schemas
├── utils/            # Utilities (custom errors, JWT, OTP)
├── infrastructure/   # External services (Redis, BullMQ)
├── jobs/             # Background jobs
│   ├── queues/       # BullMQ queue definitions
│   └── workers/      # Job processors
└── server.ts         # Server entry point

tests/
├── unit/             # Unit tests (controller, service, repository)
├── integration/      # Integration tests (full HTTP)
└── setup/            # Test environment setup
```

## Prerequisites

- Node.js 24+
- PostgreSQL 16+
- Redis 7+
- npm or pnpm

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd backend-boilerplate
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
NODE_ENV=development
PORT=8000
ORIGINS=http://localhost:3000

DATABASE_URL_DEV=postgresql://user:password@localhost:5432/mydb
DATABASE_URL_TEST=postgresql://user:password@localhost:5432/mydb-test
DATABASE_URL_PROD=postgresql://user:password@localhost:5432/mydb-prod

REDIS_URL=redis://localhost:6379

JWT_SECRET=your-secret-key-here
JWT_EXPIRY_TIME=86400

OTP_TTL_SECONDS=120
REGISTER_TOKEN_TTL_SECONDS=900

OTP_EMAIL=your-email@gmail.com
OTP_EMAIL_PASS=your-app-password
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or install locally
brew install redis  # macOS
redis-server        # Start Redis
```

### 5. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:8000`

Bull Board (queue monitoring) available at `http://localhost:8000/admin/queues`

## Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run generate <name>  # Generate new module
```

## Generate New Module

Quickly scaffold a new module with all layers:

```bash
npm run generate user
```

This creates:

- `src/controllers/user.controller.ts`
- `src/services/user.service.ts`
- `src/repositories/user.repository.ts`
- `src/routes/user.router.ts`
- `src/validation/user.schema.ts`
- `tests/unit/user/*.test.ts`
- `tests/integration/user/*.test.ts`

**Next steps after generation:**

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Define fields in validation schema
4. Update test data
5. Register route in `src/app/index.ts`

## Docker

### Development

```bash
cd docker/dev
docker-compose -f docker-compose.dev.yml up
```

### Production

```bash
cd docker/prod
docker-compose -f docker-compose.prod.yml up
```

### Testing

```bash
cd docker/test
docker-compose -f docker-compose.test.yml up
```

## Testing

Tests use Vitest with real database connections for integration testing.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Test Structure:**

- **Unit tests** - Test individual layers with database cleanup
- **Integration tests** - Full HTTP request/response cycle
- **Setup** - Automatic database reset before tests

## Authentication Flow

The boilerplate includes a complete OTP-based email authentication system:

### Flow Overview

1. **Send OTP** - User requests OTP via email
   - OTP generated and hashed with bcrypt
   - Stored in Redis with 2-minute TTL
   - Email sent via BullMQ background job

2. **Verify OTP** - User submits OTP code
   - Validates against Redis cache
   - New users receive temporary registration token
   - Existing users receive access token

3. **Register** - New users complete registration
   - Validates temporary token
   - Creates user account
   - Returns access token

### Endpoints

```bash
POST /auth/send-otp
Body: { "email": "user@example.com" }

POST /auth/verify-otp
Body: { "email": "user@example.com", "code": "123456" }

POST /auth/register
Headers: { "temp_token": "<token>" }
Body: { "name": "John Doe" }
```

### Technologies

- **Jose** - JWT signing and verification
- **Nodemailer** - Email delivery
- **BullMQ** - Async email job processing
- **Redis** - OTP caching and token management
- **Bcrypt** - OTP hashing

## Project Structure Explained

### Layered Architecture

1. **Routes** - Define endpoints and apply middleware
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Business logic and validation
4. **Repositories** - Database operations via Prisma and Redis
5. **Validation** - Zod schemas for request validation
6. **Jobs** - Background task processing with BullMQ

### Error Handling

Custom error classes with HTTP status codes:

- `NotFoundError` (404)
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)

Errors are caught by `errorMiddleware` and returned as JSON.

### Validation

Zod schemas validate `body`, `params`, and `query`:

```typescript
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
});
```

Validation errors return 422 with field-specific messages.

## Environment Variables

| Variable                     | Description                               | Required | Default |
| ---------------------------- | ----------------------------------------- | -------- | ------- |
| `NODE_ENV`                   | Environment (development/test/production) | Yes      | -       |
| `PORT`                       | Server port                               | Yes      | 8000    |
| `ORIGINS`                    | CORS allowed origins (comma-separated)    | No       | -       |
| `DATABASE_URL_DEV`           | Development database URL                  | Yes      | -       |
| `DATABASE_URL_TEST`          | Test database URL                         | Yes      | -       |
| `DATABASE_URL_PROD`          | Production database URL                   | Yes      | -       |
| `REDIS_URL`                  | Redis connection URL                      | Yes      | -       |
| `JWT_SECRET`                 | Secret key for JWT signing                | Yes      | -       |
| `JWT_EXPIRY_TIME`            | JWT expiration time (seconds)             | Yes      | -       |
| `OTP_TTL_SECONDS`            | OTP validity duration                     | No       | 120     |
| `REGISTER_TOKEN_TTL_SECONDS` | Registration token validity               | No       | 900     |
| `OTP_EMAIL`                  | Email address for sending OTPs            | Yes      | -       |
| `OTP_EMAIL_PASS`             | Email app password                        | Yes      | -       |

All environment variables are validated on startup using Zod.

## Code Quality

### Pre-commit Hooks

Husky runs on every commit:

- Prettier formatting
- ESLint linting

### Linting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Formatting

```bash
npm run format         # Format all files
npm run format:check   # Check formatting
```

## Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Set production environment variables

3. Run migrations:

```bash
npm run deploy
```

4. Start server:

```bash
npm start
```

Or use Docker:

```bash
docker-compose -f docker/prod/docker-compose.prod.yml up -d
```

## License

ISC

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

---

Built with ❤️ using Node.js, TypeScript, and Prisma
