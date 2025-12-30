import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Seeding database...')

  // Add JS Calculator project
  const calculator = await prisma.project.upsert({
    where: { slug: 'js-calculator' },
    update: {},
    create: {
      slug: 'js-calculator',
      title: 'JS Calculator - Modern Calculator App',
      description: 'A feature-rich, modern calculator web application with draggable modals, multiple themes (Dark, Light, Ocean, Sunset), advanced operations, and comprehensive calculation history. Built with Next.js 16, React 19, and Tailwind CSS.',
      category: 'CLASS',
      tags: ['calculator', 'javascript', 'nextjs', 'tailwind'],
      techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
      features: ['Draggable modals', 'Multiple themes', 'Calculation history', 'Keyboard support'],
      thumbnail: '/projects/js-calculator.png', // We'll add the image
      images: [],
      featured: true,
      published: true,
      githubUrl: 'https://github.com/kashik09/js-calc',
      liveUrl: '', // Add after deploying
      publishedAt: new Date()
    }
  })

  console.log('✅ Created calculator project:', calculator.title)

  // Ensure singleton SiteSettings row exists
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 'site_settings_singleton' },
    update: {},
    create: {
      id: 'site_settings_singleton',
      maintenanceMode: false,
      availableForBusiness: true,
      adsEnabled: false,
      adsProvider: '',
      adsClientId: null,
      adsPlacements: {}
    }
  })

  console.log('✅ Ensured site settings singleton:', siteSettings.id)

  // ============================================
  // SEED DIGITAL PRODUCTS
  // ============================================

  // 1. Next.js Portfolio Starter Template
  const portfolioStarter = await prisma.digitalProduct.upsert({
    where: { slug: 'nextjs-portfolio-starter' },
    update: {},
    create: {
      name: 'Next.js Portfolio Starter',
      slug: 'nextjs-portfolio-starter',
      description: 'A fully-featured portfolio template built with Next.js 14, featuring JSON-based CMS, admin dashboard, theme switching, and automated screenshot capture. Perfect for developers who want a professional portfolio without the hassle.',
      category: 'TEMPLATE',
      tags: ['nextjs', 'portfolio', 'cms', 'typescript', 'tailwind'],
      price: new Prisma.Decimal("49.00"),
      currency: 'USD',
      usdPrice: new Prisma.Decimal("49.00"),
      ugxPrice: new Prisma.Decimal("180000.00"),
      fileUrl: '/downloads/products/nextjs-portfolio-starter.zip',
      fileSize: 25000000, // 25MB
      fileType: 'zip',
      thumbnailUrl: '/products/portfolio-starter-thumb.png',
      previewImages: [
        '/products/portfolio-starter-1.png',
        '/products/portfolio-starter-2.png',
        '/products/portfolio-starter-3.png'
      ],
      personalLicense: true,
      commercialLicense: true,
      teamLicense: false,
      version: '1.0.0',
      changelog: 'Initial release with full portfolio features',
      documentation: '# Next.js Portfolio Starter\n\nComplete documentation available in the download package.',
      published: true,
      publishedAt: new Date(),
      featured: true
    }
  })

  console.log('✅ Created product:', portfolioStarter.name)

  // 2. E-Commerce Starter Kit
  const ecommerceKit = await prisma.digitalProduct.upsert({
    where: { slug: 'ecommerce-starter-kit' },
    update: {},
    create: {
      name: 'E-Commerce Starter Kit',
      slug: 'ecommerce-starter-kit',
      description: 'Complete e-commerce solution with product management, cart system, checkout flow, and payment integration. Includes multi-currency support and license-based products.',
      category: 'TEMPLATE',
      tags: ['ecommerce', 'nextjs', 'stripe', 'shop', 'cart'],
      price: new Prisma.Decimal("79.00"),
      currency: 'USD',
      usdPrice: new Prisma.Decimal("79.00"),
      ugxPrice: new Prisma.Decimal("290000.00"),
      fileUrl: '/downloads/products/ecommerce-starter-kit.zip',
      fileSize: 35000000, // 35MB
      fileType: 'zip',
      thumbnailUrl: '/products/ecommerce-kit-thumb.png',
      previewImages: [
        '/products/ecommerce-kit-1.png',
        '/products/ecommerce-kit-2.png'
      ],
      personalLicense: true,
      commercialLicense: true,
      teamLicense: true,
      version: '1.0.0',
      published: true,
      publishedAt: new Date(),
      featured: true
    }
  })

  console.log('✅ Created product:', ecommerceKit.name)

  // 3. Authentication Boilerplate
  const authBoilerplate = await prisma.digitalProduct.upsert({
    where: { slug: 'auth-user-management-boilerplate' },
    update: {},
    create: {
      name: 'Authentication & User Management Boilerplate',
      slug: 'auth-user-management-boilerplate',
      description: 'Drop-in authentication system with NextAuth.js, role-based access control, and user management. Includes social login, email/password auth, and protected routes.',
      category: 'CODE_SNIPPET',
      tags: ['auth', 'nextauth', 'security', 'rbac', 'typescript'],
      price: new Prisma.Decimal("39.00"),
      currency: 'USD',
      usdPrice: new Prisma.Decimal("39.00"),
      ugxPrice: new Prisma.Decimal("140000.00"),
      fileUrl: '/downloads/products/auth-boilerplate.zip',
      fileSize: 5000000, // 5MB
      fileType: 'zip',
      thumbnailUrl: '/products/auth-boilerplate-thumb.png',
      previewImages: ['/products/auth-boilerplate-1.png'],
      personalLicense: true,
      commercialLicense: true,
      teamLicense: false,
      version: '1.0.0',
      published: true,
      publishedAt: new Date(),
      featured: false
    }
  })

  console.log('✅ Created product:', authBoilerplate.name)

  // 4. JSON-Based CMS Kit
  const cmsKit = await prisma.digitalProduct.upsert({
    where: { slug: 'json-cms-kit' },
    update: {},
    create: {
      name: 'JSON-Based CMS Kit',
      slug: 'json-cms-kit',
      description: 'File-based content management system with API routes, content editors, and version control. No database required - perfect for JAMstack projects.',
      category: 'CODE_SNIPPET',
      tags: ['cms', 'json', 'jamstack', 'content', 'typescript'],
      price: new Prisma.Decimal("29.00"),
      currency: 'USD',
      usdPrice: new Prisma.Decimal("29.00"),
      ugxPrice: new Prisma.Decimal("105000.00"),
      fileUrl: '/downloads/products/json-cms-kit.zip',
      fileSize: 3000000, // 3MB
      fileType: 'zip',
      thumbnailUrl: '/products/cms-kit-thumb.png',
      previewImages: ['/products/cms-kit-1.png'],
      personalLicense: true,
      commercialLicense: true,
      teamLicense: false,
      version: '1.0.0',
      published: true,
      publishedAt: new Date(),
      featured: false
    }
  })

  console.log('✅ Created product:', cmsKit.name)

  // 5. Tailwind UI Component Library
  const uiLibrary = await prisma.digitalProduct.upsert({
    where: { slug: 'tailwind-ui-components' },
    update: {},
    create: {
      name: 'Tailwind UI Component Library',
      slug: 'tailwind-ui-components',
      description: 'A comprehensive collection of 50+ production-ready UI components built with Tailwind CSS. Includes buttons, forms, modals, cards, and more.',
      category: 'UI_KIT',
      tags: ['tailwind', 'ui', 'components', 'react', 'typescript'],
      price: new Prisma.Decimal("35.00"),
      currency: 'USD',
      usdPrice: new Prisma.Decimal("35.00"),
      ugxPrice: new Prisma.Decimal("130000.00"),
      fileUrl: '/downloads/products/tailwind-ui-library.zip',
      fileSize: 8000000, // 8MB
      fileType: 'zip',
      thumbnailUrl: '/products/ui-library-thumb.png',
      previewImages: [
        '/products/ui-library-1.png',
        '/products/ui-library-2.png',
        '/products/ui-library-3.png'
      ],
      personalLicense: true,
      commercialLicense: true,
      teamLicense: true,
      version: '2.1.0',
      published: true,
      publishedAt: new Date(),
      featured: true
    }
  })

  console.log('✅ Created product:', uiLibrary.name)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
