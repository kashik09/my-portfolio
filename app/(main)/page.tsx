import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Code2, Palette, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-primary">✨ Available for freelance projects</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-foreground">
          Hi, I'm <span className="text-primary">Kashi</span>
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto">
          A Junior Developer building innovative solutions with modern web technologies
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/projects">
            <Button variant="primary" size="lg">
              View My Work
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/request">
            <Button variant="outline" size="lg">
              Hire Me
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all">
          <div className="inline-block p-4 bg-primary/20 rounded-xl mb-4">
            <Code2 className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Clean Code</h3>
          <p className="text-muted-foreground">
            Writing maintainable, scalable, and efficient code following best practices
          </p>
        </div>

        <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all">
          <div className="inline-block p-4 bg-primary/20 rounded-xl mb-4">
            <Palette className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Modern Design</h3>
          <p className="text-muted-foreground">
            Creating beautiful, responsive interfaces that users love
          </p>
        </div>

        <div className="text-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all">
          <div className="inline-block p-4 bg-primary/20 rounded-xl mb-4">
            <Zap className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Fast Performance</h3>
          <p className="text-muted-foreground">
            Optimized applications that load quickly and run smoothly
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl p-12 md:p-16 text-center text-white shadow-xl max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to start your project?</h2>
        <p className="text-xl md:text-2xl mb-8 font-medium">
          Let's work together to bring your ideas to life
        </p>
        <Link href="/request">
          <Button variant="outline" size="lg" className="bg-white/10 border-white hover:bg-white hover:text-primary">
            Get Started Today
          </Button>
        </Link>
      </section>
    </div>
  )
}