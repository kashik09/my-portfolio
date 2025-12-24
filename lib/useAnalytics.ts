'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

interface PageViewData {
  page: string
  referrer?: string
  device?: string
}

interface EventData {
  action: string
  category: string
  label?: string
  value?: number
}

const getDeviceType = () => {
  if (typeof navigator === 'undefined') return 'desktop'

  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

// Helper function to send analytics to our database (non-blocking)
const sendToDatabase = async (eventData: any) => {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    // Silent fail - don't block UI
    console.debug('Analytics tracking failed:', error)
  }
}

export function useAnalytics() {
  // Track page view
  const trackPageView = (data: PageViewData) => {
    const eventData = {
      action: 'page_view',
      page: data.page,
      referrer: data.referrer || document.referrer,
      device: getDeviceType(),
      data: { timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track('page_view', {
      page: data.page,
      referrer: data.referrer || document.referrer,
      device: getDeviceType(),
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  // Track custom events
  const trackEvent = (data: EventData) => {
    const eventData = {
      action: data.action,
      category: data.category,
      label: data.label,
      value: data.value,
      device: getDeviceType(),
      data: { timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track(data.action, {
      category: data.category,
      label: data.label,
      value: data.value,
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  // Track project view
  const trackProjectView = (projectId: string, projectTitle: string) => {
    const eventData = {
      action: 'project_view',
      category: 'projects',
      label: projectTitle,
      device: getDeviceType(),
      data: { projectId, projectTitle, timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track('project_view', {
      projectId,
      projectTitle,
      device: getDeviceType(),
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  // Track button clicks
  const trackClick = (buttonName: string, location: string) => {
    const eventData = {
      action: 'button_click',
      category: 'interaction',
      label: buttonName,
      device: getDeviceType(),
      data: { buttonName, location, timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track('button_click', {
      buttonName,
      location,
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  // Track form submissions
  const trackFormSubmit = (formName: string, success: boolean) => {
    const eventData = {
      action: 'form_submit',
      category: 'forms',
      label: formName,
      value: success ? 1 : 0,
      device: getDeviceType(),
      data: { formName, success, timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track('form_submit', {
      formName,
      success,
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  // Track downloads
  const trackDownload = (fileName: string, fileType: string) => {
    const eventData = {
      action: 'download',
      category: 'downloads',
      label: fileName,
      device: getDeviceType(),
      data: { fileName, fileType, timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track('download', {
      fileName,
      fileType,
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  // Track theme changes
  const trackThemeChange = (themeName: string) => {
    const eventData = {
      action: 'theme_change',
      category: 'settings',
      label: themeName,
      device: getDeviceType(),
      data: { themeName, timestamp: new Date().toISOString() }
    }

    // Send to Vercel Analytics
    track('theme_change', {
      themeName,
      timestamp: new Date().toISOString()
    })

    // Send to our database (non-blocking)
    sendToDatabase(eventData)
  }

  return {
    trackPageView,
    trackEvent,
    trackProjectView,
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackThemeChange,
  }
}

// Hook to automatically track page views
export function usePageTracking(pageName: string) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView({
      page: pageName,
      referrer: document.referrer,
      device: navigator.userAgent
    })

    // Track time on page
    const startTime = Date.now()

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000) // in seconds

      const eventData = {
        action: 'time_on_page',
        page: pageName,
        value: timeSpent,
        device: getDeviceType(),
        data: { page: pageName, seconds: timeSpent, timestamp: new Date().toISOString() }
      }

      // Send to Vercel Analytics
      track('time_on_page', {
        page: pageName,
        seconds: timeSpent,
        timestamp: new Date().toISOString()
      })

      // Send to our database (non-blocking)
      sendToDatabase(eventData)
    }
  }, [pageName, trackPageView])
}
