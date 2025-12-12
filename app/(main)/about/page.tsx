import Image from 'next/image'
import { Code2, Database, Palette, Zap } from 'lucide-react'

export default function AboutPage() {
  const skills = [
    { name: 'Frontend', icon: Palette, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
    { name: 'Backend', icon: Database, items: ['Node.js', 'PostgreSQL', 'Prisma', 'API Design'] },
    { name: 'Tools', icon: Code2, items: ['Git', 'VS Code', 'Vercel', 'Figma'] },
    { name: 'Other', icon: Zap, items: ['Problem Solving', 'UI/UX', 'Team Collaboration'] }
  ]

  const experience = [
    {
      title: 'Junior Developer',
      company: 'FinTech Company',
      period: '2024 - Present',
      description: 'Developing features for mobile banking applications including savings goal tracking systems.'
    },
    {
      title: 'Student Developer',
      company: 'Moringa School',
      period: '2024',
      description: 'Completing Phase 0 Module 2 JavaScript coursework, building projects like calculators and web applications.'
    }
  ]

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-accent">
          <Image
            src="/avatar.jpg"
            alt="Ashanti Kweyu (Kashi)"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Ashanti Kweyu</h1>
        <p className="text-xl text-accent font-medium">Kashi</p>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Junior Developer from Kampala, Uganda
        </p>
        <p className="text-base text-foreground/60">
          Building innovative solutions with modern web technologies
        </p>
      </section>

      {/* Bio Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-6">My Story</h2>
        <div className="prose prose-lg">
          <p className="text-foreground/80 leading-relaxed mb-4">
            Hey! I'm Ashanti Kweyu (you can call me Kashi), a software development student at Moringa School
            based in Kampala, Uganda. I'm currently working through Phase 0 Module 2 JavaScript coursework
            while working as a junior developer for a financial technology company, where I develop features
            like savings goal tracking systems for mobile banking applications.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            I have ADHD and have developed effective strategies for managing my learning and development work,
            including breaking tasks into small commits with frequent dopamine rewards and using gamified approaches
            to maintain focus. These strategies help me stay productive and deliver quality work consistently.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            My strong Christian faith is an important part of who I am and influences my decision-making,
            relationships, and approach to both work and life. I believe in building technology that makes
            a positive impact and treating others with respect and integrity.
          </p>
        </div>
      </section>

      {/* Skills Grid */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category) => (
            <div 
              key={category.name}
              className="bg-secondary p-6 rounded-2xl border border-border hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <category.icon className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item} className="text-foreground/70 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Experience</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {experience.map((exp, index) => (
            <div 
              key={index}
              className="relative pl-8 pb-8 border-l-2 border-accent last:pb-0"
            >
              <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] bg-accent rounded-full border-4 border-primary"></div>
              <div className="bg-secondary p-6 rounded-2xl border border-border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                  <span className="text-sm text-accent font-medium">{exp.period}</span>
                </div>
                <p className="text-foreground/70 font-medium mb-2">{exp.company}</p>
                <p className="text-foreground/80">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Links */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">Let's Connect</h2>
        <div className="flex items-center justify-center gap-4">
          <a 
            href="https://github.com/kashik09"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-secondary rounded-full border border-border hover:border-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a 
            href="https://linkedin.com/in/kashi"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-secondary rounded-full border border-border hover:border-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}