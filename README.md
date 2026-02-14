# Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share them via links, and collect votes with real-time result updates.

## 🚀 Live Demo

**Frontend:** [https://real-time-poll-rooms.vercel.app](https://real-time-poll-rooms.vercel.app)  
**Backend API:** [https://real-time-poll-rooms-backend.onrender.com](https://real-time-poll-rooms-backend.onrender.com)

## 📋 Features

✅ **Poll Creation** - Create polls with questions and multiple options  
✅ **Shareable Links** - Generate unique URLs for poll sharing  
✅ **Single-Choice Voting** - Users can vote on one option per poll  
✅ **Real-Time Updates** - Live result synchronization using Socket.IO  
✅ **Anti-Abuse Protection** - Multiple mechanisms to prevent vote manipulation  
✅ **Data Persistence** - PostgreSQL database with permanent storage  
✅ **Responsive Design** - Mobile-friendly interface  
✅ **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL
- **Real-Time:** Socket.IO
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **State Management:** React Hooks
- **API Client:** Axios
- **Real-Time:** Socket.IO Client

## 🏗️ Architecture

### Backend Structure

```
backend/
├── src/
│   ├── config/          # Environment & database setup
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Validation, security, rate limiting
│   ├── models/          # Database operations
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── sockets/         # Real-time event handling
│   ├── types/           # TypeScript definitions
│   └── utils/           # Helper functions
```

### Database Schema

```sql
-- Polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY,
  question TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Poll options table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
  voter_token VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_vote_per_token UNIQUE (poll_id, voter_token)
);
```

## 🔒 Anti-Abuse Mechanisms

### 1. Voter Token System (Primary Protection)

**Implementation:** HttpOnly cookies store unique voter tokens per poll

- **What it prevents:** Multiple votes from the same user on the same poll
- **How it works:** Each user gets a unique UUID token stored in an HttpOnly cookie when they first visit a poll. Database constraints prevent duplicate votes with the same token.
- **Limitations:** Users can clear cookies to bypass, but this provides basic protection against casual abuse.

### 2. Rate Limiting (Secondary Protection)

**Implementation:** Express rate limiter with different thresholds

- **What it prevents:** Rapid-fire voting and poll creation spam
- **How it works:**
  - Voting: 5 votes per minute per IP
  - Poll creation: 10 polls per minute per IP
  - General API: 100 requests per 15 minutes per IP
- **Limitations:** IP-based limiting can be bypassed with VPNs or proxies, but provides effective protection against automated abuse.

## ⚠️ Edge Cases Handled

### Input Validation

- Minimum 2 options required for poll creation
- Maximum 10 options allowed
- Question length: 5-500 characters
- Option text: 1-200 characters per option
- Duplicate options prevented
- Invalid poll IDs return 404

### Voting Logic

- Users cannot vote on non-existent polls
- Invalid option IDs rejected
- Duplicate votes blocked by token system
- Vote counts updated atomically with database transactions

### Real-Time Updates

- Socket.IO connection errors handled gracefully
- Automatic reconnection on network issues
- Room-based broadcasting prevents cross-poll contamination
- Error events emitted for client-side error handling

### Security

- CORS configured for frontend domain only
- Helmet security headers applied
- SQL injection prevented with parameterized queries
- Input sanitization and validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL and other environment variables
npm run setup-db  # Create database tables
npm run dev       # Start development server
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env.local
# Configure NEXT_PUBLIC_API_URL
npm run dev       # Start development server
```

## 📡 API Endpoints

### Create Poll

```http
POST /api/polls
{
  "question": "What's your favorite color?",
  "options": ["Red", "Blue", "Green"]
}
```

### Get Poll

```http
GET /api/polls/:pollId
```

### Vote

```http
POST /api/votes
{
  "pollId": "uuid",
  "optionId": "uuid"
}
```

### Health Check

```http
GET /api/health
```

## 🔌 Socket.IO Events

### Client → Server

- `join_poll_room` - Join a poll's real-time room

### Server → Client

- `vote_update` - Real-time vote count updates
- `error` - Error notifications

## 🔧 Environment Variables

### Backend (.env)

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-frontend-url.com
CORS_ORIGIN=https://your-frontend-url.com
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 🚢 Deployment

### Backend (Render)

- Connected to GitHub repository
- Automatic deployments on push to main
- PostgreSQL database provisioned
- Environment variables configured

### Frontend (Vercel)

- Connected to GitHub repository
- Automatic deployments on push to main
- Environment variables configured
- Optimized for performance

## 🐛 Known Limitations & Future Improvements

### Current Limitations

1. **No User Authentication** - Anonymous voting only
2. **No Poll Expiration** - Polls persist indefinitely
3. **No Admin Controls** - Cannot edit or delete polls
4. **Basic Anti-Abuse** - Advanced abuse prevention could be enhanced
5. **No Analytics** - No tracking of poll performance metrics

### Potential Improvements

1. **User Accounts** - Allow users to manage their polls
2. **Poll Settings** - Expiration dates, private polls, multiple votes
3. **Advanced Security** - CAPTCHA, device fingerprinting, behavioral analysis
4. **Performance** - Caching layer, CDN for static assets
5. **Features** - Poll templates, voting history, export results
6. **Mobile App** - React Native companion app
7. **Real-time Chat** - Discussion feature for polls
8. **Analytics Dashboard** - Poll creator insights and metrics
