'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const remoteImageLoader = ({ src }: { src: string }) => src

function isRemoteImage(src?: string | null) {
  return !!src && src.startsWith('http')
}

export function HomeCanvasHero({
  avatarSrc,
  hasAvatar,
  onAvatarError,
}: {
  avatarSrc: string | null
  hasAvatar: boolean
  onAvatarError: () => void
}) {
  return (
    <div className="relative z-20 mx-auto flex h-full w-full max-w-6xl items-center px-6 sm:px-10">
      <div className="canvas-anchor max-w-xl space-y-6 text-base-content">
        <div className="flex items-center gap-4">
          <div className="relative flex size-18 sm:size-20 lg:size-24 items-center justify-center overflow-hidden rounded-full border border-base-300 bg-base-100/10 text-lg font-semibold">
            {avatarSrc && hasAvatar ? (
              <Image
                src={avatarSrc}
                alt="Kashi avatar"
                fill
                sizes="96px"
                className="rounded-full object-cover"
                onError={onAvatarError}
                unoptimized={isRemoteImage(avatarSrc)}
                loader={isRemoteImage(avatarSrc) ? remoteImageLoader : undefined}
              />
            ) : (
              <span className="text-base-content">K</span>
            )}
          </div>
          <p className="text-sm sm:text-base uppercase tracking-[0.4em] text-base-content/70">
            hey 👋🏾
            <br />
            i&apos;m kashi ✨
          </p>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            i notice friction,
            <span className="block text-base-content/70">then i build fixes.</span>
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-base-content/70 sm:text-lg">
            calm, premium experiences that keep momentum without the noise.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/projects" className="no-underline">
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              see what i&apos;ve built
            </Button>
          </Link>
          <Link href="/products" className="no-underline">
            <Button variant="outline" size="md">
              products
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-base-300 bg-base-100/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-base-content/70">
            component-driven
          </span>
          <span className="inline-flex items-center rounded-full border border-base-300 bg-base-100/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-base-content/70">
            calm delivery
          </span>
        </div>
      </div>
    </div>
  )
}
