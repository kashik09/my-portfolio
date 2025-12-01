import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // ============================================
  // CREATE ADMIN USER
  // ============================================
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kashicoding.com' },
    update: {},
    create: {
      email: 'admin@kashicoding.com',
      name: 'Kashi Admin',
      role: 'ADMIN',
      theme: 'DARK',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // ============================================
  // CREATE SAMPLE REGULAR USER
  // ============================================
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      role: 'USER',
      theme: 'SYSTEM',
    },
  })
  console.log('✅ Created regular user:', user.email)

  // ============================================
  // CREATE PORTFOLIO PROJECTS
  // ============================================
  const projects = [
    {
      slug: 'e-commerce-platform',
      title: 'Full-Stack E-Commerce Platform',
      description:
        'A comprehensive e-commerce solution with product management, cart functionality, payment integration, and admin dashboard.',
      category: 'FULL_STACK',
      tags: ['E-Commerce', 'Payment Integration', 'Admin Panel'],
      techStack: [
        'Next.js',
        'TypeScript',
        'Prisma',
        'PostgreSQL',
        'Stripe',
        'Tailwind CSS',
      ],
      features: [
        'User authentication and authorization',
        'Product catalog with search and filters',
        'Shopping cart and checkout process',
        'Payment processing with Stripe',
        'Order management system',
        'Admin dashboard for inventory management',
      ],
      thumbnail: '/images/projects/ecommerce-thumb.jpg',
      images: [
        '/images/projects/ecommerce-1.jpg',
        '/images/projects/ecommerce-2.jpg',
        '/images/projects/ecommerce-3.jpg',
      ],
      githubUrl: 'https://github.com/kashicoding/ecommerce-platform',
      liveUrl: 'https://demo-ecommerce.kashicoding.com',
      featured: true,
      published: true,
      publishedAt: new Date('2024-01-15'),
    },
    {
      slug: 'task-management-app',
      title: 'Real-Time Task Management Application',
      description:
        'A collaborative task management tool with real-time updates, team workspaces, and advanced filtering capabilities.',
      category: 'WEB_DEVELOPMENT',
      tags: ['SaaS', 'Real-Time', 'Collaboration'],
      techStack: [
        'React',
        'Node.js',
        'Socket.io',
        'MongoDB',
        'Express',
        'Redux',
      ],
      features: [
        'Real-time task updates across team members',
        'Kanban board and list views',
        'Task assignments and due dates',
        'File attachments and comments',
        'Team workspaces and permissions',
        'Activity tracking and notifications',
      ],
      thumbnail: '/images/projects/taskmanager-thumb.jpg',
      images: ['/images/projects/taskmanager-1.jpg'],
      githubUrl: 'https://github.com/kashicoding/task-manager',
      liveUrl: 'https://tasks.kashicoding.com',
      featured: true,
      published: true,
      publishedAt: new Date('2024-02-20'),
    },
    {
      slug: 'ai-content-generator',
      title: 'AI-Powered Content Generator',
      description:
        'An intelligent content creation platform using OpenAI GPT-4 for generating blog posts, social media content, and marketing copy.',
      category: 'MACHINE_LEARNING',
      tags: ['AI', 'NLP', 'Content Creation'],
      techStack: [
        'Next.js',
        'OpenAI API',
        'Python',
        'FastAPI',
        'PostgreSQL',
        'Redis',
      ],
      features: [
        'Multiple content type templates',
        'AI-powered content generation',
        'SEO optimization suggestions',
        'Content history and versioning',
        'Export to multiple formats',
        'Usage analytics and insights',
      ],
      thumbnail: '/images/projects/ai-content-thumb.jpg',
      images: ['/images/projects/ai-content-1.jpg'],
      liveUrl: 'https://content.kashicoding.com',
      featured: false,
      published: true,
      publishedAt: new Date('2024-03-10'),
    },
    {
      slug: 'mobile-fitness-tracker',
      title: 'Cross-Platform Fitness Tracking App',
      description:
        'A mobile application for tracking workouts, nutrition, and health metrics with social features and challenges.',
      category: 'MOBILE_DEVELOPMENT',
      tags: ['Fitness', 'Health', 'Mobile'],
      techStack: [
        'React Native',
        'Expo',
        'Firebase',
        'TypeScript',
        'Native Base',
      ],
      features: [
        'Workout logging and tracking',
        'Nutrition diary with calorie counting',
        'Progress photos and measurements',
        'Social challenges and leaderboards',
        'Apple Health and Google Fit integration',
        'Personalized workout recommendations',
      ],
      thumbnail: '/images/projects/fitness-thumb.jpg',
      images: ['/images/projects/fitness-1.jpg'],
      githubUrl: 'https://github.com/kashicoding/fitness-tracker',
      featured: false,
      published: false,
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: projectData,
    })
    console.log('✅ Created project:', project.title)
  }

  // ============================================
  // CREATE PROJECT REQUESTS
  // ============================================
  const projectRequests = [
    {
      userId: user.id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Tech Startup Inc.',
      projectType: 'WEB_APPLICATION',
      budget: 'RANGE_10K_25K',
      timeline: 'MEDIUM',
      description:
        'We need a custom SaaS platform for managing customer relationships with advanced analytics and reporting features.',
      requirements:
        'Must integrate with existing CRM, support multiple user roles, and provide API access.',
      status: 'REVIEWING',
      priority: 'HIGH',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@business.com',
      projectType: 'MOBILE_APPLICATION',
      budget: 'RANGE_5K_10K',
      timeline: 'SHORT',
      description:
        'Looking for a mobile app to complement our existing web platform. Need iOS and Android support.',
      status: 'PENDING',
      priority: 'MEDIUM',
    },
    {
      name: 'Michael Chen',
      email: 'michael@agency.com',
      company: 'Digital Marketing Agency',
      projectType: 'LANDING_PAGE',
      budget: 'UNDER_1K',
      timeline: 'URGENT',
      description:
        'Need a high-converting landing page for our new product launch next month.',
      status: 'COMPLETED',
      priority: 'URGENT',
      respondedAt: new Date('2024-01-10'),
    },
  ]

  for (const requestData of projectRequests) {
    const request = await prisma.projectRequest.create({
      data: requestData,
    })
    console.log('✅ Created project request from:', request.name)
  }

  // ============================================
  // CREATE SAMPLE VISITS (ANALYTICS)
  // ============================================
  const visits = [
    {
      pagePath: '/',
      pageTitle: 'Home - KashiCoding',
      visitorId: 'visitor-001',
      device: 'desktop',
      browser: 'Chrome',
      os: 'Windows',
      country: 'United States',
      city: 'San Francisco',
      duration: 120,
    },
    {
      pagePath: '/projects',
      pageTitle: 'Projects - KashiCoding',
      visitorId: 'visitor-001',
      device: 'desktop',
      browser: 'Chrome',
      os: 'Windows',
      referrer: '/',
      duration: 180,
    },
    {
      pagePath: '/projects/e-commerce-platform',
      pageTitle: 'E-Commerce Platform - KashiCoding',
      visitorId: 'visitor-002',
      device: 'mobile',
      browser: 'Safari',
      os: 'iOS',
      country: 'Canada',
      city: 'Toronto',
      utmSource: 'google',
      utmMedium: 'organic',
      duration: 240,
    },
    {
      pagePath: '/about',
      pageTitle: 'About - KashiCoding',
      visitorId: 'visitor-003',
      device: 'tablet',
      browser: 'Firefox',
      os: 'Android',
      country: 'United Kingdom',
      city: 'London',
      duration: 90,
    },
  ]

  for (const visitData of visits) {
    const visit = await prisma.visit.create({
      data: visitData,
    })
    console.log('✅ Created visit record for:', visit.pagePath)
  }

  console.log('✨ Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
