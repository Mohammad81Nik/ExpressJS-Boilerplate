# Backend Boilerplate

A production-ready Node.js/Express backend boilerplate with TypeScript, Prisma ORM, and comprehensive testing setup.

## Features

- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Express 5** - Modern Express with async/await support
- ✅ **Prisma ORM** - Type-safe database access with PostgreSQL
- ✅ **Zod Validation** - Runtime type validation for requests
- ✅ **Vitest** - Fast unit and integration testing
- ✅ **Docker** - Dev, test, and production environments
- ✅ **Code Generation** - Scaffold modules with consistent patterns
- ✅ **ESLint + Prettier** - Code quality and formatting
- ✅ **Husky** - Pre-commit hooks for code quality

## Architecture

```
src/
├── app/           # Express app configuration
├── config/        # Environment configuration with Zod validation
├── controllers/   # Request handlers
├── services/      # Business logic layer
├── repositories/  # Data access layer (Prisma)
├── routes/        # Route definitions
├── middleware/    # Custom middleware (validation, errors)
├── validation/    # Zod schemas
├── utils/         # Utilities (custom errors)
└── server.ts      # Server entry point

tests/
├── unit/          # Unit tests (controller, service, repository)
├── integration/   # Integration tests (full HTTP)
└── setup/         # Test environment setup
```

## Prerequisites

- Node.js 24+
- PostgreSQL 16+
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
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:8000`

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

## Project Structure Explained

### Layered Architecture

1. **Routes** - Define endpoints and apply middleware
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Business logic and validation
4. **Repositories** - Database operations via Prisma
5. **Validation** - Zod schemas for request validation

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

| Variable            | Description                               | Required |
| ------------------- | ----------------------------------------- | -------- |
| `NODE_ENV`          | Environment (development/test/production) | Yes      |
| `PORT`              | Server port                               | Yes      |
| `ORIGINS`           | CORS allowed origins (comma-separated)    | No       |
| `DATABASE_URL_DEV`  | Development database URL                  | Yes      |
| `DATABASE_URL_TEST` | Test database URL                         | Yes      |
| `DATABASE_URL_PROD` | Production database URL                   | Yes      |

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
