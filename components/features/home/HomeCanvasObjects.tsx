'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { StickerChip } from '@/components/ui/StickerChip'
import { isLocalImageUrl, truncate } from '@/lib/utils'
import type { CanvasCard, SceneObject } from './homeCanvasTypes'

interface HomeCanvasObjectsProps {
  objects: SceneObject[]
  cards: CanvasCard[]
  hoveredCard: string | null
  setHoveredCard: (value: string | null) => void
}

const cardSizes = '(min-width: 1024px) 320px, (min-width: 640px) 300px, 240px'
const remoteImageLoader = ({ src }: { src: string }) => src

export function HomeCanvasObjects({
  objects,
  cards,
  hoveredCard,
  setHoveredCard,
}: HomeCanvasObjectsProps) {
  return (
    <div className="absolute inset-0">
      {objects.map((object, index) => {
        const laneBase = object.lane === 'anchor' ? 4 : object.lane === 'ambient' ? 10 : 16
        const driftX = (index % 2 === 0 ? 1 : -1) * (laneBase + index * 2)
        const driftY = (index % 3 - 1) * (laneBase + 4)
        const parallax = object.lane === 'anchor' ? 4 : object.lane === 'ambient' ? 7 : 12
        const sizeClass =
          object.kind === 'card'
            ? {
                sm: 'w-[240px] sm:w-[260px]',
                md: 'w-[280px] sm:w-[300px]',
                lg: 'w-[min(22rem,calc(100vw-3rem))] sm:w-[320px]',
              }[object.size]
            : {
                sm: 'px-3 py-2 text-[0.6rem] tracking-[0.25em] leading-relaxed',
                md: 'px-4 py-2.5 text-[0.7rem] tracking-[0.15em] leading-relaxed',
                lg: 'px-5 py-3 text-[0.75rem] tracking-[0.2em] leading-relaxed',
              }[object.size]

        const isCard = object.kind === 'card'
        const cardData = isCard ? cards[object.cardIndex ?? 0] ?? cards[0] : null
        const isHovered = isCard && hoveredCard === cardData?.id
        const dimmedByHover = hoveredCard && !isHovered && object.kind !== 'card'
        const dimmedCard = hoveredCard && isCard && hoveredCard !== cardData?.id
        const style: CSSProperties = {
          top: object.top,
          left: object.left,
          zIndex: object.zIndex ?? 10,
          ['--rotate' as string]: `${object.rotate}deg`,
          ['--scale' as string]: object.scale.toString(),
          ['--hover-scale' as string]: isHovered ? '1.02' : '1',
          ['--drift-x' as string]: driftX.toString(),
          ['--drift-y' as string]: driftY.toString(),
          ['--parallax' as string]: parallax.toString(),
          ['--opacity' as string]: object.kind === 'card' ? '0.96' : '0.9',
        }

        return (
          <div
            key={object.id}
            className={`canvas-item ${sizeClass} ${dimmedByHover || dimmedCard ? 'is-dimmed' : ''} ${
              isHovered ? 'is-hovered' : ''
            }`}
            data-kind={object.kind}
            data-variant={object.variant}
            style={style}
          >
            {object.kind === 'card' && cardData ? (
              <Link
                href={cardData.href}
                className="pointer-events-auto block rounded-3xl border border-base-300 bg-base-200/50 p-4 shadow-xl shadow-base-300/30 backdrop-blur-xl transition focus:outline-none focus:ring-2 focus:ring-primary/60"
                onMouseEnter={() => setHoveredCard(cardData.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => setHoveredCard(cardData.id)}
                onBlur={() => setHoveredCard(null)}
              >
                <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-base-100/5">
                  {cardData.imageUrl ? (
                    <Image
                      src={cardData.imageUrl}
                      alt={cardData.title}
                      fill
                      sizes={cardSizes}
                      className="object-cover"
                      unoptimized={!isLocalImageUrl(cardData.imageUrl)}
                      loader={
                        isLocalImageUrl(cardData.imageUrl)
                          ? undefined
                          : remoteImageLoader
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-base-content/70">
                      {cardData.title.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2 text-base-content">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                      {cardData.title}
                    </h3>
                    {cardData.meta && (
                      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-base-content/60">
                        {cardData.meta}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-base-content/70">
                    {truncate(cardData.description, 90)}
                  </p>
                  <div className="text-[0.6rem] uppercase tracking-[0.3em] text-base-content/70">
                    open →
                  </div>
                </div>
              </Link>
            ) : (
              <StickerChip
                label={object.label || ''}
                treatment={
                  object.treatment === 'easter-egg'
                    ? 'egg'
                    : (object.treatment as 'solid' | 'outline' | 'glass' | undefined)
                }
                tone={object.variant as 'primary' | 'secondary'}
                size={object.size === 'lg' ? 'md' : 'sm'}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
