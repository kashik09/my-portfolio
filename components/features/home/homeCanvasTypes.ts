export type LayoutPreset = 'mobile' | 'tablet' | 'desktop'
export type Lane = 'anchor' | 'ambient' | 'context'

export interface CanvasCard {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  href: string
  meta?: string
}

export interface SceneObject {
  id: string
  kind: 'card' | 'chip'
  top: string
  left: string
  rotate: number
  scale: number
  lane: Lane
  size: 'sm' | 'md' | 'lg'
  variant: 'primary' | 'secondary'
  label?: string
  cardIndex?: number
  group?: string
  zIndex?: number
  treatment?: 'solid' | 'outline' | 'glass' | 'easter-egg'
}
