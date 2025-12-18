'use client'

import { SectionFormProps, ProjectGridData } from '@/lib/sections/types'
import { Input } from '@/components/ui/Input'
import { StyledSelect } from '@/components/ui/StyledSelect'

export function ProjectGridForm({ data, onChange }: SectionFormProps<ProjectGridData>) {
  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="e.g., Featured Projects"
      />

      <StyledSelect
        label="Filter by Category"
        value={data.filter || 'ALL'}
        onChange={(e) => onChange({ ...data, filter: e.target.value as 'ALL' | 'WEB' | 'MOBILE' | 'DESIGN' })}
      >
        <option value="ALL">All Projects</option>
        <option value="WEB">Web Projects</option>
        <option value="MOBILE">Mobile Projects</option>
        <option value="DESIGN">Design Projects</option>
      </StyledSelect>

      <Input
        label="Limit (optional)"
        type="number"
        value={data.limit?.toString() || ''}
        onChange={(e) => onChange({ ...data, limit: e.target.value ? parseInt(e.target.value) : undefined })}
        placeholder="Leave empty for all"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="includeDigitalProducts"
          checked={data.includeDigitalProducts || false}
          onChange={(e) => onChange({ ...data, includeDigitalProducts: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="includeDigitalProducts" className="text-sm text-gray-700 dark:text-gray-300">
          Include digital products
        </label>
      </div>
    </div>
  )
}
