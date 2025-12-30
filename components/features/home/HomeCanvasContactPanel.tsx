'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HomeCanvasContactPanel({
  show,
  contactHref,
}: {
  show: boolean
  contactHref: string
}) {
  return (
    <div
      className={`absolute left-1/2 top-[62%] z-30 w-[min(28rem,calc(100vw-3rem))] -translate-x-1/2 transition ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="rounded-3xl border border-base-300 bg-base-200/60 p-6 text-base-content shadow-2xl shadow-base-300/40 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/60">
          contact
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          let&apos;s build the calm version.
        </h2>
        <p className="mt-2 text-sm text-base-content/70">
          share the scope, timeline, and what feels broken. i&apos;ll reply with the cleanest next step.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {contactHref.startsWith('http') ? (
            <a
              href={contactHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-content"
            >
              whatsapp
              <ArrowRight size={14} />
            </a>
          ) : (
            <Link
              href={contactHref}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-content"
            >
              contact
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
