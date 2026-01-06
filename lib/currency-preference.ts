import { isSupportedCurrency, type SupportedCurrency } from '@/lib/currency'

const STORAGE_KEY = 'preferredCurrency'

export function getSavedCurrency(): SupportedCurrency | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value && isSupportedCurrency(value) ? value : null
  } catch {
    return null
  }
}

export function saveCurrency(currency: SupportedCurrency) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, currency)
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

export function getDefaultCurrencyFromCountry(country: string | null): SupportedCurrency {
  return country === 'UG' ? 'UGX' : 'USD'
}
