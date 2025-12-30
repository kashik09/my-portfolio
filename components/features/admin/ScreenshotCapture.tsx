'use client'

import { useState } from 'react'
import { Camera, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import Image from 'next/image'
import { isLocalImageUrl, normalizePublicPath } from '@/lib/utils'

interface ScreenshotCaptureProps {
  projectUrl?: string
  projectSlug?: string
  projectTitle?: string
  onCapture?: (imageUrl: string) => void
}

export function ScreenshotCapture({
  projectUrl = '',
  projectSlug,
  projectTitle,
  onCapture
}: ScreenshotCaptureProps) {
  const { showToast } = useToast()
  const [url, setUrl] = useState(projectUrl)
  const [fullPage, setFullPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<{
    url: string
    filename: string
  } | null>(null)

  const handleCapture = async () => {
    if (!url) {
      showToast('Please enter a URL', 'error')
      return
    }

    try {
      setLoading(true)
      setCapturedImage(null)

      const response = await fetch('/api/admin/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          projectSlug,
          projectTitle,
          fullPage
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture screenshot')
      }

      setCapturedImage(data.data)
      showToast('Screenshot captured successfully!', 'success')

      // Call onCapture callback if provided
      if (onCapture) {
        onCapture(data.data.url)
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to capture screenshot',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-border bg-card p-6">
        <div className="mb-4 flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">
              Automated Screenshot Capture
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Enter the live URL of your project</li>
              <li>Screenshots are captured at 1920x1080 @2x resolution</li>
              <li>Full page option captures the entire scrollable page</li>
              <li>Works best with publicly accessible URLs</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Project URL"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
          />

          <div className="flex items-center gap-2">
            <input
              id="fullPage"
              type="checkbox"
              checked={fullPage}
              onChange={(e) => setFullPage(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 rounded border-border bg-muted text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <label
              htmlFor="fullPage"
              className="text-sm font-medium text-foreground"
            >
              Capture full page (entire scrollable content)
            </label>
          </div>

          <Button
            variant="primary"
            onClick={handleCapture}
            disabled={loading || !url}
            loading={loading}
            icon={<Camera size={18} />}
          >
            {loading ? 'Capturing...' : 'Capture Screenshot'}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border-2 border-border bg-card p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground">
              Capturing screenshot... This may take a few moments.
            </p>
          </div>
        </div>
      )}

      {capturedImage && !loading && (
        <div className="rounded-lg border-2 border-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Check size={20} />
            <span className="font-medium">Screenshot captured successfully!</span>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              {(() => {
                const imageSrc = normalizePublicPath(capturedImage.url)
                if (!imageSrc) return null

                return isLocalImageUrl(imageSrc) ? (
                  <Image
                    src={imageSrc}
                    alt="Captured screenshot"
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-contain"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt="Captured screenshot"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                )
              })()}
            </div>

            <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Filename: </span>
                <span className="text-muted-foreground">
                  {capturedImage.filename}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">URL: </span>
                <span className="break-all text-muted-foreground">
                  {capturedImage.url}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
