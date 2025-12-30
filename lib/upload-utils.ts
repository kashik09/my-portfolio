/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
}

export interface SmartFilenameOptions {
  originalName?: string
  prefix?: string
  extension?: string
  context?: {
    projectTitle?: string
    projectSlug?: string
    type?: string
  }
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '')
    .replace(/^[.]+/, '')
    .substring(0, 255)
}

/**
 * Generates a smart filename with context-aware naming
 * Example: project-my-app-2024-12-21-14-30-45.png
 */
export function generateSmartFilename(options: SmartFilenameOptions): string {
  const { originalName, prefix = 'project', extension = 'png', context } = options

  const now = new Date()
  const date = now.toISOString().split('T')[0] // YYYY-MM-DD
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS

  const parts: string[] = [prefix]

  // Add context-based naming
  if (context?.projectSlug) {
    parts.push(slugify(context.projectSlug))
  } else if (context?.projectTitle) {
    parts.push(slugify(context.projectTitle))
  } else if (originalName) {
    // Use original filename (without extension) if no context
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    parts.push(slugify(nameWithoutExt))
  }

  // Add timestamp
  parts.push(date)
  parts.push(time)

  // Join parts and add extension
  const filename = parts.join('-')
  return sanitizeFilename(`${filename}.${extension}`)
}
