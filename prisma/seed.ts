import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kashicoding.com' },
    update: {},
    create: {
      email: 'admin@kashicoding.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin)

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Portfolio Website',
      description: 'A modern portfolio website built with Next.js and TypeScript',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
      featured: true,
    },
  })

  console.log('Created project:', project1)

  // Create sample services
  const service1 = await prisma.service.create({
    data: {
      name: 'Web Development',
      description: 'Full-stack web application development',
      features: ['Responsive Design', 'SEO Optimization', 'Performance Tuning'],
      price: 1000,
    },
  })

  console.log('Created service:', service1)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
