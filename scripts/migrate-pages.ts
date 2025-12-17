import { prisma } from '../lib/prisma'

async function migratePagesToDatabase() {
  console.log('🚀 Starting page migration to database...\n')

  // Define pages to migrate
  const pagesToMigrate = [
    {
      slug: 'home',
      title: 'Home',
      status: 'PUBLISHED' as const,
      seoTitle: 'Kashi Kweyu | Junior Developer',
      seoDescription: 'Portfolio of Kashi Kweyu - Junior Developer specializing in web development',
      sections: [
        {
          type: 'HERO' as const,
          data: {
            title: 'Hi, I\'m Kashi Kweyu',
            subtitle: 'Junior Developer passionate about creating amazing web experiences',
            ctaText: 'View Projects',
            ctaLink: '/projects'
          },
          order: 0
        },
        {
          type: 'PROJECT_GRID' as const,
          data: {
            title: 'Featured Projects',
            filter: 'ALL',
            limit: 6
          },
          order: 1
        }
      ]
    },
    {
      slug: 'about',
      title: 'About Me',
      status: 'PUBLISHED' as const,
      seoTitle: 'About Kashi Kweyu | Junior Developer',
      seoDescription: 'Learn more about Kashi Kweyu, a passionate junior developer',
      sections: [
        {
          type: 'HERO' as const,
          data: {
            title: 'About Me',
            subtitle: 'Passionate developer building for the web'
          },
          order: 0
        },
        {
          type: 'RICH_TEXT' as const,
          data: {
            content: `# Who I Am

I'm Kashi Kweyu, a junior developer with a passion for creating beautiful and functional web applications. I specialize in modern web technologies and love learning new things.

## My Journey

I started my journey in web development with a curiosity about how websites work. This curiosity led me to dive deep into programming, and I haven't looked back since.

## Skills & Technologies

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL, Prisma
- **Tools**: Git, VS Code, Vercel

## What I Do

I build full-stack web applications with a focus on user experience and clean code. I believe in writing code that is both efficient and maintainable.`
          },
          order: 1
        },
        {
          type: 'CTA' as const,
          data: {
            title: 'Let\'s Work Together',
            description: 'Have a project in mind? Let\'s discuss how I can help bring your ideas to life.',
            buttonText: 'Get in Touch',
            buttonLink: '/request'
          },
          order: 2
        }
      ]
    },
    {
      slug: 'services',
      title: 'Services',
      status: 'PUBLISHED' as const,
      seoTitle: 'Services | Kashi Kweyu',
      seoDescription: 'Web development services offered by Kashi Kweyu',
      sections: [
        {
          type: 'HERO' as const,
          data: {
            title: 'Services',
            subtitle: 'What I can help you with'
          },
          order: 0
        },
        {
          type: 'CARDS' as const,
          data: {
            title: 'What I Offer',
            columns: 3,
            cards: [
              {
                title: 'Web Development',
                description: 'Custom websites and web applications built with modern technologies',
                icon: '🌐'
              },
              {
                title: 'Frontend Development',
                description: 'Beautiful, responsive user interfaces with React and Next.js',
                icon: '🎨'
              },
              {
                title: 'Backend Development',
                description: 'Robust APIs and server-side logic with Node.js and databases',
                icon: '⚙️'
              },
              {
                title: 'UI/UX Design',
                description: 'User-centered design with focus on usability and aesthetics',
                icon: '✨'
              },
              {
                title: 'Database Design',
                description: 'Efficient database architecture and optimization',
                icon: '🗄️'
              },
              {
                title: 'Consulting',
                description: 'Technical guidance and code reviews for your projects',
                icon: '💡'
              }
            ]
          },
          order: 1
        },
        {
          type: 'CTA' as const,
          data: {
            title: 'Ready to Start Your Project?',
            description: 'Let\'s discuss your requirements and build something amazing together.',
            buttonText: 'Request a Service',
            buttonLink: '/request'
          },
          order: 2
        }
      ]
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      status: 'PUBLISHED' as const,
      seoTitle: 'Privacy Policy | Kashi Kweyu',
      seoDescription: 'Privacy policy and data protection information',
      sections: [
        {
          type: 'HERO' as const,
          data: {
            title: 'Privacy Policy',
            subtitle: 'How we protect your data'
          },
          order: 0
        },
        {
          type: 'RICH_TEXT' as const,
          data: {
            content: `# Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

## Introduction

This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.

## Information We Collect

We collect information that you provide directly to us, including:
- Name and email address
- Profile information
- Project requests and communications
- Usage data and analytics

## How We Use Your Information

We use the information we collect to:
- Provide and maintain our services
- Respond to your requests
- Send you updates and notifications
- Improve our services

## Data Protection

We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.

## Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of marketing communications

## Contact Us

If you have any questions about this Privacy Policy, please contact us through our website.`
          },
          order: 1
        }
      ]
    },
    {
      slug: 'terms',
      title: 'Terms of Service',
      status: 'PUBLISHED' as const,
      seoTitle: 'Terms of Service | Kashi Kweyu',
      seoDescription: 'Terms and conditions for using our services',
      sections: [
        {
          type: 'HERO' as const,
          data: {
            title: 'Terms of Service',
            subtitle: 'Please read these terms carefully'
          },
          order: 0
        },
        {
          type: 'RICH_TEXT' as const,
          data: {
            content: `# Terms of Service

Last updated: ${new Date().toLocaleDateString()}

## Acceptance of Terms

By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only.

## Disclaimer

The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

## Limitations

In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.

## Revisions

We may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.

## Governing Law

These terms and conditions are governed by and construed in accordance with applicable laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.`
          },
          order: 1
        }
      ]
    }
  ]

  let created = 0
  let errors = 0

  for (const pageData of pagesToMigrate) {
    try {
      console.log(`📄 Creating page: ${pageData.title} (/${pageData.slug})`)

      // Check if page already exists
      const existing = await prisma.page.findUnique({
        where: { slug: pageData.slug }
      })

      if (existing) {
        console.log(`   ⚠️  Page already exists, skipping...`)
        continue
      }

      // Create page with sections
      const page = await prisma.page.create({
        data: {
          slug: pageData.slug,
          title: pageData.title,
          status: pageData.status,
          seoTitle: pageData.seoTitle,
          seoDescription: pageData.seoDescription,
          sections: {
            create: pageData.sections
          }
        },
        include: {
          sections: true
        }
      })

      console.log(`   ✅ Created with ${page.sections.length} sections`)
      created++
    } catch (error) {
      console.error(`   ❌ Error creating page ${pageData.title}:`, error)
      errors++
    }
  }

  console.log(`\n✨ Migration complete!`)
  console.log(`   Created: ${created} pages`)
  console.log(`   Errors: ${errors}`)
  console.log(`   Skipped: ${pagesToMigrate.length - created - errors} (already exist)`)
}

migratePagesToDatabase()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })
