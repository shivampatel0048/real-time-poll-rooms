# Real-Time Poll Rooms - Backend

Enterprise-grade backend API for real-time polling system built with Express, PostgreSQL, and Socket.IO.

## Tech Stack

- **Runtime:** Node.js (LTS)
- **Framework:** Express.js
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL
- **Real-time:** Socket.IO
- **Validation:** Zod
- **Security:** Helmet, express-rate-limit
- **Session:** Cookie-based voter tokens  

## Architecture

The backend follows a layered architecture pattern:

```
Routes → Controllers → Services → Models → Database
                                    ↓
                              Socket.IO (Real-time)
```

### Layers

- **Routes:** HTTP routing only
- **Controllers:** Request/response handling
- **Services:** Business logic
- **Models:** Database operations
- **Sockets:** Real-time events

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # PostgreSQL connection pool
│   │   ├── env.ts            # Environment validation
│   │   ├── migrate.ts        # Database migration script
│   │   └── schema.sql        # Database schema
│   ├── controllers/
│   │   ├── poll.controller.ts
│   │   └── vote.controller.ts
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── voterToken.middleware.ts
│   ├── models/
│   │   ├── poll.model.ts
│   │   └── vote.model.ts
│   ├── routes/
│   │   ├── health.routes.ts
│   │   ├── poll.routes.ts
│   │   └── vote.routes.ts
│   ├── services/
│   │   ├── poll.service.ts
│   │   └── vote.service.ts
│   ├── sockets/
│   │   └── poll.socket.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   └── models.types.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── app.ts                # Express app configuration
│   └── server.ts             # HTTP server & Socket.IO setup
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites

- Node.js v18+ (LTS)
- PostgreSQL v14+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/poll_rooms
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-secret-key-min-32-characters-long-for-production
   ```

4. **Create PostgreSQL database**

   ```bash
   createdb poll_rooms
   ```

5. **Run database migrations**

   ```bash
   npm run migrate
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-14T12:00:00.000Z"
}
```

### Create Poll

```
POST /api/polls
```

**Request Body:**

```json
{
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "pollId": "uuid-here",
    "shareUrl": "http://localhost:3000/poll/uuid-here"
  }
}
```

**Rate Limit:** 10 requests per 15 minutes

### Get Poll

```
GET /api/polls/:pollId
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "question": "What is your favorite color?",
    "options": [
      {
        "id": "option-uuid-1",
        "text": "Red",
        "voteCount": 5
      },
      {
        "id": "option-uuid-2",
        "text": "Blue",
        "voteCount": 3
      }
    ],
    "totalVotes": 8
  }
}
```

### Submit Vote

```
POST /api/votes
```

**Request Body:**

```json
{
  "pollId": "uuid-here",
  "optionId": "option-uuid-1"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "voted": true
  }
}
```

**Rate Limit:** 5 requests per minute

**Anti-Abuse:**

- Voter token (HttpOnly cookie) prevents duplicate votes
- Database constraint ensures one vote per token per poll
- IP address logged for soft detection
- Rate limiting prevents spam

## Socket.IO Events

### Client → Server

**Join Poll Room:**

```javascript
socket.emit("join_poll_room", pollId);
```

**Leave Poll Room:**

```javascript
socket.emit("leave_poll_room", pollId);
```

### Server → Client

**Vote Update:**

```javascript
socket.on("vote_update", (data) => {
  // data: { pollId, options, totalVotes }
});
```

## Database Schema

### polls

```sql
id          UUID PRIMARY KEY
question    TEXT NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
```

### poll_options

```sql
id          UUID PRIMARY KEY
poll_id     UUID REFERENCES polls(id) ON DELETE CASCADE
text        TEXT NOT NULL
vote_count  INTEGER DEFAULT 0
UNIQUE(poll_id, text)
```

### votes

```sql
id           UUID PRIMARY KEY
poll_id      UUID REFERENCES polls(id) ON DELETE CASCADE
option_id    UUID REFERENCES poll_options(id) ON DELETE CASCADE
voter_token  VARCHAR(255) NOT NULL
ip_address   VARCHAR(45)
created_at   TIMESTAMP DEFAULT NOW()
UNIQUE(poll_id, voter_token)
```

## Security Features

- **Helmet:** Security headers
- **CORS:** Configured for frontend URL
- **Rate Limiting:** Prevents API abuse
- **Input Validation:** Zod schema validation
- **SQL Injection Protection:** Parameterized queries
- **XSS Protection:** Input sanitization
- **HttpOnly Cookies:** Secure voter token storage
- **Environment Validation:** Zod schema for env vars

## Scripts

```bash
npm run dev          # Start development server with watch mode
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run migrate      # Run database migrations
npm run lint         # Lint TypeScript files
npm test             # Run tests
```

## Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**HTTP Status Codes:**

- `200` - Success (GET)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint for linting
- No `any` types allowed
- Explicit function return types
- Async/await over callbacks

### Best Practices

- Atomic database transactions
- Connection pooling
- Graceful shutdown handling
- Error boundaries
- Logging in development mode

## Production Deployment

### Environment Variables

Ensure all required environment variables are set:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Production frontend URL
- `JWT_SECRET` - Min 32 characters

### Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting active
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Logging configured
- [ ] Database backups configured
- [ ] Health check endpoint tested
