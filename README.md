# Wellness Platform - Secure Session Management

A full-stack wellness session platform built with Next.js, TypeScript, MongoDB, and JWT authentication. This application allows users to create, manage, and share wellness sessions with features like auto-save drafts, secure authentication, and responsive design.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📝 Auto-Save Drafts**: Automatic draft saving every 5 seconds of inactivity
- **🧘 Session Management**: Create, edit, publish, and delete wellness sessions
- **🏷️ Tagging System**: Organize sessions with custom tags
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🔒 Protected Routes**: Secure route protection with middleware
- **🎨 Clean UI**: Modern, accessible design system with Tailwind CSS
- **⚡ Real-time Feedback**: Toast notifications for user actions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context API

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wellness-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellness-platform

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here-change-this-in-production

# Environment
NODE_ENV=development
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

### Session Management Endpoints

#### GET `/api/sessions`
Get all published wellness sessions (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "session-id",
      "title": "Morning Meditation",
      "tags": ["meditation", "morning"],
      "json_file_url": "https://example.com/session.json",
      "status": "published",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "author": "user@example.com"
    }
  ]
}
```

#### GET `/api/my-sessions`
Get all sessions for the authenticated user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "session-id",
      "title": "My Yoga Session",
      "tags": ["yoga", "beginner"],
      "json_file_url": "https://example.com/yoga.json",
      "status": "draft",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/my-sessions/[id]`
Get a specific session by ID (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "session-id",
    "title": "My Yoga Session",
    "tags": ["yoga", "beginner"],
    "json_file_url": "https://example.com/yoga.json",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/my-sessions/save-draft`
Save or update a session as draft (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "_id": "session-id", // Optional for updates
  "title": "My New Session",
  "tags": ["meditation", "evening"],
  "json_file_url": "https://example.com/session.json"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "session-id",
    "title": "My New Session",
    "tags": ["meditation", "evening"],
    "json_file_url": "https://example.com/session.json",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Draft saved successfully"
}
```

#### POST `/api/my-sessions/publish`
Publish a session (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "_id": "session-id", // Optional for new sessions
  "title": "My Published Session",
  "tags": ["meditation", "advanced"],
  "json_file_url": "https://example.com/session.json"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "session-id",
    "title": "My Published Session",
    "tags": ["meditation", "advanced"],
    "json_file_url": "https://example.com/session.json",
    "status": "published",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Session published successfully"
}
```

#### DELETE `/api/my-sessions/[id]`
Delete a session (requires authentication and ownership).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

## 🗂️ Project Structure

```
wellness-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── (dashboard)/       # Dashboard route group
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   └── my-sessions/   # Session management
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── sessions/      # Public sessions
│   │   │   └── my-sessions/   # User sessions
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Auth utilities
│   │   ├── auth-context.tsx   # Auth context
│   │   └── mongodb.ts         # Database connection
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── middleware.ts              # Next.js middleware
├── .env.example              # Environment variables example
└── README.md                 # This file
```

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Middleware-based route protection
- **Input Validation**: Zod schema validation for all inputs
- **CORS Protection**: Proper CORS configuration
- **Environment Variables**: Sensitive data stored in environment variables

## 🎨 Design System

The application uses a clean, mobile-first design system built with Tailwind CSS:

- **Colors**: Blue primary, gray neutrals, semantic colors for states
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 4px base unit with consistent spacing scale
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first approach with responsive breakpoints

## 🧪 Testing

To run tests (when implemented):

```bash
npm run test
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Node.js:

- Railway
- Render
- Netlify (with serverless functions)
- AWS
- Google Cloud Platform

## 🚀 Vercel Deployment

This application is optimized for deployment on Vercel. Follow these steps:

### 1. Push to GitHub

Make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Important Notes:**
- Never commit `.env.local` to GitHub
- Use Vercel's environment variables for production
- The `.env.example` file shows the required variables
- MongoDB connection string should include database name

### 4. Automatic Deployments

Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All open-source contributors who made this project possible
