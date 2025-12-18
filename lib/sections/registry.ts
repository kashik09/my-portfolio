import {
  SectionType,
  SectionRegistry,
  HeroData,
  RichTextData,
  ProjectGridData,
  CardsData,
  CTAData,
  FAQData,
  ContactBlockData,
} from './types'

// Import section components
import { Hero } from '@/components/sections/Hero'
import { RichText } from '@/components/sections/RichText'
import { ProjectGrid } from '@/components/sections/ProjectGrid'
import { Cards } from '@/components/sections/Cards'
import { CTA } from '@/components/sections/CTA'
import { FAQ } from '@/components/sections/FAQ'
import { ContactBlock } from '@/components/sections/ContactBlock'

// Import form components
import {
  HeroForm,
  RichTextForm,
  ProjectGridForm,
  CardsForm,
  CTAForm,
  FAQForm,
  ContactBlockForm,
} from '@/components/admin/section-forms'

export const sectionRegistry: SectionRegistry = {
  [SectionType.HERO]: {
    type: SectionType.HERO,
    label: 'Hero',
    description: 'Large hero section with title, subtitle, and CTA button',
    component: Hero,
    formComponent: HeroForm,
    defaultData: {
      title: 'Welcome',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
    } as HeroData,
    icon: '🎯',
  },
  [SectionType.RICH_TEXT]: {
    type: SectionType.RICH_TEXT,
    label: 'Rich Text',
    description: 'Markdown content with full formatting support',
    component: RichText,
    formComponent: RichTextForm,
    defaultData: {
      content: '',
    } as RichTextData,
    icon: '📝',
  },
  [SectionType.PROJECT_GRID]: {
    type: SectionType.PROJECT_GRID,
    label: 'Project Grid',
    description: 'Display projects in a grid layout with filtering',
    component: ProjectGrid,
    formComponent: ProjectGridForm,
    defaultData: {
      title: 'Projects',
      filter: 'ALL',
      includeDigitalProducts: false,
    } as ProjectGridData,
    icon: '🗂️',
  },
  [SectionType.CARDS]: {
    type: SectionType.CARDS,
    label: 'Cards',
    description: 'Grid of cards with icons and descriptions',
    component: Cards,
    formComponent: CardsForm,
    defaultData: {
      title: '',
      cards: [],
      columns: 3,
    } as CardsData,
    icon: '🃏',
  },
  [SectionType.CTA]: {
    type: SectionType.CTA,
    label: 'Call to Action',
    description: 'Prominent CTA section with button',
    component: CTA,
    formComponent: CTAForm,
    defaultData: {
      title: '',
      description: '',
      buttonText: 'Get Started',
      buttonLink: '/request',
      variant: 'primary',
    } as CTAData,
    icon: '📢',
  },
  [SectionType.FAQ]: {
    type: SectionType.FAQ,
    label: 'FAQ',
    description: 'Accordion-style frequently asked questions',
    component: FAQ,
    formComponent: FAQForm,
    defaultData: {
      title: 'FAQ',
      items: [],
    } as FAQData,
    icon: '❓',
  },
  [SectionType.CONTACT_BLOCK]: {
    type: SectionType.CONTACT_BLOCK,
    label: 'Contact Block',
    description: 'Contact information with optional form',
    component: ContactBlock,
    formComponent: ContactBlockForm,
    defaultData: {
      title: 'Get in Touch',
      showForm: true,
    } as ContactBlockData,
    icon: '📧',
  },
}

// Helper to get registry entry by type
export function getSectionRegistryEntry(type: SectionType) {
  return sectionRegistry[type]
}

// Get all section types as an array
export function getAllSectionTypes(): SectionType[] {
  return Object.values(SectionType)
}
