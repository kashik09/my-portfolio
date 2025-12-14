# Kashi Kweyu Portfolio

A modern, full-stack portfolio website built with Next.js 14, featuring a CMS for content management, authentication, and a complete admin dashboard for managing projects and client requests.

## Features

### Core Features
- **Multi-Theme System**: 5 distinct themes (Pastel, Neon, Minimal, Retro, Nature) with light/dark mode support
- **Responsive Design**: Fully responsive across all devices
- **Authentication**: NextAuth.js with Google OAuth and Email providers
- **Database**: PostgreSQL with Prisma ORM
- **Admin Dashboard**: Complete project and request management
- **Theme-Aware Components**: All UI components adapt to selected theme
- **Accessibility**: WCAG AA compliant color contrast

### Pages
- **Home**: Hero section with call-to-action
- **Projects**: Filterable project portfolio with search
- **Services**: Service offerings with pricing
- **About**: Personal bio and experience
- **Request Service**: Contact form for project inquiries
- **Admin Dashboard**: Project and request management (protected)

### UI Components
- **Button**: Enhanced with loading states, icon support, and multiple variants
- **Toast**: Notification system with auto-dismiss
- **Spinner**: Loading indicator with size variants
- **Card**: Flexible card component
- **Input**: Form input with theme support
- **Header**: Navigation with theme switcher
- **Footer**: Site footer with social links

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod

### Development
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **TypeScript**: Strict mode enabled

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- Google OAuth credentials (optional)
- Email server credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-portfolio
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Provider (optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@example.com"
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed the database
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-portfolio/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Auth pages group
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── (main)/              # Main pages group
│   │   ├── about/           # About page
│   │   ├── projects/        # Projects page
│   │   ├── request/         # Request service page
│   │   └── services/        # Services page
│   ├── admin/               # Admin dashboard
│   │   ├── projects/        # Project management
│   │   └── page.tsx         # Dashboard home
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── projects/        # Projects API
│   │   └── requests/        # Requests API
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles & themes
├── components/              # React components
│   ├── ui/                  # UI components
│   │   ├── Button.tsx       # Button component
│   │   ├── Card.tsx         # Card component
│   │   ├── Input.tsx        # Input component
│   │   ├── Spinner.tsx      # Spinner component
│   │   └── Toast.tsx        # Toast notification
│   ├── Header.tsx           # Site header
│   ├── Footer.tsx           # Site footer
│   ├── Hero.tsx             # Hero section
│   ├── theme-provider.tsx   # Theme context provider
│   └── theme-switcher.tsx   # Theme switcher UI
├── lib/                     # Utilities & helpers
│   ├── auth.ts              # Auth helper functions
│   ├── utils.ts             # General utilities
│   └── ThemeContext.tsx     # Theme context
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies

## Database Schema

### User
- `id`: String (Primary key)
- `name`: String
- `email`: String (Unique)
- `emailVerified`: DateTime
- `image`: String
- `role`: Enum (USER, ADMIN, MODERATOR)
- Relationships: accounts, sessions, projects, requests

### Project
- `id`: String (Primary key)
- `slug`: String (Unique)
- `title`: String
- `description`: String
- `category`: Enum (PERSONAL, CLASS)
- `tags`: String[]
- `techStack`: String[]
- `featured`: Boolean
- `published`: Boolean
- `publishedAt`: DateTime

### ProjectRequest
- `id`: String (Primary key)
- `name`: String
- `email`: String
- `phone`: String
- `projectType`: String
- `description`: String
- `status`: Enum (PENDING, IN_REVIEW, ACCEPTED, REJECTED, COMPLETED)
- `priority`: Enum (LOW, MEDIUM, HIGH, URGENT)

### Visit
- Track page visits and analytics

## Theme System

The portfolio includes 5 pre-designed themes:

1. **Minimal** (Default): Clean, professional design
2. **Pastel**: Soft, gentle colors
3. **Neon**: Vibrant, energetic colors
4. **Retro**: Warm, nostalgic tones
5. **Nature**: Earth-inspired greens

Each theme supports both light and dark modes with automatic contrast optimization.

### Theme Variables
Themes are defined using CSS custom properties in `app/globals.css`:
- `--color-primary`: Primary brand color
- `--color-secondary`: Secondary color
- `--color-accent`: Accent/highlight color
- `--color-foreground`: Text color
- `--color-background`: Background color

## API Endpoints

### Projects API

**GET /api/projects**
- Fetch all projects
- Query params: `category`, `search`, `published`
- Returns: Array of projects

**POST /api/projects** (Admin only)
- Create new project
- Body: Project data
- Returns: Created project

### Requests API

**GET /api/requests** (Admin only)
- Fetch all project requests
- Query params: `status`
- Returns: Array of requests

**POST /api/requests**
- Submit new project request
- Body: Request data with Zod validation
- Returns: Created request

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `EMAIL_SERVER_HOST` | SMTP server host | No |
| `EMAIL_SERVER_PORT` | SMTP server port | No |
| `EMAIL_SERVER_USER` | SMTP username | No |
| `EMAIL_SERVER_PASSWORD` | SMTP password | No |
| `EMAIL_FROM` | Sender email address | No |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- Digital Ocean

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](your-repo-url/issues)
- Email: your-email@example.com

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Supabase for database
- Tailwind CSS for styling
- All open-source contributors

---

Built with ❤️ by [Kashi Kweyu](https://github.com/kashik09)
