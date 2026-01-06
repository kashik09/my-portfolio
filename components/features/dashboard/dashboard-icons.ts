import {
  Crown,
  Heart,
  Home,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { DashboardIcon } from '@/lib/preferences/types'

export const DASHBOARD_ICON_OPTIONS: Array<{
  id: DashboardIcon
  label: string
  icon: LucideIcon
}> = [
  { id: 'layout-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'heart', label: 'Heart', icon: Heart },
  { id: 'shopping-bag', label: 'Shopping', icon: ShoppingBag },
  { id: 'zap', label: 'Zap', icon: Zap },
  { id: 'crown', label: 'Crown', icon: Crown },
]

export const DASHBOARD_ICON_MAP: Record<DashboardIcon, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  home: Home,
  star: Star,
  sparkles: Sparkles,
  heart: Heart,
  'shopping-bag': ShoppingBag,
  zap: Zap,
  crown: Crown,
}
