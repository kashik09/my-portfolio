/**
 * Product Import Script
 *
 * Imports all digital products from the catalog into the database.
 * Based on docs/digital-products-catalog.md
 *
 * Usage:
 *   npx tsx scripts/import-products.ts
 *   npx tsx scripts/import-products.ts --dry-run  # Preview without importing
 */

import { Prisma, PrismaClient, ProductCategory } from '@prisma/client'

const prisma = new PrismaClient()

// Check for dry-run mode
const isDryRun = process.argv.includes('--dry-run')

interface ProductData {
  name: string
  slug: string
  description: string
  category: ProductCategory
  tags: string[]
  price: Prisma.Decimal
  usdPrice: Prisma.Decimal
  ugxPrice: Prisma.Decimal
  fileUrl: string
  fileSize: number
  fileType: string
  thumbnailUrl?: string
  previewImages?: string[]
  personalLicense: boolean
  commercialLicense: boolean
  teamLicense: boolean
  version: string
  changelog?: string
  documentation?: string
  published: boolean
  featured: boolean
}

// ============================================
// ALL PRODUCTS FROM CATALOG
// ============================================

const products: ProductData[] = [
  // Templates & Boilerplates
  {
    name: 'Next.js Portfolio Starter',
    slug: 'nextjs-portfolio-starter',
    description: 'A fully-featured portfolio template built with Next.js 14, featuring JSON-based CMS, admin dashboard, theme switching, and automated screenshot capture. Perfect for developers who want a professional portfolio without the hassle.',
    category: 'TEMPLATE',
    tags: ['nextjs', 'portfolio', 'cms', 'typescript', 'tailwind', 'admin'],
    price: new Prisma.Decimal("49.00"),
    usdPrice: new Prisma.Decimal("49.00"),
    ugxPrice: new Prisma.Decimal("180000.00"),
    fileUrl: '/downloads/products/nextjs-portfolio-starter.zip',
    fileSize: 25000000,
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
    changelog: 'Initial release - Full portfolio system with CMS, themes, and admin dashboard',
    documentation: '# Next.js Portfolio Starter\n\nComplete setup guide and documentation included in download.',
    published: true,
    featured: true
  },
  {
    name: 'E-Commerce Starter Kit',
    slug: 'ecommerce-starter-kit',
    description: 'Complete e-commerce solution with product management, cart system, checkout flow, and payment integration. Includes multi-currency support, license-based products, and comprehensive order management.',
    category: 'TEMPLATE',
    tags: ['ecommerce', 'nextjs', 'stripe', 'shop', 'cart', 'payments'],
    price: new Prisma.Decimal("79.00"),
    usdPrice: new Prisma.Decimal("79.00"),
    ugxPrice: new Prisma.Decimal("290000.00"),
    fileUrl: '/downloads/products/ecommerce-starter-kit.zip',
    fileSize: 35000000,
    fileType: 'zip',
    thumbnailUrl: '/products/ecommerce-kit-thumb.png',
    previewImages: [
      '/products/ecommerce-kit-1.png',
      '/products/ecommerce-kit-2.png',
      '/products/ecommerce-kit-3.png'
    ],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: true,
    version: '1.0.0',
    changelog: 'Initial release - Full e-commerce platform with Stripe integration',
    documentation: '# E-Commerce Starter Kit\n\nIncludes payment setup, product management, and deployment guides.',
    published: true,
    featured: true
  },
  {
    name: 'Authentication & User Management Boilerplate',
    slug: 'auth-user-management-boilerplate',
    description: 'Drop-in authentication system with NextAuth.js, role-based access control, and comprehensive user management. Includes social login (Google, GitHub), email/password auth, protected routes, and session management.',
    category: 'CODE_SNIPPET',
    tags: ['auth', 'nextauth', 'security', 'rbac', 'typescript', '2fa'],
    price: new Prisma.Decimal("39.00"),
    usdPrice: new Prisma.Decimal("39.00"),
    ugxPrice: new Prisma.Decimal("140000.00"),
    fileUrl: '/downloads/products/auth-boilerplate.zip',
    fileSize: 5000000,
    fileType: 'zip',
    thumbnailUrl: '/products/auth-boilerplate-thumb.png',
    previewImages: ['/products/auth-boilerplate-1.png', '/products/auth-boilerplate-2.png'],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    version: '1.0.0',
    changelog: 'Initial release - Complete auth system with RBAC',
    documentation: '# Authentication Boilerplate\n\nSetup guides for OAuth providers and security best practices.',
    published: true,
    featured: false
  },
  {
    name: 'JSON-Based CMS Kit',
    slug: 'json-cms-kit',
    description: 'File-based content management system with API routes, visual content editors, and version control. No database required - perfect for JAMstack projects. Includes TypeScript types and automatic versioning.',
    category: 'CODE_SNIPPET',
    tags: ['cms', 'json', 'jamstack', 'content', 'typescript', 'api'],
    price: new Prisma.Decimal("29.00"),
    usdPrice: new Prisma.Decimal("29.00"),
    ugxPrice: new Prisma.Decimal("105000.00"),
    fileUrl: '/downloads/products/json-cms-kit.zip',
    fileSize: 3000000,
    fileType: 'zip',
    thumbnailUrl: '/products/cms-kit-thumb.png',
    previewImages: ['/products/cms-kit-1.png', '/products/cms-kit-2.png'],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    version: '1.0.0',
    changelog: 'Initial release - File-based CMS with visual editors',
    documentation: '# JSON CMS Kit\n\nContent structure guides and integration examples.',
    published: true,
    featured: false
  },
  {
    name: 'Tailwind UI Component Library',
    slug: 'tailwind-ui-components',
    description: 'A comprehensive collection of 50+ production-ready UI components built with Tailwind CSS and React. Includes buttons, forms, modals, cards, navigation, and more. Fully typed with TypeScript.',
    category: 'UI_KIT',
    tags: ['tailwind', 'ui', 'components', 'react', 'typescript', 'design-system'],
    price: new Prisma.Decimal("35.00"),
    usdPrice: new Prisma.Decimal("35.00"),
    ugxPrice: new Prisma.Decimal("130000.00"),
    fileUrl: '/downloads/products/tailwind-ui-library.zip',
    fileSize: 8000000,
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
    changelog: 'v2.1.0 - Added 10 new components, improved accessibility',
    documentation: '# Tailwind UI Library\n\nComponent documentation and usage examples.',
    published: true,
    featured: true
  },
  {
    name: 'Dashboard Admin Template',
    slug: 'dashboard-admin-template',
    description: 'Modern admin dashboard template with charts, tables, user management, and analytics. Built with Next.js 14, includes dark mode, responsive design, and customizable layouts.',
    category: 'TEMPLATE',
    tags: ['dashboard', 'admin', 'nextjs', 'charts', 'analytics', 'typescript'],
    price: new Prisma.Decimal("65.00"),
    usdPrice: new Prisma.Decimal("65.00"),
    ugxPrice: new Prisma.Decimal("240000.00"),
    fileUrl: '/downloads/products/dashboard-admin.zip',
    fileSize: 28000000,
    fileType: 'zip',
    thumbnailUrl: '/products/dashboard-thumb.png',
    previewImages: [
      '/products/dashboard-1.png',
      '/products/dashboard-2.png',
      '/products/dashboard-3.png'
    ],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: true,
    version: '1.2.0',
    published: true,
    featured: true
  },
  {
    name: 'API Documentation Template',
    slug: 'api-docs-template',
    description: 'Beautiful API documentation template with interactive examples, code snippets in multiple languages, and automatic OpenAPI/Swagger integration. Perfect for SaaS products.',
    category: 'TEMPLATE',
    tags: ['api', 'documentation', 'openapi', 'swagger', 'nextjs', 'docs'],
    price: new Prisma.Decimal("45.00"),
    usdPrice: new Prisma.Decimal("45.00"),
    ugxPrice: new Prisma.Decimal("165000.00"),
    fileUrl: '/downloads/products/api-docs-template.zip',
    fileSize: 12000000,
    fileType: 'zip',
    thumbnailUrl: '/products/api-docs-thumb.png',
    previewImages: ['/products/api-docs-1.png', '/products/api-docs-2.png'],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: true,
    version: '1.0.0',
    published: true,
    featured: false
  },
  {
    name: 'React Hook Collection',
    slug: 'react-hooks-collection',
    description: 'A curated collection of 25+ custom React hooks for common use cases. Includes hooks for forms, API calls, local storage, media queries, and more. Fully typed and tested.',
    category: 'CODE_SNIPPET',
    tags: ['react', 'hooks', 'typescript', 'utilities', 'custom-hooks'],
    price: new Prisma.Decimal("25.00"),
    usdPrice: new Prisma.Decimal("25.00"),
    ugxPrice: new Prisma.Decimal("92000.00"),
    fileUrl: '/downloads/products/react-hooks.zip',
    fileSize: 2000000,
    fileType: 'zip',
    thumbnailUrl: '/products/react-hooks-thumb.png',
    previewImages: ['/products/react-hooks-1.png'],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    version: '1.3.0',
    published: true,
    featured: false
  },
  {
    name: 'TypeScript Utility Types Pack',
    slug: 'typescript-utilities',
    description: 'Advanced TypeScript utility types and helper functions for better type safety. Includes form validation types, API response types, and common patterns.',
    category: 'CODE_SNIPPET',
    tags: ['typescript', 'types', 'utilities', 'type-safety', 'helpers'],
    price: new Prisma.Decimal("19.00"),
    usdPrice: new Prisma.Decimal("19.00"),
    ugxPrice: new Prisma.Decimal("70000.00"),
    fileUrl: '/downloads/products/typescript-utils.zip',
    fileSize: 1000000,
    fileType: 'zip',
    thumbnailUrl: '/products/ts-utils-thumb.png',
    previewImages: ['/products/ts-utils-1.png'],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    version: '1.0.0',
    published: true,
    featured: false
  },
  {
    name: 'Icon Pack - Developer Edition',
    slug: 'dev-icon-pack',
    description: '200+ developer-focused SVG icons optimized for web and mobile. Includes tech logos, code symbols, and development tools. Available in multiple formats.',
    category: 'ASSET',
    tags: ['icons', 'svg', 'design', 'assets', 'developer'],
    price: new Prisma.Decimal("29.00"),
    usdPrice: new Prisma.Decimal("29.00"),
    ugxPrice: new Prisma.Decimal("105000.00"),
    fileUrl: '/downloads/products/dev-icons.zip',
    fileSize: 5000000,
    fileType: 'zip',
    thumbnailUrl: '/products/icons-thumb.png',
    previewImages: [
      '/products/icons-1.png',
      '/products/icons-2.png',
      '/products/icons-3.png'
    ],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    version: '1.0.0',
    published: true,
    featured: false
  },
  {
    name: 'SaaS Landing Page Template',
    slug: 'saas-landing-template',
    description: 'High-converting SaaS landing page template with pricing tables, feature sections, testimonials, and CTAs. Built with Next.js and optimized for conversion.',
    category: 'TEMPLATE',
    tags: ['saas', 'landing-page', 'marketing', 'nextjs', 'conversion'],
    price: new Prisma.Decimal("55.00"),
    usdPrice: new Prisma.Decimal("55.00"),
    ugxPrice: new Prisma.Decimal("203000.00"),
    fileUrl: '/downloads/products/saas-landing.zip',
    fileSize: 15000000,
    fileType: 'zip',
    thumbnailUrl: '/products/saas-landing-thumb.png',
    previewImages: [
      '/products/saas-landing-1.png',
      '/products/saas-landing-2.png',
      '/products/saas-landing-3.png'
    ],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: true,
    version: '1.1.0',
    published: true,
    featured: true
  },
  {
    name: 'Form Validation Library',
    slug: 'form-validation-lib',
    description: 'Lightweight, type-safe form validation library for React. No dependencies, supports async validation, and includes common validators out of the box.',
    category: 'CODE_SNIPPET',
    tags: ['forms', 'validation', 'react', 'typescript', 'library'],
    price: new Prisma.Decimal("22.00"),
    usdPrice: new Prisma.Decimal("22.00"),
    ugxPrice: new Prisma.Decimal("81000.00"),
    fileUrl: '/downloads/products/form-validation.zip',
    fileSize: 1500000,
    fileType: 'zip',
    thumbnailUrl: '/products/form-validation-thumb.png',
    previewImages: ['/products/form-validation-1.png'],
    personalLicense: true,
    commercialLicense: true,
    teamLicense: false,
    version: '1.0.0',
    published: true,
    featured: false
  }
]

// ============================================
// IMPORT LOGIC
// ============================================

async function importProducts() {
  console.log('📦 Digital Products Import Script')
  console.log('==================================\n')

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  let successCount = 0
  let errorCount = 0

  for (const productData of products) {
    try {
      console.log(`Processing: ${productData.name}`)

      if (isDryRun) {
        console.log(`  → Would create/update product: ${productData.slug}`)
        console.log(`  → Price: $${productData.price} USD / ${productData.ugxPrice} UGX`)
        console.log(`  → Category: ${productData.category}`)
        console.log(`  → Published: ${productData.published ? 'Yes' : 'No'}`)
        console.log(`  → Featured: ${productData.featured ? 'Yes' : 'No'}`)
        successCount++
      } else {
        // Import to database
        await prisma.digitalProduct.upsert({
          where: { slug: productData.slug },
          update: {
            name: productData.name,
            description: productData.description,
            category: productData.category,
            tags: productData.tags,
            price: productData.price,
            usdPrice: productData.usdPrice,
            ugxPrice: productData.ugxPrice,
            fileUrl: productData.fileUrl,
            fileSize: productData.fileSize,
            fileType: productData.fileType,
            thumbnailUrl: productData.thumbnailUrl,
            previewImages: productData.previewImages || [],
            personalLicense: productData.personalLicense,
            commercialLicense: productData.commercialLicense,
            teamLicense: productData.teamLicense,
            version: productData.version,
            changelog: productData.changelog,
            documentation: productData.documentation,
            published: productData.published,
            featured: productData.featured,
            publishedAt: productData.published ? new Date() : null
          },
          create: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            category: productData.category,
            tags: productData.tags,
            price: productData.price,
            usdPrice: productData.usdPrice,
            ugxPrice: productData.ugxPrice,
            fileUrl: productData.fileUrl,
            fileSize: productData.fileSize,
            fileType: productData.fileType,
            thumbnailUrl: productData.thumbnailUrl,
            previewImages: productData.previewImages || [],
            personalLicense: productData.personalLicense,
            commercialLicense: productData.commercialLicense,
            teamLicense: productData.teamLicense,
            version: productData.version,
            changelog: productData.changelog,
            documentation: productData.documentation,
            published: productData.published,
            featured: productData.featured,
            publishedAt: productData.published ? new Date() : null
          }
        })

        console.log(`  ✅ Successfully imported: ${productData.slug}`)
        successCount++
      }

      console.log('') // Empty line for readability
    } catch (error) {
      console.error(`  ❌ Error importing ${productData.name}:`, error)
      errorCount++
      console.log('') // Empty line for readability
    }
  }

  // Summary
  console.log('==================================')
  console.log('📊 Import Summary')
  console.log('==================================')
  console.log(`Total products: ${products.length}`)
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)

  if (isDryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to import.')
  } else {
    console.log('\n🎉 Import complete!')
  }
}

// Run the import
importProducts()
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
