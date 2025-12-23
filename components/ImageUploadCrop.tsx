'use client'

import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { Upload, Crop, X, Check } from 'lucide-react'
import { Spinner } from './ui/Spinner'

interface Point {
  x: number
  y: number
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface ImageUploadCropProps {
  onImageCropped: (imageUrl: string) => void
  currentImage?: string
  aspectRatio?: number // 1 for square, 16/9 for landscape, etc.
  label?: string
}

// Helper function to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  const image = new Image()
  image.src = imageSrc
  await new Promise((resolve) => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, 'image/jpeg', 0.95)
  })
}

export function ImageUploadCrop({
  onImageCropped,
  currentImage,
  aspectRatio = 1, // Default to square
  label = 'Upload Image'
}: ImageUploadCropProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploading, setUploading] = useState(false)
  const [customAspect, setCustomAspect] = useState(aspectRatio)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setUploading(true)

    try {
      // Create cropped image blob
      const croppedBlob = await createCroppedImage(imageSrc, croppedAreaPixels)

      // Upload to server
      const formData = new FormData()
      formData.append('image', croppedBlob, 'avatar.jpg')

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onImageCropped(data.url)
        setImageSrc(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      {/* Current Image Preview */}
      {currentImage && !imageSrc && (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Current avatar"
            className="w-32 h-32 rounded-full object-cover border-2 border-border"
          />
        </div>
      )}

      {/* Cropper Interface */}
      {imageSrc ? (
        <div className="space-y-4">
          {/* Aspect Ratio Selector */}
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Aspect Ratio:</span>
            <button
              type="button"
              onClick={() => setCustomAspect(1)}
              className={`px-3 py-1 text-sm rounded transition ${
                customAspect === 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              Square (1:1)
            </button>
            <button
              type="button"
              onClick={() => setCustomAspect(4 / 3)}
              className={`px-3 py-1 text-sm rounded transition ${
                customAspect === 4 / 3
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              4:3
            </button>
            <button
              type="button"
              onClick={() => setCustomAspect(16 / 9)}
              className={`px-3 py-1 text-sm rounded transition ${
                customAspect === 16 / 9
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/70'
              }`}
            >
              16:9
            </button>
          </div>

          {/* Cropper */}
          <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={customAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape={customAspect === 1 ? 'round' : 'rect'}
            />
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCropSave}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Spinner size="sm" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save Cropped Image
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70 transition"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Upload Button */
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            <Upload size={18} />
            {currentImage ? 'Change Image' : 'Upload Image'}
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            Max size: 10MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  )
}
