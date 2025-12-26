import { HeroVibey } from './HeroVibey'

interface HeroSwitchProps {
  title: string
  highlight: string
  subtitle: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export function HeroSwitch(props: HeroSwitchProps) {
  return <HeroVibey {...props} />
}
