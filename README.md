# Kashi Kweyu Portfolio

A modern, full-stack portfolio website built with Next.js 14, featuring a JSON-based CMS for content management, preference-driven theming, and a complete admin dashboard.

## Features

### Core Features
- **Preferences Theming**: Formal or vibey modes with system, light, and dark theme support
- **Automated Screenshot Capture**: Capture project screenshots automatically using Playwright
  - Auto-capture screenshots from live URLs at 1920x1080 @2x resolution
  - Full page screenshot option for entire scrollable content
  - Smart filename generation with project context
  - Toggle between manual upload and auto-capture in admin forms
- **JSON-based CMS**: Simple file-based content management without database overhead
- **Admin Content Editor**: Edit About, Services, and Request Form content via intuitive UI
- **Responsive Design**: Fully responsive across all devices with mobile-first approach
- **Preference Persistence**: Automatic saving with localStorage
- **Modern UI**: Clean, accessible interface with Lucide icons
- **Type-Safe**: Full TypeScript implementation with strict mode

### Pages
- **Home**: Hero section with call-to-action and feature highlights
- **Projects**: Portfolio showcase with project details
- **Services**: Service offerings with descriptions
- **About**: Personal bio, skills, timeline, and social links (CMS-managed)
- **Request Service**: Contact form for project inquiries (CMS-managed)
- **Admin Content Editors**:
  - `/admin/content/about` - Edit About page content
  - Content management for Services and Request forms

### UI Components
- **Button**: Enhanced with icon support, loading states, and 4 variants (primary, secondary, outline, ghost)
- **Input**: Form input with label support and theme integration
- **Card**: Flexible card component with hover effects
- **Header**: Navigation with a responsive mobile menu
- **Footer**: Site footer with social links (GitHub, LinkedIn, Instagram, WhatsApp)

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS with CSS custom properties
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

### Content Management
- **CMS Type**: JSON-based file system
- **Storage**: `public/content/` directory
- **API**: Custom Next.js API routes for file operations
- **Format**: Structured JSON with TypeScript interfaces

### Development
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript compiler
- **Version Control**: Git

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kashik09/my-portfolio.git
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

3. **Set up Playwright (for screenshot capture feature)**
```bash
npx playwright install chromium
```

This installs the Chromium browser required for automated screenshot capture. If you skip this step, you can still use manual upload but the auto-capture feature won't work.

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-portfolio/
├── app/                          # Next.js 14 App Router
│   ├── (main)/                   # Main pages group
│   │   ├── about/                # About page
│   │   ├── projects/             # Projects page
│   │   ├── request/              # Request service page
│   │   └── services/             # Services page
│   ├── admin/                    # Admin section
│   │   └── content/              # Content editors
│   │       └── about/            # About page editor
│   ├── api/                      # API routes
│   │   └── content/              # Content API
│   │       └── about/            # About content endpoint
│   ├── layout.tsx                # Root layout with Providers
│   ├── page.tsx                  # Home page
│   ├── icon.tsx                  # Custom favicon generator
│   └── globals.css               # Global styles & theme definitions
├── components/                   # React components
│   ├── ui/                       # UI components
│   │   ├── Button.tsx            # Button component
│   │   └── Input.tsx             # Input component
│   ├── Header.tsx                # Site header with navigation
│   ├── Footer.tsx                # Site footer with social links
├── lib/                          # Utilities & helpers
├── public/                       # Static assets
│   └── content/                  # JSON CMS files
│       ├── about.json            # About page content
│       ├── services.json         # Services content
│       └── requestForm.json      # Request form configuration
├── tailwind.config.ts            # Tailwind with theme support
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Preferences and Theming

The UI uses a preference-driven theming model with formal or vibey modes and a system, light, or dark theme. See `docs/preferences.md` for the data attributes and token variables used by the theme system.

## JSON-Based CMS

### Content Files

Content is stored in `public/content/` as JSON files:

**`about.json`** - About page content:
```json
{
  "hero": {
    "name": "Kashi Kweyu",
    "nickname": "Kashi",
    "title": "Junior Developer",
    "tagline": "Building digital experiences...",
    "avatarUrl": "/avatar.jpg"
  },
  "story": [
    { "id": "story-1", "content": "Paragraph text..." }
  ],
  "skills": [
    {
      "category": "Frontend",
      "icon": "Code2",
      "items": ["React", "Next.js", "TypeScript"]
    }
  ],
  "timeline": [
    {
      "id": "timeline-1",
      "title": "Role",
      "organization": "Company",
      "period": "2024 - Present",
      "description": "Description...",
      "type": "work"
    }
  ],
  "social": {
    "github": "https://github.com/kashik09",
    "linkedin": "https://linkedin.com/in/kashi-kweyu",
    "email": "contact@example.com"
  },
  "metadata": {
    "lastUpdated": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### API Endpoints

**GET /api/content/about**
- Fetch About page content
- Returns: JSON content from `public/content/about.json`

**PUT /api/content/about**
- Update About page content
- Body: Complete AboutData object
- Updates: `lastUpdated` timestamp automatically
- Returns: Success/error response

### Admin Editors

**`/admin/content/about`** - Full WYSIWYG editor:
- Hero section (name, title, tagline, avatar)
- Story paragraphs (add/remove/edit)
- Skills by category (manage items)
- Timeline entries (work/education)
- Social links (GitHub, LinkedIn, email)
- Real-time save with success/error feedback

## API Reference

### Content API

All content endpoints follow REST conventions:

```typescript
// GET - Fetch content
GET /api/content/{page}
Response: JSON content object

// PUT - Update content
PUT /api/content/{page}
Body: Updated JSON content
Response: { success: boolean, error?: string }
```

### Content Types

**AboutData** interface:
```typescript
interface AboutData {
  hero: {
    name: string
    nickname: string
    title: string
    tagline: string
    avatarUrl: string
  }
  story: Array<{ id: string; content: string }>
  skills: Array<{
    category: string
    icon: string
    items: string[]
  }>
  timeline: Array<{
    id: string
    title: string
    organization: string
    period: string
    description: string
    type: 'work' | 'education'
  }>
  social: {
    github: string
    linkedin: string
    email: string
  }
  metadata: {
    lastUpdated: string
    version: string
  }
}
```

## Screenshot Capture

### Features

The portfolio includes an automated screenshot capture system for project thumbnails:

- **Automated Capture**: Capture screenshots from live URLs using Playwright
- **High Resolution**: Screenshots captured at 1920x1080 @2x resolution
- **Full Page Support**: Option to capture entire scrollable page
- **Smart Naming**: Context-aware filenames using project slug/title
- **CLI Support**: Command-line interface for manual captures
- **Admin Integration**: Toggle between manual upload and auto-capture in project forms

### Usage

#### In Admin Dashboard

1. Navigate to `/admin/projects/new` or edit an existing project
2. In the "Thumbnail Image" section, click the "Auto-Capture" tab
3. Enter the live project URL
4. Check "Full page" if you want to capture the entire scrollable content
5. Click "Capture Screenshot"
6. The screenshot will be automatically saved and set as the project thumbnail

#### Via CLI

Capture screenshots directly from the command line:

```bash
# Basic usage
npx tsx scripts/capture-screenshot.ts https://example.com

# With custom filename
npx tsx scripts/capture-screenshot.ts https://example.com my-project.png
```

### Configuration

The screenshot capture system can be configured in `scripts/capture-screenshot.ts`:

- **Viewport**: Default 1920x1080 (configurable)
- **Device Scale**: 2x for retina displays
- **Delay**: 2000ms wait after page load (configurable)
- **Output Directory**: `public/uploads/projects/`
- **Format**: PNG with context-aware naming

### Requirements

- **Playwright**: Must be installed with `npx playwright install chromium`
- **Admin Access**: ADMIN or OWNER role required for API access
- **Public URLs**: Works best with publicly accessible project URLs

### API Endpoint

**POST /api/admin/screenshot**
```typescript
// Request
{
  url: string
  projectSlug?: string
  projectTitle?: string
  fullPage?: boolean
}

// Response
{
  success: boolean
  data: {
    url: string        // Public path: /uploads/projects/filename.png
    filename: string   // Generated filename
  }
}
```

**GET /api/admin/screenshot**
- Check if Playwright is installed and available
- Returns availability status

## Scripts

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Screenshot Capture
npx tsx scripts/capture-screenshot.ts <url> [filename]  # Capture project screenshot
```

## Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get your live URL

4. **Custom Domain** (Optional)
   - Add domain in Vercel dashboard
   - Update DNS records
   - SSL certificate auto-provisioned

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**: Use Next.js plugin
- **Railway**: Connect GitHub repo
- **Render**: Docker or native Next.js
- **AWS Amplify**: Import from GitHub
- **Digital Ocean App Platform**: Deploy directly

### Build Configuration

No special configuration needed:
- Framework: Next.js (auto-detected)
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`
- Node version: 18+

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with Next.js automatic code splitting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

- **GitHub**: [@kashik09](https://github.com/kashik09)
- **LinkedIn**: [Kashi Kweyu](https://linkedin.com/in/kashi-kweyu)
- **Instagram**: [@kashi_kweyu](https://instagram.com/kashi_kweyu)
- **WhatsApp**: [+256 760 637783](https://wa.me/256760637783)

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- Tailwind CSS for utility-first styling
- Lucide for beautiful icons
- VS Code theme creators for color inspiration

---

Built with ❤️ by [Kashi Kweyu](https://github.com/kashik09)
